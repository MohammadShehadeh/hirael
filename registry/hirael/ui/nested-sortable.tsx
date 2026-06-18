"use client";

import * as React from "react";
import { ChevronRight, GripVertical } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/registry/hirael/ui/button";

export type NestedItem = {
  id: string;
  label: string;
  children?: NestedItem[];
};

type FlatItem = {
  id: string;
  label: string;
  depth: number;
  childCount: number;
};

type ItemEntry = {
  node: HTMLElement;
};

type NestedSortableCtx = {
  flat: FlatItem[];
  dragId: string | null;
  grabbedId: string | null;
  dropIndex: number | null;
  dropDepth: number;
  registerItem: (id: string, entry: ItemEntry) => () => void;
  startPress: (e: React.PointerEvent, id: string) => void;
  handlePointerMove: (e: React.PointerEvent, id: string) => void;
  handlePointerEnd: (e: React.PointerEvent, id: string, cancel: boolean) => void;
  handleKeyDown: (e: React.KeyboardEvent, id: string) => void;
  handleBlur: (id: string) => void;
};

const NestedSortableContext = React.createContext<NestedSortableCtx | null>(
  null,
);

function useNestedSortable() {
  const ctx = React.useContext(NestedSortableContext);
  if (!ctx) {
    throw new Error(
      "NestedSortable compound parts must be used inside <NestedSortable>",
    );
  }
  return ctx;
}

type NestedSortableItemCtx = {
  id: string;
  depth: number;
  state: "idle" | "grabbed";
};

const NestedSortableItemContext =
  React.createContext<NestedSortableItemCtx | null>(null);

function useNestedSortableItem() {
  const ctx = React.useContext(NestedSortableItemContext);
  if (!ctx) {
    throw new Error(
      "NestedSortable item parts must be used inside <NestedSortableItem>",
    );
  }
  return ctx;
}

const DRAG_THRESHOLD = 5;
const INDENT_PER_LEVEL = 24;
const INDENT_BASE = 8;

function flatten(items: NestedItem[], depth: number, out: FlatItem[]) {
  for (const item of items) {
    const children = item.children ?? [];
    out.push({
      id: item.id,
      label: item.label,
      depth,
      childCount: children.length,
    });
    if (children.length > 0) flatten(children, depth + 1, out);
  }
  return out;
}

function rebuild(flat: FlatItem[]): NestedItem[] {
  const root: NestedItem[] = [];
  const stack: { depth: number; children: NestedItem[] }[] = [
    { depth: -1, children: root },
  ];
  for (const entry of flat) {
    while (stack.length > 1 && stack[stack.length - 1].depth >= entry.depth) {
      stack.pop();
    }
    const node: NestedItem = { id: entry.id, label: entry.label };
    stack[stack.length - 1].children.push(node);
    const children: NestedItem[] = [];
    node.children = children;
    stack.push({ depth: entry.depth, children });
  }
  return pruneEmpty(root);
}

function pruneEmpty(items: NestedItem[]): NestedItem[] {
  return items.map((item) => {
    const children = item.children ? pruneEmpty(item.children) : [];
    const node: NestedItem = { id: item.id, label: item.label };
    if (children.length > 0) node.children = children;
    return node;
  });
}

/** Index just past the moving item's last descendant in the flat list. */
function branchEnd(flat: FlatItem[], from: number) {
  const depth = flat[from].depth;
  let end = from + 1;
  while (end < flat.length && flat[end].depth > depth) end += 1;
  return end;
}

export type NestedSortableProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange"
> & {
  /** Controlled tree of items. */
  value?: NestedItem[];
  /** Initial tree of items when uncontrolled. */
  defaultValue?: NestedItem[];
  /** Called with the rebuilt tree after a reorder, indent, or outdent. */
  onValueChange?: (value: NestedItem[]) => void;
  /** Deepest nesting level allowed, where the top level is 0. */
  maxDepth?: number;
};

