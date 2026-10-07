'use client';

import * as React from 'react';
import { type HTMLMotionProps, type Transition, type Variants, MotionConfig, motion } from 'motion/react';

import { cn } from '@/lib/utils';
import { useControllableState } from '@/registry/hirael/hooks/use-controllable-state';

export type FabSide = 'top' | 'bottom' | 'left' | 'right';

const TRIGGER_SELECTOR = '[data-slot="floating-action-button-trigger"]';
const ITEM_SELECTOR = '[data-slot="floating-action-button-item"]:not(:disabled)';

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

const listVariants: Variants = {
  open: { transition: { staggerChildren: 0.04, delayChildren: 0.02 } },
  closed: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

const itemVariant = (offset: { x?: number; y?: number }): Variants => ({
  open: { opacity: 1, x: 0, y: 0, visibility: 'visible' },
  closed: { opacity: 0, ...offset, transitionEnd: { visibility: 'hidden' } },
});

const itemVariants: Record<FabSide, Variants> = {
  top: itemVariant({ y: 12 }),
  bottom: itemVariant({ y: -12 }),
  left: itemVariant({ x: 12 }),
  right: itemVariant({ x: -12 }),
};

const triggerTransition: Transition = { duration: 0.2, ease: [0.22, 1, 0.36, 1] };
const itemTransition: Transition = { type: 'spring', stiffness: 300, damping: 24 };

export interface FloatingActionButtonProps extends React.ComponentProps<'div'> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: FabSide;
}

const FloatingActionButton = ({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  side = 'top',
  className,
  children,
  onKeyDown,
  ...props
}: FloatingActionButtonProps) => {
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });

  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      const root = rootRef.current;
      const target = event.target as Node;

      if (root && !root.contains(target)) {
        setOpen(false);
      }
    };

    document.addEventListener('pointerdown', onPointerDown);

    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open, setOpen]);

  const focusTrigger = React.useCallback(() => {
    rootRef.current?.querySelector<HTMLElement>(TRIGGER_SELECTOR)?.focus();
  }, []);

  // Items stay `visibility: hidden` until their staggered entrance starts, so focus retries for a moment.
  // The budget is in time, not frames: on a 120Hz screen a few frames pass before the first item shows.
  const focusFirstItem = React.useCallback(() => {
    const deadline = performance.now() + 200;
    const attempt = () => {
      const item = rootRef.current?.querySelector<HTMLElement>(ITEM_SELECTOR);
      item?.focus();
      if (item && document.activeElement !== item && performance.now() < deadline) requestAnimationFrame(attempt);
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

const FloatingActionButtonTrigger = ({ className, onClick, ...props }: FloatingActionButtonTriggerProps) => {
  const { open, setOpen, focusFirstItem } = useFab();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    setOpen(!open);
    if (!open) focusFirstItem();
  };

  return (
    <motion.button
      type="button"
      data-slot="floating-action-button-trigger"
      data-state={open ? 'open' : 'closed'}
      aria-expanded={open}
      aria-haspopup="menu"
      animate={{ rotate: open ? 45 : 0 }}
      transition={triggerTransition}
      className={cn(
        'inline-flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none [&_svg]:size-5',
        className,
      )}
      {...props}
      onClick={handleClick}
    />
  );
};

export type FloatingActionButtonListProps = HTMLMotionProps<'div'>;

const FloatingActionButtonList = ({ className, onKeyDown, ...props }: FloatingActionButtonListProps) => {
  const { open, side } = useFab();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;

    // The row is pinned to physical order in both directions, so the arrow keys stay physical too.
    const horizontal = side === 'left' || side === 'right';
    // `top` and `left` render reversed, so moving down or right walks the DOM backwards.
    const step = side === 'top' || side === 'left' ? -1 : 1;
    const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(ITEM_SELECTOR));
    const current = items.indexOf(document.activeElement as HTMLElement);

    let index: number;
    switch (event.key) {
      case horizontal ? 'ArrowRight' : 'ArrowDown':
        index = current + step;
        break;
      case horizontal ? 'ArrowLeft' : 'ArrowUp':
        index = current - step;
        break;
      case 'Home':
        index = 0;
        break;
      case 'End':
        index = -1;
        break;
      default:
        return;
    }

    event.preventDefault();
    items.at(index % items.length)?.focus();
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

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    setOpen(false);
    focusTrigger();
  };

  return (
    <motion.button
      type="button"
      role="menuitem"
      tabIndex={open ? 0 : -1}
      data-slot="floating-action-button-item"
      variants={itemVariants[side]}
      transition={itemTransition}
      className={cn(
        'inline-flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none [&_svg]:size-4',
        className,
      )}
      {...props}
      onClick={handleClick}
    />
  );
};

export { FloatingActionButton, FloatingActionButtonTrigger, FloatingActionButtonList, FloatingActionButtonItem };
