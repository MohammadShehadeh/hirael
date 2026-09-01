'use client';

import * as React from 'react';
import {
  AnimatePresence,
  HTMLMotionProps,
  type MotionValue,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react';

import { cn } from '@/lib/utils';
import { composeRefs } from '@/registry/hirael/bases/radix/components/compose-refs';

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

const DockItemContext = React.createContext<{ hovered: boolean }>({
  hovered: false,
});

interface DockProps extends React.ComponentProps<'div'> {
  /** Resting icon size, in px. */
  baseSize?: number;
  /** Peak icon size at the cursor, in px. */
  magnification?: number;
  /** Falloff radius of the magnification, in px. */
  distance?: number;
}

const Dock = ({ baseSize = 44, magnification = 72, distance = 140, className, children, ...props }: DockProps) => {
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
          if (event.pointerType === 'mouse') mouseX.set(event.clientX);
        }}
        onPointerLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
        onKeyDown={(event) => {
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
          'mx-auto flex items-end gap-3 rounded-2xl border border-border bg-popover/90 px-3 pb-3 pt-3 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-popover/70',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </DockContext.Provider>
  );
};

type DockItemProps = HTMLMotionProps<'button'>;

const DockItem = ({ className, children, ref: consumerRef, ...props }: DockItemProps) => {
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
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        className={cn(
          'relative flex shrink-0 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-1/2',
          className,
        )}
      >
        {children}
      </motion.button>
    </DockItemContext.Provider>
  );
};

type DockLabelProps = HTMLMotionProps<'div'>;

const DockLabel = ({ className, children, ...props }: DockLabelProps) => {
  const { hovered } = React.useContext(DockItemContext);
  return (
    <AnimatePresence>
      {hovered ? (
        <motion.div
          {...props}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.15 }}
          data-slot="dock-label"
          className={cn(
            'pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md',
            className,
          )}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export { Dock, DockItem, DockLabel };
