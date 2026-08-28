'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'motion/react';

import { cn } from '@/lib/utils';

interface RayConfig {
  left: string;
  rotation: number;
  width: number;
  duration: number;
  delay: number;
  swayDuration: number;
  swayDelay: number;
  blur: number;
  strongSway: boolean;
}

// Fan the rays from the top edge: leftmost leans right, rightmost leans left.
// The golden-ratio step keeps neighbours from pulsing in lockstep.
const rayConfig = (index: number, total: number): RayConfig => {
  const progress = index / Math.max(total - 1, 1);
  const variation = (index * 0.618) % 1;

  return {
    left: `${2 + progress * 96}%`,
    rotation: 28 - progress * 56,
    width: 40 + variation * 25,
    duration: 6 + variation * 5,
    delay: -variation * 10,
    swayDuration: 12 + variation * 9,
    swayDelay: -variation * 10,
    blur: 24 + variation * 9,
    strongSway: index % 2 === 0,
  };
};

interface LightRayProps extends RayConfig {
  opacity: number;
  speed: number;
  length: string;
  reduce: boolean;
}

const LightRay = React.memo(
  ({
    left,
    rotation,
    width,
    duration,
    delay,
    swayDuration,
    swayDelay,
    blur,
    strongSway,
    opacity,
    speed,
    length,
    reduce,
  }: LightRayProps) => {
    const rotate = (deg: number) => `translateX(-50%) rotate(${deg}deg)`;

    return (
      <motion.div
        data-slot="footer-beam"
        aria-hidden
        className="pointer-events-none absolute -top-[5%] origin-top mix-blend-screen"
        style={{
          left,
          width,
          height: length,
          filter: `blur(${blur}px)`,
          transform: rotate(rotation),
          opacity: reduce ? opacity : undefined,
          background: `linear-gradient(to bottom, color-mix(in oklch, var(--primary) ${Math.round(
            opacity * 100,
          )}%, transparent), transparent)`,
          willChange: reduce ? undefined : 'opacity, transform',
        }}
        initial={reduce ? false : { opacity: opacity * 0.4 }}
        animate={
          reduce
            ? undefined
            : {
                opacity: [opacity * 0.4, opacity, opacity * 0.4],
                transform: [rotate(rotation), rotate(rotation + (strongSway ? 1 : 0.5)), rotate(rotation)],
              }
        }
        transition={
          reduce
            ? undefined
            : {
                opacity: {
                  duration: duration / speed,
                  delay: delay / speed,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
                transform: {
                  duration: swayDuration / speed,
                  delay: swayDelay / speed,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }
        }
      />
    );
  },
);
LightRay.displayName = 'LightRay';

export interface FooterBeamsProps extends React.ComponentProps<'div'> {
  /** Number of rays fanned across the top edge. */
  rayCount?: number;
  /** Peak opacity of a ray, 0 to 1. */
  rayOpacity?: number;
  /** Global speed multiplier. Higher is faster. */
  raySpeed?: number;
  /** Ray length, any CSS length. */
  rayLength?: string;
}

/**
 * Soft light rays that fall from the top edge and slowly pulse and sway.
 * Sits behind whatever you pass as children.
 */
const FooterBeams = ({
  rayCount = 12,
  rayOpacity = 0.35,
  raySpeed = 1,
  rayLength = '45vh',
  className,
  children,
  ...props
}: FooterBeamsProps) => {
  const reduce = useReducedMotion() ?? false;
  const rays = React.useMemo(() => Array.from({ length: rayCount }, (_, i) => rayConfig(i, rayCount)), [rayCount]);

  return (
    <div data-slot="footer-beams" className={cn('relative overflow-hidden bg-background', className)} {...props}>
      <div aria-hidden data-slot="footer-beams-layer" className="pointer-events-none absolute inset-0 overflow-hidden">
        {rays.map((ray) => (
          <LightRay key={ray.left} {...ray} opacity={rayOpacity} speed={raySpeed} length={rayLength} reduce={reduce} />
        ))}
      </div>
      <div data-slot="footer-beams-content" className="relative">
        {children}
      </div>
    </div>
  );
};

export { FooterBeams };
