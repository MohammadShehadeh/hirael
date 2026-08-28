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

const SLOTS = [
  { label: 'slot · 01', className: 'min-h-28' },
  { label: 'slot · 02', className: 'min-h-28' },
  { label: 'slot · 03', className: 'min-h-28' },
  { label: 'slot · 04', className: 'min-h-28' },
  { label: 'slot · 05', className: 'col-span-2 min-h-56 md:col-span-3' },
  { label: 'slot · 06', className: 'col-span-2 min-h-56 md:col-span-1' },
  { label: 'slot · 07', className: 'col-span-2 min-h-56 md:col-span-1' },
  { label: 'slot · 08', className: 'col-span-2 min-h-56 md:col-span-3' },
] as const;

const BrandMark = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 80 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M16 78 V40 a24 24 0 0 1 48 0 V78" />
      <path d="M40 44 L43.2 52 L51 55 L43.2 58 L40 66 L36.8 58 L29 55 L36.8 52 Z" />
      <path d="M22 86 H58" opacity="0.7" />
      <path d="M28 92 H52" opacity="0.45" />
      <path d="M34 96 H46" opacity="0.25" />
    </svg>
  );
};

const Slot = ({ label, className }: { label: string; className?: string }) => {
  return (
    <div
      aria-hidden
      className={cn(
        'flex items-center justify-center rounded-md border border-dashed border-border/80 bg-muted/30',
        className,
      )}
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{label}</span>
    </div>
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
                    <span className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-md bg-sidebar-foreground text-sidebar">
                      <BrandMark className="size-5" />
                    </span>
                    <div className="grid min-w-0 flex-1 text-start leading-tight">
                      <span className="truncate text-sm font-semibold tracking-[-0.01em]">{activeWorkspace.name}</span>
                      <span className="truncate font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
                        {activeWorkspace.tier}
                      </span>
                    </div>
                    <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    Workspaces
                  </DropdownMenuLabel>
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
          <span className="px-2 pb-1 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground group-data-[collapsible=icon]:hidden">
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
            <Button variant="ghost" size="icon" className="relative size-8" aria-label="Notifications · 3 unread">
              <Bell className="size-4" aria-hidden />
              <Badge
                aria-hidden
                className="absolute -end-1 -top-1 size-4 justify-center rounded-full p-0 font-mono text-[10px] tabular-nums"
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
                  className="size-8 rounded-full font-mono text-[11px] font-medium"
                >
                  MS
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <span className="block text-sm font-medium">Maya Renner</span>
                  <span className="block truncate text-xs text-muted-foreground">maya@plinth.dev</span>
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

        <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
          <div className="flex flex-col gap-1">
            <h1 className="font-serif text-2xl font-medium tracking-tight sm:text-3xl">Good morning, Maya.</h1>
            <p className="text-sm text-muted-foreground">Your workspace is ready. Drop content into the slots below.</p>
          </div>

          <div className="grid flex-1 grid-cols-2 gap-4 md:grid-cols-4">
            {SLOTS.map((slot) => (
              <Slot key={slot.label} label={slot.label} className={slot.className} />
            ))}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppShell04;
