'use client';

import * as React from 'react';
import { animate, type HTMLMotionProps, motion, useReducedMotion } from 'motion/react';

type ScrollRevealDirection = 'up' | 'down' | 'left' | 'right';

interface ScrollRevealProps extends HTMLMotionProps<'div'> {
  /** Direction the content travels in from. */
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

const offsetFor = (direction: ScrollRevealDirection, distance: number) => {
  switch (direction) {
    case 'up':
      return { x: 0, y: distance };
    case 'down':
      return { x: 0, y: -distance };
    case 'left':
      return { x: distance, y: 0 };
    case 'right':
      return { x: -distance, y: 0 };
  }
};

type RevealHandler = (inView: boolean) => void;

interface RevealObserver {
  observer: IntersectionObserver;
  handlers: Map<Element, RevealHandler>;
}

// One observer per threshold, shared by every instance on the page.
const observers = new Map<number, RevealObserver>();

const observeReveal = (node: Element, amount: number, handler: RevealHandler) => {
  let entry = observers.get(amount);
  if (!entry) {
    const handlers = new Map<Element, RevealHandler>();
    const observer = new IntersectionObserver(
      (records) => {
        for (const record of records) {
          // An element taller than viewport / amount can never reach the ratio, so it reveals on entry.
          const viewport = record.rootBounds?.height ?? window.innerHeight;
          const canReachAmount = record.boundingClientRect.height * amount <= viewport;
          if (record.isIntersecting && (record.intersectionRatio >= amount || !canReachAmount)) {
            handlers.get(record.target)?.(true);
          } else if (!record.isIntersecting) handlers.get(record.target)?.(false);
        }
      },
      { threshold: [0, amount] },
    );
    entry = { observer, handlers };
    observers.set(amount, entry);
  }
  const { observer, handlers } = entry;
  handlers.set(node, handler);
  observer.observe(node);
  return () => {
    if (!handlers.delete(node)) return;
    observer.unobserve(node);
    if (handlers.size === 0) {
      observer.disconnect();
      observers.delete(amount);
    }
  };
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
  const { x, y } = offsetFor(direction, distance);

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
    [reduced, amount, once, duration, delay, x, y],
  );

  return <motion.div ref={revealRef} data-slot="scroll-reveal" {...props} />;
};

export { ScrollReveal };
