'use client';

import * as React from 'react';
import {
  Activity,
  ChevronsUpDown,
  FileText,
  FolderGit2,
  LayoutDashboard,
  LogOut,
  Package,
  PencilRuler,
  Settings2,
  type LucideIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/registry/hirael/bases/radix/ui/avatar';
import { Badge } from '@/registry/hirael/bases/radix/ui/badge';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/registry/hirael/bases/radix/ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/registry/hirael/bases/radix/ui/dropdown-menu';
import { Separator } from '@/registry/hirael/bases/radix/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@/registry/hirael/bases/radix/ui/sidebar';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  active?: boolean;
  badge?: string;
}

const ENTER =
  'animate-in fade-in slide-in-from-bottom-2 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
const SWAP =
  'animate-in fade-in slide-in-from-bottom-1 duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const WORKSPACE: readonly NavItem[] = [
  { label: 'Overview', href: '#', icon: LayoutDashboard },
  { label: 'Documents', href: '#', icon: FileText, active: true },
  { label: 'Projects', href: '#', icon: FolderGit2 },
  { label: 'Activity', href: '#', icon: Activity },
];

const TOOLS: readonly NavItem[] = [
  { label: 'Editor', href: '#', icon: PencilRuler, badge: 'Beta' },
  { label: 'Marketplace', href: '#', icon: Package },
];

const USER = {
  name: 'Mohammad Shehadeh',
  email: 'hello@mohammadshehadeh.com',
  initials: 'MS',
} as const;

type DocumentStatus = 'Draft' | 'Shared' | 'Final';

interface WorkspaceDocument {
  title: string;
  folder: string;
  owner: string;
  initials: string;
  updated: string;
  status: DocumentStatus;
}

const DOCUMENTS: readonly WorkspaceDocument[] = [
  {
    title: 'Q4 roadmap',
    folder: 'Planning',
    owner: 'Mohammad Shehadeh',
    initials: 'MS',
    updated: 'Today, 10:12',
    status: 'Draft',
  },
  {
    title: 'Editor beta feedback',
    folder: 'Research',
    owner: 'Sam Achebe',
    initials: 'SA',
    updated: 'Today, 08:40',
    status: 'Shared',
  },
  {
    title: 'Marketplace review guidelines',
    folder: 'Policy',
    owner: 'Priya Nair',
    initials: 'PN',
    updated: 'Yesterday',
    status: 'Final',
  },
  {
    title: 'Onboarding checklist for new hires',
    folder: 'People',
    owner: 'Mohammad Shehadeh',
    initials: 'MS',
    updated: 'Sep 11',
    status: 'Shared',
  },
  {
    title: 'Incident notes: sync outage',
    folder: 'Engineering',
    owner: 'Tom Weller',
    initials: 'TW',
    updated: 'Sep 9',
    status: 'Final',
  },
  {
    title: 'Pricing page copy, second pass',
    folder: 'Marketing',
    owner: 'Sam Achebe',
    initials: 'SA',
    updated: 'Sep 4',
    status: 'Draft',
  },
];

const FILTERS = ['All', 'Draft', 'Shared', 'Final'] as const;
type DocumentFilter = (typeof FILTERS)[number];

const DocumentList = () => {
  const [filter, setFilter] = React.useState<DocumentFilter>('All');
  const visible = filter === 'All' ? DOCUMENTS : DOCUMENTS.filter((doc) => doc.status === filter);

  return (
    <div data-slot="app-shell-documents" className="mt-6 flex flex-col gap-3">
      <div role="group" aria-label="Filter documents by status" className="flex flex-wrap items-center gap-1">
        {FILTERS.map((option) => (
          <Button
            key={option}
            variant={option === filter ? 'secondary' : 'ghost'}
            size="sm"
            aria-pressed={option === filter}
            onClick={() => setFilter(option)}
          >
            {option}
            <span className="text-xs tabular-nums text-muted-foreground">
              {option === 'All' ? DOCUMENTS.length : DOCUMENTS.filter((doc) => doc.status === option).length}
            </span>
          </Button>
        ))}
      </div>

      <ul key={filter} className={cn(SWAP, 'flex flex-col rounded-lg border border-border')}>
        {visible.map((doc) => (
          <li
            key={doc.title}
            className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-b-0 transition-colors hover:bg-muted/40"
          >
            <FileText className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            <div className="flex min-w-0 flex-1 flex-col">
              <a href="#" className="truncate text-sm font-medium hover:underline">
                {doc.title}
              </a>
              <span className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{doc.folder}</span>
                <span className="text-border">|</span>
                <span className="tabular-nums">{doc.updated}</span>
              </span>
            </div>
            <span
              className={cn('hidden text-xs sm:inline', doc.status === 'Draft' ? 'text-warm' : 'text-muted-foreground')}
            >
              {doc.status}
            </span>
            <Avatar className="size-7" aria-label={doc.owner}>
              <AvatarFallback>{doc.initials}</AvatarFallback>
            </Avatar>
          </li>
        ))}
      </ul>
    </div>
  );
};

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

const AppSidebar = () => {
  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="Hirael">
              <span className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-sm text-sidebar-foreground">
                <BrandMark className="size-5" />
              </span>
              <div className="grid flex-1 text-start leading-tight">
                <span className="truncate text-sm font-semibold tracking-[-0.01em]">Hirael</span>
                <span className="truncate text-xs uppercase text-muted-foreground">workspace</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {WORKSPACE.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild isActive={item.active} tooltip={item.label}>
                    <a href={item.href} aria-current={item.active ? 'page' : undefined}>
                      <item.icon className="size-4" />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {TOOLS.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild tooltip={item.label}>
                    <a href={item.href}>
                      <item.icon className="size-4" />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                  {item.badge && (
                    <SidebarMenuBadge>
                      <Badge variant="secondary">{item.badge}</Badge>
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <Avatar>
                    <AvatarFallback>{USER.initials}</AvatarFallback>
                  </Avatar>
                  <div className="grid min-w-0 flex-1 text-start text-sm leading-tight">
                    <span className="truncate font-medium">{USER.name}</span>
                    <span className="truncate text-xs text-muted-foreground">{USER.email}</span>
                  </div>
                  <ChevronsUpDown className="ms-auto size-4 shrink-0" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" sideOffset={4} className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col gap-0.5 font-normal">
                    <span className="text-sm font-medium">{USER.name}</span>
                    <span className="truncate text-xs text-muted-foreground">{USER.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <LayoutDashboard className="size-4" />
                    Overview
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings2 className="size-4" />
                    Settings
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <LogOut className="size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};

const AppShell05 = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-w-0">
        <header className="sticky top-0 z-10 flex h-12 shrink-0 items-center gap-2 border-b border-border bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/60">
          <SidebarTrigger className="-ms-1" />
          <Separator orientation="vertical" className="mx-1 data-[orientation=vertical]:h-5" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Workspace</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Documents</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div data-slot="app-shell-main" className={cn(ENTER, 'min-w-0 flex-1 overflow-x-hidden p-4 sm:p-6')}>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-[-0.02em]">Documents</h1>
            <p className="text-sm text-muted-foreground">
              Everything your workspace has written, newest first. Drafts stay private until you share them.
            </p>
          </div>

          <DocumentList />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppShell05;
