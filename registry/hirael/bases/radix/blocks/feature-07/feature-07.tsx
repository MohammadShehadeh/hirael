'use client';

import { EyeOff, FileWarning, RefreshCcw } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/radix/ui/badge';

const CHALLENGES = [
  {
    icon: FileWarning,
    title: 'YAML sprawl',
    description:
      'Pipelines grow into hundred-line files nobody wants to touch. One wrong indent and the whole run fails.',
    orbClassName: 'border-4 border-dashed',
  },
  {
    icon: RefreshCcw,
    title: 'Rerun and hope',
    description:
      'A red build with no context turns debugging into rerunning. The failing step should be obvious at a glance.',
  },
  {
    icon: EyeOff,
    title: 'No shared picture',
    description: 'Only the person who wrote the config knows how it flows. Everyone else reads logs after the fact.',
  },
];

const Feature07 = () => {
  const reduce = useReducedMotion();

  return (
    <section
      data-slot="feature"
      className="flex w-full flex-col justify-center gap-12 bg-background px-6 py-16 md:px-10 md:py-24"
    >
      <div data-slot="feature-header" className="mx-auto flex max-w-3xl flex-col gap-4 text-center">
        <Badge
          variant="outline"
          className="mx-auto rounded-full bg-card/70 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground"
        >
          The problem
        </Badge>
        <h2 className="font-serif text-3xl font-medium tracking-tight md:text-4xl lg:text-5xl">
          Work you can&apos;t see <span className="text-muted-foreground">is work you can&apos;t trust</span>
        </h2>
        <p className="mx-auto text-sm leading-relaxed text-muted-foreground md:text-base">
          Configuration as text scales badly once pipelines branch, fan out and gate deployments. The shape of the
          workflow disappears into the file.
        </p>
      </div>

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-3 md:grid-cols-3">
        {CHALLENGES.map((challenge, i) => (
          <motion.div
            key={challenge.title}
            data-slot="feature-card"
            className="group relative flex flex-col items-center gap-6 overflow-hidden rounded-xs border border-border bg-background px-8 pb-8 pt-10 text-center"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeOut' }}
          >
            <div
              data-slot="feature-card-orb"
              className={cn(
                'relative mx-auto flex size-32 items-center justify-center rounded-full border border-border bg-background shadow-xs outline outline-border outline-offset-4',
                challenge.orbClassName,
              )}
            >
              <div
                aria-hidden
                className="absolute inset-0 z-10 scale-120 bg-radial from-foreground/20 via-foreground/5 to-transparent blur-xl"
              />
              <challenge.icon aria-hidden className="relative z-20 size-12 text-warm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <h3 className="text-lg font-medium text-foreground">{challenge.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{challenge.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Feature07;
