import { Bell, Calendar, Cloud, CreditCard, Database, FileText, GitBranch, Mail, type LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

interface Tool {
  name: string;
  icon: LucideIcon;
  href: string;
}

const TOOLS: readonly Tool[] = [
  { name: 'Postgres', icon: Database, href: '#' },
  { name: 'Git', icon: GitBranch, href: '#' },
  { name: 'S3', icon: Cloud, href: '#' },
  { name: 'Calendar', icon: Calendar, href: '#' },
  { name: 'Docs', icon: FileText, href: '#' },
  { name: 'Email', icon: Mail, href: '#' },
  { name: 'Billing', icon: CreditCard, href: '#' },
  { name: 'Alerts', icon: Bell, href: '#' },
] as const;

const MIDDLE = (TOOLS.length - 1) / 2;

// Tiles sit on a shallow arc: the farther from the middle, the lower they hang.
const drop = (index: number) => `${Math.round((index - MIDDLE) ** 2 * 4.5)}px`;

const Integrations06 = () => {
  return (
    <section
      data-slot="integrations"
      className="relative isolate overflow-hidden bg-background py-20 sm:py-28"
      aria-labelledby="integrations-06-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)] bg-size-[44px_44px] opacity-50"
      />

      <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 text-center">
        <h2
          id="integrations-06-heading"
          style={stagger(1)}
          className={cn(ENTER, 'font-serif text-4xl font-medium tracking-tight text-balance sm:text-5xl')}
        >
          Built to work with everything you use
        </h2>
        <p style={stagger(2)} className={cn(ENTER, 'mt-4 max-w-xl text-base text-pretty text-muted-foreground')}>
          From the tools your team relies on every day to the ones you will adopt next, Hirael plugs into your whole
          ecosystem.
        </p>
      </div>

      <ul
        data-slot="integrations-list"
        aria-label="Supported integrations"
        className="mx-auto mt-12 flex max-w-5xl flex-wrap items-start justify-center gap-4 px-4 pb-10 sm:mt-20 sm:gap-5"
      >
        {TOOLS.map((tool, index) => (
          <li
            key={tool.name}
            style={{ ...stagger(index, 60, 200), '--drop': drop(index) } as React.CSSProperties}
            className={cn(ENTER, 'sm:mt-(--drop)')}
          >
            <a
              href={tool.href}
              aria-label={tool.name}
              className="group relative flex size-16 items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground shadow-xs transition-[color,transform,box-shadow] duration-200 ease-out hover:-translate-y-1.5 hover:text-foreground hover:shadow-lg focus-visible:-translate-y-1.5 focus-visible:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none motion-reduce:transition-none sm:size-24 sm:rounded-3xl"
            >
              <tool.icon aria-hidden className="size-7 sm:size-9" />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-full mt-2 text-center text-xs text-muted-foreground opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
              >
                {tool.name}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Integrations06;
