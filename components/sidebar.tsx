'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Boxes, Frame, History, LayoutTemplate, type LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { CATEGORIES_BY_GROUP } from '@/components/block-categories';
import { CommandMenu } from '@/components/command-menu';
import {
  BLOCKS_BY_KIND,
  CATEGORY_LABELS,
  COMPONENT_CATEGORY_ORDER,
  REGISTRY_BY_CATEGORY,
  TEMPLATES,
  entryHref,
} from '@/registry/hirael/registry-meta';

type Section = 'components' | 'blocks' | 'templates' | 'changelog';

const sectionFor = (pathname: string): Section => {
  if (pathname === '/blocks' || pathname.startsWith('/blocks/')) return 'blocks';
  if (pathname === '/templates' || pathname.startsWith('/templates/')) return 'templates';
  if (pathname === '/changelog') return 'changelog';
  return 'components';
};

export interface SidebarRelease {
  slug: string;
  label: string;
  date: string;
}

/**
 * The docs sidebar column: sticky under the tabs bar and scrolling on its
 * own, so the tree stays put while the article scrolls. Hidden below `md`,
 * where `DocsHeader` opens the same tree in a sheet.
 */
export const DocsSidebar = ({ releases }: { releases: SidebarRelease[] }) => {
  return (
    <aside className="sticky top-11 hidden h-[calc(100svh-2.75rem)] w-(--docs-sidebar-width) shrink-0 overflow-y-auto border-e border-border md:block">
      <DocsSidebarNav releases={releases} className="p-4" />
    </aside>
  );
};

/**
 * The tree itself: a search field, then the active section's pages. The
 * desktop column and the mobile sheet both render it. Each section reads
 * like a docs tree: an overview page at the root, then folders whose
 * children hang off a rail, the active one marked on the rail.
 */
export const DocsSidebarNav = ({ releases, className }: { releases: SidebarRelease[]; className?: string }) => {
  const pathname = usePathname();
  const ref = React.useRef<HTMLElement>(null);
  const section = sectionFor(pathname);

  React.useEffect(() => {
    if (ref.current) revealActiveItem(ref.current);
  }, [pathname]);

  return (
    <nav ref={ref} aria-label="Sidebar" className={cn('flex flex-col gap-4', className)}>
      <CommandMenu variant="field" />
      <div className="flex flex-col gap-3">
        {section === 'components' && <ComponentTree pathname={pathname} />}
        {section === 'blocks' && <BlockTree pathname={pathname} />}
        {section === 'templates' && <TemplateTree pathname={pathname} />}
        {section === 'changelog' && <ReleaseTree releases={releases} />}
      </div>
    </nav>
  );
};

const revealActiveItem = (container: HTMLElement) => {
  const active = container.querySelector<HTMLElement>('[aria-current="page"]');
  if (!active) return;
  const scroller = container.parentElement ?? container;
  const box = scroller.getBoundingClientRect();
  const item = active.getBoundingClientRect();
  const isHidden = item.top < box.top || item.bottom > box.bottom;
  if (isHidden) active.scrollIntoView({ block: 'center' });
};

const isUnder = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

/** A root-level page row (the section's overview). */
const PageLink = ({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) => {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'relative flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
        active
          ? 'bg-accent text-foreground before:absolute before:inset-y-1.5 before:-start-2 before:w-0.5 before:rounded-full before:bg-foreground'
          : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
      )}
    >
      {children}
    </Link>
  );
};

