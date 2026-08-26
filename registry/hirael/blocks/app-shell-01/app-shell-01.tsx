"use client";

import * as React from "react";
import {
  ArrowDown,
  ArrowUp,
  Bell,
  ChevronRight,
  ChevronsUpDown,
  Command,
  Compass,
  CreditCard,
  Inbox,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/registry/hirael/ui/badge";
import { Button } from "@/registry/hirael/ui/button";
import { Card } from "@/registry/hirael/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/hirael/ui/dropdown-menu";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/hirael/ui/empty";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/hirael/ui/input-group";
import { KbdDisplay } from "@/registry/hirael/components/kbd";
import { Separator } from "@/registry/hirael/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/hirael/ui/table";
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
  SidebarSeparator,
  SidebarTrigger,
} from "@/registry/hirael/ui/sidebar";

interface NavLink {
  label: string;
  icon: LucideIcon;
  href: string;
  active?: boolean;
  badge?: string;}

const PRIMARY: readonly NavLink[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "#", active: true },
  { label: "Inbox", icon: Inbox, href: "#", badge: "3" },
  { label: "Customers", icon: Users, href: "#" },
  { label: "Billing", icon: CreditCard, href: "#" },
  { label: "Explore", icon: Compass, href: "#" },
];

const SECONDARY: readonly NavLink[] = [
  { label: "Settings", icon: Settings, href: "#" },
  { label: "Support", icon: LifeBuoy, href: "#" },
];

type Plan = "Hobby" | "Pro" | "Team";
type Status = "Active" | "Trial" | "Past due";

interface Account {
  name: string;
  plan: Plan;
  /** Whole dollars, so the column can be sorted and formatted in one place. */
  mrr: number;
  status: Status;
  initials: string;}

const ROWS: readonly Account[] = [
  {
    name: "Plinth Labs",
    plan: "Pro",
    mrr: 2480,
    status: "Active",
    initials: "PL",
  },
  { name: "Helix", plan: "Team", mrr: 6120, status: "Active", initials: "HX" },
  { name: "Brella", plan: "Hobby", mrr: 0, status: "Trial", initials: "BR" },
  {
    name: "Verbit",
    plan: "Pro",
    mrr: 1860,
    status: "Past due",
    initials: "VB",
  },
  {
    name: "Mercado",
    plan: "Team",
    mrr: 5400,
    status: "Active",
    initials: "MC",
  },
];

/**
 * Sort order for the two columns that aren't alphabetical or numeric: smallest
 * plan and calmest status first, so ascending reads as "least urgent" in both.
 */
const PLAN_RANK: Record<Plan, number> = { Hobby: 0, Pro: 1, Team: 2 };
const STATUS_RANK: Record<Status, number> = {
  Active: 0,
  Trial: 1,
  "Past due": 2,
};

const STATUS_TONE: Record<Status, { dot: string; text: string }> = {
  Active: { dot: "bg-success", text: "text-success" },
  Trial: { dot: "bg-warning", text: "text-warning" },
  "Past due": { dot: "bg-destructive", text: "text-destructive" },
};

interface Metric {
  label: string;
  value: string;
  /** Change against the previous period; the sign carries the direction. */
  delta: number;
  unit: "%" | "pt";
  /** Which direction counts as an improvement for this metric. */
  goodWhen: "up" | "down";}

const METRICS: readonly Metric[] = [
  { label: "Customers", value: "1,284", delta: 4.1, unit: "%", goodWhen: "up" },
  { label: "MRR", value: "$48.2k", delta: 8.7, unit: "%", goodWhen: "up" },
  { label: "Churn", value: "1.8%", delta: -0.4, unit: "%", goodWhen: "down" },
  { label: "NPS", value: "62", delta: 2, unit: "pt", goodWhen: "up" },
];

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

type SortKey = "name" | "plan" | "mrr" | "status";
type SortDirection = "asc" | "desc";

const COLUMNS: readonly {
  key: SortKey;
  label: string;
  align: "start" | "end";
  hideBelowSm?: boolean;
}[] = [
  { key: "name", label: "Account", align: "start" },
  { key: "plan", label: "Plan", align: "start" },
  { key: "mrr", label: "MRR", align: "end", hideBelowSm: true },
  { key: "status", label: "Status", align: "start" },
];

const compareBy = (a: Account, b: Account, key: SortKey) => {
  if (key === "mrr") return a.mrr - b.mrr;
  if (key === "plan") return PLAN_RANK[a.plan] - PLAN_RANK[b.plan];
  if (key === "status") return STATUS_RANK[a.status] - STATUS_RANK[b.status];
  return a.name.localeCompare(b.name);
};

/** Signed delta, e.g. `+8.7%` or `−0.4%`. */
const formatDelta = ({ delta, unit }: Pick<Metric, "delta" | "unit">) => {
  const sign = delta > 0 ? "+" : delta < 0 ? "−" : "";
  return `${sign}${Math.abs(delta)}${unit}`;
};

