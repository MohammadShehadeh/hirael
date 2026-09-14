'use client';

import * as React from 'react';
import { ChevronRight, File, Folder } from 'lucide-react';

import { cn } from '@/lib/utils';

type StorageBrowserProps = React.ComponentProps<'div'>;

const StorageBrowser = ({ className, ...props }: StorageBrowserProps) => {
  return (
    <div
      data-slot="storage-browser"
      className={cn('overflow-hidden rounded-lg border border-border bg-card text-card-foreground', className)}
      {...props}
    />
  );
};

type StorageBrowserHeaderProps = React.ComponentProps<'div'>;

const StorageBrowserHeader = ({ className, ...props }: StorageBrowserHeaderProps) => {
  return (
    <div
      data-slot="storage-browser-header"
      className={cn('flex items-center justify-between gap-3 border-b border-border px-3 py-2', className)}
      {...props}
    />
  );
};

type StorageBreadcrumbProps = React.ComponentProps<'nav'>;

const StorageBreadcrumb = ({ className, children, ...props }: StorageBreadcrumbProps) => {
  const items = React.Children.toArray(children).filter(Boolean);
  return (
    <nav
      data-slot="storage-breadcrumb"
      aria-label="Path"
      className={cn('flex min-w-0 items-center gap-1 text-xs text-muted-foreground', className)}
      {...props}
    >
      {items.map((child, i) => (
        <React.Fragment key={i}>
          {i > 0 ? (
            <span className="text-muted-foreground/50" aria-hidden>
              /
            </span>
          ) : null}
          {child}
        </React.Fragment>
      ))}
    </nav>
  );
};

interface StorageBreadcrumbItemProps extends React.ComponentProps<'button'> {
  current?: boolean;
}

const StorageBreadcrumbItem = ({ current, className, ...props }: StorageBreadcrumbItemProps) => {
  return (
    <button
      type="button"
      data-slot="storage-breadcrumb-item"
      aria-current={current ? 'page' : undefined}
      className={cn(
        'max-w-40 truncate rounded-sm px-1 py-0.5 outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring',
        current && 'text-foreground',
        className,
      )}
      {...props}
    />
  );
};

type StorageBrowserListProps = React.ComponentProps<'ul'>;

const StorageBrowserList = ({ className, ...props }: StorageBrowserListProps) => {
  return <ul data-slot="storage-browser-list" className={cn('divide-y divide-border', className)} {...props} />;
};

interface StorageItemProps extends Omit<React.ComponentProps<'button'>, 'type' | 'name'> {
  kind: 'folder' | 'file';
  name: React.ReactNode;
  size?: React.ReactNode;
  modified?: React.ReactNode;
  icon?: React.ReactNode;
  /** Marks the row as the current selection, e.g. the file shown in a preview. */
  selected?: boolean;
}

const StorageItem = ({ kind, name, size, modified, icon, selected, className, ...props }: StorageItemProps) => {
  const DefaultIcon = kind === 'folder' ? Folder : File;
  return (
    <li>
      <button
        type="button"
        data-slot="storage-item"
        data-kind={kind}
        data-selected={selected ? '' : undefined}
        aria-pressed={kind === 'file' && selected !== undefined ? selected : undefined}
        className={cn(
          'flex w-full items-center gap-3 px-3 py-2.5 text-start outline-none transition-colors duration-150',
          'hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
          'data-selected:bg-muted',
          className,
        )}
        {...props}
      >
        <span
          className={cn(
            'flex shrink-0 items-center justify-center',
            kind === 'folder' ? 'text-foreground' : 'text-muted-foreground',
          )}
        >
          {icon ?? <DefaultIcon className="size-4" aria-hidden />}
        </span>
        <span className="min-w-0 flex-1 truncate text-sm text-foreground">{name}</span>
        {size ? (
          <span className="hidden w-20 shrink-0 text-end text-xs text-muted-foreground sm:block">{size}</span>
        ) : null}
        {modified ? (
          <span className="hidden w-28 shrink-0 text-end text-xs text-muted-foreground md:block">{modified}</span>
        ) : null}
        {kind === 'folder' ? (
          <ChevronRight className="size-4 shrink-0 text-muted-foreground rtl:rotate-180" aria-hidden />
        ) : (
          <span className="w-4 shrink-0" aria-hidden />
        )}
      </button>
    </li>
  );
};

export {
  StorageBrowser,
  StorageBrowserHeader,
  StorageBreadcrumb,
  StorageBreadcrumbItem,
  StorageBrowserList,
  StorageItem,
};

interface StorageEntry {
  kind: 'folder' | 'file';
  name: string;
  size?: string;
  modified?: string;
}

