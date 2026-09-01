'use client';

import * as React from 'react';
import { Check, Copy } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';

export interface CopyButtonProps extends Omit<React.ComponentProps<'button'>, 'value' | 'onCopy'> {
  /** Text written to the clipboard on click. */
  value: string;
  variant?: 'ghost' | 'outline';
  size?: 'sm' | 'md';
  /** How long the copied state stays, in ms. */
  timeout?: number;
  onCopy?: (value: string) => void;
}

const writeClipboard = async (text: string) => {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  // Fallback for non-secure contexts where the async clipboard API is absent.
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
};

const CopyButton = ({
  value,
  variant = 'ghost',
  size = 'md',
  timeout = 1500,
  onCopy,
  onClick,
  className,
  children,
  ...props
}: CopyButtonProps) => {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  React.useEffect(() => () => clearTimeout(timer.current), []);

  const handleCopy = React.useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      try {
        await writeClipboard(value);
        setCopied(true);
        onCopy?.(value);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), timeout);
      } catch {
        setCopied(false);
      }
    },
    [value, onCopy, timeout, onClick],
  );

  const hasLabel = children != null;

  return (
    <Button
      type="button"
      variant={variant}
      size={hasLabel ? 'sm' : size === 'sm' ? 'icon-xs' : 'icon-sm'}
      data-slot="copy-button"
      data-state={copied ? 'copied' : 'idle'}
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
      onClick={handleCopy}
      className={cn(size === 'sm' ? '[&_svg]:size-3.5' : '[&_svg]:size-4', className)}
      {...props}
    >
      <span className="relative inline-flex items-center justify-center">
        <Check
          aria-hidden
          className={cn('transition-all duration-150', copied ? 'scale-100 opacity-100' : 'scale-50 opacity-0')}
        />
        <Copy
          aria-hidden
          className={cn(
            'absolute transition-all duration-150',
            copied ? 'scale-50 opacity-0' : 'scale-100 opacity-100',
          )}
        />
      </span>
      {hasLabel && <span>{copied ? 'Copied' : children}</span>}
    </Button>
  );
};

export { CopyButton };
