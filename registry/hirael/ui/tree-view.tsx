"use client"

import * as React from "react"
import { ChevronRight, File, Folder, FolderOpen } from "lucide-react"

import { cn } from "@/lib/utils"

type TreeCtx = {
  selected: string | undefined
  setSelected: (value: string) => void
}

const TreeViewContext = React.createContext<TreeCtx | null>(null)

function useTreeView() {
  const ctx = React.useContext(TreeViewContext)
  if (!ctx) {
    throw new Error("TreeItem must be used inside <TreeView>")
  }
  return ctx
}

const TreeDepthContext = React.createContext(0)

/** Horizontal inset per nesting level, plus the base inset, in px. */
const TREE_INDENT_PER_LEVEL = 14
const TREE_INDENT_BASE = 8

export type TreeViewProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange"
> & {
  /** Id of the selected leaf. */
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

function TreeView({
  value: valueProp,
  defaultValue,
  onValueChange,
  className,
  ...props
}: TreeViewProps) {
  const [internal, setInternal] = React.useState<string | undefined>(defaultValue)
  const selected = valueProp ?? internal

  const setSelected = React.useCallback(
    (next: string) => {
      if (valueProp === undefined) setInternal(next)
      onValueChange?.(next)
    },
    [valueProp, onValueChange]
  )

  const ctx = React.useMemo<TreeCtx>(
    () => ({ selected, setSelected }),
    [selected, setSelected]
  )

  return (
    <TreeViewContext.Provider value={ctx}>
      <div
        data-slot="tree-view"
        role="tree"
        className={cn("w-full select-none text-sm", className)}
        {...props}
      />
    </TreeViewContext.Provider>
  )
}

export type TreeItemProps = Omit<React.ComponentProps<"div">, "title"> & {
  /** Unique id used for selection. */
  value: string
  label: React.ReactNode
  /** Override the leading icon. Pass `null` to hide it entirely. */
  icon?: React.ReactNode
  defaultExpanded?: boolean
  disabled?: boolean
}

function TreeItem({
  value,
  label,
  icon,
  defaultExpanded = false,
  disabled = false,
  className,
  children,
  ...props
}: TreeItemProps) {
  const { selected, setSelected } = useTreeView()
  const depth = React.useContext(TreeDepthContext)

  const hasChildren = React.Children.count(children) > 0
  const [expanded, setExpanded] = React.useState(defaultExpanded)

  const isSelected = !hasChildren && selected === value

  const leadingIcon =
    icon !== undefined ? (
      icon
    ) : hasChildren ? (
      expanded ? (
        <FolderOpen className="size-4 text-muted-foreground" />
      ) : (
        <Folder className="size-4 text-muted-foreground" />
      )
    ) : (
      <File className="size-4 text-muted-foreground" />
    )

  return (
    <div data-slot="tree-item" role="treeitem" aria-selected={isSelected} {...props}>
      <button
        type="button"
        disabled={disabled}
        data-slot="tree-item-trigger"
        data-state={isSelected ? "selected" : undefined}
        aria-expanded={hasChildren ? expanded : undefined}
        onClick={() => {
          if (hasChildren) setExpanded((o) => !o)
          else setSelected(value)
        }}
        style={{
          paddingInlineStart: depth * TREE_INDENT_PER_LEVEL + TREE_INDENT_BASE,
        }}
        className={cn(
          "flex h-7 w-full items-center gap-1.5 rounded-sm pe-2 text-start outline-none transition-colors",
          "hover:bg-accent focus-visible:bg-accent focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          isSelected
            ? "bg-accent font-medium text-foreground"
            : "text-foreground/80",
          className
        )}
      >
        <ChevronRight
          aria-hidden
          className={cn(
            "size-3.5 shrink-0 text-muted-foreground transition-transform duration-150",
            !hasChildren && "invisible",
            expanded ? "rotate-90" : "rtl:rotate-180"
          )}
        />
        {leadingIcon != null && (
          <span className="flex shrink-0 items-center [&_svg]:size-4">
            {leadingIcon}
          </span>
        )}
        <span className="min-w-0 truncate">{label}</span>
      </button>

      {hasChildren && expanded && (
        <div role="group">
          <TreeDepthContext.Provider value={depth + 1}>
            {children}
          </TreeDepthContext.Provider>
        </div>
      )}
    </div>
  )
}

export { TreeView, TreeItem }