/** A falling number is an improvement for churn, so tone follows intent. */
const deltaTone = ({ delta, goodWhen }: Pick<Metric, "delta" | "goodWhen">) => {
  if (delta === 0) return "text-muted-foreground";
  const improving = delta > 0 === (goodWhen === "up");
  return improving ? "text-success" : "text-destructive";
};

const deltaLabel = ({ label, delta, unit }: Metric) => {
  const direction = delta > 0 ? "up" : delta < 0 ? "down" : "unchanged";
  const measure = unit === "%" ? "percent" : "points";
  return `${label} ${direction} ${Math.abs(delta)} ${measure} against the previous 30 days`;
};

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

const AppShell01 = () => {
  const [query, setQuery] = React.useState("");
  const [sortKey, setSortKey] = React.useState<SortKey>("mrr");
  const [sortDirection, setSortDirection] =
    React.useState<SortDirection>("desc");
  const searchRef = React.useRef<HTMLInputElement>(null);

  // The ⌘K hint in the header has to do something, or it is decoration.
  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isSearchShortcut =
        event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey);
      if (!isSearchShortcut) return;
      event.preventDefault();
      searchRef.current?.focus();
      searchRef.current?.select();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const visibleRows = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const matches = q
      ? ROWS.filter(
          (r) =>
            r.name.toLowerCase().includes(q) ||
            r.plan.toLowerCase().includes(q) ||
            r.status.toLowerCase().includes(q),
        )
      : ROWS;
    const sorted = [...matches].sort((a, b) => compareBy(a, b, sortKey));
    return sortDirection === "asc" ? sorted : sorted.reverse();
  }, [query, sortKey, sortDirection]);

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    // Names read best A to Z; money and severity read best worst-first.
    setSortDirection(key === "name" ? "asc" : "desc");
  };

  const sortedColumnLabel = COLUMNS.find((c) => c.key === sortKey)?.label;

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
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
                    plinth labs · pro
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent className="overflow-hidden">
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {PRIMARY.map((item) => (
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
                        <item.icon />
                        <span>{item.label}</span>
                      </a>
                    </SidebarMenuButton>
                    {item.badge && (
                      <SidebarMenuBadge>
                        {item.badge}
                        <span className="sr-only"> unread</span>
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup>
            <SidebarGroupLabel>Account</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {SECONDARY.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild tooltip={item.label}>
                      <a href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </a>
                    </SidebarMenuButton>
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
                    tooltip="Mohammad Shehadeh"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <span className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-md bg-sidebar-primary font-mono text-[10px] font-medium text-sidebar-primary-foreground">
                      MS
                    </span>
                    <div className="grid min-w-0 flex-1 text-start leading-tight">
                      <span className="truncate text-xs font-medium">
                        Mohammad Shehadeh
                      </span>
                      <span className="truncate font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                        admin · plinth labs
                      </span>
                    </div>
                    <ChevronsUpDown className="ms-auto size-3.5 shrink-0 text-muted-foreground" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  align="start"
                  sideOffset={8}
                  className="w-56"
                >
                  <DropdownMenuLabel className="font-normal">
                    <span className="block text-sm font-medium">
                      Mohammad Shehadeh
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      mohammad@plinth.dev
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings />
                    Account settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive">
                    <LogOut />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <SidebarInset className="min-w-0">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b border-border bg-background/80 px-3 backdrop-blur sm:px-4">
          <SidebarTrigger className="-ms-1" />
          <Separator
            orientation="vertical"
            className="mx-1 hidden h-5 sm:block"
          />
          <nav
            aria-label="Breadcrumb"
            className="hidden items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground sm:flex"
          >
            <span>Workspace</span>
            <ChevronRight className="size-3 rtl:rotate-180" aria-hidden />
            <span className="text-foreground">Dashboard</span>
          </nav>

          <InputGroup className="ms-auto h-8 max-w-xs">
            <InputGroupAddon align="inline-start">
              <Search className="size-3.5" aria-hidden />
            </InputGroupAddon>
            <InputGroupInput
              ref={searchRef}
              type="search"
              placeholder="Search accounts…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key !== "Escape") return;
                // First Escape clears, a second one gives focus back.
                if (query) {
                  e.preventDefault();
                  setQuery("");
                  return;
                }
                e.currentTarget.blur();
              }}
              aria-label="Search accounts"
              aria-keyshortcuts="Meta+K Control+K"
            />
            <InputGroupAddon
              dir="ltr"
              align="inline-end"
              className="hidden sm:flex"
            >
              <KbdDisplay>
                <Command className="size-3" aria-hidden />
              </KbdDisplay>
              <KbdDisplay>K</KbdDisplay>
            </InputGroupAddon>
          </InputGroup>

          <Button
            variant="outline"
            size="icon"
            aria-label="Notifications · 3 unread"
            className="relative size-8"
          >
            <Bell className="size-3.5" aria-hidden />
            <span
              aria-hidden
              className="absolute end-1.5 top-1.5 size-1.5 rounded-full bg-foreground"
            />
          </Button>
          <Button size="sm" className="hidden sm:inline-flex">
            <Plus className="size-3" aria-hidden />
            New customer
          </Button>
          <Button
            size="icon"
            className="size-8 sm:hidden"
            aria-label="New customer"
          >
            <Plus className="size-3.5" aria-hidden />
          </Button>
        </header>

        <div className="flex flex-1 flex-col gap-5 p-4 sm:p-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-[-0.02em]">
              Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              An overview of customers, revenue, and recent activity. Changes
              compare against the previous 30 days.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {METRICS.map((m) => (
              <Card key={m.label} className="gap-1 p-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  {m.label}
                </span>
                <span className="text-lg font-semibold tabular-nums">
                  {m.value}
                </span>
                <span
                  dir="ltr"
                  aria-label={deltaLabel(m)}
                  className={cn(
                    "font-mono text-[10px] tabular-nums",
                    deltaTone(m),
                  )}
                >
                  {formatDelta(m)}
                </span>
              </Card>
            ))}
          </div>

          <Card className="gap-0 overflow-hidden p-0">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <span
                aria-live="polite"
                className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
              >
                recent accounts
                {query.trim() && (
                  <span className="ms-2 text-foreground">
                    ({visibleRows.length} of {ROWS.length})
                  </span>
                )}
              </span>
              <Button variant="link" size="sm" className="h-auto p-0" asChild>
                <a href="#">View all</a>
              </Button>
            </div>

            {visibleRows.length === 0 ? (
              <Empty className="border-0">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Search />
                  </EmptyMedia>
                  <EmptyTitle>No matching accounts</EmptyTitle>
                  <EmptyDescription>
                    Nothing matched{" "}
                    <span className="font-mono text-foreground">
                      &ldquo;{query.trim()}&rdquo;
                    </span>
                    . Try a company name, a plan, or a status.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setQuery("");
                      searchRef.current?.focus();
                    }}
                  >
                    Clear search
                  </Button>
                </EmptyContent>
              </Empty>
            ) : (
              <Table className="w-full">
                <caption className="sr-only">
                  Recent accounts, sorted by {sortedColumnLabel}{" "}
                  {sortDirection === "asc" ? "ascending" : "descending"}.
                </caption>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    {COLUMNS.map((column) => {
                      const isSorted = column.key === sortKey;
                      return (
                        <TableHead
                          key={column.key}
                          aria-sort={
                            isSorted
                              ? sortDirection === "asc"
                                ? "ascending"
                                : "descending"
                              : "none"
                          }
                          className={cn(
                            "h-auto p-0 font-normal",
                            column.hideBelowSm && "hidden sm:table-cell",
                          )}
                        >
                          <button
                            type="button"
                            onClick={() => toggleSort(column.key)}
                            className={cn(
                              "flex w-full items-center gap-1 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset focus-visible:outline-none",
                              column.align === "end" && "justify-end",
                              isSorted
                                ? "text-foreground"
                                : "text-muted-foreground",
                            )}
                          >
                            {column.label}
                            {isSorted ? (
                              sortDirection === "asc" ? (
                                <ArrowUp className="size-3" aria-hidden />
                              ) : (
                                <ArrowDown className="size-3" aria-hidden />
                              )
                            ) : (
                              <ChevronsUpDown
                                className="size-3 opacity-40"
                                aria-hidden
                              />
                            )}
                          </button>
                        </TableHead>
                      );
                    })}
                    <TableHead className="h-auto px-4 py-2 text-end font-normal">
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleRows.map((r) => {
                    const tone = STATUS_TONE[r.status];
                    return (
                      <TableRow
                        key={r.name}
                        className="text-sm hover:bg-accent/30"
                      >
                        <TableCell className="px-4 py-2.5">
                          <span className="inline-flex items-center gap-2">
                            <span
                              aria-hidden
                              className="inline-flex size-6 items-center justify-center rounded-full bg-muted font-mono text-[10px] font-medium text-foreground"
                            >
                              {r.initials}
                            </span>
                            <span className="font-medium">{r.name}</span>
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-2.5">
                          <Badge
                            variant={r.plan === "Hobby" ? "outline" : "default"}
                            className="font-mono"
                          >
                            {r.plan}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden px-4 py-2.5 text-end font-mono tabular-nums text-foreground sm:table-cell">
                          {usd.format(r.mrr)}
                        </TableCell>
                        <TableCell className="px-4 py-2.5">
                          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em]">
                            <span
                              aria-hidden
                              className={cn("size-1.5 rounded-full", tone.dot)}
                            />
                            <span className={tone.text}>{r.status}</span>
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-2.5 text-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-7"
                                aria-label={`Actions for ${r.name}`}
                              >
                                <MoreHorizontal
                                  className="size-3.5"
                                  aria-hidden
                                />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuItem>View account</DropdownMenuItem>
                              <DropdownMenuItem>Manage billing</DropdownMenuItem>
                              <DropdownMenuItem>Invite teammate</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem variant="destructive">
                                Remove account
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppShell01;
