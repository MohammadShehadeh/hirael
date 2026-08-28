'use client';

import * as React from 'react';
import { type HTMLMotionProps, motion, useReducedMotion } from 'motion/react';

import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/registry/hirael/bases/radix/ui/accordion';
import { Badge } from '@/registry/hirael/bases/radix/ui/badge';

const HEADLINE = 'Answers before you ask';

const FAQS: readonly { id: string; q: string; a: string }[] = [
  {
    id: 'item-1',
    q: 'What do I actually install?',
    a: 'Plain TSX files. The CLI copies each component into your repo, so there is no package to update and nothing hidden behind a version pin.',
  },
  {
    id: 'item-2',
    q: 'Does it work with my existing shadcn/ui setup?',
    a: 'Yes. Every item reads the same CSS variables and uses the same primitives, so it lands next to what you already have and picks up your theme.',
  },
  {
    id: 'item-3',
    q: 'Can I change the code after installing?',
    a: 'That is the point. The source is yours from the first install. Edit it, rename it, delete the parts you do not need.',
  },
  {
    id: 'item-4',
    q: 'Is right-to-left supported?',
    a: 'Every component and block uses logical properties and flips directional icons, so an Arabic or Hebrew layout works without extra configuration.',
  },
  {
    id: 'item-5',
    q: 'How do I report a problem?',
    a: 'Open an issue on GitHub with the component name and a short reproduction. Most reports get a reply within a day.',
  },
];

const EASE = 'easeOut' as const;

/* -------------------------------------------------------------------------- */
/*  Parts                                                                      */
/* -------------------------------------------------------------------------- */

const FaqBadge = ({ className, ...props }: React.ComponentProps<typeof Badge>) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
    >
      <Badge
        data-slot="faq-badge"
        variant="outline"
        className={cn(
          'rounded-full bg-card/70 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground backdrop-blur-sm',
          className,
        )}
        {...props}
      />
    </motion.div>
  );
};

interface FaqTitleProps extends Omit<React.ComponentProps<'h2'>, 'children'> {
  children: string;
}

const FaqTitle = ({ children, className, ...props }: FaqTitleProps) => {
  const reduce = useReducedMotion();
  const words = children.split(' ');
  const half = Math.floor(words.length / 2);

  return (
    <h2
      data-slot="faq-title"
      className={cn(
        'mx-auto max-w-3xl text-balance font-serif text-4xl font-medium leading-[1.04] tracking-tight sm:text-5xl',
        className,
      )}
      {...props}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className={cn('me-[0.25em] inline-block', i < half ? 'text-muted-foreground' : 'text-foreground')}
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.2 + i * 0.08 }}
        >
          {word}
        </motion.span>
      ))}
    </h2>
  );
};

const FaqDescription = ({ className, ...props }: HTMLMotionProps<'p'>) => {
  const reduce = useReducedMotion();
  return (
    <motion.p
      data-slot="faq-description"
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: EASE, delay: 0.4 }}
      className={cn('mx-auto max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg', className)}
      {...props}
    />
  );
};

interface FaqCardProps extends React.ComponentProps<typeof AccordionItem> {
  /** Position in the list, used to stagger the reveal. */
  index?: number;
}

const FaqCard = ({ index = 0, className, ...props }: FaqCardProps) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, ease: EASE, delay: index * 0.1 }}
    >
      <AccordionItem
        data-slot="faq-card"
        className={cn(
          'rounded-lg border border-border bg-card px-4 transition-colors last:border-b data-[state=open]:bg-muted/40 md:px-6',
          className,
        )}
        {...props}
      />
    </motion.div>
  );
};

/* -------------------------------------------------------------------------- */
/*  Preview                                                                    */
/* -------------------------------------------------------------------------- */

const Faq06 = () => {
  return (
    <section data-slot="faq" className="bg-background py-16 md:py-24">
      <div className="mx-auto w-full max-w-3xl px-6">
        <div className="mb-10 flex flex-col items-center gap-5 text-center">
          <FaqBadge>FAQ</FaqBadge>
          <FaqTitle>{HEADLINE}</FaqTitle>
          <FaqDescription>
            The questions that come up most when a team installs its first component. Still unsure? Open an issue and
            ask.
          </FaqDescription>
        </div>

        <Accordion type="multiple" data-slot="faq-list" className="flex flex-col gap-3">
          {FAQS.map((item, i) => (
            <FaqCard key={item.id} value={item.id} index={i}>
              <AccordionTrigger className="gap-6 py-4 text-start text-base font-medium text-foreground hover:no-underline md:text-lg">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-base text-muted-foreground">{item.a}</AccordionContent>
            </FaqCard>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export { FaqBadge, FaqTitle, FaqDescription, FaqCard };

export default Faq06;
