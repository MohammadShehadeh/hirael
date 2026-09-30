import {
  ArrowRight,
  Bell,
  Calendar,
  Cloud,
  CreditCard,
  Database,
  FileText,
  GitBranch,
  Mail,
  type LucideIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/radix/ui/button';

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

const Integrations08 = () => {
  return (
    <section
      data-slot="integrations"
      className="bg-background py-20 sm:py-28"
      aria-labelledby="integrations-08-heading"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 text-center">
        <h2
          id="integrations-08-heading"
          style={stagger(1)}
          className={cn(ENTER, 'font-serif text-3xl font-medium tracking-tight text-balance sm:text-4xl')}
        >
          Works with the tools you already use
        </h2>

        <ul
          data-slot="integrations-list"
          aria-label="Supported integrations"
          className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-4 rounded-3xl border border-border bg-card/40 px-8 py-5"
        >
          {TOOLS.map((tool, index) => (
            <li key={tool.name} style={stagger(index, 50, 160)} className={ENTER}>
              <a
                href={tool.href}
                aria-label={tool.name}
                title={tool.name}
                className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-[color,transform] duration-150 ease-out hover:-translate-y-0.5 hover:text-foreground focus-visible:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none motion-reduce:transition-none"
              >
                <tool.icon aria-hidden className="size-7" />
              </a>
            </li>
          ))}
        </ul>

        <Button asChild style={stagger(TOOLS.length, 50, 160)} className={cn(ENTER, 'group mt-10')}>
          <a href="#">
            See all integrations
            <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
          </a>
        </Button>
      </div>
    </section>
  );
};

export default Integrations08;
