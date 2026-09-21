'use client';

import * as React from 'react';
import { ChevronRight, File, Folder } from 'lucide-react';

import { cn } from '@/lib/utils';
import { SegmentedControl } from '@/components/segmented-control';
import { CopyButton } from '@/registry/hirael/bases/radix/components/copy-button';
import { Button } from '@/registry/hirael/bases/radix/ui/button';

export interface CodeBlockTab {
  label: string;
  code: string;
  html: string;
}

export type CodeBlockLayout = 'tabs' | 'tree';

export interface CodeBlockProps {
  tabs: CodeBlockTab[];
  defaultTab?: string;
  className?: string;
  maxHeight?: string;
  layout?: CodeBlockLayout;
  collapsible?: boolean;
}

export const CodeBlock = ({
  tabs,
  defaultTab,
  className,
  maxHeight = 'max-h-[640px]',
  layout = 'tabs',
  collapsible = false,
}: CodeBlockProps) => {
  const [activeLabel, setActiveLabel] = React.useState(() => defaultTab ?? tabs[0]?.label);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const currentTab = tabs.find((tab) => tab.label === activeLabel) ?? tabs[0];

  if (!currentTab) return null;

  if (layout === 'tree') {
    return (
      <div className={cn('overflow-hidden rounded-md border border-border bg-card', className)}>
        <div className="flex min-h-0">
          <FileTree
            paths={tabs.map((tab) => tab.label)}
            activePath={currentTab.label}
            onSelect={setActiveLabel}
            maxHeight={maxHeight}
          />
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-center justify-between gap-2 border-b border-l border-border px-2.5 py-1.5">
              <span title={currentTab.label} className="truncate text-xs text-muted-foreground">
                {currentTab.label}
              </span>
              <CopyButton value={currentTab.code} size="sm" aria-label="Copy code" />
            </div>
            <CodePane
              html={currentTab.html}
              maxHeight={maxHeight}
              isCollapsible={collapsible}
              isExpanded={isExpanded}
              onExpandedChange={setIsExpanded}
              className="border-l border-border"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('overflow-hidden rounded-md border border-border bg-card', className)}>
      <div className="flex items-center justify-between gap-2 border-b border-border px-1 py-1">
        <SegmentedControl
          role="tab"
          ariaLabel="Source files"
          value={currentTab.label}
          onValueChange={setActiveLabel}
          className="min-w-0 overflow-x-auto"
          items={tabs.map((tab) => ({
            value: tab.label,
            label: tab.label.split('/').slice(-1)[0],
            title: tab.label,
          }))}
        />
        <CopyButton value={currentTab.code} size="sm" aria-label="Copy code" className="mr-0.5" />
      </div>
      <CodePane
        html={currentTab.html}
        maxHeight={maxHeight}
        isCollapsible={collapsible}
        isExpanded={isExpanded}
        onExpandedChange={setIsExpanded}
      />
    </div>
  );
};

interface CodePaneProps {
  html: string;
  maxHeight: string;
  isCollapsible: boolean;
  isExpanded: boolean;
  onExpandedChange: (isExpanded: boolean) => void;
  className?: string;
}

const CodePane = ({ html, maxHeight, isCollapsible, isExpanded, onExpandedChange, className }: CodePaneProps) => {
  const isClipped = isCollapsible && !isExpanded;
  return (
    <div className={cn('relative', className)}>
      <div
        className={cn('shiki-scroll', isClipped ? 'max-h-72 overflow-hidden' : cn('overflow-auto', maxHeight))}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {isClipped && (
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-center bg-linear-to-t from-card via-card/85 to-transparent pb-3 pt-20">
          <Button type="button" variant="outline" size="sm" onClick={() => onExpandedChange(true)}>
            Expand source
          </Button>
        </div>
      )}
      {isCollapsible && isExpanded && (
        <div className="flex justify-center border-t border-border py-1.5">
          <Button type="button" variant="ghost" size="sm" onClick={() => onExpandedChange(false)}>
            Collapse
          </Button>
        </div>
      )}
    </div>
  );
};

