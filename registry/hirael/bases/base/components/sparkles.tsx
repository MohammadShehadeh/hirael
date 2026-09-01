'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { composeRefs } from '@/registry/hirael/bases/base/components/compose-refs';

interface SparklesProps extends React.ComponentProps<'div'> {
  /**
   * Particles per 10,000 px² (a 100×100 tile) of canvas. The default (2) puts
   * about 200 particles on a 1000×1000 area and scales with the container size.
   */
  density?: number;
  /** Largest particle radius, in px. Each particle picks a size up to this. */
  size?: number;
  /** Drift speed, in px per second at 1×. */
  speed?: number;
  /** Particle color. CSS variables resolve against the container, so tokens work. */
  color?: string;
  /** Brightest alpha a particle twinkles up to (0–1). */
  opacity?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  phase: number;
  rate: number;
}

const resolveColor = (el: HTMLElement, color: string) => {
  const match = color.match(/^var\((--[\w-]+)\)$/);
  if (!match) return color;
  return getComputedStyle(el).getPropertyValue(match[1]).trim() || color;
};

const Sparkles = ({
  density = 2,
  size = 1.2,
  speed = 0.4,
  color = 'var(--foreground)',
  opacity = 1,
  className,
  ref,
  ...props
}: SparklesProps) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const composedRef = React.useMemo(() => composeRefs(containerRef, ref), [ref]);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!container || !canvas || !ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let fill = resolveColor(container, color);
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let raf = 0;
    let last = 0;
    let isVisible = true;
    let isRunning = false;

    const seed = () => {
      const count = Math.round(((width * height) / 10_000) * density);
      particles = Array.from({ length: count }, () => {
        const angle = Math.random() * Math.PI * 2;
        const v = speed * (0.3 + Math.random() * 0.7);
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: Math.cos(angle) * v,
          vy: Math.sin(angle) * v,
          r: size * (0.4 + Math.random() * 0.6),
          phase: Math.random() * Math.PI * 2,
          rate: 0.6 + Math.random() * 1.6,
        };
      });
    };

    const draw = (dt: number, t: number) => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = fill;
      for (const p of particles) {
        p.x = (p.x + p.vx * dt + width) % width;
        p.y = (p.y + p.vy * dt + height) % height;
        const twinkle = (Math.sin(t * p.rate + p.phase) + 1) / 2;
        ctx.globalAlpha = opacity * (0.1 + 0.9 * twinkle);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const frame = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      draw(dt, now / 1000);
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (isRunning || reduced) return;
      isRunning = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      isRunning = false;
      cancelAnimationFrame(raf);
    };
    const sync = () => {
      if (isVisible && document.visibilityState === 'visible') start();
      else stop();
    };

    const resize = () => {
      fill = resolveColor(container, color);
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      if (reduced) draw(0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    const mo = new MutationObserver(() => {
      fill = resolveColor(container, color);
      if (reduced) draw(0, 0);
    });
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'style'],
    });
    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      sync();
    });
    io.observe(container);
    document.addEventListener('visibilitychange', sync);
    sync();

    return () => {
      stop();
      ro.disconnect();
      mo.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, [density, size, speed, color, opacity]);

  return (
    <div
      ref={composedRef}
      data-slot="sparkles"
      aria-hidden
      className={cn('pointer-events-none absolute inset-0', className)}
      {...props}
    >
      <canvas ref={canvasRef} className="block size-full" />
    </div>
  );
};

export { Sparkles };
