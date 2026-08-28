'use client';

import * as React from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/registry/hirael/bases/base/ui/accordion';

const FAQS: readonly { id: string; q: string; a: string }[] = [
  {
    id: 'item-1',
    q: 'Is there a free plan?',
    a: 'Yes. Start for free and explore the full dashboard, no card required. Upgrade only when you need more seats or higher limits.',
  },
  {
    id: 'item-2',
    q: 'Can I change plans later?',
    a: 'Anytime. Move up or down from the billing page and the change takes effect on your next cycle. Downgrades keep your data intact.',
  },
  {
    id: 'item-3',
    q: 'How is my data kept safe?',
    a: 'Everything is encrypted in transit and at rest. Access is scoped to members of your workspace, and you control who gets in.',
  },
  {
    id: 'item-4',
    q: 'Do you offer team accounts?',
    a: 'Yes. Invite teammates, set roles, and share workspaces. Billing is per seat, so you only pay for the people who use it.',
  },
  {
    id: 'item-5',
    q: 'What if I need help?',
    a: "Reach out anytime. Most questions get a reply within a day, and there's a searchable guide for the common ones.",
  },
];

const Faq05 = () => {
  return (
    <section data-slot="faq" className="bg-background py-16 md:py-24">
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 border-y border-border md:grid-cols-2 md:border-x">
        <div
          data-slot="faq-intro"
          className="flex flex-col gap-4 border-b border-border px-6 pt-12 pb-6 md:border-b-0 md:border-e md:px-10 md:py-16"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground">faq</span>
          <h2 className="font-serif text-4xl font-medium leading-[1.04] tracking-tight md:text-5xl">
            Questions, answered.
          </h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            The things people ask most often. Still stuck? Reach out and we’ll walk you through it.
          </p>
        </div>

        <div data-slot="faq-list" className="flex flex-col justify-center px-6 py-4 md:px-8">
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default Faq05;
