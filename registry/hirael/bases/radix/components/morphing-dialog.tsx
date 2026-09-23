'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, type HTMLMotionProps, MotionConfig, motion } from 'motion/react';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { composeRefs } from '@/registry/hirael/bases/radix/components/compose-refs';
import { Button } from '@/registry/hirael/bases/radix/ui/button';

interface MorphingDialogContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  uniqueId: string;
  titleId: string;
  descriptionId: string;
  hasTitle: boolean;
  hasDescription: boolean;
  setHasTitle: React.Dispatch<React.SetStateAction<boolean>>;
  setHasDescription: React.Dispatch<React.SetStateAction<boolean>>;
  triggerRef: React.RefObject<HTMLDivElement | null>;
}

const NEVER_CHANGES = () => () => {};

const MorphingDialogContext = React.createContext<MorphingDialogContextValue | null>(null);

const useMorphingDialog = () => {
  const ctx = React.useContext(MorphingDialogContext);
  if (!ctx) {
    throw new Error('MorphingDialog parts must be used within <MorphingDialog>');
  }

  return ctx;
};

export interface MorphingDialogProps {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const MorphingDialog = ({ children, open: openProp, defaultOpen, onOpenChange }: MorphingDialogProps) => {
  const [uncontrolled, setUncontrolled] = React.useState(defaultOpen ?? false);
  const isOpen = openProp ?? uncontrolled;
  const reactId = React.useId();
  const triggerRef = React.useRef<HTMLDivElement | null>(null);
  const [hasTitle, setHasTitle] = React.useState(false);
  const [hasDescription, setHasDescription] = React.useState(false);

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setUncontrolled(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );

  const open = React.useCallback(() => setOpen(true), [setOpen]);
  const close = React.useCallback(() => setOpen(false), [setOpen]);

  const value = React.useMemo<MorphingDialogContextValue>(
    () => ({
      isOpen,
      open,
      close,
      uniqueId: reactId,
      titleId: `${reactId}-title`,
      descriptionId: `${reactId}-description`,
      hasTitle,
      hasDescription,
      setHasTitle,
      setHasDescription,
      triggerRef,
    }),
    [isOpen, open, close, reactId, hasTitle, hasDescription],
  );

  return (
    <MorphingDialogContext.Provider value={value}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </MorphingDialogContext.Provider>
  );
};

export type MorphingDialogTriggerProps = HTMLMotionProps<'div'>;

const MorphingDialogTrigger = ({
  className,
  children,
  style,
  ref,
  onClick,
  onKeyDown,
  ...props
}: MorphingDialogTriggerProps) => {
  const { open, isOpen, uniqueId, triggerRef } = useMorphingDialog();
  const composedRef = React.useMemo(() => composeRefs(triggerRef, ref), [triggerRef, ref]);

  return (
    <motion.div
      {...props}
      ref={composedRef}
      layoutId={`morphing-dialog-${uniqueId}`}
      data-slot="morphing-dialog-trigger"
      role="button"
      tabIndex={0}
      aria-expanded={isOpen}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) open();
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          open();
        }
      }}
      style={{ borderRadius: 12, ...style }}
      className={cn(
        'cursor-pointer overflow-hidden border border-border bg-card text-card-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
        className,
      )}
    >
      {children}
    </motion.div>
  );
};

const focusableWithin = (container: HTMLElement) => {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
    ),
  );
};

export type MorphingDialogContentProps = HTMLMotionProps<'div'>;

const MorphingDialogContent = ({ className, children, style, ref, ...props }: MorphingDialogContentProps) => {
  const { isOpen, close, uniqueId, titleId, descriptionId, hasTitle, hasDescription, triggerRef } = useMorphingDialog();
  const panelRef = React.useRef<HTMLDivElement>(null);
  const composedRef = React.useMemo(() => composeRefs(panelRef, ref), [ref]);
  const mounted = React.useSyncExternalStore(
    NEVER_CHANGES,
    () => true,
    () => false,
  );
  // Latest close in a ref so an inline onOpenChange doesn't re-run the focus effect on every render.
  const closeRef = React.useRef(close);
  React.useEffect(() => {
    closeRef.current = close;
  }, [close]);

  React.useEffect(() => {
    if (!isOpen) return;
    const panel = panelRef.current;
    const trigger = triggerRef.current;
    panel?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeRef.current();

        return;
      }
      if (event.key === 'Tab' && panel) {
        const focusables = focusableWithin(panel);
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

    document.addEventListener('keydown', onKeyDown);
    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingInlineEnd;
    // Reserve the scrollbar's width so the page doesn't shift sideways while scrolling is locked.
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      const currentPadding = parseFloat(getComputedStyle(body).paddingInlineEnd) || 0;
      body.style.paddingInlineEnd = `${currentPadding + scrollbarWidth}px`;
    }
    body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      body.style.overflow = previousOverflow;
      body.style.paddingInlineEnd = previousPadding;
      trigger?.focus();
    };
  }, [isOpen, triggerRef]);

  if (!mounted) return null;

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
          <div
            data-slot="morphing-dialog-positioner"
            className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              {...props}
              ref={composedRef}
              layoutId={`morphing-dialog-${uniqueId}`}
              data-slot="morphing-dialog-content"
              role="dialog"
              aria-modal="true"
              aria-labelledby={hasTitle ? titleId : undefined}
              aria-describedby={hasDescription ? descriptionId : undefined}
              tabIndex={-1}
              style={{ borderRadius: 12, ...style }}
              className={cn(
                'pointer-events-auto relative overflow-hidden border border-border bg-card text-card-foreground shadow-lg focus:outline-none',
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
};

export type MorphingDialogTitleProps = React.ComponentProps<'h2'>;

const MorphingDialogTitle = ({ className, ...props }: MorphingDialogTitleProps) => {
  const { titleId, setHasTitle } = useMorphingDialog();

  React.useEffect(() => {
    setHasTitle(true);

    return () => setHasTitle(false);
  }, [setHasTitle]);

  return (
    <h2
      id={titleId}
      data-slot="morphing-dialog-title"
      className={cn('text-lg font-semibold tracking-tight text-foreground', className)}
      {...props}
    />
  );
};

export type MorphingDialogDescriptionProps = React.ComponentProps<'p'>;

const MorphingDialogDescription = ({ className, ...props }: MorphingDialogDescriptionProps) => {
  const { descriptionId, setHasDescription } = useMorphingDialog();

  React.useEffect(() => {
    setHasDescription(true);

    return () => setHasDescription(false);
  }, [setHasDescription]);

  return (
    <p
      id={descriptionId}
      data-slot="morphing-dialog-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
};

export type MorphingDialogCloseProps = React.ComponentProps<'button'>;

const MorphingDialogClose = ({ className, children, onClick, ...props }: MorphingDialogCloseProps) => {
  const { close } = useMorphingDialog();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      data-slot="morphing-dialog-close"
      aria-label="Close"
      className={cn('absolute end-3 top-3', className)}
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) close();
      }}
    >
      {children ?? <X className="size-4" />}
    </Button>
  );
};

export {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogTitle,
  MorphingDialogDescription,
  MorphingDialogClose,
};
