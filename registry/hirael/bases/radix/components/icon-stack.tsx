import * as React from 'react';

import { cn } from '@/lib/utils';

const PLATE_WIDTH = 44;
const PLATE_HEIGHT = 68.3;
const STEP_X = 13.65;
const STEP_Y = 6.04;

const FACE_X = 23.7;
const FACE_Y = 34.9;

// Fixed, not grown per layer: `IconStackContent` is placed as a percentage of it and would drift off the face.
const VIEW_WIDTH = 72;
const VIEW_HEIGHT = 80;

const SHADOW_ROOM = 4;

export interface IconStackProps extends React.ComponentProps<'div'> {
  /** How many plates are stacked. */
  layers?: number;
}

/** Pair with `IconStackContent`. Size it with a width; height follows the 72:80 aspect ratio. */
const IconStack = ({ className, children, style, layers = 3, ...props }: IconStackProps) => {
  const count = Math.max(1, Math.round(layers));
  const stackWidth = PLATE_WIDTH + STEP_X * (count - 1);
  const stackHeight = PLATE_HEIGHT + STEP_Y * (count - 1) + SHADOW_ROOM;

  const scale = Math.min(VIEW_WIDTH / stackWidth, VIEW_HEIGHT / stackHeight);
  const offsetX = (VIEW_WIDTH - stackWidth * scale) / 2;
  const offsetY = (VIEW_HEIGHT - stackHeight * scale) / 2;

  const faceX = offsetX + (FACE_X + STEP_X * (count - 1)) * scale;
  const faceY = offsetY + (FACE_Y + STEP_Y * (count - 1)) * scale;

  return (
    <div
      data-slot="icon-stack"
      className={cn('relative aspect-9/10 w-18 text-foreground **:data-[slot=icon-stack-layer]:fill-muted', className)}
      style={
        {
          '--icon-stack-face-x': `${(faceX / VIEW_WIDTH) * 100}%`,
          '--icon-stack-face-y': `${(faceY / VIEW_HEIGHT) * 100}%`,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      {/* The stack is a fixed physical arrangement, so it is not mirrored in RTL. */}
      <svg
        aria-hidden
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        fill="none"
        className="h-full w-full overflow-visible"
      >
        <g transform={`translate(${offsetX} ${offsetY}) scale(${scale})`}>
          <ellipse
            cx={stackWidth / 2}
            cy={stackHeight + 4}
            rx={stackWidth * 0.42}
            ry="7"
            fill="currentColor"
            fillOpacity="0.055"
            className="blur-xs"
          />

          {Array.from({ length: count }, (_, index) => (
            <IconStackLayer
              key={index}
              x={STEP_X * index}
              y={STEP_Y * index}
              // Back layer at 0.4 ramping to 0.8 at the front; a lone layer is the front.
              opacity={count === 1 ? 0.8 : 0.4 + (0.4 / (count - 1)) * index}
              front={index === count - 1}
            />
          ))}
        </g>
      </svg>

      {children}
    </div>
  );
};

const IconStackLayer = ({
  front = false,
  opacity,
  x,
  y,
}: {
  front?: boolean;
  opacity: number;
  x: number;
  y: number;
}) => {
  return (
    <g opacity={opacity} transform={`translate(${x} ${y})`}>
      <path
        data-slot="icon-stack-layer"
        d="M42.2538 2.046C41.4408 1.6325 40.3965 1.6677 39.2612 2.2424L7.9616 18.1934C5.3895 19.5039 3.301 23.1064 3.301 26.2322V64.3226C3.301 66.0677 3.9458 67.2943 4.962 67.8199L1.8363 66.229C0.8201 65.7104 0.1753 64.4771 0.1753 62.732V24.6412C0.1753 21.5085 2.2638 17.913 4.8359 16.6024L36.1355 0.6515C37.2778 0.0698 38.322 0.0416 39.128 0.4551L42.2538 2.046Z"
        stroke="currentColor"
        strokeOpacity={front ? 0.3 : 0.2}
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        data-slot="icon-stack-layer"
        d="M42.2545 2.0456C43.2707 2.5643 43.9155 3.7979 43.9155 5.543V43.6337C43.9155 46.7665 41.827 50.3616 39.2549 51.6722L7.9554 67.6235C6.813 68.2052 5.7687 68.2331 4.9628 67.8196C3.9465 67.301 3.3018 66.0673 3.3018 64.3222V26.2318C3.3018 23.0991 5.3903 19.5036 7.9624 18.193L39.2619 2.2421C40.4043 1.6604 41.4486 1.6321 42.2545 2.0456Z"
        stroke="currentColor"
        strokeOpacity={front ? 0.3 : 0.2}
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
};

const IconStackContent = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="icon-stack-content"
      className={cn(
        'pointer-events-none absolute top-(--icon-stack-face-y) left-(--icon-stack-face-x) flex -translate-x-1/2 -translate-y-1/2 scale-x-90 -skew-y-26 items-center justify-center text-muted-foreground',
        className,
      )}
      {...props}
    />
  );
};

export { IconStack, IconStackContent };
