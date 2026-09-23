'use client';

import * as React from 'react';
import {
  AnimatePresence,
  type HTMLMotionProps,
  type MotionValue,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react';

import { cn } from '@/lib/utils';
import { composeRefs } from '@/registry/hirael/bases/base/components/compose-refs';

interface DockContextValue {
  mouseX: MotionValue<number>;
  baseSize: number;
  magnification: number;
  distance: number;
}

const DockContext = React.createContext<DockContextValue | null>(null);

const useDock = () => {
  const ctx = React.useContext(DockContext);
  if (!ctx) throw new Error('Dock parts must be used within <Dock>');

  return ctx;
};

interface DockItemContextValue {
  hovered: boolean;
}

const DockItemContext = React.createContext<DockItemContextValue | null>(null);

const useDockItem = () => {
  const ctx = React.useContext(DockItemContext);
  if (!ctx) throw new Error('DockLabel must be used within <DockItem>');

  return ctx;
};

export interface DockProps extends React.ComponentProps<'div'> {
  /** Resting icon size, in px. */
  baseSize?: number;
  /** Peak icon size at the cursor, in px. */
  magnification?: number;
  /** Falloff radius of the magnification, in px. */
  distance?: number;
}

const Dock = ({
  baseSize = 44,
  magnification = 72,
  distance = 140,
  className,
  children,
  onKeyDown,
  onPointerMove,
  onPointerLeave,
  ...props
}: DockProps) => {
  const mouseX = useMotionValue(Number.POSITIVE_INFINITY);
  const value = React.useMemo<DockContextValue>(
    () => ({ mouseX, baseSize, magnification, distance }),
    [mouseX, baseSize, magnification, distance],
  );

  return (
    <DockContext.Provider value={value}>
      <div
        role="toolbar"
        data-slot="dock"
        onPointerMove={(event) => {
          onPointerMove?.(event);
          if (!event.defaultPrevented && event.pointerType === 'mouse') mouseX.set(event.clientX);
        }}
        onPointerLeave={(event) => {
          onPointerLeave?.(event);
          mouseX.set(Number.POSITIVE_INFINITY);
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented) return;
          if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
          const items = Array.from(
            event.currentTarget.querySelectorAll<HTMLElement>('[data-slot="dock-item"]:not(:disabled)'),
          );
          const index = items.indexOf(document.activeElement as HTMLElement);
          if (index === -1) return;
          event.preventDefault();
          const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
          let delta = event.key === 'ArrowRight' ? 1 : -1;
          if (rtl) delta = -delta;
          items[(index + delta + items.length) % items.length]?.focus();
        }}
        className={cn(
          'mx-auto flex items-end gap-3 rounded-2xl border border-border bg-popover/90 px-3 pt-3 pb-3 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-popover/70',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </DockContext.Provider>
  );
};

export type DockItemProps = HTMLMotionProps<'button'>;

const DockItem = ({
  className,
  children,
  ref: consumerRef,
  onHoverStart,
  onHoverEnd,
  onFocus,
  onBlur,
  ...props
}: DockItemProps) => {
  const ref = React.useRef<HTMLButtonElement>(null);
  const composedRef = React.useMemo(() => composeRefs(ref, consumerRef), [consumerRef]);
  const { mouseX, baseSize, magnification, distance } = useDock();
  const [hovered, setHovered] = React.useState(false);
  const reducedMotion = useReducedMotion();

  const distanceFromMouse = useTransform(mouseX, (x) => {
    const bounds = ref.current?.getBoundingClientRect();
    const center = bounds ? bounds.x + bounds.width / 2 : 0;

    return x - center;
  });
  const widthTarget = useTransform(distanceFromMouse, [-distance, 0, distance], [baseSize, magnification, baseSize]);
  const width = useSpring(widthTarget, {
    mass: 0.1,
    stiffness: 170,
    damping: 14,
  });

  const itemCtx = React.useMemo(() => ({ hovered }), [hovered]);

  return (
    <DockItemContext.Provider value={itemCtx}>
      <motion.button
        {...props}
        ref={composedRef}
        type="button"
        data-slot="dock-item"
        style={reducedMotion ? { width: baseSize, height: baseSize } : { width, height: width }}
        onHoverStart={(event, info) => {
          onHoverStart?.(event, info);
          setHovered(true);
        }}
        onHoverEnd={(event, info) => {
          onHoverEnd?.(event, info);
          setHovered(false);
        }}
        onFocus={(event) => {
          onFocus?.(event);
          setHovered(true);
        }}
        onBlur={(event) => {
          onBlur?.(event);
          setHovered(false);
        }}
        className={cn(
          'relative flex shrink-0 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-sm transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none [&_svg]:size-1/2',
          className,
        )}
      >
        {children}
      </motion.button>
    </DockItemContext.Provider>
  );
};

export interface DockLabelProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children?: React.ReactNode;
}

const DockLabel = ({ className, children, ...props }: DockLabelProps) => {
  const { hovered } = useDockItem();

  return (
    <>
      {/* Always in the accessibility tree, so an icon-only item keeps its name while the tooltip is hidden. */}
      <span data-slot="dock-label-text" className="sr-only">
        {children}
      </span>
      <AnimatePresence>
        {hovered ? (
          <motion.div
            {...props}
            aria-hidden
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            data-slot="dock-label"
            className={cn(
              'pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-md border border-border bg-popover px-2 py-1 text-xs whitespace-nowrap text-popover-foreground shadow-md',
              className,
            )}
          >
            {children}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export { Dock, DockItem, DockLabel };
