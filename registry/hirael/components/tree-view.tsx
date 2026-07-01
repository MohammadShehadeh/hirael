"use client";

import * as React from "react";
import { ChevronRight, File, Folder, FolderOpen } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/registry/hirael/ui/collapsible";

type TreeCtx = {
  selected: string | undefined;
  setSelected: (value: string) => void;
  tabbable: string | null;
  setTabbable: (value: string) => void;
  registerItem: (value: string, el: HTMLButtonElement) => () => void;
  getVisibleItems: () => HTMLButtonElement[];
};

const TreeViewContext = React.createContext<TreeCtx | null>(null);

function useTreeView() {
  const ctx = React.useContext(TreeViewContext);
  if (!ctx) {
    throw new Error("TreeItem must be used inside <TreeView>");
  }
  return ctx;
}

const TreeDepthContext = React.createContext(0);

const TreeParentContext =
  React.createContext<React.RefObject<HTMLButtonElement | null> | null>(null);

/** Horizontal inset per nesting level, plus the base inset, in px. */
const TREE_INDENT_PER_LEVEL = 14;
const TREE_INDENT_BASE = 8;

export type TreeViewProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange"
> & {
  /** Id of the selected leaf. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

function TreeView({
  value: valueProp,
  defaultValue,
  onValueChange,
  className,
  ...props
}: TreeViewProps) {
  const [internal, setInternal] = React.useState<string | undefined>(
    defaultValue,
  );
  const selected = valueProp ?? internal;

  const itemsRef = React.useRef(new Map<string, HTMLButtonElement>());
  const [tabbable, setTabbable] = React.useState<string | null>(null);

  const setSelected = React.useCallback(
    (next: string) => {
      if (valueProp === undefined) setInternal(next);
      onValueChange?.(next);
    },
    [valueProp, onValueChange],
  );

  const getVisibleItems = React.useCallback(
    () =>
      Array.from(itemsRef.current.values())
        .filter((el) => el.isConnected && !el.disabled)
        .sort((a, b) =>
          a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING
            ? -1
            : 1,
        ),
    [],
  );

  const firstVisibleValue = React.useCallback(() => {
    const first = getVisibleItems()[0];
    if (!first) return null;
    for (const [itemValue, itemEl] of itemsRef.current) {
      if (itemEl === first) return itemValue;
    }
    return null;
  }, [getVisibleItems]);

  const registerItem = React.useCallback(
    (value: string, el: HTMLButtonElement) => {
      itemsRef.current.set(value, el);
      return () => {
        itemsRef.current.delete(value);
        setTabbable((current) =>
          current === value ? firstVisibleValue() : current,
        );
      };
    },
    [firstVisibleValue],
  );

  React.useEffect(() => {
    setTabbable((current) => {
      if (current !== null && itemsRef.current.has(current)) return current;
      if (selected !== undefined && itemsRef.current.has(selected)) {
        return selected;
      }
      return firstVisibleValue();
    });
  }, [selected, firstVisibleValue]);

  const ctx = React.useMemo<TreeCtx>(
    () => ({
      selected,
      setSelected,
      tabbable,
      setTabbable,
      registerItem,
      getVisibleItems,
    }),
    [
      selected,
      setSelected,
      tabbable,
      setTabbable,
      registerItem,
      getVisibleItems,
    ],
  );

  return (
    <TreeViewContext.Provider value={ctx}>
      <div
        data-slot="tree-view"
        role="tree"
        className={cn("w-full select-none text-sm", className)}
        {...props}
      />
    </TreeViewContext.Provider>
  );
}

export type TreeItemProps = Omit<React.ComponentProps<"div">, "title"> & {
  /** Unique id used for selection. */
  value: string;
  label: React.ReactNode;
  /** Override the leading icon. Pass `null` to hide it entirely. */
  icon?: React.ReactNode;
  defaultExpanded?: boolean;
  disabled?: boolean;
};

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
  const {
    selected,
    setSelected,
    tabbable,
    setTabbable,
    registerItem,
    getVisibleItems,
  } = useTreeView();
  const depth = React.useContext(TreeDepthContext);
  const parentTriggerRef = React.useContext(TreeParentContext);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const [open, setOpen] = React.useState(defaultExpanded);

  const hasChildren = React.Children.count(children) > 0;
  const isSelected = !hasChildren && selected === value;

  React.useLayoutEffect(() => {
    const el = triggerRef.current;
    if (!el) return;
    return registerItem(value, el);
  }, [registerItem, value]);

  const onTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const { key } = event;
    if (
      key !== "ArrowDown" &&
      key !== "ArrowUp" &&
      key !== "ArrowLeft" &&
      key !== "ArrowRight" &&
      key !== "Home" &&
      key !== "End"
    ) {
      return;
    }
    event.preventDefault();
    const items = getVisibleItems();
    const index = items.indexOf(event.currentTarget);
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
    const expandKey = rtl ? "ArrowLeft" : "ArrowRight";

    if (key === "ArrowDown") {
      items[index + 1]?.focus();
    } else if (key === "ArrowUp") {
      items[index - 1]?.focus();
    } else if (key === "Home") {
      items[0]?.focus();
    } else if (key === "End") {
      items[items.length - 1]?.focus();
    } else if (key === expandKey) {
      if (!hasChildren) return;
      if (open) items[index + 1]?.focus();
      else setOpen(true);
    } else if (hasChildren && open) {
      setOpen(false);
    } else {
      parentTriggerRef?.current?.focus();
    }
  };

  const triggerStyle: React.CSSProperties = {
    paddingInlineStart: depth * TREE_INDENT_PER_LEVEL + TREE_INDENT_BASE,
  };
  const triggerClassName = cn(
    "group flex h-7 w-full items-center gap-1.5 rounded-sm pe-2 text-start outline-none transition-colors",
    "hover:bg-accent focus-visible:bg-accent focus-visible:ring-2 focus-visible:ring-ring",
    "disabled:cursor-not-allowed disabled:opacity-50",
    isSelected ? "bg-accent font-medium text-foreground" : "text-foreground/80",
    className,
  );
  const triggerProps = {
    ref: triggerRef,
    type: "button" as const,
    disabled,
    tabIndex: tabbable === value ? 0 : -1,
    "data-slot": "tree-item-trigger",
    style: triggerStyle,
    className: triggerClassName,
    onKeyDown: onTriggerKeyDown,
    onFocus: () => setTabbable(value),
  };

  // Folder open/closed and the chevron rotation are driven off the trigger's
  // data-[state] (set by Collapsible) instead of tracked React state.
  const leadingIcon =
    icon !== undefined ? (
      icon
    ) : hasChildren ? (
      <>
        <Folder className="size-4 text-muted-foreground group-data-[state=open]:hidden" />
        <FolderOpen className="hidden size-4 text-muted-foreground group-data-[state=open]:block" />
      </>
    ) : (
      <File className="size-4 text-muted-foreground" />
    );

  const labelRow = (
    <>
      <ChevronRight
        aria-hidden
        className={cn(
          "size-3.5 shrink-0 text-muted-foreground transition-transform duration-150",
          hasChildren
            ? "group-data-[state=open]:rotate-90 rtl:group-data-[state=closed]:rotate-180"
            : "invisible",
        )}
      />
      {leadingIcon != null && (
        <span className="flex shrink-0 items-center [&_svg]:size-4">
          {leadingIcon}
        </span>
      )}
      <span className="min-w-0 truncate">{label}</span>
    </>
  );

  if (hasChildren) {
    return (
      <Collapsible asChild open={open} onOpenChange={setOpen}>
        <div
          data-slot="tree-item"
          role="treeitem"
          aria-selected={isSelected}
          aria-expanded={open}
          {...props}
        >
          <CollapsibleTrigger asChild>
            <button {...triggerProps}>{labelRow}</button>
          </CollapsibleTrigger>
          <CollapsibleContent asChild>
            <div role="group">
              <TreeDepthContext.Provider value={depth + 1}>
                <TreeParentContext.Provider value={triggerRef}>
                  {children}
                </TreeParentContext.Provider>
              </TreeDepthContext.Provider>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    );
  }

  return (
    <div
      data-slot="tree-item"
      role="treeitem"
      aria-selected={isSelected}
      {...props}
    >
      <button
        {...triggerProps}
        data-state={isSelected ? "selected" : undefined}
        onClick={() => setSelected(value)}
      >
        {labelRow}
      </button>
    </div>
  );
}

export { TreeView, TreeItem };
