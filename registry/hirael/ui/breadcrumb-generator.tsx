"use client";

import * as React from "react";
import { ChevronRight, Home } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/registry/hirael/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/hirael/ui/dropdown-menu";

type BreadcrumbCrumb = {
  label: string;
  href?: string;
};

function humanizeSegment(segment: string) {
  const decoded = (() => {
    try {
      return decodeURIComponent(segment);
    } catch {
      return segment;
    }
  })();

  return decoded
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Split a URL path into breadcrumb crumbs, humanizing each segment and
 * building a cumulative `href` for every level.
 *
 * @param path - The path to split, e.g. `/settings/billing/invoices`.
 * @param basePath - Prefix prepended to each generated `href`, e.g. `/app`.
 */
function segmentsFromPath(path: string, basePath = ""): BreadcrumbCrumb[] {
  const cleanBase = basePath.replace(/\/+$/, "");
  const segments = path.split("/").filter(Boolean);

  return segments.map((segment, index) => ({
    label: humanizeSegment(segment),
    href: `${cleanBase}/${segments.slice(0, index + 1).join("/")}`,
  }));
}

/**
 * A single rendered crumb. Pass `isCurrent` for the trailing item so it
 * renders as the current page instead of a link.
 */
function BreadcrumbGeneratorItem({
  label,
  href,
  isCurrent,
}: BreadcrumbCrumb & {
  /** Render as the current page (non-link) instead of a link. */
  isCurrent?: boolean;
}) {
  return (
    <BreadcrumbItem data-slot="breadcrumb-generator-item">
      {isCurrent || !href ? (
        <BreadcrumbPage>{label}</BreadcrumbPage>
      ) : (
        <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
      )}
    </BreadcrumbItem>
  );
}

function BreadcrumbGenerator({
  items,
  path,
  basePath,
  maxItems = 4,
  showHome = false,
  homeHref = "/",
  className,
  ...props
}: React.ComponentProps<typeof Breadcrumb> & {
  /** Crumbs to render. The last item becomes the current page. */
  items?: BreadcrumbCrumb[];
  /** A URL path to derive crumbs from when `items` is omitted. */
  path?: string;
  /** Prefix prepended to each `href` generated from `path`. */
  basePath?: string;
  /** Collapse the middle into an ellipsis when the trail exceeds this. */
  maxItems?: number;
  /** Prepend a Home crumb linking to `homeHref`. */
  showHome?: boolean;
  /** Destination for the leading Home crumb. */
  homeHref?: string;
}) {
  const crumbs = React.useMemo<BreadcrumbCrumb[]>(() => {
    if (items) return items;
    if (path) return segmentsFromPath(path, basePath);
    return [];
  }, [items, path, basePath]);

  const lastIndex = crumbs.length - 1;
  const isCollapsed = crumbs.length > maxItems;

  const head = isCollapsed ? crumbs.slice(0, 1) : crumbs.slice(0, lastIndex);
  const hidden = isCollapsed ? crumbs.slice(1, lastIndex) : [];
  const tail = crumbs[lastIndex];

  return (
    <Breadcrumb
      data-slot="breadcrumb-generator"
      className={cn(className)}
      {...props}
    >
      <BreadcrumbList>
        {showHome ? (
          <>
            <BreadcrumbItem data-slot="breadcrumb-generator-home">
              <BreadcrumbLink href={homeHref} aria-label="Home">
                <Home className="size-3.5" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            {crumbs.length > 0 ? (
              <BreadcrumbSeparator>
                <ChevronRight className="rtl:rotate-180" />
              </BreadcrumbSeparator>
            ) : null}
          </>
        ) : null}

        {head.map((crumb, index) => (
          <React.Fragment key={`${crumb.label}-${index}`}>
            <BreadcrumbGeneratorItem {...crumb} />
            <BreadcrumbSeparator>
              <ChevronRight className="rtl:rotate-180" />
            </BreadcrumbSeparator>
          </React.Fragment>
        ))}

        {isCollapsed && hidden.length > 0 ? (
          <>
            <BreadcrumbItem data-slot="breadcrumb-generator-collapsed">
              <DropdownMenu>
                <DropdownMenuTrigger
                  data-slot="breadcrumb-generator-collapsed-trigger"
                  className="flex items-center justify-center rounded-sm outline-none transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  aria-label="Show hidden crumbs"
                >
                  <BreadcrumbEllipsis />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  data-slot="breadcrumb-generator-collapsed-content"
                >
                  {hidden.map((crumb, index) =>
                    crumb.href ? (
                      <DropdownMenuItem
                        key={`${crumb.label}-${index}`}
                        asChild
                      >
                        <a href={crumb.href}>{crumb.label}</a>
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        key={`${crumb.label}-${index}`}
                        disabled
                      >
                        {crumb.label}
                      </DropdownMenuItem>
                    ),
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="rtl:rotate-180" />
            </BreadcrumbSeparator>
          </>
        ) : null}

        {tail ? <BreadcrumbGeneratorItem {...tail} isCurrent /> : null}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export {
  BreadcrumbGenerator,
  BreadcrumbGeneratorItem,
  segmentsFromPath,
  type BreadcrumbCrumb,
};
