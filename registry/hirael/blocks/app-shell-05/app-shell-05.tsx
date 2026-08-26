"use client";

import * as React from "react";
import {
  Activity,
  ChevronsUpDown,
  FolderGit2,
  LayoutDashboard,
  LogOut,
  Package,
  PencilRuler,
  Settings2,
  type LucideIcon,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/registry/hirael/ui/avatar";
import { Badge } from "@/registry/hirael/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/registry/hirael/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/hirael/ui/dropdown-menu";
import { Separator } from "@/registry/hirael/ui/separator";
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
} from "@/registry/hirael/ui/sidebar";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  active?: boolean;
  badge?: string;}

const WORKSPACE: readonly NavItem[] = [
  { label: "Overview", href: "#", icon: LayoutDashboard, active: true },
  { label: "Projects", href: "#", icon: FolderGit2 },
  { label: "Activity", href: "#", icon: Activity },
];

const TOOLS: readonly NavItem[] = [
  { label: "Editor", href: "#", icon: PencilRuler, badge: "Beta" },
  { label: "Marketplace", href: "#", icon: Package },
];

const USER = {
  name: "Lena Ortiz",
  email: "lena@example.com",
  initials: "LO",
} as const;

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
              <span className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <BrandMark className="size-5" />
              </span>
              <div className="grid flex-1 text-start leading-tight">
                <span className="truncate text-sm font-semibold tracking-[-0.01em]">
                  Hirael
                </span>
                <span className="truncate font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  workspace
                </span>
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
                  <SidebarMenuButton
                    asChild
                    isActive={item.active}
                    tooltip={item.label}
                  >
                    <a
                      href={item.href}
                      aria-current={item.active ? "page" : undefined}
                    >
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
                      <Badge variant="secondary" className="font-mono">
                        {item.badge}
                      </Badge>
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
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="size-8 rounded-md">
                    <AvatarFallback className="rounded-md font-mono text-[10px]">
                      {USER.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid min-w-0 flex-1 text-start text-sm leading-tight">
                    <span className="truncate font-medium">{USER.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {USER.email}
                    </span>
                  </div>
                  <ChevronsUpDown className="ms-auto size-4 shrink-0" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="start"
                sideOffset={4}
                className="w-56"
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium">{USER.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {USER.email}
                    </span>
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
                <DropdownMenuItem className="text-destructive focus:text-destructive">
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
          <Separator orientation="vertical" className="mx-1 h-5" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Workspace</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Overview</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="min-w-0 flex-1 overflow-x-hidden p-4 sm:p-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-[-0.02em]">
              Overview
            </h1>
            <p className="text-sm text-muted-foreground">
              A sidebar shell with collapsible nav, a sticky header, and an
              account menu. Drop your pages into the inset.
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              { label: "Projects", value: "12" },
              { label: "Open tasks", value: "34" },
              { label: "This week", value: "8" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-border bg-card p-4"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  {item.label}
                </span>
                <p className="mt-1 text-2xl font-semibold tabular-nums">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            Page content goes here.
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppShell05;
