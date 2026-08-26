"use client";

import * as React from "react";
import { ChevronRight, File, Folder } from "lucide-react";

import { cn } from "@/lib/utils";

type StorageBrowserProps = React.ComponentProps<"div">;

const StorageBrowser = ({ className, ...props }: StorageBrowserProps) => {
  return (
    <div
      data-slot="storage-browser"
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-card text-card-foreground",
        className,
      )}
      {...props}
    />
  );
};

type StorageBrowserHeaderProps = React.ComponentProps<"div">;

const StorageBrowserHeader = ({
  className,
  ...props
}: StorageBrowserHeaderProps) => {
  return (
    <div
      data-slot="storage-browser-header"
      className={cn(
        "flex items-center justify-between gap-3 border-b border-border px-3 py-2",
        className,
      )}
      {...props}
    />
  );
};

type StorageBreadcrumbProps = React.ComponentProps<"nav">;

const StorageBreadcrumb = ({
  className,
  children,
  ...props
}: StorageBreadcrumbProps) => {
  const items = React.Children.toArray(children).filter(Boolean);
  return (
    <nav
      data-slot="storage-breadcrumb"
      aria-label="Path"
      className={cn(
        "flex min-w-0 items-center gap-1 font-mono text-xs text-muted-foreground",
        className,
      )}
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

interface StorageBreadcrumbItemProps extends React.ComponentProps<"button"> {
  current?: boolean;
}

const StorageBreadcrumbItem = ({
  current,
  className,
  ...props
}: StorageBreadcrumbItemProps) => {
  return (
    <button
      type="button"
      data-slot="storage-breadcrumb-item"
      aria-current={current ? "page" : undefined}
      className={cn(
        "max-w-40 truncate rounded-sm px-1 py-0.5 outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
        current && "text-foreground",
        className,
      )}
      {...props}
    />
  );
};

type StorageBrowserListProps = React.ComponentProps<"ul">;

const StorageBrowserList = ({
  className,
  ...props
}: StorageBrowserListProps) => {
  return (
    <ul
      data-slot="storage-browser-list"
      className={cn("divide-y divide-border", className)}
      {...props}
    />
  );
};

interface StorageItemProps extends Omit<
  React.ComponentProps<"button">,
  "type" | "name"
> {
  kind: "folder" | "file";
  name: React.ReactNode;
  size?: React.ReactNode;
  modified?: React.ReactNode;
  icon?: React.ReactNode;
}

const StorageItem = ({
  kind,
  name,
  size,
  modified,
  icon,
  className,
  ...props
}: StorageItemProps) => {
  const DefaultIcon = kind === "folder" ? Folder : File;
  return (
    <li>
      <button
        type="button"
        data-slot="storage-item"
        data-kind={kind}
        className={cn(
          "flex w-full items-center gap-3 px-3 py-2.5 text-start outline-none transition-colors",
          "hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
          className,
        )}
        {...props}
      >
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-md",
            kind === "folder"
              ? "bg-accent text-foreground"
              : "bg-muted text-muted-foreground",
          )}
        >
          {icon ?? <DefaultIcon className="size-4" aria-hidden />}
        </span>
        <span className="min-w-0 flex-1 truncate text-sm text-foreground">
          {name}
        </span>
        {size ? (
          <span className="hidden w-20 shrink-0 text-end font-mono text-xs text-muted-foreground sm:block">
            {size}
          </span>
        ) : null}
        {modified ? (
          <span className="hidden w-28 shrink-0 text-end text-xs text-muted-foreground md:block">
            {modified}
          </span>
        ) : null}
        {kind === "folder" ? (
          <ChevronRight
            className="size-4 shrink-0 text-muted-foreground rtl:rotate-180"
            aria-hidden
          />
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
  kind: "folder" | "file";
  name: string;
  size?: string;
  modified?: string;
}

const STORAGE_FS: Record<string, StorageEntry[]> = {
  "": [
    { kind: "folder", name: "images", modified: "Apr 12" },
    { kind: "folder", name: "backups", modified: "Apr 09" },
    { kind: "folder", name: "logs", modified: "Apr 14" },
    { kind: "file", name: "README.md", size: "2.1 KB", modified: "Apr 02" },
    { kind: "file", name: "config.yaml", size: "840 B", modified: "Apr 08" },
  ],
  images: [
    { kind: "folder", name: "thumbnails", modified: "Apr 12" },
    { kind: "file", name: "hero.jpg", size: "1.4 MB", modified: "Apr 11" },
    { kind: "file", name: "avatar.png", size: "312 KB", modified: "Apr 10" },
  ],
  "images/thumbnails": [
    { kind: "file", name: "hero@2x.webp", size: "88 KB", modified: "Apr 12" },
    { kind: "file", name: "avatar@2x.webp", size: "22 KB", modified: "Apr 12" },
  ],
  backups: [
    {
      kind: "file",
      name: "db-2024-04-09.sql.gz",
      size: "48 MB",
      modified: "Apr 09",
    },
    {
      kind: "file",
      name: "db-2024-04-02.sql.gz",
      size: "47 MB",
      modified: "Apr 02",
    },
  ],
  logs: [
    { kind: "file", name: "app.log", size: "6.2 MB", modified: "Apr 14" },
    { kind: "file", name: "access.log", size: "18 MB", modified: "Apr 14" },
  ],
};

const StorageBrowserBlock = () => {
  const [path, setPath] = React.useState<string[]>([]);
  const key = path.join("/");
  const entries = STORAGE_FS[key] ?? [];

  function open(entry: StorageEntry) {
    if (entry.kind !== "folder") return;
    const nextKey = [...path, entry.name].join("/");
    if (STORAGE_FS[nextKey]) setPath([...path, entry.name]);
  }

  return (
    <section
      data-slot="storage-browser-block"
      className="flex w-full justify-center bg-background p-6 sm:p-10"
    >
      <div className="w-full max-w-2xl">
        <StorageBrowser>
          <StorageBrowserHeader>
            <StorageBreadcrumb>
              <StorageBreadcrumbItem
                current={path.length === 0}
                onClick={() => setPath([])}
              >
                my-bucket
              </StorageBreadcrumbItem>
              {path.map((segment, i) => (
                <StorageBreadcrumbItem
                  key={segment}
                  current={i === path.length - 1}
                  onClick={() => setPath(path.slice(0, i + 1))}
                >
                  {segment}
                </StorageBreadcrumbItem>
              ))}
            </StorageBreadcrumb>
            <span className="shrink-0 font-mono text-xs text-muted-foreground">
              {entries.length} items
            </span>
          </StorageBrowserHeader>
          <StorageBrowserList>
            {entries.map((entry) => (
              <StorageItem
                key={entry.name}
                kind={entry.kind}
                name={entry.name}
                size={entry.size}
                modified={entry.modified}
                onClick={() => open(entry)}
              />
            ))}
          </StorageBrowserList>
        </StorageBrowser>
      </div>
    </section>
  );
};

export default StorageBrowserBlock;
