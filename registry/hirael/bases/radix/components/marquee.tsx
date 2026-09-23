import * as React from 'react';

import { cn } from '@/lib/utils';

export interface MarqueeProps extends React.ComponentProps<'div'> {
  /** Scroll the opposite direction. */
  reverse?: boolean;
  /** Pause while the pointer is over the track. Focus inside always pauses it. */
  pauseOnHover?: boolean;
  /** Scroll top-to-bottom instead of left-to-right. */
  vertical?: boolean;
  /** How many times the children are duplicated to fill the loop. */
  repeat?: number;
  /** Seconds for one full loop. Lower is faster. */
  duration?: number;
  /** Gap between items, any CSS length. */
  gap?: string;
}

// Inline keyframes need no globals.css edit. Flex reverses the tracks under RTL, so
// --marquee-x-dir flips the travel sign (-1 ltr, 1 rtl) so the loop never jumps.
const MARQUEE_KEYFRAMES = `
@keyframes msh-marquee-x {
  from { transform: translateX(0); }
  to { transform: translateX(calc(var(--marquee-x-dir, -1) * (100% + var(--marquee-gap)))); }
}
@keyframes msh-marquee-y {
  from { transform: translateY(0); }
  to { transform: translateY(calc(-100% - var(--marquee-gap))); }
}
[data-slot="marquee"][data-pause="true"]:hover [data-slot="marquee-track"],
[data-slot="marquee"]:focus-within [data-slot="marquee-track"] {
  animation-play-state: paused;
}
[dir="rtl"] [data-slot="marquee-track"] {
  --marquee-x-dir: 1;
}
`;

const Marquee = ({
  reverse = false,
  pauseOnHover = false,
  vertical = false,
  repeat = 4,
  duration = 40,
  gap = '1rem',
  className,
  style,
  children,
  ...props
}: MarqueeProps) => {
  const trackStyle: React.CSSProperties = {
    animationName: vertical ? 'msh-marquee-y' : 'msh-marquee-x',
    animationDuration: 'var(--marquee-duration)',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
    animationDirection: reverse ? 'reverse' : 'normal',
    gap: 'var(--marquee-gap)',
  };

  return (
    <div
      data-slot="marquee"
      data-pause={pauseOnHover ? 'true' : undefined}
      style={
        {
          ...style,
          '--marquee-duration': `${duration}s`,
          '--marquee-gap': gap,
          gap: 'var(--marquee-gap)',
        } as React.CSSProperties
      }
      className={cn(
        'group flex w-full max-w-full min-w-0 overflow-hidden',
        vertical ? 'flex-col' : 'flex-row',
        className,
      )}
      {...props}
    >
      {/* href + precedence let React hoist one copy into <head>, however many marquees render. */}
      <style href="hirael-marquee" precedence="default">
        {MARQUEE_KEYFRAMES}
      </style>
      {Array.from({ length: Math.max(2, repeat) }).map((_, i) => (
        <div
          key={i}
          data-slot="marquee-track"
          aria-hidden={i > 0}
          // Clones are decorative; inert keeps their links and buttons out of the tab order.
          inert={i > 0 || undefined}
          style={trackStyle}
          className={cn(
            'flex shrink-0 justify-around motion-reduce:[animation-play-state:paused]',
            vertical ? 'flex-col' : 'flex-row',
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
};

export { Marquee };
