'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'motion/react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/base/ui/badge';

interface Value {
  title: string;
  description: string;
}

const VALUES: readonly Value[] = [
  {
    title: 'Own the source',
    description: 'Every component installs as plain TypeScript in your repo. No package to pin, nothing to wait on.',
  },
  {
    title: 'Accessible by default',
    description:
      'Keyboard paths, focus rings, and screen reader labels are part of the component, not a follow-up ticket.',
  },
  {
    title: 'Tokens over hex',
    description:
      'One set of CSS variables drives light, dark, and any brand you bring. Change the token, change the product.',
  },
  {
    title: 'Compound first',
    description: 'Small composable parts you can rearrange, with a one-prop form for the common case.',
  },
  {
    title: 'RTL without config',
    description:
      'Logical properties and mirrored icons mean Arabic and Hebrew layouts work the day you flip the direction.',
  },
  {
    title: 'Plain language',
    description: 'Labels, empty states, and docs read like a person wrote them. Short, specific, no hype.',
  },
];

const HEADLINE = 'The principles behind every component';

const Title = () => {
  const reduce = useReducedMotion();
  const words = HEADLINE.split(' ');
  const half = Math.floor(words.length / 2);

  return (
    <h2
      data-slot="feature-title"
      className="font-serif text-4xl font-medium leading-[1.04] tracking-tight text-balance sm:text-5xl"
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className={cn('me-[0.25em] inline-block', i < half ? 'text-muted-foreground' : 'text-foreground')}
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 + i * 0.08 }}
        >
          {word}
        </motion.span>
      ))}
    </h2>
  );
};

interface Dot {
  x: number;
  y: number;
  phase: number;
  speed: number;
}

const GAP = 10;
const RADIUS = 1.6;

/** Canvas dot grid where each dot pulses on its own phase. Static under reduced motion. */
const DottedGlow = ({ className }: { className?: string }) => {
  const ref = React.useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dots: Dot[] = [];
    let width = 0;
    let height = 0;
    let raf = 0;
    let isVisible = true;
    let color = '';
    const start = performance.now();

    const layout = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      color = getComputedStyle(canvas).color;
      dots = [];
      for (let y = GAP / 2; y < height; y += GAP) {
        for (let x = GAP / 2; x < width; x += GAP) {
          dots.push({
            x,
            y,
            phase: Math.random() * Math.PI * 2,
            speed: 0.3 + Math.random() * 0.7,
          });
        }
      }
    };

    const draw = (now: number) => {
      const t = (now - start) / 1000;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = color;
      for (const dot of dots) {
        const alpha = 0.15 + 0.85 * (0.5 + 0.5 * Math.sin(dot.phase + t * dot.speed));
        ctx.globalAlpha = alpha * 0.5;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const loop = (now: number) => {
      if (!isVisible) return;
      draw(now);
      raf = requestAnimationFrame(loop);
    };

    const run = () => {
      cancelAnimationFrame(raf);
      if (reduce) {
        draw(start);
        return;
      }
      if (isVisible) raf = requestAnimationFrame(loop);
    };

    layout();
    run();

    const resize = new ResizeObserver(() => {
      layout();
      run();
    });
    resize.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      run();
    });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      io.disconnect();
    };
  }, [reduce]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      data-slot="dotted-glow"
      className={cn(
        'pointer-events-none absolute inset-0 size-full text-warm [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]',
        className,
      )}
    />
  );
};

const ValueCard = ({ value, index }: { value: Value; index: number }) => {
  const reduce = useReducedMotion();

  return (
    <motion.article
      data-slot="feature-card"
      className="relative overflow-hidden rounded-lg border border-border bg-card/60 p-6 backdrop-blur-sm"
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.15 }}
    >
      <DottedGlow />
      <div className="relative flex flex-col gap-2">
        <h3 className="text-xl font-semibold text-foreground">{value.title}</h3>
        <p className="text-pretty text-muted-foreground">{value.description}</p>
      </div>
    </motion.article>
  );
};

const Feature05 = () => {
  const reduce = useReducedMotion();
  const half = Math.ceil(VALUES.length / 2);
  const columns = [VALUES.slice(0, half), VALUES.slice(half)];

  return (
    <section data-slot="feature" className="bg-background py-20 sm:py-28">
      <div className="container w-full">
        <div data-slot="feature-header" className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <Badge
              variant="outline"
              className="rounded-full bg-card/70 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground backdrop-blur-sm"
            >
              Values
            </Badge>
          </motion.div>
          <Title />
          <motion.p
            data-slot="feature-description"
            className="max-w-2xl text-base text-pretty text-muted-foreground sm:text-lg"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.4 }}
          >
            Six decisions we make the same way every time, so you never have to guess how a new component will behave.
          </motion.p>
        </div>

        <div
          data-slot="feature-grid"
          className="mx-auto mt-14 grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-2 md:gap-8"
        >
          {columns.map((column, c) => (
            <div
              key={c}
              data-slot="feature-column"
              className={cn('flex flex-col gap-4 md:gap-8', c === 1 && 'md:mt-16')}
            >
              {column.map((value, i) => (
                <ValueCard key={value.title} value={value} index={i} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Feature05;
