import type * as React from 'react';
import { Check, ChevronRight, Search } from 'lucide-react';

import { cn } from '@/lib/utils';
import { DemoCard } from '@/components/demo-card';
import { REGISTRY_BY_NAME } from '@/registry/hirael/registry-meta';

interface FigureProps {
  caption: string;
  children: React.ReactNode;
}

const Figure = ({ caption, children }: FigureProps) => (
  <figure className="mt-6 flex flex-col gap-2.5">
    {children}
    <figcaption className="text-xs text-muted-foreground">{caption}</figcaption>
  </figure>
);

interface FlowStep {
  title: string;
  code: string;
  note: string;
}

const FLOW_STEPS: FlowStep[] = [
  { title: 'Registry', code: 'hirael.com/r/multi-select.json', note: 'Source, dependencies and where each file goes.' },
  { title: 'shadcn CLI', code: 'npx shadcn add @hirael/multi-select', note: 'Fetches it and installs what it needs.' },
  { title: 'Your project', code: 'components/multi-select.tsx', note: 'Plain source that you own and edit.' },
];

export const InstallFlow = () => (
  <Figure caption="One command takes an item from the registry into your codebase.">
    <ol className="grid overflow-hidden rounded-md border border-border bg-card sm:grid-cols-3">
      {FLOW_STEPS.map((step, index) => (
        <li
          key={step.title}
          className="flex min-w-0 flex-col gap-2 border-border p-4 not-first:border-t sm:not-first:border-s sm:not-first:border-t-0"
        >
          <span className="text-xs text-muted-foreground tabular-nums">
            {String(index + 1).padStart(2, '0')} / {String(FLOW_STEPS.length).padStart(2, '0')}
          </span>
          <span className="text-sm font-medium text-foreground">{step.title}</span>
          <code dir="ltr" className="truncate font-mono text-xs text-primary">
            {step.code}
          </code>
          <span className="text-xs leading-relaxed text-muted-foreground">{step.note}</span>
        </li>
      ))}
    </ol>
  </Figure>
);

interface ItemPreviewsProps {
  /** Space-separated item names. next-mdx-remote strips JS expressions from props, so arrays can't be passed. */
  names: string;
}

export const ItemPreviews = ({ names }: ItemPreviewsProps) => (
  <div className="mt-6 grid gap-3 sm:grid-cols-3">
    {names
      .split(/\s+/)
      .filter(Boolean)
      .map((name) => {
        const entry = REGISTRY_BY_NAME[name];
        if (!entry) throw new Error(`ItemPreviews: no registry item named "${name}"`);

        return <DemoCard key={name} entry={entry} />;
      })}
  </div>
);

interface InstalledFile {
  path: string;
  source: string;
}

const installedFiles = (name: string): InstalledFile[] => {
  const entry = REGISTRY_BY_NAME[name];
  if (!entry) throw new Error(`InstallTree: no registry item named "${name}"`);
  const own = (entry.files ?? []).map((file) => ({ path: file.path, source: 'This item' }));
  const deps = (entry.registryDependencies ?? []).flatMap((dep) => {
    const hiraelDep = REGISTRY_BY_NAME[dep];
    if (!hiraelDep) return [{ path: `components/ui/${dep}.tsx`, source: 'shadcn/ui' }];

    return (hiraelDep.files ?? []).map((file) => ({ path: file.path, source: 'Hirael' }));
  });

  return [...own, ...deps].toSorted((a, b) => a.path.localeCompare(b.path));
};

interface InstallTreeProps {
  name: string;
}

/** Built from the registry metadata, so it stays true when the item's dependencies change. */
export const InstallTree = ({ name }: InstallTreeProps) => (
  <Figure caption={`What adding ${name} writes into a fresh project. Files you already have are left alone.`}>
    <ul dir="ltr" className="divide-y divide-border overflow-hidden rounded-md border border-border bg-card">
      {installedFiles(name).map((file) => (
        <li key={file.path} className="flex items-center justify-between gap-4 px-4 py-2">
          <code className="truncate font-mono text-xs text-foreground">{file.path}</code>
          <span
            className={cn(
              'shrink-0 text-xs',
              file.source === 'This item' ? 'font-medium text-primary' : 'text-muted-foreground',
            )}
          >
            {file.source}
          </span>
        </li>
      ))}
    </ul>
  </Figure>
);

interface TokenGroup {
  label: string;
  tokens: { name: string; className: string }[];
}

