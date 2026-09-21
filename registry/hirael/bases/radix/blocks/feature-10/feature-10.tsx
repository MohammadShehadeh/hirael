import type * as React from 'react';
import { ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/registry/hirael/bases/radix/ui/avatar';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/registry/hirael/bases/radix/ui/card';

const CELL = 'min-h-full rounded-none border-0 shadow-none';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

const METRICS = [
  { value: '14', label: 'teams', caption: 'on one set of files' },
  { value: '212', label: 'components', caption: 'in two parallel bases' },
] as const;

const JOBS = [
  {
    title: 'Install',
    body: 'The CLI writes the files into your repo. Nothing lands in node_modules.',
  },
  {
    title: 'Theme',
    body: 'It reads the same CSS variables as the rest of your UI.',
  },
  {
    title: 'RTL',
    body: 'Logical properties throughout, so setting dir=rtl is the whole job.',
  },
] as const;

const Feature10 = () => {
  return (
    <section data-slot="feature" className="bg-background py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
        <div data-slot="feature-header" className="flex max-w-2xl flex-col gap-5">
          <span className={cn(ENTER, 'text-xs uppercase text-muted-foreground')}>Overview</span>
          <h2
            style={stagger(1)}
            className={cn(ENTER, 'font-serif text-4xl font-medium leading-[1.04] tracking-tight sm:text-5xl')}
          >
            What the catalog is doing.
          </h2>
          <p style={stagger(2)} className={cn(ENTER, 'text-base text-muted-foreground sm:text-lg')}>
            Components your team installs once and then owns, kept current in two bases and shipped a few at a time.
          </p>
        </div>

        <div
          data-slot="feature-bento"
          className="mt-14 grid grid-cols-6 gap-px overflow-hidden rounded-xl border border-border bg-border"
        >
          <Card
            data-slot="feature-quote"
            style={stagger(0, 60, 180)}
            className={cn(ENTER, CELL, 'col-span-6 lg:col-span-4 lg:row-span-2')}
          >
            <CardHeader>
              <CardDescription className="text-xs uppercase">from the field</CardDescription>
              <CardTitle className="sr-only">What teams say</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <blockquote className="font-serif text-2xl leading-[1.3] tracking-tight sm:text-3xl">
                We stopped maintaining a fork of the date picker. The file in the registry is the one in production.
              </blockquote>
            </CardContent>
            <CardFooter className="mt-auto gap-3">
              <Avatar aria-hidden>
                <AvatarFallback className="text-xs font-medium text-foreground">PB</AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-col">
                <cite className="text-sm font-medium not-italic">Priya Banerjee</cite>
                <span className="flex flex-wrap items-center gap-x-2 text-xs uppercase text-muted-foreground">
                  <span>Design systems</span>
                  <span aria-hidden className="text-border">
                    |
                  </span>
                  <span>Helios Lab</span>
                </span>
              </div>
            </CardFooter>
          </Card>

          {METRICS.map((metric, index) => (
            <Card
              key={metric.label}
              data-slot="feature-metric"
              style={stagger(index + 1, 60, 180)}
              className={cn(ENTER, CELL, 'col-span-3 lg:col-span-2')}
            >
              <CardHeader>
                <CardDescription className="text-xs uppercase">{metric.label}</CardDescription>
                <CardTitle className="text-4xl tracking-tight tabular-nums sm:text-5xl">{metric.value}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{metric.caption}</p>
              </CardContent>
            </Card>
          ))}

          <Card
            data-slot="feature-work"
            style={stagger(3, 60, 180)}
            className={cn(ENTER, CELL, 'col-span-6 lg:col-span-4')}
          >
            <CardHeader>
              <CardDescription className="text-xs uppercase">latest drop</CardDescription>
              <CardTitle className="text-lg">Command Palette</CardTitle>
              <CardAction>
                <Button variant="outline" size="sm" asChild>
                  <a href="#">
                    Release notes
                    <ArrowRight aria-hidden className="size-3.5 rtl:rotate-180" />
                  </a>
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <p className="max-w-md text-sm text-muted-foreground">
                Search, nested pages you can back out of with Backspace, and a shortcut hint on each row.
              </p>
            </CardContent>
          </Card>

          <Card
            data-slot="feature-list"
            style={stagger(4, 60, 180)}
            className={cn(ENTER, CELL, 'col-span-6 lg:col-span-2')}
          >
            <CardHeader>
              <CardDescription className="text-xs uppercase">what it does</CardDescription>
              <CardTitle className="sr-only">What the registry does</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-4">
                {JOBS.map((job) => (
                  <li key={job.title} className="flex flex-col gap-1">
                    <span className="text-sm font-medium">{job.title}</span>
                    <span className="text-sm text-muted-foreground">{job.body}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Feature10;