function NestedSortable({
  value: valueProp,
  defaultValue = [],
  onValueChange,
  maxDepth = Infinity,
  className,
  children,
  ...props
}: NestedSortableProps) {
  const [internal, setInternal] = React.useState(defaultValue);
  const [dragId, setDragId] = React.useState<string | null>(null);
  const [grabbedId, setGrabbedId] = React.useState<string | null>(null);
  const [dropIndex, setDropIndex] = React.useState<number | null>(null);
  const [dropDepth, setDropDepth] = React.useState(0);
  const [liveText, setLiveText] = React.useState("");

  const committed = valueProp ?? internal;

  const flat = React.useMemo(() => flatten(committed, 0, []), [committed]);
  const flatRef = React.useRef(flat);
  flatRef.current = flat;

  const itemsRef = React.useRef(new Map<string, ItemEntry>());
  const pressRef = React.useRef<{ id: string; x: number; y: number } | null>(
    null,
  );
  const rtlRef = React.useRef(false);
  const listRef = React.useRef<HTMLDivElement | null>(null);

  const registerItem = React.useCallback((id: string, entry: ItemEntry) => {
    itemsRef.current.set(id, entry);
    return () => {
      itemsRef.current.delete(id);
    };
  }, []);

  const announce = React.useCallback((text: string) => {
    setLiveText(text);
  }, []);

  const labelOf = React.useCallback(
    (id: string) => flatRef.current.find((f) => f.id === id)?.label ?? id,
    [],
  );

  const isRtl = React.useCallback(
    () =>
      listRef.current !== null &&
      getComputedStyle(listRef.current).direction === "rtl",
    [],
  );

  const commit = React.useCallback(
    (next: NestedItem[]) => {
      if (valueProp === undefined) setInternal(next);
      onValueChange?.(next);
    },
    [valueProp, onValueChange],
  );

  const cancel = React.useCallback(() => {
    setDragId(null);
    setGrabbedId(null);
    setDropIndex(null);
    pressRef.current = null;
  }, []);

  /**
   * Move the branch rooted at `id` so that, in the flattened list, it lands at
   * `targetIndex` (an index into the list with the moving branch removed) at
   * `desiredDepth`. Depth is capped at one past the previous row and at
   * `maxDepth`. When `clampToNext` is set (pointer drag), it is also floored at
   * the depth of the row it lands above so that row keeps its parent. Returns
   * the rebuilt tree and the moving item's final depth.
   */
  const computeMove = React.useCallback(
    (
      id: string,
      targetIndex: number,
      desiredDepth: number,
      clampToNext: boolean,
    ) => {
      const list = flatRef.current;
      const from = list.findIndex((f) => f.id === id);
      if (from === -1) return null;
      const end = branchEnd(list, from);
      const branch = list.slice(from, end);
      const rest = [...list.slice(0, from), ...list.slice(end)];

      const at = Math.max(0, Math.min(targetIndex, rest.length));
      const before = rest[at - 1];
      const after = rest[at];
      const maxAllowed = Math.min(before ? before.depth + 1 : 0, maxDepth);
      const minAllowed = clampToNext && after ? after.depth : 0;
      const depth = Math.max(minAllowed, Math.min(desiredDepth, maxAllowed));

      const shift = depth - branch[0].depth;
      const shifted = branch.map((f) => ({ ...f, depth: f.depth + shift }));
      const merged = [...rest.slice(0, at), ...shifted, ...rest.slice(at)];
      return { tree: rebuild(merged), depth };
    },
    [maxDepth],
  );

  const startPress = React.useCallback(
    (e: React.PointerEvent, id: string) => {
      if (e.button !== 0) return;
      pressRef.current = { id, x: e.clientX, y: e.clientY };
      e.currentTarget.setPointerCapture(e.pointerId);
      rtlRef.current = isRtl();
    },
    [isRtl],
  );

  const handlePointerMove = React.useCallback(
    (e: React.PointerEvent, id: string) => {
      const press = pressRef.current;
      if (!press || press.id !== id) return;

      if (dragId !== id) {
        const dx = e.clientX - press.x;
        const dy = e.clientY - press.y;
        if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
        setDragId(id);
        setGrabbedId(null);
      }

      const list = flatRef.current;
      const from = list.findIndex((f) => f.id === id);
      if (from === -1) return;
      const end = branchEnd(list, from);

      let target = list.length;
      for (let i = 0; i < list.length; i += 1) {
        if (i >= from && i < end) continue;
        const entry = itemsRef.current.get(list[i].id);
        if (!entry) continue;
        const rect = entry.node.getBoundingClientRect();
        const mid = (rect.top + rect.bottom) / 2;
        if (e.clientY < mid) {
          target = i;
          break;
        }
      }
      const restIndex = target > from ? target - (end - from) : target;

      const startDelta = rtlRef.current
        ? press.x - e.clientX
        : e.clientX - press.x;
      const desired =
        list[from].depth + Math.round(startDelta / INDENT_PER_LEVEL);

      const moved = computeMove(id, restIndex, desired, true);
      if (!moved) return;
      setDropIndex(target);
      setDropDepth(moved.depth);
    },
    [dragId, computeMove],
  );

  const handlePointerEnd = React.useCallback(
    (e: React.PointerEvent, id: string, cancelled: boolean) => {
      const wasDragging = dragId === id;
      pressRef.current = null;
      const target = dropIndex;
      const depth = dropDepth;
      setDropIndex(null);
      if (!wasDragging) return;
      setDragId(null);
      if (cancelled || target === null) return;
      const list = flatRef.current;
      const from = list.findIndex((f) => f.id === id);
      const end = branchEnd(list, from);
      const restIndex = target > from ? target - (end - from) : target;
      const moved = computeMove(id, restIndex, depth, true);
      if (!moved) return;
      commit(moved.tree);
      announce(`Moved ${labelOf(id)} to level ${moved.depth + 1}`);
    },
    [dragId, dropIndex, dropDepth, computeMove, commit, announce, labelOf],
  );

  const moveVertical = React.useCallback(
    (id: string, dir: -1 | 1) => {
      const list = flatRef.current;
      const from = list.findIndex((f) => f.id === id);
      if (from === -1) return;
      const end = branchEnd(list, from);
      const self = list[from];

      const target =
        dir === -1 ? from - 1 : end < list.length ? end + 1 : list.length;
      if (dir === -1 && from === 0) return;
      if (dir === 1 && end >= list.length) return;

      const restIndex = target > from ? target - (end - from) : target;
      const moved = computeMove(id, restIndex, self.depth, true);
      if (!moved) return;
      commit(moved.tree);
      const next = flatten(moved.tree, 0, []);
      const pos = next.findIndex((f) => f.id === id);
      announce(`Moved ${labelOf(id)} to position ${pos + 1} of ${next.length}`);
    },
    [computeMove, commit, announce, labelOf],
  );

  const reparent = React.useCallback(
    (id: string, dir: -1 | 1) => {
      const list = flatRef.current;
      const from = list.findIndex((f) => f.id === id);
      if (from === -1) return;
      const self = list[from];
      const targetDepth = self.depth + dir;
      if (targetDepth < 0) return;
      const moved = computeMove(id, from, targetDepth, false);
      if (!moved || moved.depth === self.depth) return;
      commit(moved.tree);
      const verb = dir === 1 ? "Indented" : "Outdented";
      announce(`${verb} ${labelOf(id)} to level ${moved.depth + 1}`);
    },
    [computeMove, commit, announce, labelOf],
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent, id: string) => {
      const rtl = isRtl();

      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (grabbedId === id) {
          setGrabbedId(null);
          announce(`Dropped ${labelOf(id)}`);
        } else if (grabbedId === null && dragId === null) {
          setGrabbedId(id);
          announce(
            `Grabbed ${labelOf(id)}. Use up and down arrows to move, left and right arrows to outdent and indent, Space to drop, Escape to cancel.`,
          );
        }
        return;
      }

      if (e.key === "Escape") {
        if (grabbedId === id) {
          e.preventDefault();
          cancel();
          announce(`Reorder cancelled. ${labelOf(id)} returned to its place.`);
        }
        return;
      }

      if (e.key === "Tab") {
        if (grabbedId !== id) return;
        e.preventDefault();
        reparent(id, e.shiftKey ? -1 : 1);
        return;
      }

      if (grabbedId !== id) return;

      if (e.key === "ArrowUp") {
        e.preventDefault();
        moveVertical(id, -1);
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        moveVertical(id, 1);
        return;
      }
      const startKey = rtl ? "ArrowRight" : "ArrowLeft";
      const endKey = rtl ? "ArrowLeft" : "ArrowRight";
      if (e.key === endKey) {
        e.preventDefault();
        reparent(id, 1);
        return;
      }
      if (e.key === startKey) {
        e.preventDefault();
        reparent(id, -1);
      }
    },
    [
      isRtl,
      grabbedId,
      dragId,
      cancel,
      reparent,
      moveVertical,
      announce,
      labelOf,
    ],
  );

  const handleBlur = React.useCallback(
    (id: string) => {
      if (grabbedId === id) cancel();
    },
    [grabbedId, cancel],
  );

  React.useEffect(() => {
    if (!dragId) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        cancel();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dragId, cancel]);

  const ctx = React.useMemo<NestedSortableCtx>(
    () => ({
      flat,
      dragId,
      grabbedId,
      dropIndex,
      dropDepth,
      registerItem,
      startPress,
      handlePointerMove,
      handlePointerEnd,
      handleKeyDown,
      handleBlur,
    }),
    [
      flat,
      dragId,
      grabbedId,
      dropIndex,
      dropDepth,
      registerItem,
      startPress,
      handlePointerMove,
      handlePointerEnd,
      handleKeyDown,
      handleBlur,
    ],
  );

  return (
    <NestedSortableContext.Provider value={ctx}>
      <div
        ref={listRef}
        role="tree"
        aria-label="Sortable outline"
        data-slot="nested-sortable"
        className={cn("relative flex flex-col gap-1", className)}
        {...props}
      >
        {children ??
          flat.map((item) => (
            <NestedSortableItem key={item.id} value={item.id}>
              <NestedSortableHandle />
              <NestedSortableLabel>{item.label}</NestedSortableLabel>
            </NestedSortableItem>
          ))}
        <span
          data-slot="nested-sortable-live"
          aria-live="polite"
          className="sr-only"
        >
          {liveText}
        </span>
      </div>
    </NestedSortableContext.Provider>
  );
}

