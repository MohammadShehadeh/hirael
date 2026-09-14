'use client';

import * as React from 'react';
import { ArrowUpRight, LifeBuoy, Mail, Search, SearchX } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/registry/hirael/bases/base/ui/accordion';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/registry/hirael/bases/base/ui/empty';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/registry/hirael/bases/base/ui/input-group';
import { Tabs, TabsList, TabsTrigger } from '@/registry/hirael/bases/base/ui/tabs';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
const SWAP =
  'animate-in fade-in slide-in-from-bottom-1 duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

type Category = 'getting-started' | 'billing' | 'licensing';

const CATEGORIES: { value: Category | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'getting-started', label: 'Getting started' },
  { value: 'billing', label: 'Billing' },
  { value: 'licensing', label: 'Licensing' },
];

const CATEGORY_LABELS: Record<Category, string> = {
  'getting-started': 'Getting started',
  billing: 'Billing',
  licensing: 'Licensing',
};

const FAQS: readonly { q: string; a: string; category: Category }[] = [
  {
    q: 'How do I install my first block?',
    a: "Run the shadcn CLI with the block's registry URL; the source lands in components/blocks/ and is yours to edit. No package to add, nothing to configure.",
    category: 'getting-started',
  },
  {
    q: 'Do blocks work without the rest of Hirael?',
    a: 'Yes. Each block declares its own dependencies, and the CLI resolves only what that block needs. You can install a single FAQ section into an existing app.',
    category: 'getting-started',
  },
  {
    q: 'Which frameworks are supported?',
    a: 'Anywhere React runs: Next.js App or Pages Router, Remix, Vite. Blocks avoid framework-specific APIs unless the block page says otherwise.',
    category: 'getting-started',
  },
  {
    q: 'Is there a paid tier?',
    a: 'Everything currently published is free. If a pro tier ships later, existing blocks stay free and installed copies are unaffected.',
    category: 'billing',
  },
  {
    q: 'Do you offer team invoicing?',
    a: "There's nothing to invoice today; installs are free and unmetered. For procurement paperwork, contact us and we'll sort something out.",
    category: 'billing',
  },
  {
    q: 'Can I use blocks in client work?',
    a: "Yes. Copies installed into a client project belong to that codebase. There's no per-seat or per-project license to track.",
    category: 'licensing',
  },
  {
    q: 'Can I republish blocks as my own library?',
    a: "Shipping products with blocks inside is encouraged; repackaging the registry itself as a competing collection isn't. When in doubt, ask.",
    category: 'licensing',
  },
  {
    q: 'Do I need to credit Hirael?',
    a: 'No attribution required. A mention is appreciated but never a condition of use.',
    category: 'licensing',
  },
];

const Faq03 = () => {
  const [query, setQuery] = React.useState('');
  const [category, setCategory] = React.useState<Category | 'all'>('all');

  const normalized = query.trim().toLowerCase();
  const visible = FAQS.filter((f) => {
    if (category !== 'all' && f.category !== category) return false;
    if (!normalized) return true;
    return f.q.toLowerCase().includes(normalized) || f.a.toLowerCase().includes(normalized);
  });

  const clearFilters = () => {
    setQuery('');
    setCategory('all');
  };

  return (
    <section data-slot="faq" className="bg-background py-20 md:py-28">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-6 md:px-10">
        <div data-slot="faq-header" className="flex flex-col items-center gap-4 text-center">
          <span className={cn(ENTER, 'text-xs uppercase text-muted-foreground')}>Help center</span>
          <h2
            style={stagger(1, 70)}
            className={cn(
              ENTER,
              'max-w-2xl font-serif text-4xl font-medium leading-[1.04] tracking-tight sm:text-5xl md:text-6xl',
            )}
          >
            Find the answer before you file the issue.
          </h2>
          <p style={stagger(2, 70)} className={cn(ENTER, 'max-w-xl text-sm text-muted-foreground')}>
            Search the questions we hear most, or narrow by topic. Anything unanswered lands in the inbox below.
          </p>
        </div>

        <div data-slot="faq-filters" style={stagger(3, 70)} className={cn(ENTER, 'flex flex-col items-center gap-4')}>
          <InputGroup className="w-full max-w-md">
            <InputGroupAddon>
              <Search className="size-4" />
            </InputGroupAddon>
            <InputGroupInput
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions…"
              aria-label="Search questions"
            />
          </InputGroup>
          <Tabs
            value={category}
            onValueChange={(v) => setCategory(v as Category | 'all')}
            className="w-full items-center"
          >
            <TabsList className="max-w-full flex-wrap group-data-[orientation=horizontal]/tabs:h-auto">
              {CATEGORIES.map((c) => (
                <TabsTrigger key={c.value} value={c.value} className="flex-none">
                  {c.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {visible.length > 0 ? (
          <div key={`${category}:${normalized}`} data-slot="faq-list" className={SWAP}>
            <Accordion type="single" collapsible className="border-y border-border">
              {visible.map((f) => (
                <AccordionItem key={f.q} value={f.q} className="px-1">
                  <AccordionTrigger>
                    <span className="flex flex-1 items-baseline justify-between gap-4">
                      <span>{f.q}</span>
                      <span className="shrink-0 text-xs uppercase text-muted-foreground">
                        {CATEGORY_LABELS[f.category]}
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ) : (
          <Empty data-slot="faq-empty" className={SWAP}>
            <EmptyHeader>
              <EmptyMedia>
                <SearchX aria-hidden className="size-6 text-muted-foreground" />
              </EmptyMedia>
              <EmptyTitle>No matching questions</EmptyTitle>
              <EmptyDescription>
                Nothing matches &ldquo;{query.trim()}&rdquo;
                {category !== 'all' ? ` in ${CATEGORY_LABELS[category as Category]}` : ''}. Try different keywords or
                clear the filters.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            </EmptyContent>
          </Empty>
        )}

        <div
          data-slot="faq-help"
          className="flex flex-col items-start justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center"
        >
          <div className="flex flex-col gap-1">
            <span className="inline-flex items-center gap-2 text-sm font-medium">
              <LifeBuoy aria-hidden className="size-4 text-muted-foreground" />
              Still stuck?
            </span>
            <span className="text-sm text-muted-foreground">We answer most questions within a day.</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button render={<a href="mailto:support@hirael.com" />} nativeButton={false} variant="outline" size="sm">
              <Mail className="size-3.5" />
              Email support
            </Button>
            <Button render={<a href="#" />} nativeButton={false} size="sm">
              Open an issue
              <ArrowUpRight className="size-3.5 rtl:-scale-x-100" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq03;