// Class names are spelled out so Tailwind finds them when it scans this file.
const TOKEN_GROUPS: TokenGroup[] = [
  {
    label: 'Surfaces',
    tokens: [
      { name: 'background', className: 'bg-background' },
      { name: 'card', className: 'bg-card' },
      { name: 'muted', className: 'bg-muted' },
      { name: 'border', className: 'bg-border' },
    ],
  },
  {
    label: 'Accents',
    tokens: [
      { name: 'primary', className: 'bg-primary' },
      { name: 'secondary', className: 'bg-secondary' },
      { name: 'accent', className: 'bg-accent' },
      { name: 'destructive', className: 'bg-destructive' },
    ],
  },
  {
    label: 'Status',
    tokens: [
      { name: 'success', className: 'bg-success' },
      { name: 'warning', className: 'bg-warning' },
      { name: 'info', className: 'bg-info' },
      { name: 'ring', className: 'bg-ring' },
    ],
  },
  {
    label: 'Charts',
    tokens: [
      { name: 'chart-1', className: 'bg-chart-1' },
      { name: 'chart-2', className: 'bg-chart-2' },
      { name: 'chart-3', className: 'bg-chart-3' },
      { name: 'chart-4', className: 'bg-chart-4' },
    ],
  },
];

export const TokenSwatches = () => (
  <Figure caption="These swatches read your current theme. Change it in the Registry Customizer and they update.">
    <div className="grid gap-4 rounded-md border border-border bg-card p-4 sm:grid-cols-2">
      {TOKEN_GROUPS.map((group) => (
        <div key={group.label} className="flex flex-col gap-2">
          <span className="text-xs text-muted-foreground uppercase">{group.label}</span>
          <div className="grid grid-cols-4 gap-2">
            {group.tokens.map((token) => (
              <div key={token.name} className="flex min-w-0 flex-col gap-1.5">
                <span className={cn('h-10 rounded-md border border-border', token.className)} />
                <code className="truncate font-mono text-[11px] text-muted-foreground">{token.name}</code>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </Figure>
);

interface DirectionSampleProps {
  dir: 'ltr' | 'rtl';
  label: string;
  crumbs: [string, string];
  search: string;
  action: string;
}

const DirectionSample = ({ dir, label, crumbs, search, action }: DirectionSampleProps) => (
  <div dir={dir} lang={dir === 'rtl' ? 'ar' : 'en'} className="flex flex-col gap-3 p-4">
    <span className="text-xs text-muted-foreground uppercase">{label}</span>
    <span className="flex items-center gap-1 text-sm text-muted-foreground">
      {crumbs[0]}
      <ChevronRight aria-hidden className="size-3.5 rtl:rotate-180" />
      <span className="text-foreground">{crumbs[1]}</span>
    </span>
    <span className="relative flex h-9 items-center rounded-md border border-input bg-background ps-8 text-sm text-muted-foreground">
      <Search aria-hidden className="absolute start-2.5 size-4" />
      {search}
    </span>
    <span className="h-1.5 overflow-hidden rounded-full bg-muted">
      <span className="block h-full w-2/3 rounded-full bg-primary" />
    </span>
    <span className="flex items-center gap-1.5 self-end rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground">
      {action}
      <ChevronRight aria-hidden className="size-4 rtl:rotate-180" />
    </span>
  </div>
);

export const RtlCompare = () => (
  <Figure caption="The same markup in both directions. Nothing changes except the dir attribute.">
    <div className="grid overflow-hidden rounded-md border border-border bg-card sm:grid-cols-2">
      <DirectionSample dir="ltr" label="dir=ltr" crumbs={['Account', 'Profile']} search="Search" action="Next" />
      <div className="border-t border-border sm:border-s sm:border-t-0">
        <DirectionSample dir="rtl" label="dir=rtl" crumbs={['الحساب', 'الملف الشخصي']} search="بحث" action="التالي" />
      </div>
    </div>
  </Figure>
);

const AGENT_STEPS = [
  'Searched the @hirael registry for "date picker"',
  'Found Date Picker, Date Range Picker and Date Time Picker',
  'Ran npx shadcn@latest add @hirael/date-picker',
  'Added the picker to booking-form.tsx',
];

export const AgentSession = () => (
  <Figure caption="An example session. Your editor words it differently, but the steps are the same.">
    <div className="flex flex-col gap-4 rounded-md border border-border bg-card p-4">
      <p className="max-w-[85%] self-end rounded-lg bg-primary px-3.5 py-2 text-sm text-primary-foreground">
        Add a date picker from @hirael to the booking form.
      </p>
      <ul className="flex flex-col gap-2">
        {AGENT_STEPS.map((step) => (
          <li key={step} className="flex items-start gap-2.5 text-sm text-foreground/80">
            <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-success" />
            {step}
          </li>
        ))}
      </ul>
    </div>
  </Figure>
);
