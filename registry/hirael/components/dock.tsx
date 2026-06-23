"use client";

import * as React from "react";
import {
  AnimatePresence,
  HTMLMotionProps,
  type MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";

import { cn } from "@/lib/utils";

type DockContextValue = {
  mouseX: MotionValue<number>;
  baseSize: number;
  magnification: number;
  distance: number;
};

const DockContext = React.createContext<DockContextValue | null>(null);

function useDock() {
  const ctx = React.useContext(DockContext);
  if (!ctx) throw new Error("Dock parts must be used within <Dock>");
  return ctx;
}

const DockItemContext = React.createContext<{ hovered: boolean }>({
  hovered: false,
});

type DockProps = React.ComponentProps<"div"> & {
  /** Resting icon size, in px. */
  baseSize?: number;
  /** Peak icon size at the cursor, in px. */
  magnification?: number;
  /** Falloff radius of the magnification, in px. */
  distance?: number;
};

function Dock({
  baseSize = 44,
  magnification = 72,
  distance = 140,
  className,
  children,
  ...props
}: DockProps) {
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
          if (event.pointerType === "mouse") mouseX.set(event.clientX);
        }}
        onPointerLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
        className={cn(
          "mx-auto flex items-end gap-3 rounded-2xl border border-border bg-popover/90 px-3 pb-3 pt-3 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-popover/70",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </DockContext.Provider>
  );
}

type DockItemProps = HTMLMotionProps<"button">;

function DockItem({ className, children, ...props }: DockItemProps) {
  const ref = React.useRef<HTMLButtonElement>(null);
  const { mouseX, baseSize, magnification, distance } = useDock();
  const [hovered, setHovered] = React.useState(false);

  const distanceFromMouse = useTransform(mouseX, (x) => {
    const bounds = ref.current?.getBoundingClientRect();
    const center = bounds ? bounds.x + bounds.width / 2 : 0;
    return x - center;
  });
  const widthTarget = useTransform(
    distanceFromMouse,
    [-distance, 0, distance],
    [baseSize, magnification, baseSize],
  );
  const width = useSpring(widthTarget, {
    mass: 0.1,
    stiffness: 170,
    damping: 14,
  });

  return (
    <DockItemContext.Provider value={{ hovered }}>
      <motion.button
        {...props}
        ref={ref}
        type="button"
        data-slot="dock-item"
        style={{ width, height: width }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        className={cn(
          "relative flex shrink-0 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-1/2",
          className,
        )}
      >
        {children}
      </motion.button>
    </DockItemContext.Provider>
  );
}

type DockLabelProps = HTMLMotionProps<"div">;

function DockLabel({ className, children, ...props }: DockLabelProps) {
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
            "pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md",
            className,
          )}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export { Dock, DockItem, DockLabel };