/** A folder: a labelled header with its pages hanging off a rail beneath it. */
const Folder = ({
  icon: Icon,
  label,
  href,
  children,
}: {
  icon: LucideIcon;
  label: string;
  /** Folders whose label is itself a page (a category index) link there. */
  href?: string;
  children: React.ReactNode;
}) => {
  const header = (
    <>
      <Icon className="size-4 text-muted-foreground" aria-hidden />
      <span>{label}</span>
    </>
  );
  const headerClass = 'flex items-center gap-2 px-2 py-1.5 text-sm text-foreground/80';

  return (
    <div className="flex flex-col">
      {href ? (
        <Link href={href} className={cn(headerClass, 'rounded-md transition-colors hover:text-foreground')}>
          {header}
        </Link>
      ) : (
        <div className={headerClass}>{header}</div>
      )}
      <ul className="ms-4 flex flex-col border-s border-border ps-2">{children}</ul>
    </div>
  );
};

/** A page inside a folder; the active one carries a marker on the rail. */
const FolderLink = ({
  href,
  active,
  count,
  children,
}: {
  href: string;
  active: boolean;
  count?: number;
  children: React.ReactNode;
}) => {
  return (
    <li>
      <Link
        href={href}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'relative flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition-colors',
          active
            ? 'bg-accent text-foreground before:absolute before:inset-y-1.5 before:-start-[calc(0.5rem+1px)] before:w-0.5 before:rounded-full before:bg-foreground'
            : 'text-muted-foreground hover:text-foreground',
        )}
      >
        <span className="truncate">{children}</span>
        {count !== undefined && (
          <span className="ms-auto font-mono text-[10px] tabular-nums text-muted-foreground">{count}</span>
        )}
      </Link>
    </li>
  );
};

const ComponentTree = ({ pathname }: { pathname: string }) => {
  return (
    <>
      <PageLink href="/components" active={pathname === '/components'}>
        Overview
      </PageLink>
      {COMPONENT_CATEGORY_ORDER.map((category) => {
        const items = REGISTRY_BY_CATEGORY[category];
        if (!items.length) return null;
        return (
          <Folder key={category} icon={Boxes} label={CATEGORY_LABELS[category]} href={`/components/${category}`}>
            {items.map((entry) => {
              const href = entryHref(entry);
              return (
                <FolderLink key={entry.name} href={href} active={isUnder(pathname, href)}>
                  {entry.title}
                </FolderLink>
              );
            })}
          </Folder>
        );
      })}
    </>
  );
};

const BlockTree = ({ pathname }: { pathname: string }) => {
  return (
    <>
      <PageLink href="/blocks" active={pathname === '/blocks'}>
        Overview
      </PageLink>
      {CATEGORIES_BY_GROUP.map(({ group, label, categories }) => (
        <Folder key={group} icon={LayoutTemplate} label={label}>
          {categories.map((category) => {
            const href = `/blocks/${category.slug}`;
            const blocks = category.blockKind ? BLOCKS_BY_KIND[category.blockKind] : [];
            return (
              <FolderLink
                key={category.slug}
                href={href}
                active={isUnder(pathname, href)}
                count={blocks.length > 0 ? blocks.length : undefined}
              >
                {category.title}
              </FolderLink>
            );
          })}
        </Folder>
      ))}
    </>
  );
};

const TemplateTree = ({ pathname }: { pathname: string }) => {
  return (
    <>
      <PageLink href="/templates" active={pathname === '/templates'}>
        Overview
      </PageLink>
      <Folder icon={Frame} label="Templates">
        {TEMPLATES.map((entry) => {
          const href = entryHref(entry);
          return (
            <FolderLink key={entry.name} href={href} active={isUnder(pathname, href)}>
              {entry.title}
            </FolderLink>
          );
        })}
      </Folder>
    </>
  );
};

const ReleaseTree = ({ releases }: { releases: SidebarRelease[] }) => {
  if (!releases.length) return null;
  return (
    <Folder icon={History} label="Releases">
      {releases.map((release) => (
        <li key={release.slug}>
          <a
            href={`#release-${release.slug}`}
            className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="truncate">{release.label}</span>
            <span className="ms-auto font-mono text-[10px] text-muted-foreground">{release.date}</span>
          </a>
        </li>
      ))}
    </Folder>
  );
};