interface TreeNode {
  name: string;
  filePath?: string;
  children: TreeNode[];
}

const buildTree = (paths: string[]): TreeNode[] => {
  const roots: TreeNode[] = [];
  for (const path of paths) {
    const parts = path.split('/').filter(Boolean);
    let level = roots;
    parts.forEach((segment, index) => {
      const isLeaf = index === parts.length - 1;
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
  const sortFoldersFirst = (nodes: TreeNode[]) => {
    nodes.sort((a, b) => {
      const isFolderA = a.children.length > 0;
      const isFolderB = b.children.length > 0;
      if (isFolderA !== isFolderB) return isFolderA ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    nodes.forEach((n) => sortFoldersFirst(n.children));
  };
  sortFoldersFirst(roots);
  return roots;
};

interface FileTreeProps {
  paths: string[];
  activePath: string;
  onSelect: (path: string) => void;
  maxHeight: string;
}

const FileTree = ({ paths, activePath, onSelect, maxHeight }: FileTreeProps) => {
  const tree = buildTree(paths);
  return (
    <div role="tree" aria-label="Files" className={cn('w-56 shrink-0 overflow-auto px-1 py-2 text-[12px]', maxHeight)}>
      {tree.map((node) => (
        <TreeRow key={node.name} node={node} depth={0} activePath={activePath} onSelect={onSelect} />
      ))}
    </div>
  );
};

interface TreeRowProps {
  node: TreeNode;
  depth: number;
  activePath: string;
  onSelect: (path: string) => void;
}

const TreeRow = ({ node, depth, activePath, onSelect }: TreeRowProps) => {
  const isFolder = node.children.length > 0;
  const [isOpen, setIsOpen] = React.useState(true);
  const indent = { paddingLeft: 8 + depth * 12 };

  if (isFolder) {
    return (
      <div role="treeitem" aria-expanded={isOpen} aria-selected={false}>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          style={indent}
          className={cn(
            'flex w-full items-center gap-1.5 rounded-sm py-1 pr-2 text-left text-muted-foreground transition-colors hover:text-foreground',
            'outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
          )}
        >
          <ChevronRight className={cn('size-3 shrink-0 transition-transform', isOpen && 'rotate-90')} aria-hidden />
          <Folder className="size-3 shrink-0" aria-hidden />
          <span className="truncate">{node.name}</span>
        </button>
        {isOpen && (
          <div role="group">
            {node.children.map((child) => (
              <TreeRow key={child.name} node={child} depth={depth + 1} activePath={activePath} onSelect={onSelect} />
            ))}
          </div>
        )}
      </div>
    );
  }

  const isActive = activePath === node.filePath;
  return (
    <button
      type="button"
      role="treeitem"
      aria-selected={isActive}
      onClick={() => node.filePath && onSelect(node.filePath)}
      style={indent}
      title={node.filePath}
      className={cn(
        'flex w-full items-center gap-1.5 rounded-sm py-1 pr-2 text-left transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        isActive ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground',
      )}
    >
      <span className="size-3 shrink-0" aria-hidden />
      <File className="size-3 shrink-0" aria-hidden />
      <span className="truncate">{node.name}</span>
    </button>
  );
};

export interface InlineCodeBlockProps {
  html: string;
  code: string;
  className?: string;
  maxHeight?: string;
}

export const InlineCodeBlock = ({ html, code, className, maxHeight = 'max-h-[640px]' }: InlineCodeBlockProps) => {
  return (
    <div className={cn('group relative overflow-hidden rounded-md border border-border bg-card', className)}>
      <span className="absolute right-2 top-2 z-10 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
        <CopyButton value={code} size="sm" aria-label="Copy code" />
      </span>
      <div className={cn('shiki-scroll overflow-auto', maxHeight)} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};
