'use client';

import * as React from 'react';
import {
  Activity,
  AppWindow,
  ArrowLeft,
  BarChart3,
  BookOpen,
  ChevronRight,
  CreditCard,
  GitBranch,
  Globe,
  KeyRound,
  LayoutDashboard,
  Rocket,
  ScrollText,
  Server,
  Settings,
  Users,
  type LucideIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/registry/hirael/bases/radix/ui/breadcrumb';
import { useDirection } from '@/registry/hirael/bases/radix/ui/direction';
import { Separator } from '@/registry/hirael/bases/radix/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@/registry/hirael/bases/radix/ui/sidebar';

interface NavGroup {
  label?: string;
  items: readonly NavNode[];
}

/** A sidebar entry. One with `groups` replaces the whole list instead of opening a page. */
interface NavNode {
  id: string;
  label: string;
  icon: LucideIcon;
  groups?: readonly NavGroup[];
}

type Direction = 'none' | 'forward' | 'back';

const WORKSPACE = 'Hirael';

interface BrandMarkProps {
  className?: string;
}

const BrandMark = ({ className }: BrandMarkProps) => {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M2.3 12h2.4v10.95h6.2V14.6h4.6v8.35h6.2V12h-2.4V1.05h-6.2V9.4H8.5V1.05H2.3Z" />
    </svg>
  );
};

const projectNode = (name: string, label: string, icon: LucideIcon): NavNode => ({
  id: name,
  label,
  icon,
  groups: [
    {
      items: [
        { id: `${name}/overview`, label: 'Overview', icon: LayoutDashboard },
        { id: `${name}/deployments`, label: 'Deployments', icon: Rocket },
        { id: `${name}/logs`, label: 'Logs', icon: ScrollText },
        { id: `${name}/analytics`, label: 'Analytics', icon: BarChart3 },
        {
          id: `${name}/settings`,
          label: 'Settings',
          icon: Settings,
          groups: [
            {
              label: 'Project settings',
              items: [
                { id: `${name}/settings/general`, label: 'General', icon: Settings },
                { id: `${name}/settings/domains`, label: 'Domains', icon: Globe },
                { id: `${name}/settings/environment`, label: 'Environment variables', icon: KeyRound },
                { id: `${name}/settings/git`, label: 'Git', icon: GitBranch },
              ],
            },
          ],
        },
      ],
    },
  ],
});

const ROOT: readonly NavGroup[] = [
  {
    items: [
      { id: 'overview', label: 'Overview', icon: LayoutDashboard },
      { id: 'activity', label: 'Activity', icon: Activity },
      {
        id: 'settings',
        label: 'Settings',
        icon: Settings,
        groups: [
          {
            label: 'Workspace settings',
            items: [
              { id: 'settings/general', label: 'General', icon: Settings },
              { id: 'settings/members', label: 'Members', icon: Users },
              { id: 'settings/billing', label: 'Billing', icon: CreditCard },
            ],
          },
        ],
      },
    ],
  },
  {
    label: 'Projects',
    items: [
      projectNode('website', 'Website', AppWindow),
      projectNode('docs', 'Documentation', BookOpen),
      projectNode('api', 'API', Server),
    ],
  },
];

const itemsOf = (groups: readonly NavGroup[]) => groups.flatMap((group) => group.items);

// tw-animate's from-start/end only read dir on the element itself, so the rtl: variant flips the slide instead.
const SLIDE: Record<Direction, string> = {
  none: '',
  forward:
    'animate-in fade-in slide-in-from-right-8 rtl:slide-in-from-left-8 duration-300 ease-out motion-reduce:animate-none',
  back: 'animate-in fade-in slide-in-from-left-8 rtl:slide-in-from-right-8 duration-300 ease-out motion-reduce:animate-none',
};

const AppShell06 = () => {
  const [stack, setStack] = React.useState<NavNode[]>([]);
  const [activeId, setActiveId] = React.useState('overview');
  const [direction, setDirection] = React.useState<Direction>('none');

  const current = stack.at(-1);
  const groups = current?.groups ?? ROOT;
  const parentLabel = stack.length > 1 ? stack[stack.length - 2].label : WORKSPACE;
  const activeLabel = itemsOf(groups).find((item) => item.id === activeId)?.label ?? '';

  const handleOpen = (node: NavNode) => {
    if (!node.groups) {
      setActiveId(node.id);

      return;
    }
    setDirection('forward');
    setStack([...stack, node]);
    setActiveId(itemsOf(node.groups).find((item) => !item.groups)?.id ?? '');
  };

  // Going back lands on the entry you drilled out of, so the list you return to shows where you were.
  const handleBack = (depth: number) => {
    const leaving = stack[depth];
    if (!leaving) return;
    setDirection('back');
    setStack(stack.slice(0, depth));
    setActiveId(leaving.id);
  };

  // Sidebar's `side` is physical, so an RTL page pins it to the right.
  const sidebarSide = useDirection() === 'rtl' ? 'right' : 'left';

  return (
    <SidebarProvider>
      <Sidebar side={sidebarSide} variant="inset" collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" tooltip={WORKSPACE} onClick={() => handleBack(0)}>
                <span className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-sm text-sidebar-foreground">
                  <BrandMark className="size-5" />
                </span>
                <span className="grid min-w-0 flex-1 text-start leading-tight">
                  <span className="truncate font-semibold">{WORKSPACE}</span>
                  <span className="truncate text-xs text-sidebar-foreground/70">Workspace</span>
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent className="overflow-x-hidden">
          {/* Keyed by the open path so each list mounts fresh and plays its slide instead of updating in place. */}
          <div key={current?.id ?? 'root'} data-slot="app-shell-nav" className={cn('flex flex-col', SLIDE[direction])}>
            {current && (
              <SidebarGroup>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip={`Back to ${parentLabel}`} onClick={() => handleBack(stack.length - 1)}>
                      <ArrowLeft className="rtl:rotate-180" />
                      <span className="truncate">{parentLabel}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            )}
            {groups.map((group, index) => (
              <SidebarGroup key={group.label ?? index}>
                {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          isActive={item.id === activeId}
                          aria-current={item.id === activeId ? 'page' : undefined}
                          tooltip={item.label}
                          onClick={() => handleOpen(item)}
                        >
                          <item.icon />
                          <span className="truncate">{item.label}</span>
                          {item.groups && <ChevronRight className="ms-auto rtl:rotate-180" />}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </div>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>

      <SidebarInset className="min-w-0">
        <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger className="-ms-1" />
          <Separator orientation="vertical" className="mx-1 data-[orientation=vertical]:h-5" />
          <Breadcrumb className="min-w-0">
            <BreadcrumbList className="flex-nowrap">
              <BreadcrumbItem className="hidden sm:inline-flex">
                <BreadcrumbLink
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    handleBack(0);
                  }}
                >
                  {WORKSPACE}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {stack.map((node, depth) => (
                <React.Fragment key={node.id}>
                  <BreadcrumbSeparator className="hidden sm:block" />
                  <BreadcrumbItem className="hidden sm:inline-flex">
                    <BreadcrumbLink
                      href="#"
                      onClick={(event) => {
                        event.preventDefault();
                        handleBack(depth + 1);
                      }}
                    >
                      {node.label}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
              <BreadcrumbSeparator className="hidden sm:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{activeLabel}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main data-slot="app-shell-main" className="flex min-w-0 flex-1 flex-col gap-4 p-4 sm:p-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">{activeLabel}</h1>
            <p className="text-sm text-muted-foreground">Items with an arrow open their own list in the sidebar.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="min-h-64 flex-1 rounded-xl bg-muted/50" />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppShell06;
