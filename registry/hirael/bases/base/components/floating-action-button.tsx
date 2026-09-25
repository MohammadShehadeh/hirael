'use client';

import * as React from 'react';
import { type HTMLMotionProps, type Variants, MotionConfig, motion } from 'motion/react';

import { cn } from '@/lib/utils';

export type FabSide = 'top' | 'bottom' | 'left' | 'right';

interface FabContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  side: FabSide;
  focusFirstItem: () => void;
  focusTrigger: () => void;
}

const FabContext = React.createContext<FabContextValue | null>(null);

const useFab = () => {
  const ctx = React.useContext(FabContext);
  if (!ctx) {
    throw new Error('FloatingActionButton parts must be used within <FloatingActionButton>');
  }

  return ctx;
};

// Horizontal sides are physical, like `side` itself: the rtl: counterparts stop RTL from flipping the row.
const listSideClasses: Record<FabSide, string> = {
  top: 'bottom-full left-1/2 mb-3 -translate-x-1/2 flex-col-reverse',
  bottom: 'top-full left-1/2 mt-3 -translate-x-1/2 flex-col',
  left: 'right-full top-1/2 mr-3 -translate-y-1/2 flex-row-reverse rtl:flex-row',
  right: 'left-full top-1/2 ml-3 -translate-y-1/2 flex-row rtl:flex-row-reverse',
};

const closedOffset: Record<FabSide, { x?: number; y?: number }> = {
  top: { y: 12 },
  bottom: { y: -12 },
  left: { x: 12 },
  right: { x: -12 },
};

const listVariants: Variants = {
  open: { transition: { staggerChildren: 0.04, delayChildren: 0.02 } },
  closed: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

export interface FloatingActionButtonProps extends React.ComponentProps<'div'> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: FabSide;
}

const FloatingActionButton = ({
  open: openProp,
  defaultOpen,
  onOpenChange,
  side = 'top',
  className,
  children,
  onKeyDown,
  ...props
}: FloatingActionButtonProps) => {
  const [uncontrolled, setUncontrolled] = React.useState(defaultOpen ?? false);
  const open = openProp ?? uncontrolled;
  const rootRef = React.useRef<HTMLDivElement>(null);

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setUncontrolled(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );

  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      const root = rootRef.current;
      if (root && event.target instanceof Node && !root.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);

    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open, setOpen]);

  const focusTrigger = React.useCallback(() => {
    rootRef.current?.querySelector<HTMLElement>('[data-slot="floating-action-button-trigger"]')?.focus();
  }, []);

  // Items stay `visibility: hidden` until the open animation starts, so focus waits a few frames for them.
  const focusFirstItem = React.useCallback(() => {
    let frames = 3;
    const attempt = () => {
      const item = rootRef.current?.querySelector<HTMLElement>(
        '[data-slot="floating-action-button-item"]:not(:disabled)',
      );
      item?.focus();
      frames -= 1;
      if (item && document.activeElement !== item && frames > 0) requestAnimationFrame(attempt);
    };
    requestAnimationFrame(attempt);
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || event.key !== 'Escape' || !open) return;
    event.stopPropagation();
    setOpen(false);
    focusTrigger();
  };

  const value = React.useMemo<FabContextValue>(
    () => ({ open, setOpen, side, focusFirstItem, focusTrigger }),
    [open, setOpen, side, focusFirstItem, focusTrigger],
  );

  return (
    <FabContext.Provider value={value}>
      <MotionConfig reducedMotion="user">
        <div
          ref={rootRef}
          data-slot="floating-action-button"
          data-state={open ? 'open' : 'closed'}
          className={cn('relative inline-flex', className)}
          {...props}
          onKeyDown={handleKeyDown}
        >
          {children}
        </div>
      </MotionConfig>
    </FabContext.Provider>
  );
};

export type FloatingActionButtonTriggerProps = HTMLMotionProps<'button'>;

const FloatingActionButtonTrigger = ({ className, children, onClick, ...props }: FloatingActionButtonTriggerProps) => {
  const { open, setOpen, focusFirstItem } = useFab();

  return (
    <motion.button
      type="button"
      data-slot="floating-action-button-trigger"
      data-state={open ? 'open' : 'closed'}
      aria-expanded={open}
      aria-haspopup="menu"
      animate={{ rotate: open ? 45 : 0 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'inline-flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none [&_svg]:size-5',
        className,
      )}
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        setOpen(!open);
        if (!open) focusFirstItem();
      }}
    >
      {children}
    </motion.button>
  );
};

export type FloatingActionButtonListProps = HTMLMotionProps<'div'>;

const FloatingActionButtonList = ({ className, onKeyDown, ...props }: FloatingActionButtonListProps) => {
  const { open, side } = useFab();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || !open) return;
    // The row is pinned to physical order in both directions, so the arrow keys stay physical too.
    const horizontal = side === 'left' || side === 'right';
    const nextKey = horizontal ? 'ArrowRight' : 'ArrowDown';
    const prevKey = horizontal ? 'ArrowLeft' : 'ArrowUp';
    if (event.key !== nextKey && event.key !== prevKey) return;
    event.preventDefault();
    const items = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>('[data-slot="floating-action-button-item"]:not(:disabled)'),
    );
    if (items.length === 0) return;
    const delta = (event.key === nextKey) !== (side === 'top' || side === 'left') ? 1 : -1;
    const index = items.indexOf(document.activeElement as HTMLElement);
    const target = index === -1 ? items[0] : items[(index + delta + items.length) % items.length];
    target?.focus();
  };

  return (
    <motion.div
      role="menu"
      data-slot="floating-action-button-list"
      data-state={open ? 'open' : 'closed'}
      initial={false}
      animate={open ? 'open' : 'closed'}
      variants={listVariants}
      className={cn(
        'absolute z-10 flex items-center gap-2',
        listSideClasses[side],
        !open && 'pointer-events-none',
        className,
      )}
      {...props}
      onKeyDown={handleKeyDown}
    />
  );
};

export type FloatingActionButtonItemProps = HTMLMotionProps<'button'>;

const FloatingActionButtonItem = ({ className, onClick, ...props }: FloatingActionButtonItemProps) => {
  const { open, setOpen, side, focusTrigger } = useFab();
  const itemVariants: Variants = {
    open: { opacity: 1, x: 0, y: 0, visibility: 'visible' },
    closed: { opacity: 0, ...closedOffset[side], transitionEnd: { visibility: 'hidden' } },
  };

  return (
    <motion.button
      type="button"
      role="menuitem"
      tabIndex={open ? 0 : -1}
      aria-hidden={open ? undefined : true}
      data-slot="floating-action-button-item"
      variants={itemVariants}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className={cn(
        'inline-flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none [&_svg]:size-4',
        className,
      )}
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        setOpen(false);
        focusTrigger();
      }}
    />
  );
};

export { FloatingActionButton, FloatingActionButtonTrigger, FloatingActionButtonList, FloatingActionButtonItem };
