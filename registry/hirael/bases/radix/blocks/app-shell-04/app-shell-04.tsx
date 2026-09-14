'use client';

import * as React from 'react';
import {
  Bell,
  CalendarRange,
  Check,
  ChartNoAxesColumn,
  ChevronsUpDown,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Megaphone,
  Plug,
  Search,
  Settings,
  Users,
  type LucideIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/radix/ui/badge';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/registry/hirael/bases/radix/ui/dropdown-menu';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/registry/hirael/bases/radix/ui/input-group';
import { KbdDisplay, KbdGroup } from '@/registry/hirael/bases/radix/components/kbd';
import { Separator } from '@/registry/hirael/bases/radix/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@/registry/hirael/bases/radix/ui/sidebar';

interface NavItem {
  icon: LucideIcon;
  label: string;
}

const NAV: readonly NavItem[] = [
  { icon: LayoutDashboard, label: 'Overview' },
  { icon: CalendarRange, label: 'Planner' },
  { icon: Megaphone, label: 'Campaigns' },
  { icon: ChartNoAxesColumn, label: 'Reports' },
  { icon: Users, label: 'Audience' },
  { icon: Plug, label: 'Connections' },
];

const FOOTER_NAV: readonly NavItem[] = [
  { icon: LifeBuoy, label: 'Support' },
  { icon: Settings, label: 'Settings' },
];

interface Workspace {
  name: string;
  tier: string;
}

const WORKSPACES: readonly Workspace[] = [
  { name: 'Plinth Labs', tier: 'Pro workspace' },
  { name: 'Northbeam', tier: 'Team workspace' },
  { name: 'Personal', tier: 'Free workspace' },
];

const ENTER =
  'animate-in fade-in slide-in-from-bottom-2 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
const SWAP =
  'animate-in fade-in slide-in-from-bottom-1 duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 50): React.CSSProperties => ({ animationDelay: `${index * step}ms` });

const STATS = [
  { label: 'Live campaigns', value: '6', note: '2 end this month' },
  { label: 'Due this week', value: '4', note: '1 waiting on copy' },
  { label: 'Budget spent', value: '$18.4k', note: 'of $32k for Q3' },
  { label: 'In review', value: '3', note: 'Oldest opened Monday' },
] as const;

interface BoardCard {
  title: string;
  channel: string;
  owner: string;
  due: string;
}

const BOARD: readonly { stage: string; cards: readonly BoardCard[] }[] = [
  {
    stage: 'Planned',
    cards: [
      { title: 'Autumn price change email', channel: 'Email', owner: 'JP', due: 'Sep 29' },
      { title: 'Partner webinar landing page', channel: 'Web', owner: 'RK', due: 'Oct 3' },
    ],
  },
  {
    stage: 'In progress',
    cards: [
      { title: 'Onboarding drip, week 2', channel: 'Email', owner: 'MS', due: 'Sep 18' },
      { title: 'Retargeting ads for trial users', channel: 'Paid', owner: 'AL', due: 'Sep 20' },
      { title: 'Case study: Northbeam rollout', channel: 'Blog', owner: 'JP', due: 'Sep 22' },
    ],
  },
  {
    stage: 'Review',
    cards: [
      { title: 'September product update', channel: 'Email', owner: 'MS', due: 'Sep 16' },
      { title: 'Pricing page headline test', channel: 'Web', owner: 'RK', due: 'Sep 17' },
    ],
  },
  {
    stage: 'Shipped',
    cards: [{ title: 'Back to school discount', channel: 'Paid', owner: 'AL', due: 'Sep 9' }],
  },
];

const PAGE_SUMMARY: Record<string, string> = {
  Planner: 'Nothing scheduled past October yet. Drafts from the board show up here once they have a date.',
  Campaigns: 'Six campaigns are live. Open one from the board to see its channels and spend.',
  Reports: 'The weekly report runs every Monday at 08:00 and lands in your inbox.',
  Audience: '12,480 contacts across four segments. The trial segment grew by 312 this week.',
  Connections: 'Mailer, ads account and analytics are connected. The CRM sync last ran 20 minutes ago.',
};

const BrandMark = ({ className }: { className?: string }) => {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M2.3 12h2.4v10.95h6.2V14.6h4.6v8.35h6.2V12h-2.4V1.05h-6.2V9.4H8.5V1.05H2.3Z" />
    </svg>
  );
};

