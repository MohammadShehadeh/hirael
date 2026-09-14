'use client';

import * as React from 'react';
import { MapPin, Clock, ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/base/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/registry/hirael/bases/base/ui/toggle-group';

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]';
const ENTER = `animate-in fade-in slide-in-from-bottom-4 duration-500 ${EASE} fill-mode-both motion-reduce:animate-none`;
const SWAP = `animate-in fade-in slide-in-from-bottom-2 duration-250 ${EASE} fill-mode-both motion-reduce:animate-none`;

const stagger = (index: number, step = 60, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

interface Role {
  title: string;
  department: string;
  location: string;
  type: string;
  href: string;
}

const ROLES: readonly Role[] = [
  {
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    location: 'Remote, Europe',
    type: 'Full-time',
    href: '#',
  },
  {
    title: 'Design Systems Engineer',
    department: 'Engineering',
    location: 'Berlin or remote',
    type: 'Full-time',
    href: '#',
  },
  {
    title: 'Product Designer',
    department: 'Design',
    location: 'Lisbon',
    type: 'Full-time',
    href: '#',
  },
  {
    title: 'Developer Advocate',
    department: 'Marketing',
    location: 'Remote, Americas',
    type: 'Full-time',
    href: '#',
  },
  {
    title: 'Technical Writer',
    department: 'Marketing',
    location: 'Remote',
    type: 'Contract, 6 months',
    href: '#',
  },
  {
    title: 'Founding Account Executive',
    department: 'Sales',
    location: 'New York',
    type: 'Full-time',
    href: '#',
  },
  {
    title: 'Sales Engineer',
    department: 'Sales',
    location: 'London',
    type: 'Part-time, 3 days',
    href: '#',
  },
];

const DEPARTMENTS = ['All', 'Engineering', 'Design', 'Marketing', 'Sales'];

const countFor = (department: string) =>
  department === 'All' ? ROLES.length : ROLES.filter((role) => role.department === department).length;

const Careers01 = () => {
  const [department, setDepartment] = React.useState('All');

  const roles = department === 'All' ? ROLES : ROLES.filter((role) => role.department === department);

  return (
    <section data-slot="careers" className="bg-background py-20 sm:py-28">
      <div className="mx-auto w-full max-w-4xl px-6 md:px-10">
        <div data-slot="careers-header" className="flex flex-col gap-5">
          <span className={cn(ENTER, 'text-xs uppercase text-muted-foreground')}>Careers</span>
          <h2
            style={stagger(1, 70)}
            className={cn(ENTER, 'font-serif text-4xl font-medium leading-[1.04] tracking-tight sm:text-5xl')}
          >
            Open roles.
          </h2>
          <p style={stagger(2, 70)} className={cn(ENTER, 'max-w-xl text-base text-muted-foreground sm:text-lg')}>
            We are a small team spread across four cities, building the components shadcn/ui leaves out. {ROLES.length}{' '}
            roles open right now.
          </p>
        </div>

        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          spacing={2}
          value={department}
          onValueChange={(next) => {
            if (next) setDepartment(next);
          }}
          aria-label="Filter roles by department"
          data-slot="careers-filter"
          style={stagger(3, 70)}
          className={cn(ENTER, 'mt-10 flex-wrap')}
        >
          {DEPARTMENTS.map((dept) => (
            <ToggleGroupItem
              key={dept}
              value={dept}
              className="group/chip gap-1.5 rounded-full data-pressed:border-primary data-pressed:bg-primary data-pressed:text-primary-foreground"
            >
              {dept}
              <span className="text-xs tabular-nums text-muted-foreground group-data-pressed/chip:text-primary-foreground/70">
                {countFor(dept)}
              </span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <ul data-slot="careers-list" style={stagger(4, 70)} className={cn(ENTER, 'mt-8 border-t border-border')}>
          {roles.map((role, index) => (
            <li
              key={`${department}-${role.title}`}
              style={stagger(index, 50)}
              className={cn(SWAP, 'border-b border-border')}
            >
              <a
                href={role.href}
                data-slot="careers-role"
                className="group -mx-4 flex items-center justify-between gap-4 rounded-lg px-4 py-5 transition-colors duration-150 ease-out hover:bg-accent/50"
              >
                <div className="flex flex-col gap-2">
                  <h3 className="text-base font-medium tracking-[-0.01em] sm:text-lg">{role.title}</h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground sm:text-sm">
                    <Badge variant="outline" className="bg-card text-xs font-normal uppercase text-muted-foreground">
                      {role.department}
                    </Badge>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin aria-hidden className="size-3.5" />
                      {role.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock aria-hidden className="size-3.5" />
                      {role.type}
                    </span>
                  </div>
                </div>
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors duration-150 ease-out group-hover:border-foreground group-hover:bg-foreground group-hover:text-background">
                  <ArrowRight
                    aria-hidden
                    className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                  />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Careers01;
