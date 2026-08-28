'use client';

import * as React from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/registry/hirael/bases/radix/ui/accordion';

interface Group {
  label: string;
  faqs: readonly { q: string; a: string }[];
}

const GROUPS: readonly Group[] = [
  {
    label: 'Getting started',
    faqs: [
      {
        q: 'What exactly is Hirael?',
        a: "A registry of components and section blocks. Nothing ships as a package; the shadcn CLI copies source files straight into your repo, where they're yours to edit.",
      },
      {
        q: 'How long does the first install take?',
        a: "Under a minute. Run the CLI with a block's registry URL and the file lands in components/blocks/, wired to your existing Tailwind tokens.",
      },
      {
        q: 'Do I need a particular framework?',
        a: 'Anywhere React runs. Blocks avoid framework-specific APIs unless a block page says otherwise: Next.js, Remix and Vite all work.',
      },
    ],
  },
  {
    label: 'Working with blocks',
    faqs: [
      {
        q: 'Can I mix blocks with my own components?',
        a: "That's the intended use. Blocks are plain source files in your tree; import your components into them, or lift pieces out of them into yours.",
      },
      {
        q: 'How do updates reach my project?',
        a: "They don't, unless you ask. Re-run the install command to pull the latest version, then diff against your copy and keep what you want.",
      },
      {
        q: 'What if two blocks need different versions of a primitive?',
        a: "They can't conflict; each block declares its primitives and the CLI installs one shared copy into components/ui/ that both use.",
      },
    ],
  },
  {
    label: 'Theming',
    faqs: [
      {
        q: 'Will blocks match my existing shadcn theme?',
        a: 'Yes. Everything is built on the same CSS variables; change the tokens and every installed block follows.',
      },
      {
        q: 'Is dark mode handled?',
        a: 'Both schemes are first-class. Light is a faithful inverse of dark, and every block is reviewed in both before it ships.',
      },
      {
        q: 'Can I change fonts and radii globally?',
        a: 'Blocks inherit your --radius and font stack from the theme, so a one-line token change restyles all of them at once.',
      },
    ],
  },
  {
    label: 'Licensing',
    faqs: [
      {
        q: 'Can I use blocks in commercial projects?',
        a: 'Yes: client work, products, internal tools. Installed copies belong to the codebase they land in, with no per-seat tracking.',
      },
      {
        q: 'Is attribution required?',
        a: 'No. A mention is appreciated, never a condition.',
      },
      {
        q: "What's not allowed?",
        a: "Repackaging the registry itself as a competing collection. Shipping products with blocks inside is encouraged; reselling the blocks as blocks isn't.",
      },
    ],
  },
  {
    label: 'Support',
    faqs: [
      {
        q: 'Where do I report a bug?',
        a: 'Open an issue on the GitHub repository with the block name and a repro. Most reports get a response within a day.',
      },
      {
        q: 'Do you take block requests?',
        a: "Yes; request the section you're missing and we'll weigh it against the roadmap. Popular requests ship first.",
      },
      {
        q: 'Is there a changelog?',
        a: 'Every release is tagged on GitHub with notes per block, so you can diff exactly what changed before pulling an update.',
      },
    ],
  },
];

const Faq04 = () => {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="relative mx-auto w-full max-w-2xl border-border md:border-x">
        <span aria-hidden className="absolute -left-px top-0 hidden h-px w-6 -translate-x-full bg-border md:block" />
        <span aria-hidden className="absolute -right-px top-0 hidden h-px w-6 translate-x-full bg-border md:block" />

        <div className="flex flex-col items-center gap-4 border-b border-border px-6 py-12 text-center md:px-10 md:py-16">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground">faq</span>
          <h2 className="font-serif text-4xl font-medium leading-[1.04] tracking-tight sm:text-5xl md:text-6xl">
            Asked, answered, archived.
          </h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Every question we&apos;ve answered more than twice, grouped by topic so you can skip to yours.
          </p>
        </div>

        <div className="flex flex-col gap-12 px-6 py-10 md:px-10 md:py-14">
          {GROUPS.map((group, gi) => (
            <section key={group.label} className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between gap-3 md:px-4">
                <h3 className="text-lg font-semibold tracking-[-0.02em]">{group.label}</h3>
                <span className="font-mono text-[10px] tabular-nums uppercase tracking-[0.1em] text-muted-foreground">
                  {String(gi + 1).padStart(2, '0')} · {group.faqs.length} questions
                </span>
              </div>
              <Accordion type="single" collapsible className="w-full">
                {group.faqs.map((f) => (
                  <AccordionItem key={f.q} value={f.q} className="md:px-4">
                    <AccordionTrigger>{f.q}</AccordionTrigger>
                    <AccordionContent>{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          ))}
        </div>

        <div className="border-t border-border px-6 py-8 text-center md:px-10">
          <p className="text-sm text-muted-foreground">
            Covering a case we missed?{' '}
            <a
              href="mailto:support@hirael.com"
              className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
            >
              Write to support.
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Faq04;
