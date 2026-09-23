'use client';

import * as React from 'react';
import {
  ArrowRight,
  BookOpen,
  Boxes,
  Building2,
  ChartLine,
  GitBranch,
  GraduationCap,
  LifeBuoy,
  Menu,
  Newspaper,
  Rocket,
  ShieldCheck,
  ShoppingBag,
  Users,
  Workflow,
  type LucideIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/registry/hirael/bases/radix/ui/accordion';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/registry/hirael/bases/radix/ui/navigation-menu';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/registry/hirael/bases/radix/ui/sheet';

interface MenuLink {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

interface MenuFeature {
  label: string;
  title: string;
  body: string;
  date: string;
  dateTime: string;
  cta: string;
  href: string;
}

interface MenuGroup {
  value: string;
  label: string;
  links: readonly MenuLink[];
  feature: MenuFeature;
}

const GROUPS: readonly MenuGroup[] = [
  {
    value: 'product',
    label: 'Product',
    links: [
      { title: 'Deploys', description: 'Ship from main or any branch in one push.', icon: Rocket, href: '#' },
      { title: 'Branch previews', description: 'A live URL for every pull request.', icon: GitBranch, href: '#' },
      { title: 'Pipelines', description: 'Build, test and release steps you can read.', icon: Workflow, href: '#' },
      { title: 'Analytics', description: 'Traffic and response times per route.', icon: ChartLine, href: '#' },
      {
        title: 'Access control',
        description: 'Roles, SSO and audit history per project.',
        icon: ShieldCheck,
        href: '#',
      },
      { title: 'Integrations', description: 'GitHub, Slack, Linear and 40 more.', icon: Boxes, href: '#' },
    ],
    feature: {
      label: "What's new",
      title: 'Preview comments',
      body: 'Reviewers can pin a comment to any element on a branch preview, and it lands on the pull request.',
      date: 'Sep 9, 2026',
      dateTime: '2026-09-09',
      cta: 'Read the release note',
      href: '#',
    },
  },
  {
    value: 'solutions',
    label: 'Solutions',
    links: [
      { title: 'Startups', description: 'Free for your first three projects.', icon: Rocket, href: '#' },
      { title: 'Enterprise', description: 'Dedicated regions and a 99.99% SLA.', icon: Building2, href: '#' },
      { title: 'Ecommerce', description: 'Storefronts that stay up on launch day.', icon: ShoppingBag, href: '#' },
      { title: 'Agencies', description: 'One workspace per client, billed apart.', icon: Users, href: '#' },
    ],
    feature: {
      label: 'Customer story',
      title: 'Halden cut deploy time to 90 seconds',
      body: 'A 40 person retail team moved 12 storefronts over in a weekend and stopped scheduling release nights.',
      date: 'Aug 21, 2026',
      dateTime: '2026-08-21',
      cta: 'Read the story',
      href: '#',
    },
  },
  {
    value: 'resources',
    label: 'Resources',
    links: [
      { title: 'Guides', description: 'Step by step setups for common stacks.', icon: BookOpen, href: '#' },
      { title: 'Blog', description: 'Engineering notes from the team.', icon: Newspaper, href: '#' },
      { title: 'Academy', description: 'Short courses on shipping safely.', icon: GraduationCap, href: '#' },
      { title: 'Support', description: 'Talk to an engineer, not a script.', icon: LifeBuoy, href: '#' },
    ],
    feature: {
      label: 'Upcoming',
      title: 'Zero downtime migrations, live',
      body: 'A one hour walkthrough of moving a production Postgres database without a maintenance window.',
      date: 'Oct 2, 2026',
      dateTime: '2026-10-02',
      cta: 'Save a seat',
      href: '#',
    },
  },
];

const PLAIN_LINKS = [
  { label: 'Pricing', href: '#' },
  { label: 'Docs', href: '#' },
] as const;

const MENU_ROOT = cn(
  'static max-w-none flex-none',
  '[&>div:last-child]:inset-x-0',
  '**:data-[slot=navigation-menu-viewport]:mt-2',
  '**:data-[slot=navigation-menu-viewport]:duration-250 **:data-[slot=navigation-menu-viewport]:ease-[cubic-bezier(0.22,1,0.36,1)]',
  '**:data-[slot=navigation-menu-viewport]:data-[state=open]:fade-in-0 **:data-[slot=navigation-menu-viewport]:data-[state=open]:zoom-in-97',
  '**:data-[slot=navigation-menu-viewport]:data-[state=closed]:fade-out-0 **:data-[slot=navigation-menu-viewport]:data-[state=closed]:zoom-out-97 **:data-[slot=navigation-menu-viewport]:data-[state=closed]:duration-150',
  '**:data-[slot=navigation-menu-content]:duration-250 **:data-[slot=navigation-menu-content]:ease-[cubic-bezier(0.22,1,0.36,1)]',
  '**:data-[slot=navigation-menu-content]:data-[motion=from-end]:slide-in-from-right-6 **:data-[slot=navigation-menu-content]:data-[motion=from-start]:slide-in-from-left-6',
  '**:data-[slot=navigation-menu-content]:data-[motion=to-end]:slide-out-to-right-6 **:data-[slot=navigation-menu-content]:data-[motion=to-start]:slide-out-to-left-6 **:data-[slot=navigation-menu-content]:data-[motion^=to-]:duration-150',
);

const TRIGGER = cn(navigationMenuTriggerStyle(), 'h-8');

interface WordmarkProps {
  className?: string;
}

const Wordmark = ({ className }: WordmarkProps) => {
  return (
    <a
      href="#"
      data-slot="header-brand"
      className={cn(
        'rounded-sm text-base font-semibold tracking-[-0.03em] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
    >
      Northbeam
    </a>
  );
};

interface FlyoutRowProps {
  link: MenuLink;
}

const FlyoutRow = ({ link }: FlyoutRowProps) => {
  const Icon = link.icon;
  return (
    <li>
      <NavigationMenuLink href={link.href} className="flex-row items-start">
        <Icon aria-hidden className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="text-sm font-medium text-foreground">{link.title}</span>
          <span className="text-sm leading-snug text-pretty text-muted-foreground">{link.description}</span>
        </span>
      </NavigationMenuLink>
    </li>
  );
};

interface FlyoutFeatureProps {
  feature: MenuFeature;
}

const FlyoutFeature = ({ feature }: FlyoutFeatureProps) => {
  return (
    <div
      data-slot="header-flyout-feature"
      className="flex flex-col gap-2 border-t border-border bg-muted/30 p-5 md:border-t-0 md:border-s"
    >
      <span className="text-xs uppercase text-muted-foreground">{feature.label}</span>
      <p className="text-sm font-medium text-foreground">{feature.title}</p>
      <p className="text-sm leading-relaxed text-muted-foreground">{feature.body}</p>
      <time dateTime={feature.dateTime} className="text-xs tabular-nums text-muted-foreground">
        {feature.date}
      </time>
      <NavigationMenuLink href={feature.href} className="group/cta mt-auto flex-row items-center self-start">
        {feature.cta}
        <ArrowRight
          aria-hidden
          className="size-3.5 text-current transition-transform duration-150 group-hover/cta:translate-x-0.5 rtl:rotate-180 rtl:group-hover/cta:-translate-x-0.5"
        />
      </NavigationMenuLink>
    </div>
  );
};

const Header03 = () => {
  return (
    <div data-slot="header-03-block" className="relative w-full bg-background">
      <header data-slot="header" className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
        <div className="relative mx-auto flex h-14 w-full max-w-6xl items-center gap-8 px-6 md:px-10">
          <Wordmark />

          <NavigationMenu className={cn(MENU_ROOT, 'hidden md:flex')}>
            <NavigationMenuList>
              {GROUPS.map((group) => (
                <NavigationMenuItem key={group.value} value={group.value}>
                  <NavigationMenuTrigger className={TRIGGER}>{group.label}</NavigationMenuTrigger>
                  <NavigationMenuContent className="md:w-[min(52rem,calc(100vw-3rem))]">
                    <div data-slot="header-flyout" className="grid md:grid-cols-[minmax(0,1fr)_17rem]">
                      <ul className="grid gap-1 p-3 sm:grid-cols-2">
                        {group.links.map((link) => (
                          <FlyoutRow key={link.title} link={link} />
                        ))}
                      </ul>
                      <FlyoutFeature feature={group.feature} />
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
              {PLAIN_LINKS.map((link) => (
                <NavigationMenuItem key={link.label}>
                  <NavigationMenuLink href={link.href} className={cn(TRIGGER, 'flex-row')}>
                    {link.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="ms-auto hidden items-center gap-2 md:flex">
            <Button asChild variant="ghost" size="sm">
              <a href="#">Sign in</a>
            </Button>
            <Button asChild size="sm">
              <a href="#">Start free</a>
            </Button>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu" className="ms-auto md:hidden">
                <Menu aria-hidden className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-sm">
              <SheetHeader className="h-14 justify-center">
                <SheetTitle className="text-start">
                  <Wordmark />
                </SheetTitle>
              </SheetHeader>
              <nav data-slot="header-mobile-menu" className="flex-1 overflow-y-auto px-6">
                <Accordion type="single" collapsible>
                  {GROUPS.map((group) => (
                    <AccordionItem key={group.value} value={group.value}>
                      <AccordionTrigger>{group.label}</AccordionTrigger>
                      <AccordionContent>
                        <ul className="flex flex-col">
                          {group.links.map((link) => {
                            const Icon = link.icon;
                            return (
                              <li key={link.title}>
                                <SheetClose asChild>
                                  <a
                                    href={link.href}
                                    className="-mx-2 flex items-start gap-3 rounded-md px-2 py-2.5 transition-colors duration-150 hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                  >
                                    <Icon aria-hidden className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                                    <span className="flex min-w-0 flex-col gap-0.5">
                                      <span className="text-sm font-medium">{link.title}</span>
                                      <span className="text-sm text-muted-foreground">{link.description}</span>
                                    </span>
                                  </a>
                                </SheetClose>
                              </li>
                            );
                          })}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                <ul className="flex flex-col border-t border-border">
                  {PLAIN_LINKS.map((link) => (
                    <li key={link.label} className="border-b border-border last:border-b-0">
                      <SheetClose asChild>
                        <a
                          href={link.href}
                          className="block py-4 text-base font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {link.label}
                        </a>
                      </SheetClose>
                    </li>
                  ))}
                </ul>
              </nav>
              <SheetFooter>
                <Button asChild variant="ghost">
                  <a href="#">Sign in</a>
                </Button>
                <Button asChild>
                  <a href="#">Start free</a>
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="mx-auto flex min-h-[28rem] w-full max-w-6xl items-end px-6 pb-10 md:px-10">
        <p className="text-sm text-muted-foreground">Hover Product, Solutions or Resources to open a menu.</p>
      </main>
    </div>
  );
};

export default Header03;
