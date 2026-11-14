'use client';

import * as React from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { Label } from '@/registry/hirael/bases/radix/ui/label';
import { Switch } from '@/registry/hirael/bases/radix/ui/switch';

const PRINCIPLES = [
  { title: 'Ship early', body: 'A rough version in front of users beats a polished one in a branch.' },
  { title: 'Write it down', body: 'Decisions live in documents, so nobody has to be in the meeting.' },
  { title: 'Own the outcome', body: 'Whoever starts a project sees it through to the people who use it.' },
  { title: 'Stay small', body: 'We add a person when the work demands it, not when the budget allows it.' },
  { title: 'Work in the open', body: 'Roadmaps, incidents and pay bands are visible to the whole team.' },
  { title: 'Rest properly', body: 'Six weeks off a year, and nobody answers messages while away.' },
] as const;

interface Role {
  title: string;
  location: string;
  isRemote: boolean;
}

interface Department {
  name: string;
  roles: readonly Role[];
}

const DEPARTMENTS: readonly Department[] = [
  {
    name: 'Engineering',
    roles: [
      { title: 'Senior Frontend Engineer', location: 'Remote, Europe', isRemote: true },
      { title: 'Design Systems Engineer', location: 'Berlin', isRemote: false },
      { title: 'Platform Engineer', location: 'Remote, Americas', isRemote: true },
    ],
  },
  {
    name: 'Design',
    roles: [
      { title: 'Product Designer', location: 'Lisbon', isRemote: false },
      { title: 'Brand Designer', location: 'Remote, Europe', isRemote: true },
    ],
  },
  {
    name: 'Customer Experience',
    roles: [
      { title: 'Support Engineer', location: 'Remote, Asia Pacific', isRemote: true },
      { title: 'Solutions Architect', location: 'London', isRemote: false },
    ],
  },
  {
    name: 'Operations',
    roles: [{ title: 'People Operations Lead', location: 'Berlin', isRemote: false }],
  },
];

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const FOCUS_RING = 'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none';

const twoDigits = (value: number) => String(value).padStart(2, '0');

const slugFor = (name: string) => `careers-${name.toLowerCase().replace(/\s+/g, '-')}`;

const Principles = () => (
  <ol data-slot="careers-principles" className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
    {PRINCIPLES.map((principle, index) => (
      <li key={principle.title} className="flex flex-col gap-2 border-t border-border py-6">
        <span className="text-xs text-muted-foreground tabular-nums">{twoDigits(index + 1)}</span>
        <h3 className="text-base font-medium tracking-[-0.01em]">{principle.title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{principle.body}</p>
      </li>
    ))}
  </ol>
);

interface DepartmentRolesProps {
  department: Department;
}

const DepartmentRoles = ({ department }: DepartmentRolesProps) => (
  <section
    id={slugFor(department.name)}
    aria-labelledby={`${slugFor(department.name)}-title`}
    className="grid scroll-mt-8 gap-x-10 gap-y-3 border-t border-border py-6 md:grid-cols-[14rem_1fr]"
  >
    <h4 id={`${slugFor(department.name)}-title`} className="flex items-baseline gap-2 text-sm font-medium">
      {department.name}
      <span className="text-xs font-normal text-muted-foreground tabular-nums">{department.roles.length}</span>
    </h4>
    <ul className="flex flex-col">
      {department.roles.map((role) => (
        <li key={role.title} className="border-b border-border last:border-b-0">
          <a
            href="#"
            data-slot="careers-role"
            className={cn(
              'group flex items-center justify-between gap-4 rounded-sm py-3 transition-colors duration-150 first:pt-0',
              FOCUS_RING,
            )}
          >
            <span className="flex min-w-0 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
              <span className="text-base font-medium tracking-[-0.01em] group-hover:underline group-hover:underline-offset-4">
                {role.title}
              </span>
              <span className="text-sm text-muted-foreground">{role.location}</span>
            </span>
            <ArrowRight
              aria-hidden
              className="size-4 shrink-0 text-muted-foreground transition-transform duration-150 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
            />
          </a>
        </li>
      ))}
    </ul>
  </section>
);

const Careers03 = () => {
  const [isRemoteOnly, setIsRemoteOnly] = React.useState(false);

  const departments = DEPARTMENTS.map((department) => ({
    ...department,
    roles: isRemoteOnly ? department.roles.filter((role) => role.isRemote) : department.roles,
  })).filter((department) => department.roles.length > 0);
  const roleCount = departments.reduce((sum, department) => sum + department.roles.length, 0);

  return (
    <section data-slot="careers" className="bg-background py-20 sm:py-28">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-6 md:px-10">
        <header className={cn(ENTER, 'flex flex-col items-start gap-5')}>
          <span className="text-xs text-muted-foreground uppercase">Careers</span>
          <h2 className="max-w-2xl text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl">
            Build the parts other teams skip.
          </h2>
          <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
            Hirael is 24 people in nine countries. We hire slowly, pay the same band for the same role everywhere, and
            publish how we work before you apply.
          </p>
          <Button asChild variant="outline">
            <a href="#careers-roles">
              See open roles
              <ArrowDown aria-hidden />
            </a>
          </Button>
        </header>

        <div className="flex flex-col gap-6">
          <h3 className="text-xs text-muted-foreground uppercase">How we work</h3>
          <Principles />
        </div>

        <div id="careers-roles" data-slot="careers-roles" className="flex scroll-mt-8 flex-col gap-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-2xl font-semibold tracking-tight">Open roles</h3>
              <p aria-live="polite" className="text-sm text-muted-foreground">
                <span className="tabular-nums">{roleCount}</span> {roleCount === 1 ? 'role' : 'roles'} in{' '}
                <span className="tabular-nums">{departments.length}</span> {departments.length === 1 ? 'team' : 'teams'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="careers-remote" checked={isRemoteOnly} onCheckedChange={setIsRemoteOnly} />
              <Label htmlFor="careers-remote">Remote only</Label>
            </div>
          </div>

          <nav aria-label="Teams" className="flex flex-wrap gap-2">
            {departments.map((department) => (
              <Button key={department.name} asChild variant="outline" size="sm">
                <a href={`#${slugFor(department.name)}`}>
                  {department.name}
                  <span className="text-muted-foreground tabular-nums">{department.roles.length}</span>
                </a>
              </Button>
            ))}
          </nav>

          <div className="flex flex-col border-b border-border">
            {departments.map((department) => (
              <DepartmentRoles key={department.name} department={department} />
            ))}
          </div>

          <p className="text-sm text-muted-foreground">
            Nothing that fits? Write to{' '}
            <a
              href="mailto:hello@mohammadshehadeh.com"
              className={cn('rounded-sm text-foreground underline underline-offset-4', FOCUS_RING)}
            >
              hello@mohammadshehadeh.com
            </a>{' '}
            and tell us what you would work on.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Careers03;
