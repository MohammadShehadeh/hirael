"use client";

import * as React from "react";
import {
  ChevronRight,
  File,
  Folder,
  FolderOpen,
  LayoutGrid,
  List,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/registry/hirael/ui/breadcrumb";
import { Button } from "@/registry/hirael/ui/button";

export type FileNode = {
  name: string;
  type: "folder" | "file";
  size?: number;
  modified?: string;
  children?: FileNode[];
};

type FileView = "list" | "grid";

type FileExplorerContextValue = {
  tree: FileNode;
  path: string[];
  current: FileNode;
  view: FileView;
  setView: (view: FileView) => void;
  navigate: (path: string[]) => void;
  open: (node: FileNode) => void;
  isOnPath: (path: string[]) => boolean;
  selected: string | undefined;
  setSelected: (name: string | undefined) => void;
};

const FileExplorerContext =
  React.createContext<FileExplorerContextValue | null>(null);

function useFileExplorer() {
  const ctx = React.useContext(FileExplorerContext);
  if (!ctx) {
    throw new Error("FileExplorer parts must be used within <FileExplorer>");
  }
  return ctx;
}

function nodeAtPath(root: FileNode, path: string[]): FileNode {
  let node = root;
  for (const name of path) {
    const next = node.children?.find(
      (child) => child.type === "folder" && child.name === name,
    );
    if (!next) break;
    node = next;
  }
  return node;
}

function samePath(a: string[], b: string[]) {
  return a.length === b.length && a.every((part, index) => part === b[index]);
}

function startsWithPath(path: string[], prefix: string[]) {
  return (
    prefix.length <= path.length &&
    prefix.every((part, index) => part === path[index])
  );
}

function formatSize(bytes: number | undefined) {
  if (bytes == null) return "";
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value < 10 ? value.toFixed(1) : Math.round(value)} ${units[unit]}`;
}

function folderSummary(node: FileNode) {
  const count = node.children?.length ?? 0;
  return count === 1 ? "1 item" : `${count} items`;
}

export type FileExplorerProps = Omit<
  React.ComponentProps<"div">,
  "onChange"
> & {
  /** Root folder rendered in the tree and browsed in the main pane. */
  tree: FileNode;
  /** Initial folder path, as folder names from the root's children down. */
  defaultPath?: string[];
  /** Controlled folder path, as folder names from the root's children down. */
  path?: string[];
  /** Called with the new path when the user navigates. */
  onPathChange?: (path: string[]) => void;
  defaultView?: FileView;
};

function FileExplorer({
  tree,
  defaultPath,
  path: pathProp,
  onPathChange,
  defaultView = "list",
  className,
  children,
  ...props
}: FileExplorerProps) {
  const [internalPath, setInternalPath] = React.useState<string[]>(
    defaultPath ?? [],
  );
  const path = pathProp ?? internalPath;
  const [view, setView] = React.useState<FileView>(defaultView);
  const [selected, setSelected] = React.useState<string | undefined>(undefined);

  const navigate = React.useCallback(
    (next: string[]) => {
      if (pathProp === undefined) setInternalPath(next);
      onPathChange?.(next);
      setSelected(undefined);
    },
    [pathProp, onPathChange],
  );

  const current = React.useMemo(() => nodeAtPath(tree, path), [tree, path]);

  const open = React.useCallback(
    (node: FileNode) => {
      if (node.type === "folder") {
        navigate([...path, node.name]);
      } else {
        setSelected(node.name);
      }
    },
    [navigate, path],
  );

  const isOnPath = React.useCallback(
    (candidate: string[]) => startsWithPath(path, candidate),
    [path],
  );

  const value = React.useMemo<FileExplorerContextValue>(
    () => ({
      tree,
      path,
      current,
      view,
      setView,
      navigate,
      open,
      isOnPath,
      selected,
      setSelected,
    }),
    [tree, path, current, view, navigate, open, isOnPath, selected],
  );

  return (
    <FileExplorerContext.Provider value={value}>
      <div
        data-slot="file-explorer"
        className={cn(
          "flex min-h-0 w-full overflow-hidden rounded-lg border border-border bg-card text-card-foreground",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </FileExplorerContext.Provider>
  );
}

type FileExplorerSidebarProps = React.ComponentProps<"div">;

function FileExplorerSidebar({
  className,
  children,
  ...props
}: FileExplorerSidebarProps) {
  return (
    <div
      data-slot="file-explorer-sidebar"
      className={cn(
        "flex w-56 shrink-0 flex-col overflow-auto border-e border-border bg-background/40 p-2",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type FileExplorerTreeProps = React.ComponentProps<"div"> & {
  /** Folder to render. Defaults to the explorer's root tree. */
  node?: FileNode;
};

function FileExplorerTree({
  node,
  className,
  ...props
}: FileExplorerTreeProps) {
  const { tree } = useFileExplorer();
  const root = node ?? tree;

  return (
    <div
      data-slot="file-explorer-tree"
      role="tree"
      className={cn("min-w-0 select-none text-sm", className)}
      {...props}
    >
      {root.children
        ?.filter((child) => child.type === "folder")
        .map((child) => (
          <FileExplorerTreeNode key={child.name} node={child} path={[child.name]} />
        ))}
    </div>
  );
}

const TREE_INDENT_PER_LEVEL = 14;
const TREE_INDENT_BASE = 8;

type FileExplorerTreeNodeProps = {
  node: FileNode;
  path: string[];
};

function FileExplorerTreeNode({ node, path }: FileExplorerTreeNodeProps) {
  const { path: currentPath, isOnPath, navigate } = useFileExplorer();
  const folders =
    node.children?.filter((child) => child.type === "folder") ?? [];
  const hasFolders = folders.length > 0;
  const onPath = isOnPath(path);
  const isCurrent = samePath(currentPath, path);

  const [expanded, setExpanded] = React.useState(onPath);

  React.useEffect(() => {
    if (onPath) setExpanded(true);
  }, [onPath]);

  const depth = path.length - 1;

  return (
    <div data-slot="file-explorer-tree-item" role="treeitem" aria-selected={isCurrent}>
      <button
        type="button"
        data-slot="file-explorer-tree-trigger"
        data-state={expanded ? "open" : "closed"}
        data-active={isCurrent ? "" : undefined}
        aria-expanded={hasFolders ? expanded : undefined}
        onClick={() => {
          navigate(path);
          if (hasFolders) setExpanded(true);
        }}
        style={{
          paddingInlineStart:
            depth * TREE_INDENT_PER_LEVEL + TREE_INDENT_BASE,
        }}
        className={cn(
          "group flex h-7 w-full items-center gap-1.5 rounded-sm pe-2 text-start outline-none transition-colors",
          "hover:bg-accent focus-visible:bg-accent focus-visible:ring-2 focus-visible:ring-ring",
          isCurrent
            ? "bg-accent font-medium text-foreground"
            : "text-foreground/80",
        )}
      >
        <span
          role="presentation"
          onClick={(event) => {
            if (!hasFolders) return;
            event.stopPropagation();
            setExpanded((value) => !value);
          }}
          className="flex size-4 shrink-0 items-center justify-center"
        >
          <ChevronRight
            aria-hidden
            className={cn(
              "size-3.5 text-muted-foreground transition-transform duration-150",
              hasFolders
                ? "group-data-[state=open]:rotate-90 rtl:rotate-180 rtl:group-data-[state=open]:rotate-90"
                : "invisible",
            )}
          />
        </span>
        <span className="flex shrink-0 items-center [&_svg]:size-4">
          <Folder className="text-muted-foreground group-data-[state=open]:hidden" />
          <FolderOpen className="hidden text-muted-foreground group-data-[state=open]:block" />
        </span>
        <span className="min-w-0 truncate">{node.name}</span>
      </button>
      {hasFolders && expanded && (
        <div role="group">
          {folders.map((child) => (
            <FileExplorerTreeNode
              key={child.name}
              node={child}
              path={[...path, child.name]}
            />
          ))}
        </div>
      )}
    </div>
  );
}

type FileExplorerBreadcrumbProps = React.ComponentProps<typeof Breadcrumb> & {
  /** Label for the root crumb. */
  rootLabel?: React.ReactNode;
};

function FileExplorerBreadcrumb({
  rootLabel = "Home",
  className,
  ...props
}: FileExplorerBreadcrumbProps) {
  const { tree, path, navigate } = useFileExplorer();
  const rootName = tree.name || rootLabel;

  const crumbs = [
    { label: rootName, target: [] as string[] },
    ...path.map((name, index) => ({
      label: name,
      target: path.slice(0, index + 1),
    })),
  ];

  return (
    <Breadcrumb
      data-slot="file-explorer-breadcrumb"
      className={cn("min-w-0", className)}
      {...props}
    >
      <BreadcrumbList>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <React.Fragment key={index}>
              <BreadcrumbItem className="min-w-0">
                {isLast ? (
                  <BreadcrumbPage className="truncate">
                    {crumb.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    asChild
                    className="truncate rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <button
                      type="button"
                      onClick={() => navigate(crumb.target)}
                    >
                      {crumb.label}
                    </button>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && (
                <BreadcrumbSeparator>
                  <ChevronRight className="rtl:rotate-180" />
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

type FileExplorerToolbarProps = React.ComponentProps<"div">;

function FileExplorerToolbar({
  className,
  children,
  ...props
}: FileExplorerToolbarProps) {
  const { view, setView } = useFileExplorer();
  return (
    <div
      data-slot="file-explorer-toolbar"
      className={cn(
        "flex items-center gap-2 border-b border-border px-3 py-2",
        className,
      )}
      {...props}
    >
      {children ?? <FileExplorerBreadcrumb />}
      <div
        role="group"
        aria-label="View"
        className="ms-auto flex shrink-0 items-center gap-1"
      >
        <Button
          type="button"
          variant={view === "list" ? "secondary" : "ghost"}
          size="icon-sm"
          aria-label="List view"
          aria-pressed={view === "list"}
          onClick={() => setView("list")}
        >
          <List />
        </Button>
        <Button
          type="button"
          variant={view === "grid" ? "secondary" : "ghost"}
          size="icon-sm"
          aria-label="Grid view"
          aria-pressed={view === "grid"}
          onClick={() => setView("grid")}
        >
          <LayoutGrid />
        </Button>
      </div>
    </div>
  );
}

type FileExplorerListProps = React.ComponentProps<"div"> & {
  /** Shown when the current folder has no children. */
  emptyState?: React.ReactNode;
};

function FileExplorerList({
  className,
  emptyState = "Empty folder",
  children,
  ...props
}: FileExplorerListProps) {
  const { current, view } = useFileExplorer();
  const entries = current.children ?? [];

  if (children != null) {
    return (
      <div
        data-slot="file-explorer-list"
        data-view={view}
        className={cn("min-h-0 flex-1 overflow-auto", className)}
        {...props}
      >
        {children}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div
        data-slot="file-explorer-list"
        data-view={view}
        className={cn("min-h-0 flex-1 overflow-auto", className)}
        {...props}
      >
        <div
          data-slot="file-explorer-empty"
          className="flex h-full items-center justify-center p-6 text-sm text-muted-foreground"
        >
          {emptyState}
        </div>
      </div>
    );
  }

  const sorted = [...entries].sort((a, b) => {
    if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  if (view === "grid") {
    return (
      <div
        data-slot="file-explorer-list"
        data-view="grid"
        role="grid"
        className={cn(
          "grid min-h-0 flex-1 auto-rows-min grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-2 overflow-auto p-3",
          className,
        )}
        {...props}
      >
        {sorted.map((node) => (
          <FileExplorerItem key={node.name} node={node} />
        ))}
      </div>
    );
  }

  return (
    <div
      data-slot="file-explorer-list"
      data-view="list"
      role="grid"
      className={cn("min-h-0 flex-1 overflow-auto", className)}
      {...props}
    >
      <div
        role="row"
        data-slot="file-explorer-list-header"
        className="grid grid-cols-[minmax(0,1fr)_5rem_8rem] items-center gap-3 border-b border-border px-3 py-2 text-xs font-medium text-muted-foreground"
      >
        <span role="columnheader">Name</span>
        <span role="columnheader" className="text-end">
          Size
        </span>
        <span role="columnheader" className="text-end">
          Modified
        </span>
      </div>
      <div role="rowgroup">
        {sorted.map((node) => (
          <FileExplorerItem key={node.name} node={node} />
        ))}
      </div>
    </div>
  );
}

type FileExplorerItemProps = Omit<React.ComponentProps<"button">, "onClick"> & {
  /** The file or folder this row represents. */
  node: FileNode;
};

function FileExplorerItem({
  node,
  className,
  ...props
}: FileExplorerItemProps) {
  const { view, open, selected, setSelected } = useFileExplorer();
  const isFolder = node.type === "folder";
  const isSelected = selected === node.name;

  const icon = isFolder ? (
    <Folder className="text-muted-foreground" />
  ) : (
    <File className="text-muted-foreground" />
  );

  const activate = () => {
    if (isFolder) {
      open(node);
    } else {
      setSelected(node.name);
    }
  };

  if (view === "grid") {
    return (
      <button
        type="button"
        role="gridcell"
        data-slot="file-explorer-item"
        data-type={node.type}
        data-state={isSelected ? "selected" : undefined}
        aria-current={isSelected ? "true" : undefined}
        onClick={activate}
        onDoubleClick={() => isFolder && open(node)}
        className={cn(
          "group flex flex-col items-center gap-2 rounded-md p-3 text-center outline-none transition-colors",
          "hover:bg-accent focus-visible:bg-accent focus-visible:ring-2 focus-visible:ring-ring",
          isSelected && "bg-accent",
          className,
        )}
        {...props}
      >
        <span className="flex size-9 items-center justify-center [&_svg]:size-7">
          {icon}
        </span>
        <span className="w-full truncate text-xs text-foreground">
          {node.name}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      role="row"
      data-slot="file-explorer-item"
      data-type={node.type}
      data-state={isSelected ? "selected" : undefined}
      aria-current={isSelected ? "true" : undefined}
      onClick={activate}
      onDoubleClick={() => isFolder && open(node)}
      className={cn(
        "grid w-full grid-cols-[minmax(0,1fr)_5rem_8rem] items-center gap-3 px-3 py-2 text-start outline-none transition-colors",
        "hover:bg-accent focus-visible:bg-accent focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
        isSelected && "bg-accent",
        className,
      )}
      {...props}
    >
      <span role="gridcell" className="flex min-w-0 items-center gap-2">
        <span className="flex shrink-0 items-center [&_svg]:size-4">{icon}</span>
        <span className="min-w-0 truncate text-sm text-foreground">
          {node.name}
        </span>
      </span>
      <span
        role="gridcell"
        className="truncate text-end text-xs text-muted-foreground"
      >
        {isFolder ? folderSummary(node) : formatSize(node.size)}
      </span>
      <span
        role="gridcell"
        className="truncate text-end text-xs text-muted-foreground"
      >
        {node.modified ?? ""}
      </span>
    </button>
  );
}

export {
  FileExplorer,
  FileExplorerSidebar,
  FileExplorerTree,
  FileExplorerBreadcrumb,
  FileExplorerToolbar,
  FileExplorerList,
  FileExplorerItem,
};
