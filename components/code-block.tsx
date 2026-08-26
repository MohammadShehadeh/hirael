"use client";

import * as React from "react";
import { ChevronRight, File, Folder } from "lucide-react";

import { cn } from "@/lib/utils";
import { SegmentedControl } from "@/components/segmented-control";
import { CopyButton } from "@/registry/hirael/components/copy-button";
import { Button } from "@/registry/hirael/ui/button";

export interface CodeBlockTab {
  /** Tab label (e.g. filename or install-target path). */
  label: string;
  /** Raw source — used for copy + clipboard. */
  code: string;
  /** Pre-highlighted shiki HTML for `code`. */
  html: string;}

export type CodeBlockLayout = "tabs" | "tree";

export const CodeBlock = ({
  tabs,
  defaultTab,
  className,
  maxHeight = "max-h-[640px]",
  layout = "tabs",
  collapsible = false,
}: {
  tabs: CodeBlockTab[];
  defaultTab?: string;
  className?: string;
  /** Tailwind max-h class for the scroll area. */
  maxHeight?: string;
  /** "tabs" (horizontal) or "tree" (left sidebar file hierarchy). */
  layout?: CodeBlockLayout;
  /** Clip to a short preview behind an "Expand" control. */
  collapsible?: boolean;
}) => {
  const [active, setActive] = React.useState(
    () => defaultTab ?? tabs[0]?.label,
  );
  const [expanded, setExpanded] = React.useState(false);
  const current = tabs.find((t) => t.label === active) ?? tabs[0];

  if (!current) return null;

  if (layout === "tree") {
    return (
      <div
        className={cn(
          "overflow-hidden rounded-md border border-border bg-card",
          className,
        )}
      >
        <div className="flex min-h-0">
          <FileTree
            paths={tabs.map((t) => t.label)}
            active={current.label}
            onSelect={setActive}
            maxHeight={maxHeight}
          />
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-center justify-between gap-2 border-b border-l border-border px-2.5 py-1.5">
              <span
                title={current.label}
                className="truncate font-mono text-[11px] text-muted-foreground"
              >
                {current.label}
              </span>
              <CopyButton
                value={current.code}
                size="sm"
                aria-label="Copy code"
              />
            </div>
            <CodePane
              html={current.html}
              maxHeight={maxHeight}
              collapsible={collapsible}
              expanded={expanded}
              onExpandedChange={setExpanded}
              className="border-l border-border"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border border-border bg-card",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border px-1 py-1">
        <SegmentedControl
          role="tab"
          ariaLabel="Source files"
          value={current.label}
          onValueChange={setActive}
          className="min-w-0 overflow-x-auto"
          items={tabs.map((t) => ({
            value: t.label,
            label: t.label.split("/").slice(-1)[0],
            title: t.label,
          }))}
        />
        <CopyButton
          value={current.code}
          size="sm"
          aria-label="Copy code"
          className="mr-0.5"
        />
      </div>
      <CodePane
        html={current.html}
        maxHeight={maxHeight}
        collapsible={collapsible}
        expanded={expanded}
        onExpandedChange={setExpanded}
      />
    </div>
  );
};

const CodePane = ({
  html,
  maxHeight,
  collapsible,
  expanded,
  onExpandedChange,
  className,
}: {
  html: string;
  maxHeight: string;
  collapsible: boolean;
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  className?: string;
}) => {
  const clipped = collapsible && !expanded;
  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "shiki-scroll",
          clipped ? "max-h-72 overflow-hidden" : cn("overflow-auto", maxHeight),
        )}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {clipped && (
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-center bg-linear-to-t from-card via-card/85 to-transparent pb-3 pt-20">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onExpandedChange(true)}
            className="rounded-full bg-background"
          >
            Expand source
          </Button>
        </div>
      )}
      {collapsible && expanded && (
        <div className="flex justify-center border-t border-border py-1.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onExpandedChange(false)}
            className="text-muted-foreground"
          >
            Collapse
          </Button>
        </div>
      )}
    </div>
  );
};

