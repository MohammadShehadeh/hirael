"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/registry/hirael/ui/alert-dialog";
import { Button } from "@/registry/hirael/ui/button";

export type ConfirmTone = "default" | "destructive";

export type ConfirmOptions = {
  /** Dialog heading. */
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
   * Runs when the user confirms. While the returned promise is pending the
   * confirm button shows a spinner and the dialog stays open, closing once it
   * resolves. If it rejects, the dialog returns to its idle state so the user
   * can retry, so handle the error inside `onConfirm`. When omitted,
   * confirming closes immediately.
   */
  onConfirm?: () => void | Promise<void>;
};

/** Opens the dialog and resolves `true` on confirm, `false` on cancel/dismiss. */
export type ConfirmFn = (options?: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = React.createContext<ConfirmFn | null>(null);

/**
 * Returns a `confirm(options)` function that opens the shared dialog and
 * resolves to `true` when the user confirms or `false` when they cancel or
 * dismiss it. Must be called under a `<ConfirmProvider>`.
 */
function useConfirm(): ConfirmFn {
  const ctx = React.useContext(ConfirmContext);
  if (!ctx) {
    throw new Error("useConfirm must be used inside <ConfirmProvider>");
  }
  return ctx;
}

type ConfirmRequest = {
  options: ConfirmOptions;
  resolve: (value: boolean) => void;
};

export type ConfirmProviderProps = {
  children: React.ReactNode;
  /** Defaults merged under every `confirm()` call. */
  defaultOptions?: Pick<
    ConfirmOptions,
    "confirmText" | "cancelText" | "tone" | "dismissible"
  >;
};

const CLOSE_DURATION = 200;

/**
 * Wrap your app once, near the root. Renders a single shared alert dialog and
 * exposes `useConfirm()` to any descendant. Re-entrant `confirm()` calls queue
 * behind the open one.
 */
function ConfirmProvider({ children, defaultOptions }: ConfirmProviderProps) {
  const [open, setOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [active, setActive] = React.useState<ConfirmRequest | null>(null);
  const activeRef = React.useRef<ConfirmRequest | null>(null);
  const queueRef = React.useRef<ConfirmRequest[]>([]);
  const closingRef = React.useRef(false);

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
    window.setTimeout(() => {
      closingRef.current = false;
      const next = queueRef.current.shift() ?? null;
      activeRef.current = next;
      setActive(next);
      setOpen(next !== null);
    }, CLOSE_DURATION);
  }, []);

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
        (error) => {
          setPending(false);
          throw error;
        },
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
    confirmText: "Confirm",
    cancelText: "Cancel",
    tone: "default",
    dismissible: true,
    ...defaultOptions,
    ...active?.options,
  };
  const tone = options.tone ?? "default";
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
          {...(hasDescription ? {} : { "aria-describedby": undefined })}
        >
          <AlertDialogHeader>
            {options.icon != null ? (
              <AlertDialogMedia
                className={cn(
                  tone === "destructive" &&
                    "bg-destructive/10 text-destructive",
                )}
              >
                {options.icon}
              </AlertDialogMedia>
            ) : null}
            <AlertDialogTitle>{options.title}</AlertDialogTitle>
            {hasDescription ? (
              <AlertDialogDescription>
                {options.description}
              </AlertDialogDescription>
            ) : null}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>
              {options.cancelText}
            </AlertDialogCancel>
            <Button
              type="button"
              data-slot="confirm-action"
              data-tone={tone}
              variant={tone === "destructive" ? "destructive" : "default"}
              disabled={pending}
              onClick={handleConfirm}
            >
              {pending ? <ConfirmSpinner /> : null}
              {options.confirmText}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ConfirmContext.Provider>
  );
}

function ConfirmSpinner() {
  return (
    <span
      data-slot="confirm-spinner"
      aria-hidden
      className="size-4 animate-spin rounded-full border-2 border-current border-e-transparent"
    />
  );
}

export { ConfirmProvider, useConfirm };
