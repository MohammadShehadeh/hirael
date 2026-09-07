import { ArrowRight, BookOpen, Braces, GitBranch, Plug, Terminal, Webhook, type LucideIcon } from 'lucide-react';

import { Badge } from '@/registry/hirael/bases/base/ui/badge';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Separator } from '@/registry/hirael/bases/base/ui/separator';

interface Row {
  name: string;
  summary: string;
  icon: LucideIcon;
  status: 'Live' | 'Beta';
}

const ROWS: readonly Row[] = [
  { name: 'CLI', summary: 'npx shadcn add, straight from the registry URL', icon: Terminal, status: 'Live' },
  { name: 'Webhooks', summary: 'A POST on every release, signed and retried', icon: Webhook, status: 'Live' },
  { name: 'JSON payloads', summary: 'Every item served as registry-item JSON', icon: Braces, status: 'Live' },
  { name: 'Markdown docs', summary: 'The same page an agent can read at /r/name.md', icon: BookOpen, status: 'Live' },
  { name: 'Git sync', summary: 'Open a pull request when an item changes', icon: GitBranch, status: 'Beta' },
];

const Integrations03 = () => {
  return (
    <section className="bg-background py-20 sm:py-28" aria-labelledby="integrations-03-heading">
      <div className="container w-full max-w-5xl">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-16">
          <div className="lg:sticky lg:top-16 lg:self-start">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">How it plugs in</p>
            <h2
              id="integrations-03-heading"
              className="mt-3 font-serif text-3xl font-medium tracking-tight sm:text-4xl"
            >
              Five ways in, no SDK
            </h2>
            <p className="mt-4 text-muted-foreground">
              The registry is a set of static files behind a URL. Anything that can read a URL can read it, which is
              most of your pipeline already.
            </p>

            <div className="mt-8 rounded-md border border-border bg-card p-5">
              <div className="flex items-center gap-2">
                <Plug aria-hidden className="size-4" />
                <h3 className="text-sm font-medium">Something missing?</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Open an issue with the tool you want wired up. Connectors ship in the same release as components.
              </p>
              <Button variant="outline" size="sm" className="group mt-4">
                Request an integration
                <ArrowRight className="size-3.5 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
              </Button>
            </div>
          </div>

          <ul className="flex flex-col">
            {ROWS.map((row, index) => (
              <li key={row.name}>
                {index > 0 && <Separator />}
                <div className="flex items-start gap-4 py-5">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-sm border border-border bg-card">
                    <row.icon aria-hidden className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium">{row.name}</h3>
                      <Badge
                        variant={row.status === 'Live' ? 'secondary' : 'outline'}
                        className="font-mono text-[10px] uppercase tracking-[0.1em]"
                      >
                        {row.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{row.summary}</p>
                  </div>
                  <ArrowRight aria-hidden className="mt-1 size-4 shrink-0 text-muted-foreground/50 rtl:rotate-180" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Integrations03;
