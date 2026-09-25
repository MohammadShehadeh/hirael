'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '@/registry/hirael/bases/radix/ui/alert-dialog';
import { Button } from '@/registry/hirael/bases/radix/ui/button';

export type ConfirmTone = 'default' | 'destructive';

export interface ConfirmOptions {
  /** Dialog heading, and the dialog's accessible name. Defaults to "Are you sure?". */
  title?: React.ReactNode;
  /** Supporting line under the title. */
  description?: React.ReactNode;
  /** Confirm button label. Defaults to "Confirm". */
  confirmText?: React.ReactNode;
  /** Cancel button label. Defaults to "Cancel". */
  cancelText?: React.ReactNode;
  /** `destructive` tints the confirm button as a danger action. */
  tone?: ConfirmTone;
  /** Optional icon shown in the header media slot. */
  icon?: React.ReactNode;
  /** Whether Escape dismisses the dialog (counts as cancel). Defaults to true. */
  dismissible?: boolean;
  /**
   * Runs on confirm. A pending promise keeps the dialog open with a spinner; a
   * rejection returns it to idle so the user can retry, so handle errors inside.
   * Without it, confirming closes immediately.
   */
  onConfirm?: () => void | Promise<void>;
}

/** Opens the dialog and resolves `true` on confirm, `false` on cancel/dismiss. */
export type ConfirmFn = (options?: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = React.createContext<ConfirmFn | null>(null);

/** The nearest provider's `confirm`, or null outside any `<ConfirmProvider>`. */
const useOptionalConfirm = (): ConfirmFn | null => React.useContext(ConfirmContext);

/** Must be called under a `<ConfirmProvider>`. */
const useConfirm = (): ConfirmFn => {
  const ctx = React.useContext(ConfirmContext);
  if (!ctx) {
    throw new Error('useConfirm must be used inside <ConfirmProvider>');
  }

  return ctx;
};

interface ConfirmRequest {
  options: ConfirmOptions;
  resolve: (value: boolean) => void;
}

export interface ConfirmProviderProps {
  children: React.ReactNode;
  /** Defaults merged under every `confirm()` call. */
  defaultOptions?: Pick<ConfirmOptions, 'title' | 'confirmText' | 'cancelText' | 'tone' | 'dismissible'>;
}

const CLOSE_DURATION = 200;
const DEFAULT_TITLE = 'Are you sure?';

/** Mount once near the root. Re-entrant `confirm()` calls queue behind the open one. */
const ConfirmProvider = ({ children, defaultOptions }: ConfirmProviderProps) => {
  const [open, setOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [active, setActive] = React.useState<ConfirmRequest | null>(null);
  const activeRef = React.useRef<ConfirmRequest | null>(null);
  const queueRef = React.useRef<ConfirmRequest[]>([]);
  const closingRef = React.useRef(false);
  const closeTimerRef = React.useRef<number | undefined>(undefined);

  const confirm = React.useCallback<ConfirmFn>((options = {}) => {
    return new Promise<boolean>((resolve) => {
      const request: ConfirmRequest = { options, resolve };
      if (activeRef.current) {
        queueRef.current.push(request);

        return;
      }
      activeRef.current = request;
      setActive(request);
      setOpen(true);
    });
  }, []);

  const settle = React.useCallback((value: boolean) => {
    const current = activeRef.current;
    if (!current || closingRef.current) return;
    closingRef.current = true;
    current.resolve(value);
    setPending(false);
    setOpen(false);
    closeTimerRef.current = window.setTimeout(() => {
      closingRef.current = false;
      const next = queueRef.current.shift() ?? null;
      activeRef.current = next;
      setActive(next);
      setOpen(next !== null);
    }, CLOSE_DURATION);
  }, []);

  React.useEffect(
    () => () => {
      window.clearTimeout(closeTimerRef.current);
      activeRef.current?.resolve(false);
      for (const queued of queueRef.current) queued.resolve(false);
      queueRef.current = [];
    },
    [],
  );

  const handleConfirm = React.useCallback(() => {
    if (closingRef.current) return;
    const onConfirm = activeRef.current?.options.onConfirm;
    if (!onConfirm) {
      settle(true);

      return;
    }
    setPending(true);
    Promise.resolve()
      .then(onConfirm)
      .then(
        () => settle(true),
        // Back to idle so the user can retry; surfacing the error is onConfirm's job.
        () => setPending(false),
      );
  }, [settle]);

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (next || pending) return;
      settle(false);
    },
    [pending, settle],
  );

  const options: ConfirmOptions = {
    title: DEFAULT_TITLE,
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    tone: 'default',
    dismissible: true,
    ...defaultOptions,
    ...active?.options,
  };
  const tone = options.tone ?? 'default';
  const dismissible = options.dismissible ?? true;
  const hasDescription = options.description != null;

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <AlertDialog open={open} onOpenChange={handleOpenChange}>
        <AlertDialogContent
          data-tone={tone}
          onEscapeKeyDown={(event) => {
            if (!dismissible || pending) event.preventDefault();
          }}
          {...(hasDescription ? {} : { 'aria-describedby': undefined })}
        >
          <AlertDialogHeader>
            {options.icon != null && (
              <AlertDialogMedia className={cn(tone === 'destructive' && 'bg-destructive/10 text-destructive')}>
                {options.icon}
              </AlertDialogMedia>
            )}
            <AlertDialogTitle>{options.title ?? DEFAULT_TITLE}</AlertDialogTitle>
            {hasDescription && <AlertDialogDescription>{options.description}</AlertDialogDescription>}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>{options.cancelText}</AlertDialogCancel>
            <Button
              type="button"
              data-slot="confirm-action"
              data-tone={tone}
              variant={tone === 'destructive' ? 'destructive' : 'default'}
              disabled={pending}
              onClick={handleConfirm}
            >
              {pending && <ConfirmSpinner />}
              {options.confirmText}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ConfirmContext.Provider>
  );
};

const ConfirmSpinner = () => {
  return (
    <span
      data-slot="confirm-spinner"
      aria-hidden
      className="size-4 animate-spin rounded-full border-2 border-current border-e-transparent"
    />
  );
};

export { ConfirmProvider, useConfirm, useOptionalConfirm };
