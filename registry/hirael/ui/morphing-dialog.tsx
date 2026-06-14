"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  HTMLMotionProps,
  MotionConfig,
  motion,
} from "motion/react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

type MorphingDialogContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  uniqueId: string;
  titleId: string;
  descriptionId: string;
  triggerRef: React.RefObject<HTMLDivElement | null>;
};

const MorphingDialogContext =
  React.createContext<MorphingDialogContextValue | null>(null);

function useMorphingDialog() {
  const ctx = React.useContext(MorphingDialogContext);
  if (!ctx) {
    throw new Error(
      "MorphingDialog parts must be used within <MorphingDialog>",
    );
  }
  return ctx;
}

type MorphingDialogProps = {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

function MorphingDialog({
  children,
  open: openProp,
  defaultOpen,
  onOpenChange,
}: MorphingDialogProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultOpen ?? false);
  const isOpen = openProp ?? uncontrolled;
  const reactId = React.useId();
  const triggerRef = React.useRef<HTMLDivElement | null>(null);

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setUncontrolled(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );

  const value = React.useMemo<MorphingDialogContextValue>(
    () => ({
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
      uniqueId: reactId,
      titleId: `${reactId}-title`,
      descriptionId: `${reactId}-description`,
      triggerRef,
    }),
    [isOpen, setOpen, reactId],
  );

  return (
    <MorphingDialogContext.Provider value={value}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </MorphingDialogContext.Provider>
  );
}

type MorphingDialogTriggerProps = HTMLMotionProps<"div">;

function MorphingDialogTrigger({
  className,
  children,
  style,
  ...props
}: MorphingDialogTriggerProps) {
  const { open, isOpen, uniqueId, triggerRef } = useMorphingDialog();
  return (
    <motion.div
      {...props}
      ref={triggerRef}
      layoutId={`morphing-dialog-${uniqueId}`}
      data-slot="morphing-dialog-trigger"
      role="button"
      tabIndex={0}
      aria-expanded={isOpen}
      onClick={open}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          open();
        }
      }}
      style={{ borderRadius: 12, ...style }}
      className={cn(
        "cursor-pointer overflow-hidden border border-border bg-card text-card-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

function focusablewithin(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
    ),
  );
}

type MorphingDialogContentProps = HTMLMotionProps<"div">;

function MorphingDialogContent({
  className,
  children,
  style,
  ...props
}: MorphingDialogContentProps) {
  const { isOpen, close, uniqueId, titleId, descriptionId, triggerRef } =
    useMorphingDialog();
  const panelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isOpen) return;
    const panel = panelRef.current;
    const trigger = triggerRef.current;
    panel?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key === "Tab" && panel) {
        const focusables = focusablewithin(panel);
        if (!focusables.length) {
          event.preventDefault();
          panel.focus();
          return;
        }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (event.shiftKey && (active === first || active === panel)) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && active === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [isOpen, close, triggerRef]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <div data-slot="morphing-dialog-portal">
          <motion.div
            aria-hidden
            data-slot="morphing-dialog-overlay"
            className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              {...props}
              ref={panelRef}
              layoutId={`morphing-dialog-${uniqueId}`}
              data-slot="morphing-dialog-content"
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={descriptionId}
              tabIndex={-1}
              style={{ borderRadius: 12, ...style }}
              className={cn(
                "pointer-events-auto relative overflow-hidden border border-border bg-card text-card-foreground shadow-lg focus:outline-none",
                className,
              )}
            >
              {children}
            </motion.div>
          </div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

type MorphingDialogTitleProps = React.ComponentProps<"h2">;

function MorphingDialogTitle({
  className,
  ...props
}: MorphingDialogTitleProps) {
  const { titleId } = useMorphingDialog();
  return (
    <h2
      id={titleId}
      data-slot="morphing-dialog-title"
      className={cn(
        "text-lg font-semibold tracking-tight text-foreground",
        className,
      )}
      {...props}
    />
  );
}

type MorphingDialogDescriptionProps = React.ComponentProps<"p">;

function MorphingDialogDescription({
  className,
  ...props
}: MorphingDialogDescriptionProps) {
  const { descriptionId } = useMorphingDialog();
  return (
    <p
      id={descriptionId}
      data-slot="morphing-dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

type MorphingDialogCloseProps = React.ComponentProps<"button">;

function MorphingDialogClose({
  className,
  children,
  ...props
}: MorphingDialogCloseProps) {
  const { close } = useMorphingDialog();
  return (
    <button
      type="button"
      data-slot="morphing-dialog-close"
      onClick={close}
      aria-label="Close"
      className={cn(
        "absolute end-3 top-3 inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      {...props}
    >
      {children ?? <X className="size-4" />}
    </button>
  );
}

export {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogTitle,
  MorphingDialogDescription,
  MorphingDialogClose,
};
