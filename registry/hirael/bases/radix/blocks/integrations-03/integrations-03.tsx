'use client';

import * as React from 'react';
import {
  ArrowRight,
  BookOpen,
  Braces,
  Check,
  GitBranch,
  Loader2,
  Plug,
  Terminal,
  Webhook,
  type LucideIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/radix/ui/badge';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { Field, FieldError, FieldLabel } from '@/registry/hirael/bases/radix/ui/field';
import { Input } from '@/registry/hirael/bases/radix/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/hirael/bases/radix/ui/popover';
import { Separator } from '@/registry/hirael/bases/radix/ui/separator';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
const SWAP =
  'animate-in fade-in zoom-in-97 duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

interface Row {
  name: string;
  summary: string;
  icon: LucideIcon;
  status: 'Live' | 'Beta';
  href: string;
}

const ROWS: readonly Row[] = [
  {
    name: 'CLI',
    summary: 'npx shadcn add, straight from the registry URL',
    icon: Terminal,
    status: 'Live',
    href: '#cli',
  },
  {
    name: 'Webhooks',
    summary: 'A POST on every release, signed and retried',
    icon: Webhook,
    status: 'Live',
    href: '#webhooks',
  },
  {
    name: 'JSON payloads',
    summary: 'Every item served as registry-item JSON',
    icon: Braces,
    status: 'Live',
    href: '#json-payloads',
  },
  {
    name: 'Markdown docs',
    summary: 'The same page an agent can read at /r/name.md',
    icon: BookOpen,
    status: 'Live',
    href: '#markdown-docs',
  },
  {
    name: 'Git sync',
    summary: 'Open a pull request when an item changes',
    icon: GitBranch,
    status: 'Beta',
    href: '#git-sync',
  },
];

const RequestIntegration = () => {
  const [open, setOpen] = React.useState(false);
  const [tool, setTool] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);
  const [sent, setSent] = React.useState<string | null>(null);

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next && sent) {
      setSent(null);
      setTool('');
    }
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const name = tool.trim();
    if (name.length < 2) {
      setError('Name the tool you want connected.');

      return;
    }
    setError(null);
    setPending(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setPending(false);
    setSent(name);
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="group mt-4">
          Request an integration
          <ArrowRight className="size-3.5 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80">
        {sent ? (
          <div key="sent" role="status" className={cn(SWAP, 'flex flex-col gap-1.5')}>
            <p className="flex items-center gap-2 text-sm font-medium">
              <Check aria-hidden className="size-4 text-primary" />
              Request sent
            </p>
            <p className="text-sm text-muted-foreground">
              We&apos;ll reply on the issue once {sent} is on the roadmap.
            </p>
          </div>
        ) : (
          <form
            key="form"
            data-slot="integrations-request"
            noValidate
            onSubmit={onSubmit}
            className="flex flex-col gap-3"
          >
            <Field className="gap-1.5" data-invalid={Boolean(error) || undefined}>
              <FieldLabel htmlFor="integrations-03-tool">Tool to connect</FieldLabel>
              <Input
                id="integrations-03-tool"
                placeholder="Issue tracker, CI runner, docs site"
                value={tool}
                onChange={(event) => setTool(event.target.value)}
                aria-invalid={Boolean(error) || undefined}
                aria-describedby={error ? 'integrations-03-tool-error' : undefined}
              />
              <FieldError id="integrations-03-tool-error">{error}</FieldError>
            </Field>
            <Button type="submit" size="sm" disabled={pending}>
              {pending && <Loader2 aria-hidden className="size-3.5 animate-spin motion-reduce:animate-none" />}
              {pending ? 'Sending' : 'Send request'}
            </Button>
          </form>
        )}
      </PopoverContent>
    </Popover>
  );
};

const Integrations03 = () => {
  return (
    <section
      data-slot="integrations"
      className="bg-background py-20 sm:py-28"
      aria-labelledby="integrations-03-heading"
    >
      <div className="mx-auto w-full max-w-5xl px-4">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-16">
          <div data-slot="integrations-header" className="lg:sticky lg:top-16 lg:self-start">
            <p className={cn(ENTER, 'text-xs text-muted-foreground uppercase')}>How it plugs in</p>
            <h2
              id="integrations-03-heading"
              style={stagger(1)}
              className={cn(ENTER, 'mt-3 font-serif text-3xl font-medium tracking-tight sm:text-4xl')}
            >
              Five ways in, no SDK
            </h2>
            <p style={stagger(2)} className={cn(ENTER, 'mt-4 text-muted-foreground')}>
              The registry is a set of static files behind a URL. Anything that can read a URL can read it, which is
              most of your pipeline already.
            </p>

            <div style={stagger(3)} className={cn(ENTER, 'mt-8 rounded-md border border-border bg-card p-5')}>
              <h3 className="flex items-center gap-2 text-sm font-medium">
                <Plug aria-hidden className="size-4 text-muted-foreground" />
                Something missing?
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Tell us the tool you want wired up. Connectors ship in the same release as components.
              </p>
              <RequestIntegration />
            </div>
          </div>

          <ul data-slot="integrations-list" className="flex flex-col">
            {ROWS.map((row, index) => (
              <li key={row.name} style={stagger(index, 60, 200)} className={ENTER}>
                {index > 0 && <Separator />}
                <a
                  href={row.href}
                  className="group -mx-3 flex items-start gap-4 rounded-md px-3 py-5 transition-colors duration-150 hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <row.icon aria-hidden className="size-4 shrink-0 text-muted-foreground" />
                      <h3 className="text-sm font-medium">{row.name}</h3>
                      <Badge variant={row.status === 'Live' ? 'secondary' : 'outline'}>{row.status}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-pretty text-muted-foreground">{row.summary}</p>
                  </div>
                  <ArrowRight
                    aria-hidden
                    className="mt-1 size-4 shrink-0 text-muted-foreground/50 transition-[color,transform] duration-150 ease-out group-hover:translate-x-0.5 group-hover:text-foreground motion-reduce:transition-none rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Integrations03;