interface TreeNode {
  name: string;
  /** Full path when this node is a file; undefined for folders. */
  filePath?: string;
  children: TreeNode[];}

const buildTree = (paths: string[]): TreeNode[] => {
  const roots: TreeNode[] = [];
  for (const path of paths) {
    const parts = path.split("/").filter(Boolean);
    let level = roots;
    parts.forEach((segment, i) => {
      const isLeaf = i === parts.length - 1;
      let node = level.find((n) => n.name === segment);
      if (!node) {
        node = { name: segment, children: [] };
        if (isLeaf) node.filePath = path;
        level.push(node);
      } else if (isLeaf && !node.filePath) {
        node.filePath = path;
      }
      level = node.children;
    });
  }
  const sort = (nodes: TreeNode[]) => {
    nodes.sort((a, b) => {
      const aFolder = a.children.length > 0;
      const bFolder = b.children.length > 0;
      if (aFolder !== bFolder) return aFolder ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    nodes.forEach((n) => sort(n.children));
  };
  sort(roots);
  return roots;
};

const FileTree = ({
  paths,
  active,
  onSelect,
  maxHeight,
}: {
  paths: string[];
  active: string;
  onSelect: (path: string) => void;
  maxHeight: string;
}) => {
  const tree = buildTree(paths);
  return (
    <div
      role="tree"
      aria-label="Files"
      className={cn(
        "w-56 shrink-0 overflow-auto py-2 pl-1 pr-1 text-[12px]",
        maxHeight,
      )}
    >
      {tree.map((node) => (
        <TreeRow
          key={node.name}
          node={node}
          depth={0}
          active={active}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

const TreeRow = ({
  node,
  depth,
  active,
  onSelect,
}: {
  node: TreeNode;
  depth: number;
  active: string;
  onSelect: (path: string) => void;
}) => {
  const isFolder = node.children.length > 0;
  const [open, setOpen] = React.useState(true);
  const indent = { paddingLeft: 8 + depth * 12 };

  if (isFolder) {
    return (
      <div role="treeitem" aria-expanded={open} aria-selected={false}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          style={indent}
          className={cn(
            "flex w-full items-center gap-1.5 rounded-sm py-1 pr-2 text-left font-mono text-muted-foreground transition-colors hover:text-foreground",
            "outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
          )}
        >
          <ChevronRight
            className={cn(
              "size-3 shrink-0 transition-transform",
              open && "rotate-90",
            )}
            aria-hidden
          />
          <Folder className="size-3 shrink-0" aria-hidden />
          <span className="truncate">{node.name}</span>
        </button>
        {open && (
          <div role="group">
            {node.children.map((child) => (
              <TreeRow
                key={child.name}
                node={child}
                depth={depth + 1}
                active={active}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  const isActive = active === node.filePath;
  return (
    <button
      type="button"
      role="treeitem"
      aria-selected={isActive}
      onClick={() => node.filePath && onSelect(node.filePath)}
      style={indent}
      title={node.filePath}
      className={cn(
        "flex w-full items-center gap-1.5 rounded-sm py-1 pr-2 text-left font-mono transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isActive
          ? "bg-accent text-foreground"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      <span className="size-3 shrink-0" aria-hidden />
      <File className="size-3 shrink-0" aria-hidden />
      <span className="truncate">{node.name}</span>
    </button>
  );
};

export const InlineCodeBlock = ({
  html,
  code,
  className,
  maxHeight = "max-h-[640px]",
}: {
  html: string;
  code: string;
  className?: string;
  maxHeight?: string;
}) => {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-md border border-border bg-card",
        className,
      )}
    >
      <CopyButton
        value={code}
        size="sm"
        aria-label="Copy code"
        className="absolute right-2 top-2 z-10 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
      />
      <div
        className={cn("shiki-scroll overflow-auto", maxHeight)}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};
