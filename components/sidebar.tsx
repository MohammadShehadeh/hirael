"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Boxes, Frame, History, LayoutTemplate, Sparkles } from "lucide-react";

import { CATEGORIES_BY_GROUP } from "@/components/block-categories";
import { LogoTile } from "@/components/logo";
import { SITE } from "@/lib/site";
import {
  BLOCKS_BY_KIND,
  CATEGORY_LABELS,
  COMPONENT_CATEGORY_ORDER,
  COMPONENTS,
  REGISTRY_BY_CATEGORY,
  TEMPLATES,
  entryHref,
} from "@/registry/hirael/registry-meta";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/registry/hirael/ui/sidebar";

type Section = "components" | "blocks" | "templates" | "changelog";

function sectionFor(pathname: string): Section {
  if (pathname === "/blocks" || pathname.startsWith("/blocks/"))
    return "blocks";
  if (pathname === "/templates" || pathname.startsWith("/templates/"))
    return "templates";
  if (pathname === "/changelog") return "changelog";
  return "components";
}

export type SidebarRelease = { slug: string; label: string; date: string };

export function ShowcaseSidebar({ releases }: { releases: SidebarRelease[] }) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const section = sectionFor(pathname);
  const blockCount = REGISTRY_BY_CATEGORY.blocks.length;
  const templateCount = TEMPLATES.length;

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);
  const isExact = (href: string) => pathname === href;

  React.useEffect(() => {
    setOpenMobile(false);
  }, [pathname, setOpenMobile]);

  React.useEffect(() => {
    if (contentRef.current) revealActiveItem(contentRef.current);
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

      <SidebarContent ref={contentRef}>
        {/* The desktop topbar carries these links; only phones need them here. */}
        <SidebarGroup className="lg:hidden">
          <SidebarGroupLabel>Browse</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isExact("/components")}>
                  <Link href="/components">
                    <Boxes />
                    <span>Components</span>
                    <Count n={COMPONENTS.length} />
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isExact("/blocks")}>
                  <Link href="/blocks">
                    <LayoutTemplate />
                    <span>Blocks</span>
                    <Count n={blockCount} />
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isExact("/templates")}>
                  <Link href="/templates">
                    <Frame />
                    <span>Templates</span>
                    <Count n={templateCount} />
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isExact("/theme")}>
                  <Link href="/theme">
                    <Sparkles />
                    <span>Theme playground</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isExact("/changelog")}>
                  <Link href="/changelog">
                    <History />
                    <span>Changelog</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {section === "components" && <ComponentGroups isActive={isActive} />}
        {section === "blocks" && <BlockGroups isActive={isActive} />}
        {section === "templates" && <TemplateGroup isActive={isActive} />}
        {section === "changelog" && <ReleaseGroup releases={releases} />}
      </SidebarContent>
    </Sidebar>
  );
}

function revealActiveItem(container: HTMLElement) {
  const active = container.querySelector<HTMLElement>(
    '[data-sidebar="menu-button"][data-active="true"]',
  );
  if (!active) return;
  const box = container.getBoundingClientRect();
  const item = active.getBoundingClientRect();
  const isHidden = item.top < box.top || item.bottom > box.bottom;
  if (isHidden) active.scrollIntoView({ block: "center" });
}

function Count({ n }: { n: number }) {
  return (
    <span className="ml-auto font-mono text-[10px] tabular-nums text-muted-foreground">
      {n}
    </span>
  );
}

type GroupProps = { isActive: (href: string) => boolean };

function ComponentGroups({ isActive }: GroupProps) {
  return (
    <>
      {COMPONENT_CATEGORY_ORDER.map((cat) => {
        const items = REGISTRY_BY_CATEGORY[cat];
        if (!items.length) return null;
        return (
          <SidebarGroup key={cat}>
            <SidebarGroupLabel asChild>
              <Link href={`/components/${cat}`}>{CATEGORY_LABELS[cat]}</Link>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((entry) => {
                  const href = entryHref(entry);
                  return (
                    <SidebarMenuItem key={entry.name}>
                      <SidebarMenuButton asChild isActive={isActive(href)}>
                        <Link href={href}>
                          <span>{entry.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        );
      })}
    </>
  );
}

function BlockGroups({ isActive }: GroupProps) {
  return (
    <>
      {CATEGORIES_BY_GROUP.map(({ group, label, categories }) => (
        <SidebarGroup key={group}>
          <SidebarGroupLabel asChild>
            <Link href="/blocks">{label}</Link>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {categories.map((cat) => {
                const href = `/blocks/${cat.slug}`;
                const blocks = cat.blockKind
                  ? BLOCKS_BY_KIND[cat.blockKind]
                  : [];
                return (
                  <SidebarMenuItem key={cat.slug}>
                    <SidebarMenuButton asChild isActive={isActive(href)}>
                      <Link href={href}>
                        <span>{cat.title}</span>
                        {blocks.length > 0 && <Count n={blocks.length} />}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}

function TemplateGroup({ isActive }: GroupProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel asChild>
        <Link href="/templates">Templates</Link>
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {TEMPLATES.map((entry) => {
            const href = entryHref(entry);
            return (
              <SidebarMenuItem key={entry.name}>
                <SidebarMenuButton asChild isActive={isActive(href)}>
                  <Link href={href}>
                    <span>{entry.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function ReleaseGroup({ releases }: { releases: SidebarRelease[] }) {
  if (!releases.length) return null;
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Releases</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {releases.map((release) => (
            <SidebarMenuItem key={release.slug}>
              <SidebarMenuButton asChild>
                <a href={`#release-${release.slug}`}>
                  <span>{release.label}</span>
                  <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                    {release.date}
                  </span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
