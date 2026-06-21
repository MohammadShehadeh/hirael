"use client";

import * as React from "react";
import {
  type HTMLMotionProps,
  type Variants,
  MotionConfig,
  motion,
} from "motion/react";

import { cn } from "@/lib/utils";

type FabSide = "top" | "bottom" | "left" | "right";

type FabContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  side: FabSide;
};

const FabContext = React.createContext<FabContextValue | null>(null);

function useFab() {
  const ctx = React.useContext(FabContext);
  if (!ctx) {
    throw new Error(
      "FloatingActionButton parts must be used within <FloatingActionButton>",
    );
  }
  return ctx;
}

const listSideClasses: Record<FabSide, string> = {
  top: "bottom-full left-1/2 mb-3 -translate-x-1/2 flex-col-reverse",
  bottom: "top-full left-1/2 mt-3 -translate-x-1/2 flex-col",
  left: "right-full top-1/2 me-3 -translate-y-1/2 flex-row-reverse",
  right: "left-full top-1/2 ms-3 -translate-y-1/2 flex-row",
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

type FloatingActionButtonProps = React.ComponentProps<"div"> & {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: FabSide;
};

function FloatingActionButton({
  open: openProp,
  defaultOpen,
  onOpenChange,
  side = "top",
  className,
  children,
  ...props
}: FloatingActionButtonProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultOpen ?? false);
  const open = openProp ?? uncontrolled;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setUncontrolled(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );

  const value = React.useMemo<FabContextValue>(
    () => ({ open, setOpen, side }),
    [open, setOpen, side],
  );

  return (
    <FabContext.Provider value={value}>
      <MotionConfig reducedMotion="user">
        <div
          data-slot="floating-action-button"
          data-state={open ? "open" : "closed"}
          className={cn("relative inline-flex", className)}
          {...props}
        >
          {children}
        </div>
      </MotionConfig>
    </FabContext.Provider>
  );
}

type FloatingActionButtonTriggerProps = HTMLMotionProps<"button">;

function FloatingActionButtonTrigger({
  className,
  children,
  ...props
}: FloatingActionButtonTriggerProps) {
  const { open, setOpen } = useFab();
  return (
    <motion.button
      type="button"
      data-slot="floating-action-button-trigger"
      data-state={open ? "open" : "closed"}
      aria-expanded={open}
      aria-haspopup="menu"
      onClick={() => setOpen(!open)}
      animate={{ rotate: open ? 45 : 0 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "inline-flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&_svg]:size-5",
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}

type FloatingActionButtonListProps = HTMLMotionProps<"div">;

function FloatingActionButtonList({
  className,
  ...props
}: FloatingActionButtonListProps) {
  const { open, side } = useFab();
  return (
    <motion.div
      role="menu"
      data-slot="floating-action-button-list"
      data-state={open ? "open" : "closed"}
      initial={false}
      animate={open ? "open" : "closed"}
      variants={listVariants}
      className={cn(
        "absolute z-10 flex items-center gap-2",
        listSideClasses[side],
        !open && "pointer-events-none",
        className,
      )}
      {...props}
    />
  );
}

type FloatingActionButtonItemProps = HTMLMotionProps<"button">;

function FloatingActionButtonItem({
  className,
  ...props
}: FloatingActionButtonItemProps) {
  const { open, side } = useFab();
  const itemVariants: Variants = {
    open: { opacity: 1, x: 0, y: 0 },
    closed: { opacity: 0, ...closedOffset[side] },
  };
  return (
    <motion.button
      type="button"
      role="menuitem"
      tabIndex={open ? 0 : -1}
      data-slot="floating-action-button-item"
      variants={itemVariants}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-4",
        className,
      )}
      {...props}
    />
  );
}

export {
  FloatingActionButton,
  FloatingActionButtonTrigger,
  FloatingActionButtonList,
  FloatingActionButtonItem,
};
