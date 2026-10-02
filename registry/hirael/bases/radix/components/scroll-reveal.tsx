'use client';

import * as React from 'react';
import { animate, type HTMLMotionProps, motion, useReducedMotion } from 'motion/react';
import { observeReveal } from '@/registry/hirael/lib/reveal-observer';

export type ScrollRevealDirection = 'up' | 'down' | 'left' | 'right' | 'start' | 'end';

export interface ScrollRevealProps extends HTMLMotionProps<'div'> {
  /** Direction the content travels as it reveals. `start` and `end` follow the text direction; `left` and `right` stay physical. */
  direction?: ScrollRevealDirection;
  /** Travel distance, in px. */
  distance?: number;
  /** Delay before the reveal starts, in ms. */
  delay?: number;
  /** Reveal duration, in ms. */
  duration?: number;
  /** Reveal once and stay, or replay every time it re-enters the viewport. */
  once?: boolean;
  /** Visible fraction (0–1) that triggers the reveal. */
  amount?: number;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const offsetFor = (direction: ScrollRevealDirection, distance: number, rtl: boolean) => {
  const flip = rtl ? -1 : 1;

  return {
    up: { x: 0, y: distance },
    down: { x: 0, y: -distance },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
    start: { x: flip * distance, y: 0 },
    end: { x: -flip * distance, y: 0 },
  }[direction];
};

/**
 * Server HTML stays visible, so nothing waits on hydration. Once mounted, content that is off
 * screen is hidden and motion reveals it on arrival; content already in view is left alone.
 */
const ScrollReveal = ({
  direction = 'up',
  distance = 24,
  delay = 0,
  duration = 600,
  once = true,
  amount = 0.3,
  ref,
  ...props
}: ScrollRevealProps) => {
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
          const { x, y } = offsetFor(direction, distance, getComputedStyle(node).direction === 'rtl');
          animate(node, { opacity: 0, x, y }, { duration: 0 });

          return;
        }
        if (isHidden) {
          isHidden = false;
          animate(node, { opacity: 1, x: 0, y: 0 }, { duration: duration / 1000, delay: delay / 1000, ease: EASE });
        }
        if (once) stop();
      });

      return stop;
    },
    [reduced, amount, once, duration, delay, direction, distance],
  );

  return <motion.div ref={revealRef} data-slot="scroll-reveal" {...props} />;
};

export { ScrollReveal };