export type NestedSortableItemProps = React.ComponentProps<"div"> & {
  /** Unique id matching an entry in the root tree. */
  value: string;
};

function NestedSortableItem({
  value,
  className,
  style,
  children,
  ...props
}: NestedSortableItemProps) {
  const {
    flat,
    dragId,
    grabbedId,
    dropIndex,
    dropDepth,
    registerItem,
    handleKeyDown,
    handleBlur,
  } = useNestedSortable();

  const ref = React.useRef<HTMLDivElement | null>(null);
  const order = flat.findIndex((f) => f.id === value);
  const depth = order === -1 ? 0 : flat[order].depth;

  React.useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    return registerItem(value, { node });
  }, [value, registerItem]);

  const state: "idle" | "grabbed" =
    dragId === value || grabbedId === value ? "grabbed" : "idle";

  const showIndicator = dragId !== null && dropIndex === order;

  const itemCtx = React.useMemo<NestedSortableItemCtx>(
    () => ({ id: value, depth, state }),
    [value, depth, state],
  );

  const guides = Array.from({ length: depth }, (_, i) => (
    <span
      key={i}
      aria-hidden
      data-slot="nested-sortable-guide"
      className="absolute top-0 bottom-0 w-px bg-border"
      style={{ insetInlineStart: i * INDENT_PER_LEVEL + INDENT_BASE + 11 }}
    />
  ));

  return (
    <NestedSortableItemContext.Provider value={itemCtx}>
      <div
        ref={ref}
        role="treeitem"
        aria-level={depth + 1}
        data-slot="nested-sortable-item"
        data-state={state}
        data-depth={depth}
        aria-roledescription="sortable item"
        style={{
          ...style,
          order: order === -1 ? undefined : order,
          paddingInlineStart: depth * INDENT_PER_LEVEL + INDENT_BASE,
        }}
        className={cn(
          "group/nested-item relative",
          state === "grabbed" && "z-10",
          className,
        )}
        {...props}
      >
        {guides}
        {showIndicator && (
          <span
            aria-hidden
            data-slot="nested-sortable-indicator"
            className="pointer-events-none absolute -top-0.5 end-0 z-20 h-0.5 rounded-full bg-primary"
            style={{
              insetInlineStart: dropDepth * INDENT_PER_LEVEL + INDENT_BASE,
            }}
          />
        )}
        <div
          data-slot="nested-sortable-row"
          tabIndex={-1}
          onKeyDown={(e) => handleKeyDown(e, value)}
          onBlur={() => handleBlur(value)}
          className={cn(
            "relative flex select-none items-center gap-2 rounded-md border border-border bg-background px-2 py-1.5 text-sm outline-none transition-[box-shadow,transform,background-color]",
            "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
            state === "grabbed" &&
              "scale-[1.01] border-ring bg-card shadow-lg ring-2 ring-ring/40",
          )}
        >
          {children}
        </div>
      </div>
    </NestedSortableItemContext.Provider>
  );
}

