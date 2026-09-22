import type * as React from 'react';

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

const FaqBadge = ({ className, ...props }: React.ComponentProps<typeof Badge>) => {
  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none">
      <Badge data-slot="faq-badge" variant="outline" className={className} {...props} />
    </div>
  );
};

interface FaqTitleProps extends Omit<React.ComponentProps<'h2'>, 'children'> {
  children: string;
}

const FaqTitle = ({ children, className, ...props }: FaqTitleProps) => {
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
        <span
          key={`${word}-${i}`}
          className={cn(
            'me-[0.25em] inline-block animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none',
            i < half ? 'text-muted-foreground' : 'text-foreground',
          )}
          style={{ animationDelay: `${60 + i * 50}ms` }}
        >
          {word}
        </span>
      ))}
    </h2>
  );
};

const FaqDescription = ({ className, ...props }: React.ComponentProps<'p'>) => {
  return (
    <p
      data-slot="faq-description"
      className={cn(
        'mx-auto max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none delay-300',
        className,
      )}
      {...props}
    />
  );
};

interface FaqCardProps extends React.ComponentProps<typeof AccordionItem> {
  /** Position in the list, used to stagger the reveal. */
  index?: number;
}

const FaqCard = ({ index = 0, className, ...props }: FaqCardProps) => {
  return (
    <div
      className={`not-first:mt-3 rounded-lg border border-border bg-card px-4 transition-colors md:px-6 has-data-[state=open]:bg-muted/40 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none`}
      style={{ animationDelay: `${360 + index * 50}ms` }}
    >
      <AccordionItem data-slot="faq-card" className={className} {...props} />
    </div>
  );
};

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

        <Accordion type="multiple" data-slot="faq-list" className="flex flex-col">
          {FAQS.map((item, i) => (
            <FaqCard key={item.id} value={item.id} index={i}>
              <AccordionTrigger className="text-start">
                <span className="text-base md:text-lg">{item.q}</span>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-base text-muted-foreground">{item.a}</p>
              </AccordionContent>
            </FaqCard>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export { FaqBadge, FaqTitle, FaqDescription, FaqCard };

export default Faq06;