const STORAGE_FS: Record<string, StorageEntry[]> = {
  '': [
    { kind: 'folder', name: 'images', modified: 'Apr 12' },
    { kind: 'folder', name: 'backups', modified: 'Apr 09' },
    { kind: 'folder', name: 'logs', modified: 'Apr 14' },
    { kind: 'file', name: 'README.md', size: '2.1 KB', modified: 'Apr 02' },
    { kind: 'file', name: 'config.yaml', size: '840 B', modified: 'Apr 08' },
  ],
  images: [
    { kind: 'folder', name: 'thumbnails', modified: 'Apr 12' },
    { kind: 'file', name: 'hero.jpg', size: '1.4 MB', modified: 'Apr 11' },
    { kind: 'file', name: 'avatar.png', size: '312 KB', modified: 'Apr 10' },
  ],
  'images/thumbnails': [
    { kind: 'file', name: 'hero@2x.webp', size: '88 KB', modified: 'Apr 12' },
    { kind: 'file', name: 'avatar@2x.webp', size: '22 KB', modified: 'Apr 12' },
  ],
  backups: [
    {
      kind: 'file',
      name: 'db-2024-04-09.sql.gz',
      size: '48 MB',
      modified: 'Apr 09',
    },
    {
      kind: 'file',
      name: 'db-2024-04-02.sql.gz',
      size: '47 MB',
      modified: 'Apr 02',
    },
  ],
  logs: [
    { kind: 'file', name: 'app.log', size: '6.2 MB', modified: 'Apr 14' },
    { kind: 'file', name: 'access.log', size: '18 MB', modified: 'Apr 14' },
  ],
};

const ENTER =
  'animate-in fade-in slide-in-from-bottom-2 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
const SWAP =
  'animate-in fade-in slide-in-from-bottom-1 duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const CONTENT_TYPES: Record<string, string> = {
  md: 'text/markdown',
  yaml: 'application/yaml',
  jpg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gz: 'application/gzip',
  log: 'text/plain',
};

const contentType = (name: string) => CONTENT_TYPES[name.split('.').pop() ?? ''] ?? 'application/octet-stream';

const StorageBrowserBlock = () => {
  const [path, setPath] = React.useState<string[]>([]);
  const [selected, setSelected] = React.useState<string | null>(null);
  const key = path.join('/');
  const entries = STORAGE_FS[key] ?? [];
  const selectedEntry = entries.find((entry) => entry.kind === 'file' && entry.name === selected);

  function navigate(next: string[]) {
    setPath(next);
    setSelected(null);
  }

  function open(entry: StorageEntry) {
    if (entry.kind === 'file') {
      setSelected((current) => (current === entry.name ? null : entry.name));
      return;
    }
    const next = [...path, entry.name];
    if (STORAGE_FS[next.join('/')]) navigate(next);
  }

  return (
    <section data-slot="storage-browser-block" className="flex w-full justify-center bg-background p-6 sm:p-10">
      <div className="w-full max-w-2xl">
        <StorageBrowser className={ENTER}>
          <StorageBrowserHeader>
            <StorageBreadcrumb>
              <StorageBreadcrumbItem current={path.length === 0} onClick={() => navigate([])}>
                my-bucket
              </StorageBreadcrumbItem>
              {path.map((segment, i) => (
                <StorageBreadcrumbItem
                  key={segment}
                  current={i === path.length - 1}
                  onClick={() => navigate(path.slice(0, i + 1))}
                >
                  {segment}
                </StorageBreadcrumbItem>
              ))}
            </StorageBreadcrumb>
            <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
              {entries.length} {entries.length === 1 ? 'item' : 'items'}
            </span>
          </StorageBrowserHeader>
          <StorageBrowserList key={key} className={SWAP}>
            {entries.map((entry) => (
              <StorageItem
                key={entry.name}
                kind={entry.kind}
                name={entry.name}
                size={entry.size}
                modified={entry.modified}
                selected={entry.kind === 'file' ? entry.name === selected : undefined}
                onClick={() => open(entry)}
              />
            ))}
          </StorageBrowserList>
          <div
            data-slot="storage-browser-details"
            className="border-t border-border bg-muted/30 px-3 py-3 text-xs text-muted-foreground"
          >
            {selectedEntry ? (
              <dl
                key={`${key}/${selectedEntry.name}`}
                className={cn(SWAP, 'grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4')}
              >
                <div className="col-span-2 flex min-w-0 flex-col gap-0.5">
                  <dt>Key</dt>
                  <dd dir="ltr" className="truncate text-start text-sm text-foreground">
                    {[...path, selectedEntry.name].join('/')}
                  </dd>
                </div>
                <div className="flex flex-col gap-0.5">
                  <dt>Size</dt>
                  <dd className="text-sm tabular-nums text-foreground">{selectedEntry.size}</dd>
                </div>
                <div className="flex flex-col gap-0.5">
                  <dt>Modified</dt>
                  <dd className="text-sm text-foreground">{selectedEntry.modified}</dd>
                </div>
                <div className="col-span-2 flex flex-col gap-0.5 sm:col-span-4">
                  <dt>Content type</dt>
                  <dd className="text-sm text-foreground">{contentType(selectedEntry.name)}</dd>
                </div>
              </dl>
            ) : (
              <p key={`${key}-hint`} className={cn(SWAP, 'py-1')}>
                Select a file to see its details.
              </p>
            )}
          </div>
        </StorageBrowser>
      </div>
    </section>
  );
};

export default StorageBrowserBlock;
