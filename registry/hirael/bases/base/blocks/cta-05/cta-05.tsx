'use client';

import * as React from 'react';
import { Mail, Phone } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';

const email = 'team@example.com';
const phone = '+1 (555) 012 3456';

const Cta05 = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['end start', 'start end'],
  });

  const gradientWidth = useTransform(scrollYProgress, [0, 1], [50, 140]);
  const gradientHeight = useTransform(scrollYProgress, [0, 1], [70, 160]);
  const background = useTransform([gradientWidth, gradientHeight], (values) => {
    const [width, height] = values as number[];
    const w = Math.max(Math.floor(width), 100);
    const h = Math.max(Math.round(height), 100);
    return `radial-gradient(${w}% ${h}% at 50% 0%, transparent 0%, transparent 55%, color-mix(in oklab, var(--primary) 60%, transparent) 80%, color-mix(in oklab, var(--primary) 18%, var(--card)) 100%)`;
  });

  return (
    <section data-slot="cta" className="bg-background py-12 md:py-16">
      <div ref={containerRef} className="container w-full">
        <motion.div
          data-slot="cta-panel"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-3xl border border-border bg-card pt-16 pb-28 md:pt-20 md:pb-36"
        >
          <motion.div
            aria-hidden
            data-slot="cta-glow"
            style={{ background }}
            className="pointer-events-none absolute inset-0 opacity-60 dark:opacity-100"
          />
          <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
            <motion.span
              data-slot="cta-badge"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground backdrop-blur-sm"
            >
              <span className="size-1.5 rounded-full bg-primary" />
              Get in touch
            </motion.span>

            <AnimatedTitle data-slot="cta-title" text="Let's talk about your next project" className="mt-5" />

            <motion.p
              data-slot="cta-copy"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg"
            >
              Tell us what you’re building and where it’s stuck. We read every message and usually reply within a day.
            </motion.p>

            <motion.div
              data-slot="cta-actions"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-10 grid w-full max-w-md grid-cols-1 gap-5 md:grid-cols-2"
            >
              <div className="flex flex-col items-center gap-2">
                <Button
                  render={<a href={`mailto:${email}`} />}
                  nativeButton={false}
                  size="lg"
                  className="w-full rounded-full"
                >
                  <Mail className="size-4" />
                  Send email
                </Button>
                <p className="text-sm font-medium text-muted-foreground">{email}</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Button
                  render={<a href={`tel:${phone.replace(/[^\d+]/g, '')}`} />}
                  nativeButton={false}
                  size="lg"
                  variant="outline"
                  className="w-full rounded-full"
                >
                  <Phone className="size-4" />
                  Call us
                </Button>
                <p className="text-sm font-medium text-muted-foreground">{phone}</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const AnimatedTitle = ({ text, className, ...props }: React.ComponentProps<'h2'> & { text: string }) => {
  const words = text.split(' ');

  return (
    <h2
      className={cn(
        'mx-auto max-w-3xl font-serif text-3xl font-medium leading-tight tracking-tight text-foreground md:text-5xl',
        className,
      )}
      {...props}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.08 }}
          className="me-2 inline-block"
        >
          {word}
        </motion.span>
      ))}
    </h2>
  );
};

export default Cta05;
