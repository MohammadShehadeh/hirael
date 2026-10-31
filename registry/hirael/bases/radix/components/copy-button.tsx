'use client';

import * as React from 'react';
import { Check, Copy } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/radix/ui/button';

type CopyButtonState = 'idle' | 'copied' | 'error';

export interface CopyButtonProps extends Omit<React.ComponentProps<'button'>, 'value' | 'onCopy'> {
  /** Text written to the clipboard on click; pass a function to build it only when clicked. */
  value: string | (() => string);
  variant?: 'ghost' | 'outline';
  size?: 'sm' | 'md';
  /** How long the copied or error state stays, in ms. */
  timeout?: number;
  /** Accessible name of the icon-only button. */
  label?: string;
  /** Announced, and shown in place of the label, after a successful copy. */
  copiedLabel?: string;
  /** Announced when both the clipboard API and the fallback fail. */
  errorLabel?: string;
  onCopy?: (value: string) => void;
  onCopyError?: (error: unknown) => void;
}

const copyWithExecCommand = (text: string) => {
  const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    if (typeof document.execCommand !== 'function' || !document.execCommand('copy')) {
      throw new Error('Copy command was rejected');
    }
  } finally {
    document.body.removeChild(textarea);
    previousFocus?.focus({ preventScroll: true });
  }
};

const writeClipboard = async (text: string) => {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);

      return;
    } catch {
      // Permission denied or unfocused document: fall through to execCommand.
    }
  }
  copyWithExecCommand(text);
};

// Outside the component: the React Compiler can't compile a try/catch around optional calls.
const copyValue = async (value: CopyButtonProps['value']) => {
  try {
    const text = typeof value === 'function' ? value() : value;
    await writeClipboard(text);

    return { ok: true as const, text };
  } catch (error) {
    return { ok: false as const, error };
  }
};

const CopyButton = ({
  value,
  variant = 'ghost',
  size = 'md',
  timeout = 1500,
  label = 'Copy to clipboard',
  copiedLabel = 'Copied',
  errorLabel = 'Copy failed',
  onCopy,
  onCopyError,
  onClick,
  className,
  children,
  ...props
}: CopyButtonProps) => {
  const [state, setState] = React.useState<CopyButtonState>('idle');
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  React.useEffect(() => () => clearTimeout(timer.current), []);

  const settle = (next: CopyButtonState) => {
    setState(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState('idle'), timeout);
  };

  const handleCopy = async (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    const result = await copyValue(value);
    if (result.ok) {
      settle('copied');
      onCopy?.(result.text);
    } else {
      settle('error');
      onCopyError?.(result.error);
    }
  };

  const copied = state === 'copied';
  const hasLabel = children != null;
  const announcement = { idle: '', copied: copiedLabel, error: errorLabel }[state];

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={hasLabel ? 'sm' : size === 'sm' ? 'icon-xs' : 'icon-sm'}
        data-slot="copy-button"
        data-state={state}
        aria-label={hasLabel ? undefined : label}
        onClick={handleCopy}
        className={cn(size === 'sm' ? '[&_svg]:size-3.5' : '[&_svg]:size-4', className)}
        {...props}
      >
        <span className="relative inline-flex items-center justify-center">
          <Check
            className={cn(
              'transition-[opacity,scale] duration-150',
              copied ? 'scale-100 opacity-100' : 'scale-50 opacity-0',
            )}
          />
          <Copy
            className={cn(
              'absolute transition-[opacity,scale] duration-150',
              copied ? 'scale-50 opacity-0' : 'scale-100 opacity-100',
            )}
          />
        </span>
        {hasLabel && <span>{copied ? copiedLabel : children}</span>}
      </Button>
      <span data-slot="copy-button-status" role="status" aria-live="polite" className="sr-only">
        {announcement}
      </span>
    </>
  );
};

export { CopyButton };
