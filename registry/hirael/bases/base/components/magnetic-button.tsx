'use client';

import * as React from 'react';
import { useRender } from '@base-ui/react/use-render';
import { type HTMLMotionProps, motion, useReducedMotion, useSpring } from 'motion/react';

import { cn } from '@/lib/utils';

/** A `<button>` that can be swapped for any element through Base UI's `render` prop. */
const MagneticSlot = ({ render, ...props }: useRender.ComponentProps<'button'>) => {
  return useRender({ defaultTagName: 'button', render, props });
};

const MotionSlot = motion.create(MagneticSlot);

const SPRING = { stiffness: 200, damping: 15, mass: 0.1 };

interface MagneticButtonProps extends HTMLMotionProps<'button'> {
  /** Pull strength as a fraction of the cursor's distance from center. */
  strength?: number;
  /** Render another element instead of a button (e.g. `render={<a href="/docs" />}`). */
  render?: useRender.RenderProp;
}

const MagneticButton = ({ className, strength = 0.4, render, ...props }: MagneticButtonProps) => {
  const reduced = useReducedMotion();
  const x = useSpring(0, SPRING);
  const y = useSpring(0, SPRING);

  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (reduced) return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <MotionSlot
      data-slot="magnetic-button"
      render={render}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      style={{ x, y }}
      className={cn(
        !render &&
          'inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className,
      )}
      {...props}
    />
  );
};

export { MagneticButton };
