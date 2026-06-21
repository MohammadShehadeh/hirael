"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Boxes,
  ChevronDown,
  Frame,
  LayoutTemplate,
  Search,
  Sparkles,
  X,
} from "lucide-react";

import { LogoTile } from "@/components/showcase/logo";
import { ThemeSheetTrigger } from "@/components/showcase/theme-sheet";
import { SITE } from "@/lib/site";
import {
  CATEGORY_LABELS,
  COMPONENT_CATEGORY_ORDER,
  COMPONENTS,
  REGISTRY_BY_CATEGORY,
  entryHref,
} from "@/registry/hirael/registry-meta";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/registry/hirael/ui/collapsible";
import { Input } from "@/registry/hirael/ui/input";
import { KbdDisplay } from "@/registry/hirael/ui/kbd";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/registry/hirael/ui/sidebar";

// The recurring eyebrow label: mono, tiny, uppercase, tracked, muted — the
// same treatment the "On this page" rail and changelog header use.
const EYEBROW_CLASS =
  "font-mono text-[10px] font-normal uppercase tracking-[0.14em] text-muted-foreground";

const COUNT_CLASS =
  "ms-auto font-mono text-[10px] tabular-nums tracking-normal text-muted-foreground";

export function ShowcaseSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  const componentCount = COMPONENTS.length;
  const blockCount = REGISTRY_BY_CATEGORY.blocks.length;
  const templateCount = REGISTRY_BY_CATEGORY.templates.length;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Which component category the current route sits under, if any.
  const activeCategory = React.useMemo(() => {
    const seg = pathname.match(/^\/components\/([^/]+)/)?.[1];
    return seg && (COMPONENT_CATEGORY_ORDER as readonly string[]).includes(seg)
      ? seg
      : null;
  }, [pathname]);

  // Collapsed/expanded category state. The active category is always open so
  // you can see its siblings; the rest stay folded to keep the list short.
  // Use the headers to pin extra categories open while you browse.
  const [expanded, setExpanded] = React.useState<Set<string>>(() => new Set());
  const toggle = React.useCallback((cat: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }, []);

  // Live filter over the component list.
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const isFiltering = tokens.length > 0;

  const sections = COMPONENT_CATEGORY_ORDER.map((cat) => {
    const label = CATEGORY_LABELS[cat];
    const all = REGISTRY_BY_CATEGORY[cat];
    const items = isFiltering
      ? all.filter((entry) => {
          const haystack =
            `${entry.title} ${entry.name} ${label}`.toLowerCase();
          return tokens.every((token) => haystack.includes(token));
        })
      : all;
    return { cat, label, items };
  }).filter((section) => section.items.length > 0);

  const firstMatch = isFiltering ? sections[0]?.items[0] : undefined;

  // "/" focuses the filter from anywhere, unless you're already typing.
  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey)
        return;
      const el = document.activeElement as HTMLElement | null;
      if (
        el &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.tagName === "SELECT" ||
          el.isContentEditable)
      )
        return;
      event.preventDefault();
      inputRef.current?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // The mobile sidebar is an off-canvas sheet; close it when the route
  // changes so a tapped link doesn't leave it covering the page.
  React.useEffect(() => {
    setOpenMobile(false);
  }, [pathname, setOpenMobile]);

  // Keep the active item in view when you arrive from search, the pager, or a
  // deep link into a long, scrolled-away category.
  const activeItemRef = React.useRef<HTMLAnchorElement>(null);
  React.useEffect(() => {
    const id = requestAnimationFrame(() =>
      activeItemRef.current?.scrollIntoView({ block: "nearest" }),
    );
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return (
    <Sidebar collapsible="offcanvas" className="border-r border-sidebar-border">
      <SidebarHeader>
        <Link
          href="/"
          className="group/brand flex items-center gap-3 rounded-sm px-2 py-2 transition-colors hover:bg-sidebar-accent"
          aria-label={`${SITE.name} | home`}
        >
          <LogoTile />
          <span
            className="truncate whitespace-nowrap text-xl leading-none text-foreground"
            style={{
              fontFamily: "var(--font-cormorant), ui-serif, serif",
              fontWeight: 500,
              letterSpacing: "0.22em",
            }}
          >
            HIRAEL
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={EYEBROW_CLASS}>
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/components")}>
                  <Link href="/components">
                    <Boxes />
                    <span>All components</span>
                    <span className={COUNT_CLASS}>{componentCount}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/blocks")}>
                  <Link href="/blocks">
                    <LayoutTemplate />
                    <span>Blocks</span>
                    <span className={COUNT_CLASS}>{blockCount}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/templates")}>
                  <Link href="/templates">
                    <Frame />
                    <span>Templates</span>
                    <span className={COUNT_CLASS}>{templateCount}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/theme")}>
                  <Link href="/theme">
                    <Sparkles />
                    <span>Theme playground</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="sticky top-0 z-10 bg-sidebar px-2 py-1.5">
          <div className="relative">
            <Search className="pointer-events-none absolute start-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  if (query) setQuery("");
                  else inputRef.current?.blur();
                } else if (event.key === "Enter" && firstMatch) {
                  event.preventDefault();
                  setQuery("");
                  router.push(entryHref(firstMatch));
                }
              }}
              placeholder="Filter components…"
              aria-label="Filter components"
              autoComplete="off"
              className="h-8 border-sidebar-border bg-sidebar-accent/40 ps-8 pe-10 dark:bg-sidebar-accent/40"
            />
            {query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                aria-label="Clear filter"
                className="absolute end-1.5 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <X className="size-3.5" />
              </button>
            ) : (
              <KbdDisplay className="absolute end-2 top-1/2 -translate-y-1/2 border border-sidebar-border bg-sidebar-accent/40">
                /
              </KbdDisplay>
            )}
          </div>
        </div>

        {sections.map(({ cat, label, items }) => {
          const open =
            isFiltering || cat === activeCategory || expanded.has(cat);
          return (
            <Collapsible
              key={cat}
              open={open}
              onOpenChange={() => {
                if (!isFiltering) toggle(cat);
              }}
              className="group/collapsible"
            >
              <SidebarGroup className="px-2 py-0.5">
                <SidebarGroupLabel
                  asChild
                  className={`${EYEBROW_CLASS} w-full cursor-pointer gap-1.5 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground${
                    cat === activeCategory
                      ? " text-sidebar-accent-foreground"
                      : ""
                  }`}
                >
                  <CollapsibleTrigger>
                    <span className="truncate">{label}</span>
                    <span className={COUNT_CLASS}>{items.length}</span>
                    <ChevronDown className="shrink-0 text-muted-foreground/80 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent className="pt-0.5">
                    <SidebarMenu>
                      {items.map((entry) => {
                        const href = entryHref(entry);
                        const active = isActive(href);
                        return (
                          <SidebarMenuItem key={entry.name}>
                            <SidebarMenuButton
                              asChild
                              isActive={active}
                              className="text-[13px] text-sidebar-foreground/70"
                            >
                              <Link
                                href={href}
                                ref={active ? activeItemRef : undefined}
                              >
                                <span>{entry.title}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          );
        })}

        {isFiltering && sections.length === 0 && (
          <div className="px-4 py-6 text-center">
            <p className="text-sm text-sidebar-foreground/70">
              No components match.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Blocks and templates live in the top-bar search.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="mt-3 text-xs text-foreground underline-offset-4 hover:underline"
            >
              Clear filter
            </button>
          </div>
        )}
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center justify-between gap-2 bg-sidebar-accent/30 px-1 py-2">
          <span className={EYEBROW_CLASS}>peer of shadcn</span>
          <ThemeSheetTrigger />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
