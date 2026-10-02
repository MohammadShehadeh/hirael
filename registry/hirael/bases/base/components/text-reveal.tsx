'use client';

import * as React from 'react';
import { animate, stagger as staggerDelay, useReducedMotion } from 'motion/react';

import { cn } from '@/lib/utils';
import { observeReveal } from '@/registry/hirael/bases/base/components/reveal-observer';

export type TextRevealBy = 'word' | 'char' | 'line';

export interface TextRevealProps extends Omit<React.ComponentProps<'span'>, 'children' | 'ref'> {
  children: string;
  ref?: React.Ref<HTMLElement>;
  /** Element to render the text as. */
  as?: React.ElementType;
  /** Split granularity for the staggered reveal. */
  by?: TextRevealBy;
  /** Delay before the first unit reveals, in ms. */
  delay?: number;
  /** Per-unit reveal duration, in ms. */
  duration?: number;
  /** Delay added between units, in ms. */
  stagger?: number;
  /** Reveal once and stay, or replay every time it re-enters the viewport. */
  once?: boolean;
  /** Visible fraction (0–1) that triggers the reveal. */
  amount?: number;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const UNIT = '[data-slot=text-reveal-unit] > span';

/**
 * Server HTML stays visible, so nothing waits on hydration. Once mounted, text that is off
 * screen is hidden and motion reveals it on arrival; text already in view is left alone.
 */
const TextReveal = ({
  children,
  as,
  by = 'word',
  delay = 0,
  duration = 600,
  stagger = 60,
  once = true,
  amount = 0.3,
  className,
  ref,
  ...props
}: TextRevealProps) => {
  const nodeRef = React.useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  React.useImperativeHandle(ref, () => nodeRef.current as HTMLElement);
  const Tag = as ?? 'p';

  // A callback ref, not an effect: observation starts when the node attaches and stops when it
  // detaches. It watches the container because each unit starts clipped by its mask.
  const revealRef = React.useCallback(
    (node: HTMLElement | null) => {
      nodeRef.current = node;
      if (!node || reduced) return;
      let isHidden = false;
      const stop = observeReveal(node, amount, (inView) => {
        const units = node.querySelectorAll<HTMLElement>(UNIT);
        if (!inView) {
          if (isHidden) return;
          isHidden = true;
          animate(units, { y: '120%', opacity: 0 }, { duration: 0 });

          return;
        }
        if (isHidden) {
          isHidden = false;
          animate(
            units,
            { y: 0, opacity: 1 },
            {
              duration: duration / 1000,
              delay: staggerDelay(stagger / 1000, { startDelay: delay / 1000 }),
              ease: EASE,
            },
          );
        }
        if (once) stop();
      });

      return stop;
    },
    [reduced, amount, once, duration, delay, stagger],
  );

  const units = by === 'char' ? Array.from(children) : by === 'line' ? children.split('\n') : children.split(' ');

  return (
    <Tag ref={revealRef} data-slot="text-reveal" className={cn(by === 'line' && 'flex flex-col', className)} {...props}>
      {/* The split units are decorative, and a role-less element ignores aria-label. */}
      <span className="sr-only">{children}</span>
      {units.map((unit, i) => (
        <React.Fragment key={i}>
          <span
            aria-hidden
            data-slot="text-reveal-unit"
            className={cn('overflow-hidden pb-[0.12em]', by === 'line' ? 'flex' : 'inline-flex align-bottom')}
          >
            <span className="inline-block">{unit === '' ? ' ' : unit}</span>
          </span>
          {by === 'word' && i < units.length - 1 ? ' ' : null}
        </React.Fragment>
      ))}
    </Tag>
  );
};

export { TextReveal };
