'use client';

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
} from '@/registry/hirael/bases/base/ui/accordion';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/registry/hirael/bases/base/ui/navigation-menu';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/registry/hirael/bases/base/ui/sheet';

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

const CONTENT_MOTION = cn(
  'duration-250 data-ending-style:duration-150',
  'data-[activation-direction=left]:data-ending-style:translate-x-6 data-[activation-direction=left]:data-starting-style:-translate-x-6',
  'data-[activation-direction=right]:data-ending-style:-translate-x-6 data-[activation-direction=right]:data-starting-style:translate-x-6',
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
        'rounded-sm text-base font-semibold tracking-[-0.03em] text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
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
      className="flex flex-col gap-2 border-t border-border bg-muted/30 p-5 md:border-s md:border-t-0"
    >
      <span className="text-xs text-muted-foreground uppercase">{feature.label}</span>
      <p className="text-sm font-medium text-foreground">{feature.title}</p>
      <p className="text-sm leading-relaxed text-muted-foreground">{feature.body}</p>
      <time dateTime={feature.dateTime} className="text-xs text-muted-foreground tabular-nums">
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

          <NavigationMenu className="hidden max-w-none flex-none md:flex">
            <NavigationMenuList>
              {GROUPS.map((group) => (
                <NavigationMenuItem key={group.value} value={group.value}>
                  <NavigationMenuTrigger className={TRIGGER}>{group.label}</NavigationMenuTrigger>
                  <NavigationMenuContent className={cn(CONTENT_MOTION, 'md:w-[min(52rem,calc(100vw-3rem))]')}>
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
            <Button render={<a href="#" />} nativeButton={false} variant="ghost" size="sm">
              Sign in
            </Button>
            <Button render={<a href="#" />} nativeButton={false} size="sm">
              Start free
            </Button>
          </div>

          <Sheet>
            <SheetTrigger
              render={<Button variant="ghost" size="icon" aria-label="Open menu" className="ms-auto md:hidden" />}
            >
              <Menu aria-hidden className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-sm">
              <SheetHeader className="h-14 justify-center">
                <SheetTitle className="text-start">
                  <Wordmark />
                </SheetTitle>
              </SheetHeader>
              <nav data-slot="header-mobile-menu" className="flex-1 overflow-y-auto px-6">
                <Accordion>
                  {GROUPS.map((group) => (
                    <AccordionItem key={group.value} value={group.value}>
                      <AccordionTrigger>{group.label}</AccordionTrigger>
                      <AccordionContent>
                        <ul className="flex flex-col">
                          {group.links.map((link) => {
                            const Icon = link.icon;

                            return (
                              <li key={link.title}>
                                <SheetClose
                                  nativeButton={false}
                                  render={
                                    <a
                                      href={link.href}
                                      className="-mx-2 flex items-start gap-3 rounded-md px-2 py-2.5 transition-colors duration-150 hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                    />
                                  }
                                >
                                  <Icon aria-hidden className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                                  <span className="flex min-w-0 flex-col gap-0.5">
                                    <span className="text-sm font-medium">{link.title}</span>
                                    <span className="text-sm text-muted-foreground">{link.description}</span>
                                  </span>
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
                      <SheetClose
                        nativeButton={false}
                        render={
                          <a
                            href={link.href}
                            className="block py-4 text-base font-medium focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                          />
                        }
                      >
                        {link.label}
                      </SheetClose>
                    </li>
                  ))}
                </ul>
              </nav>
              <SheetFooter>
                <Button render={<a href="#" />} nativeButton={false} variant="ghost">
                  Sign in
                </Button>
                <Button render={<a href="#" />} nativeButton={false}>
                  Start free
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
