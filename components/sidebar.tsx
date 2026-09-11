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

const sectionForPath = (pathname: string): Section => {
  if (pathname === '/blocks' || pathname.startsWith('/blocks/')) return 'blocks';
  if (pathname === '/templates' || pathname.startsWith('/templates/')) return 'templates';
  if (pathname === '/changelog') return 'changelog';
  return 'components';
};

const isCurrentPath = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

export interface SidebarRelease {
  slug: string;
  label: string;
  date: string;
}

export interface DocsSidebarProps {
  releases: SidebarRelease[];
}

/**
 * The docs sidebar column: sticky under the tabs bar and scrolling on its
 * own. Hidden below `md`, where `DocsHeader` opens the same tree in a sheet.
 */
export const DocsSidebar = ({ releases }: DocsSidebarProps) => {
  return (
    <aside className="sticky top-11 hidden h-[calc(100svh-2.75rem)] w-(--docs-sidebar-width) shrink-0 overflow-y-auto border-e border-border md:block">
      <DocsSidebarNav releases={releases} className="p-4" />
    </aside>
  );
};

export interface DocsSidebarNavProps {
  releases: SidebarRelease[];
  className?: string;
}

/** The search field and the active section's page tree; rendered by the desktop column and the mobile sheet. */
export const DocsSidebarNav = ({ releases, className }: DocsSidebarNavProps) => {
  const pathname = usePathname();
  const ref = React.useRef<HTMLElement>(null);
  const section = sectionForPath(pathname);

  React.useEffect(() => {
    if (ref.current) scrollCurrentPageIntoView(ref.current);
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

const scrollCurrentPageIntoView = (tree: HTMLElement) => {
  const current = tree.querySelector<HTMLElement>('[aria-current="page"]');
  if (!current) return;
  const scroller = tree.parentElement ?? tree;
  const box = scroller.getBoundingClientRect();
  const row = current.getBoundingClientRect();
  const isOutOfSight = row.top < box.top || row.bottom > box.bottom;
  if (isOutOfSight) current.scrollIntoView({ block: 'center' });
};

interface RootPageLinkProps {
  href: string;
  isCurrent: boolean;
  children: React.ReactNode;
}

const RootPageLink = ({ href, isCurrent, children }: RootPageLinkProps) => {
  return (
    <Link
      href={href}
      aria-current={isCurrent ? 'page' : undefined}
      className={cn(
        'relative flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
        isCurrent
          ? 'bg-accent text-foreground before:absolute before:inset-y-1.5 before:-start-2 before:w-0.5 before:rounded-full before:bg-foreground'
          : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
      )}
    >
      {children}
    </Link>
  );
};

interface FolderProps {
  icon: LucideIcon;
  label: string;
  /** Set when the label is itself a page, such as a category index. */
  href?: string;
  children: React.ReactNode;
}

const Folder = ({ icon: Icon, label, href, children }: FolderProps) => {
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

interface FolderPageLinkProps {
  href: string;
  isCurrent: boolean;
  count?: number;
  children: React.ReactNode;
}

const FolderPageLink = ({ href, isCurrent, count, children }: FolderPageLinkProps) => {
  return (
    <li>
      <Link
        href={href}
        aria-current={isCurrent ? 'page' : undefined}
        className={cn(
          'relative flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition-colors',
          isCurrent
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

interface SectionTreeProps {
  pathname: string;
}

const ComponentTree = ({ pathname }: SectionTreeProps) => {
  return (
    <>
      <RootPageLink href="/components" isCurrent={pathname === '/components'}>
        Overview
      </RootPageLink>
      {COMPONENT_CATEGORY_ORDER.map((category) => {
        const components = REGISTRY_BY_CATEGORY[category];
        if (!components.length) return null;
        return (
          <Folder key={category} icon={Boxes} label={CATEGORY_LABELS[category]} href={`/components/${category}`}>
            {components.map((entry) => {
              const href = entryHref(entry);
              return (
                <FolderPageLink key={entry.name} href={href} isCurrent={isCurrentPath(pathname, href)}>
                  {entry.title}
                </FolderPageLink>
              );
            })}
          </Folder>
        );
      })}
    </>
  );
};

const BlockTree = ({ pathname }: SectionTreeProps) => {
  return (
    <>
      <RootPageLink href="/blocks" isCurrent={pathname === '/blocks'}>
        Overview
      </RootPageLink>
      {CATEGORIES_BY_GROUP.map(({ group, label, categories }) => (
        <Folder key={group} icon={LayoutTemplate} label={label}>
          {categories.map((category) => {
            const href = `/blocks/${category.slug}`;
            const blockCount = category.blockKind ? BLOCKS_BY_KIND[category.blockKind].length : 0;
            return (
              <FolderPageLink
                key={category.slug}
                href={href}
                isCurrent={isCurrentPath(pathname, href)}
                count={blockCount > 0 ? blockCount : undefined}
              >
                {category.title}
              </FolderPageLink>
            );
          })}
        </Folder>
      ))}
    </>
  );
};

const TemplateTree = ({ pathname }: SectionTreeProps) => {
  return (
    <>
      <RootPageLink href="/templates" isCurrent={pathname === '/templates'}>
        Overview
      </RootPageLink>
      <Folder icon={Frame} label="Templates">
        {TEMPLATES.map((entry) => {
          const href = entryHref(entry);
          return (
            <FolderPageLink key={entry.name} href={href} isCurrent={isCurrentPath(pathname, href)}>
              {entry.title}
            </FolderPageLink>
          );
        })}
      </Folder>
    </>
  );
};

interface ReleaseTreeProps {
  releases: SidebarRelease[];
}

const ReleaseTree = ({ releases }: ReleaseTreeProps) => {
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