function NestedSortableHandle({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { startPress, handlePointerMove, handlePointerEnd, handleKeyDown } =
    useNestedSortable();
  const { id, state } = useNestedSortableItem();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-xs"
      data-slot="nested-sortable-handle"
      data-state={state}
      aria-label="Drag to reorder or nest"
      aria-pressed={state === "grabbed"}
      onPointerDown={(e) => startPress(e, id)}
      onPointerMove={(e) => handlePointerMove(e, id)}
      onPointerUp={(e) => handlePointerEnd(e, id, false)}
      onPointerCancel={(e) => handlePointerEnd(e, id, true)}
      onKeyDown={(e) => handleKeyDown(e, id)}
      className={cn(
        "shrink-0 cursor-grab touch-none text-muted-foreground hover:text-foreground",
        state === "grabbed" && "cursor-grabbing text-foreground",
        className,
      )}
      {...props}
    >
      {children ?? <GripVertical aria-hidden />}
    </Button>
  );
}

function NestedSortableLabel({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  const { depth } = useNestedSortableItem();

  return (
    <span
      data-slot="nested-sortable-label"
      className={cn("flex min-w-0 flex-1 items-center gap-1.5", className)}
      {...props}
    >
      {depth > 0 && (
        <ChevronRight
          aria-hidden
          className="size-3.5 shrink-0 text-muted-foreground rtl:rotate-180"
        />
      )}
      <span className="min-w-0 truncate">{children}</span>
    </span>
  );
}

export {
  NestedSortable,
  NestedSortableItem,
  NestedSortableHandle,
  NestedSortableLabel,
};
