import * as React from 'react';

import { cn } from '@/lib/utils';

export interface TextShimmerProps extends React.ComponentProps<'span'> {
  /** Element to render the text as. */
  as?: React.ElementType;
  /** Seconds for one pass of the highlight. */
  duration?: number;
  /** Half-width of the highlight, in `em`. */
  spread?: number;
}

// The base layer paints currentColor through the glyphs, so a text colour class still tints the
// resting text; the moving layer is the foreground highlight. RTL runs the sweep backwards.
const SHIMMER_STYLES = `
@keyframes hirael-text-shimmer {
  from { background-position: 100% center; }
  to { background-position: 0% center; }
}
[data-slot="text-shimmer"] {
  background-image:
    linear-gradient(90deg, transparent calc(50% - var(--shimmer-spread)), var(--foreground) 50%, transparent calc(50% + var(--shimmer-spread))),
    linear-gradient(currentColor, currentColor);
  background-size: 250% 100%, auto;
  background-repeat: no-repeat;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: hirael-text-shimmer var(--shimmer-duration) linear infinite;
}
[dir="rtl"] [data-slot="text-shimmer"] {
  animation-direction: reverse;
}
@media (prefers-reduced-motion: reduce) {
  [data-slot="text-shimmer"] {
    animation: none;
    background-image: none;
    -webkit-text-fill-color: currentColor;
  }
}
`;

const TextShimmer = ({ as: Comp = 'span', duration = 2, spread = 2, className, style, ...props }: TextShimmerProps) => {
  return (
    <>
      {/* href + precedence let React hoist one copy into <head>, however many shimmers render. */}
      <style href="hirael-text-shimmer" precedence="default">
        {SHIMMER_STYLES}
      </style>
      <Comp
        data-slot="text-shimmer"
        className={cn('inline-block text-muted-foreground', className)}
        style={
          {
            '--shimmer-duration': `${duration}s`,
            '--shimmer-spread': `${spread}em`,
            ...style,
          } as React.CSSProperties
        }
        {...props}
      />
    </>
  );
};

export { TextShimmer };