const BoardOverview = () => {
  return (
    <>
      <dl data-slot="app-shell-stats" className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border xl:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1 bg-background p-4">
            <dt className="text-xs uppercase text-muted-foreground">{stat.label}</dt>
            <dd className="text-2xl font-semibold tabular-nums tracking-tight">{stat.value}</dd>
            <dd className="text-xs text-muted-foreground">{stat.note}</dd>
          </div>
        ))}
      </dl>

      <section data-slot="app-shell-board" aria-labelledby="app-shell-04-board" className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between gap-3">
          <h2 id="app-shell-04-board" className="text-sm font-medium">
            Campaign board
          </h2>
          <span className="text-xs text-muted-foreground">Q3, all channels</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {BOARD.map((column, index) => (
            <div
              key={column.stage}
              data-slot="app-shell-board-column"
              style={stagger(index + 1)}
              className={cn(ENTER, 'flex flex-col rounded-lg border border-border')}
            >
              <div className="flex items-center justify-between border-b border-border px-3 py-2">
                <h3 className="text-xs uppercase text-muted-foreground">{column.stage}</h3>
                <span className="text-xs tabular-nums text-muted-foreground">{column.cards.length}</span>
              </div>
              <ul className="flex flex-col">
                {column.cards.map((card) => (
                  <li
                    key={card.title}
                    className="flex flex-col gap-2 border-b border-border px-3 py-3 last:border-b-0 transition-colors hover:bg-muted/40"
                  >
                    <span className="text-sm font-medium text-pretty">{card.title}</span>
                    <span className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{card.channel}</span>
                      <span className="text-border">|</span>
                      <span className="tabular-nums">Due {card.due}</span>
                      <span
                        aria-label={`Owner ${card.owner}`}
                        className="ms-auto grid size-6 place-items-center rounded-full bg-muted text-[11px] font-medium text-foreground"
                      >
                        {card.owner}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

const AppShell04 = () => {
  const [workspace, setWorkspace] = React.useState(WORKSPACES[0].name);
  const [active, setActive] = React.useState(NAV[0].label);
  const [query, setQuery] = React.useState('');
  const searchRef = React.useRef<HTMLInputElement>(null);

  // The ⌘K hint next to the field has to focus something, or it is a sticker.
  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isSearchShortcut = event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey);
      if (!isSearchShortcut) return;
      event.preventDefault();
      searchRef.current?.focus();
      searchRef.current?.select();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const normalized = query.trim().toLowerCase();
  const visibleNav = normalized ? NAV.filter((item) => item.label.toLowerCase().includes(normalized)) : NAV;

  const activeWorkspace = WORKSPACES.find((w) => w.name === workspace) ?? WORKSPACES[0];

  return (
    <SidebarProvider>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    tooltip={activeWorkspace.name}
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <span className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-sm text-sidebar-foreground">
                      <BrandMark className="size-5" />
                    </span>
                    <div className="grid min-w-0 flex-1 text-start leading-tight">
                      <span className="truncate text-sm font-semibold tracking-[-0.01em]">{activeWorkspace.name}</span>
                      <span className="truncate text-xs uppercase text-muted-foreground">{activeWorkspace.tier}</span>
                    </div>
                    <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel className="text-xs uppercase text-muted-foreground">Workspaces</DropdownMenuLabel>
                  {WORKSPACES.map((w) => (
                    <DropdownMenuItem key={w.name} onSelect={() => setWorkspace(w.name)}>
                      <span className="flex-1">{w.name}</span>
                      {w.name === activeWorkspace.name && <Check className="size-4" aria-label="Current" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>

          <InputGroup className="h-8 group-data-[collapsible=icon]:hidden">
            <InputGroupAddon align="inline-start">
              <Search className="size-3.5" aria-hidden />
            </InputGroupAddon>
            <InputGroupInput
              ref={searchRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key !== 'Escape') return;
                if (query) {
                  e.preventDefault();
                  setQuery('');
                  return;
                }
                e.currentTarget.blur();
              }}
              placeholder="Filter nav…"
              aria-label="Filter navigation"
              aria-keyshortcuts="Meta+K Control+K"
              className="text-sm"
            />
            <InputGroupAddon dir="ltr" align="inline-end">
              <KbdGroup>
                <KbdDisplay>⌘</KbdDisplay>
                <KbdDisplay>K</KbdDisplay>
              </KbdGroup>
            </InputGroupAddon>
          </InputGroup>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {visibleNav.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      isActive={item.label === active}
                      tooltip={item.label}
                      onClick={() => setActive(item.label)}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
              {visibleNav.length === 0 && (
                <p className="px-2 py-3 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
                  Nothing matches “{query.trim()}”.
                </p>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            {FOOTER_NAV.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton asChild tooltip={item.label} className="h-7">
                  <a href="#">
                    <item.icon />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          <span className="px-2 pb-1 text-xs uppercase text-muted-foreground group-data-[collapsible=icon]:hidden">
            © {activeWorkspace.name}
          </span>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <SidebarInset className="min-h-[640px]">
        <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border px-4">
          <div className="flex min-w-0 items-center gap-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4" />
            <span className="truncate text-sm font-medium tracking-[-0.01em]">{active}</span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="ghost" size="icon" className="relative size-8" aria-label="Notifications, 3 unread">
              <Bell className="size-4" aria-hidden />
              <Badge
                aria-hidden
                className="absolute -end-1 -top-1 size-4 justify-center rounded-full p-0 text-[10px] tabular-nums"
              >
                3
              </Badge>
            </Button>
            <Separator orientation="vertical" className="h-4" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Account menu"
                  className="size-8 rounded-full text-[11px] font-medium"
                >
                  MS
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <span className="block text-sm font-medium">Maya Renner</span>
                  <span className="block truncate text-xs text-muted-foreground">maya@hirael.com</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings />
                  Preferences
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LifeBuoy />
                  Support
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <LogOut />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div data-slot="app-shell-main" className={cn(ENTER, 'flex flex-1 flex-col p-4 sm:p-6')}>
          {active === NAV[0].label ? (
            <div key={active} className={cn(SWAP, 'flex flex-col gap-6')}>
              <div className="flex flex-col gap-1">
                <h1 className="font-serif text-2xl font-medium tracking-tight sm:text-3xl">Good morning, Maya.</h1>
                <p className="text-sm text-muted-foreground">
                  Two campaigns are due before Wednesday and three drafts are waiting for review.
                </p>
              </div>
              <BoardOverview />
            </div>
          ) : (
            <div key={active} className={cn(SWAP, 'flex max-w-xl flex-col gap-1')}>
              <h1 className="font-serif text-2xl font-medium tracking-tight sm:text-3xl">{active}</h1>
              <p className="text-sm text-muted-foreground">{PAGE_SUMMARY[active]}</p>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppShell04;
