'use client';

import * as React from 'react';
import { useRender } from '@base-ui/react/use-render';
import { type HTMLMotionProps, motion, useReducedMotion, useSpring } from 'motion/react';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/registry/hirael/bases/base/ui/button';

const MagneticSlot = ({ render, ...props }: useRender.ComponentProps<'button'>) => {
  return useRender({ defaultTagName: 'button', render, props });
};

const MotionSlot = motion.create(MagneticSlot);

const SPRING = { stiffness: 200, damping: 15, mass: 0.1 };

export interface MagneticButtonProps extends HTMLMotionProps<'button'> {
  /** Pull strength as a fraction of the cursor's distance from center. */
  strength?: number;
  /** Render another element instead of a button (e.g. `render={<a href="/docs" />}`). */
  render?: useRender.RenderProp;
}

const MagneticButton = ({
  className,
  strength = 0.4,
  render,
  onPointerMove,
  onPointerLeave,
  ...props
}: MagneticButtonProps) => {
  const reduced = useReducedMotion();
  const x = useSpring(0, SPRING);
  const y = useSpring(0, SPRING);

  const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    onPointerMove?.(event);
    if (event.defaultPrevented || reduced || event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const handlePointerLeave = (event: React.PointerEvent<HTMLButtonElement>) => {
    onPointerLeave?.(event);
    x.set(0);
    y.set(0);
  };

  return (
    <MotionSlot
      data-slot="magnetic-button"
      render={render}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ x, y }}
      className={cn(
        !render && buttonVariants(),
        // Motion drives the transform every frame; transition-all would make it lag behind the spring.
        'transition-[color,background-color,border-color,box-shadow]',
        className,
      )}
      {...props}
    />
  );
};

export { MagneticButton };
