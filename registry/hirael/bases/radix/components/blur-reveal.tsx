'use client';

import * as React from 'react';
import { animate, type HTMLMotionProps, motion, useReducedMotion } from 'motion/react';
import { observeReveal } from '@/registry/hirael/bases/radix/components/reveal-observer';

export interface BlurRevealProps extends HTMLMotionProps<'div'> {
  /** Delay before the reveal starts, in ms. */
  delay?: number;
  /** Reveal duration, in ms. */
  duration?: number;
  /** Reveal once and stay, or replay every time it re-enters the viewport. */
  once?: boolean;
  /** Visible fraction (0–1) that triggers the reveal. */
  amount?: number;
  /** Starting blur, in px. Blur repaints every frame; keep it small on large elements. */
  blur?: number;
  /** Starting vertical offset, in px. */
  y?: number;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Server HTML stays visible, so nothing waits on hydration. Once mounted, content that is off
 * screen is hidden and motion reveals it on arrival; content already in view is left alone.
 */
const BlurReveal = ({
  delay = 0,
  duration = 600,
  once = true,
  amount = 0.3,
  blur = 8,
  y = 8,
  ref,
  ...props
}: BlurRevealProps) => {
  const nodeRef = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  React.useImperativeHandle(ref, () => nodeRef.current as HTMLDivElement);

  // A callback ref, not an effect: observation starts when the node attaches and stops when it detaches.
  const revealRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      nodeRef.current = node;
      if (!node || reduced) return;
      let isHidden = false;
      const stop = observeReveal(node, amount, (inView) => {
        if (!inView) {
          if (isHidden) return;
          isHidden = true;
          animate(node, { opacity: 0, filter: `blur(${blur}px)`, y }, { duration: 0 });

          return;
        }
        if (isHidden) {
          isHidden = false;
          animate(
            node,
            { opacity: 1, filter: 'blur(0px)', y: 0 },
            { duration: duration / 1000, delay: delay / 1000, ease: EASE },
          );
        }
        if (once) stop();
      });

      return stop;
    },
    [reduced, amount, once, duration, delay, blur, y],
  );

  return <motion.div ref={revealRef} data-slot="blur-reveal" {...props} />;
};

export { BlurReveal };
