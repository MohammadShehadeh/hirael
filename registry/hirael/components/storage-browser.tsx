"use client";

import * as React from "react";
import { ChevronRight, File, Folder } from "lucide-react";

import { cn } from "@/lib/utils";

type StorageBrowserProps = React.ComponentProps<"div">;

function StorageBrowser({ className, ...props }: StorageBrowserProps) {
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
}

type StorageBrowserHeaderProps = React.ComponentProps<"div">;

function StorageBrowserHeader({
  className,
  ...props
}: StorageBrowserHeaderProps) {
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
}

type StorageBreadcrumbProps = React.ComponentProps<"nav">;

function StorageBreadcrumb({
  className,
  children,
  ...props
}: StorageBreadcrumbProps) {
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
}

type StorageBreadcrumbItemProps = React.ComponentProps<"button"> & {
  current?: boolean;
};

function StorageBreadcrumbItem({
  current,
  className,
  ...props
}: StorageBreadcrumbItemProps) {
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
}

type StorageBrowserListProps = React.ComponentProps<"ul">;

function StorageBrowserList({ className, ...props }: StorageBrowserListProps) {
  return (
    <ul
      data-slot="storage-browser-list"
      className={cn("divide-y divide-border", className)}
      {...props}
    />
  );
}

type StorageItemProps = Omit<React.ComponentProps<"button">, "type"> & {
  kind: "folder" | "file";
  name: React.ReactNode;
  size?: React.ReactNode;
  modified?: React.ReactNode;
  icon?: React.ReactNode;
};

function StorageItem({
  kind,
  name,
  size,
  modified,
  icon,
  className,
  ...props
}: StorageItemProps) {
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
}

export {
  StorageBrowser,
  StorageBrowserHeader,
  StorageBreadcrumb,
  StorageBreadcrumbItem,
  StorageBrowserList,
  StorageItem,
};
