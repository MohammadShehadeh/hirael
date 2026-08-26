"use client";

import * as React from "react";
import { ChevronRight, ChevronsDownUp, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { CopyButton } from "@/registry/hirael/components/copy-button";
import { Button } from "@/registry/hirael/ui/button";

type JsonKind =
  | "object"
  | "array"
  | "string"
  | "number"
  | "bigint"
  | "boolean"
  | "null"
  | "undefined"
  | "date"
  | "function"
  | "symbol";

const kindOf = (value: unknown): JsonKind => {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  if (value instanceof Date) return "date";
  const type = typeof value;
  if (type === "object") return "object";
  if (type === "string") return "string";
  if (type === "number") return "number";
  if (type === "bigint") return "bigint";
  if (type === "boolean") return "boolean";
  if (type === "function") return "function";
  if (type === "symbol") return "symbol";
  return "undefined";
};

const isExpandable = (kind: JsonKind) => {
  return kind === "object" || kind === "array";
};

const entriesOf = (value: unknown, kind: JsonKind): [string, unknown][] => {
  if (kind === "array") {
    return (value as unknown[]).map((v, i) => [String(i), v]);
  }
  if (kind === "object") {
    return Object.entries(value as Record<string, unknown>);
  }
  return [];
};

const childPath = (path: string, key: string, parentKind: JsonKind) => {
  return parentKind === "array" ? `${path}[${key}]` : `${path}.${key}`;
};

/** Every expandable path in `value`, root included. */
const collectPaths = (value: unknown, path = "$"): string[] => {
  const kind = kindOf(value);
  if (!isExpandable(kind)) return [];
  const out = [path];
  for (const [key, child] of entriesOf(value, kind)) {
    out.push(...collectPaths(child, childPath(path, key, kind)));
  }
  return out;
};

const stringify = (value: unknown, indent: number) => {
  return JSON.stringify(
    value,
    (_key, v: unknown) => (typeof v === "bigint" ? v.toString() : v),
    indent,
  );
};

interface JsonViewerCtx {
  value: unknown;
  maxStringLength: number;
  isExpanded: (path: string, depth: number) => boolean;
  toggle: (path: string, depth: number) => void;
  expandAll: () => void;
  collapseAll: () => void;
  focusedPath: string;
  setFocusedPath: (path: string) => void;
  treeRef: React.RefObject<HTMLDivElement | null>;}

const JsonViewerContext = React.createContext<JsonViewerCtx | null>(null);

const useJsonViewer = () => {
  const ctx = React.useContext(JsonViewerContext);
  if (!ctx) {
    throw new Error(
      "JsonViewer compound parts must be used inside <JsonViewer>",
    );
  }
  return ctx;
};

interface JsonViewerNodeCtx {
  path: string;
  depth: number;
  kind: JsonKind;
  expandable: boolean;
  expanded: boolean;
  count: number;}

const JsonViewerNodeContext = React.createContext<JsonViewerNodeCtx | null>(
  null,
);

const useJsonViewerNode = () => {
  const ctx = React.useContext(JsonViewerNodeContext);
  if (!ctx) {
    throw new Error(
      "JsonViewer node parts must be used inside <JsonViewerNode>",
    );
  }
  return ctx;
};

export interface JsonViewerProps extends Omit<React.ComponentProps<"div">, "children"> {
  value: unknown;
  /**
   * `true` expands everything, `false` collapses the root, a number expands
   * nodes shallower than that depth (`1` opens only the root).
   */
  defaultExpanded?: number | boolean;
  /** Controlled set of expanded paths, e.g. `["$", "$.user", "$.items[0]"]`. */
  expanded?: string[];
  onExpandedChange?: (paths: string[]) => void;
  /** Strings longer than this are truncated with an inline expand control. */
  maxStringLength?: number;
  children?: React.ReactNode;}

interface UncontrolledState { depth: number; overrides: Record<string, boolean>}

const JsonViewer = ({
  value,
  defaultExpanded = 2,
  expanded: expandedProp,
  onExpandedChange,
  maxStringLength = 80,
  className,
  children,
  ...props
}: JsonViewerProps) => {
  const [internal, setInternal] = React.useState<UncontrolledState>(() => ({
    depth:
      defaultExpanded === true
        ? Infinity
        : defaultExpanded === false
          ? 0
          : defaultExpanded,
    overrides: {},
  }));
  const [focusedPath, setFocusedPath] = React.useState("$");
  const treeRef = React.useRef<HTMLDivElement | null>(null);

  const controlled = expandedProp !== undefined;
  const expandedSet = React.useMemo(
    () => (expandedProp ? new Set(expandedProp) : null),
    [expandedProp],
  );

  const isExpanded = React.useCallback(
    (path: string, depth: number) => {
      if (expandedSet) return expandedSet.has(path);
      const override = internal.overrides[path];
      return override ?? depth < internal.depth;
    },
    [expandedSet, internal],
  );

  const toggle = React.useCallback(
    (path: string, depth: number) => {
      const next = !isExpanded(path, depth);
      // Keep the roving tab stop on something visible when a parent closes.
      if (!next) {
        setFocusedPath((current) =>
          current !== path &&
          (current.startsWith(`${path}.`) || current.startsWith(`${path}[`))
            ? path
            : current,
        );
      }
      if (controlled) {
        const set = new Set(expandedSet);
        if (next) set.add(path);
        else set.delete(path);
        onExpandedChange?.(Array.from(set));
        return;
      }
      setInternal((s) => ({
        ...s,
        overrides: { ...s.overrides, [path]: next },
      }));
    },
    [controlled, expandedSet, isExpanded, onExpandedChange],
  );

  const expandAll = React.useCallback(() => {
    if (controlled) {
      onExpandedChange?.(collectPaths(value));
      return;
    }
    setInternal({ depth: Infinity, overrides: {} });
  }, [controlled, onExpandedChange, value]);

  const collapseAll = React.useCallback(() => {
    setFocusedPath("$");
    if (controlled) {
      onExpandedChange?.([]);
      return;
    }
    setInternal({ depth: 0, overrides: {} });
  }, [controlled, onExpandedChange]);

  const ctx = React.useMemo<JsonViewerCtx>(
    () => ({
      value,
      maxStringLength,
      isExpanded,
      toggle,
      expandAll,
      collapseAll,
      focusedPath,
      setFocusedPath,
      treeRef,
    }),
    [
      value,
      maxStringLength,
      isExpanded,
      toggle,
      expandAll,
      collapseAll,
      focusedPath,
    ],
  );

  return (
    <JsonViewerContext.Provider value={ctx}>
      <div
        data-slot="json-viewer"
        className={cn(
          "overflow-auto rounded-md border border-border bg-card p-3 font-mono text-xs leading-relaxed text-card-foreground",
          className,
        )}
        {...props}
      >
        {children ?? <JsonViewerTree />}
      </div>
    </JsonViewerContext.Provider>
  );
};

const JsonViewerTree = ({
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children">) => {
  const { value, treeRef } = useJsonViewer();
  return (
    <div
      ref={treeRef}
      role="tree"
      data-slot="json-viewer-tree"
      className={cn("min-w-max", className)}
      {...props}
    >
      <JsonViewerNode value={value} path="$" depth={0} isLast />
    </div>
  );
};

export interface JsonViewerNodeProps extends Omit<
  React.ComponentProps<"div">,
  "children"
> {
  value: unknown;
  /** Key or array index. Omit for the root. */
  name?: string;
  path?: string;
  depth?: number;
  isLast?: boolean;}

const JsonViewerNode = ({
  value,
  name,
  path = "$",
  depth = 0,
  isLast = true,
  className,
  ...props
}: JsonViewerNodeProps) => {
  const { isExpanded, toggle, focusedPath, setFocusedPath, treeRef } =
    useJsonViewer();
  const kind = kindOf(value);
  const expandable = isExpandable(kind);
  const entries = expandable ? entriesOf(value, kind) : [];
  const expanded = expandable && isExpanded(path, depth);
  const open = kind === "array" ? "[" : "{";
  const close = kind === "array" ? "]" : "}";

  const nodeCtx = React.useMemo<JsonViewerNodeCtx>(
    () => ({
      path,
      depth,
      kind,
      expandable,
      expanded,
      count: entries.length,
    }),
    [path, depth, kind, expandable, expanded, entries.length],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const row = e.currentTarget;
    const tree = treeRef.current;
    if (!tree) return;
    const rtl = getComputedStyle(row).direction === "rtl";
    const expandKey = rtl ? "ArrowLeft" : "ArrowRight";
    const collapseKey = rtl ? "ArrowRight" : "ArrowLeft";
    const rows = Array.from(
      tree.querySelectorAll<HTMLElement>('[data-slot="json-viewer-row"]'),
    );
    const index = rows.indexOf(row);
    const focusRow = (target: HTMLElement | undefined) => {
      if (!target) return;
      e.preventDefault();
      target.focus();
    };

    switch (e.key) {
      case "ArrowDown":
        focusRow(rows[index + 1]);
        break;
      case "ArrowUp":
        focusRow(rows[index - 1]);
        break;
      case "Home":
        focusRow(rows[0]);
        break;
      case "End":
        focusRow(rows[rows.length - 1]);
        break;
      case expandKey:
        if (!expandable) break;
        e.preventDefault();
        if (expanded) focusRow(rows[index + 1]);
        else toggle(path, depth);
        break;
      case collapseKey: {
        e.preventDefault();
        if (expandable && expanded) {
          toggle(path, depth);
          break;
        }
        const parent = row
          .closest('[data-slot="json-viewer-node"]')
          ?.parentElement?.closest<HTMLElement>(
            '[data-slot="json-viewer-node"]',
          );
        focusRow(
          parent?.querySelector<HTMLElement>('[data-slot="json-viewer-row"]') ??
            undefined,
        );
        break;
      }
      case "Enter":
      case " ":
        if (!expandable) break;
        e.preventDefault();
        toggle(path, depth);
        break;
    }
  };

  return (
    <JsonViewerNodeContext.Provider value={nodeCtx}>
      <div
        data-slot="json-viewer-node"
        data-path={path}
        data-kind={kind}
        data-state={expandable ? (expanded ? "open" : "closed") : undefined}
        className={cn(className)}
        {...props}
      >
        <div
          role="treeitem"
          data-slot="json-viewer-row"
          tabIndex={focusedPath === path ? 0 : -1}
          aria-level={depth + 1}
          aria-expanded={expandable ? expanded : undefined}
          aria-selected={focusedPath === path}
          onFocus={() => setFocusedPath(path)}
          onKeyDown={handleKeyDown}
          onClick={(e) => {
            if (!expandable) return;
            // Let inline controls (copy, string expand) handle their own clicks.
            if ((e.target as HTMLElement).closest("button")) return;
            toggle(path, depth);
          }}
          className={cn(
            "flex items-start gap-1 rounded-sm px-1 outline-none",
            "hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
            expandable && "cursor-pointer",
          )}
        >
          <JsonViewerToggle />
          {name !== undefined ? (
            <>
              <JsonViewerKey>{name}</JsonViewerKey>
              <span className="text-muted-foreground">:</span>
            </>
          ) : null}
          {expandable ? (
            expanded ? (
              <span className="text-muted-foreground">{open}</span>
            ) : (
              <span className="text-muted-foreground">
                {open}
                <span data-slot="json-viewer-count" className="px-0.5">
                  {entries.length}
                </span>
                {close}
                {!isLast ? "," : null}
              </span>
            )
          ) : (
            <>
              <JsonViewerValue value={value} />
              {!isLast ? (
                <span className="text-muted-foreground">,</span>
              ) : null}
            </>
          )}
        </div>
        {expandable && expanded ? (
          <>
            <div
              role="group"
              data-slot="json-viewer-children"
              className="ms-3 border-s border-border ps-2"
            >
              {entries.map(([key, child], i) => (
                <JsonViewerNode
                  key={key}
                  name={key}
                  value={child}
                  path={childPath(path, key, kind)}
                  depth={depth + 1}
                  isLast={i === entries.length - 1}
                />
              ))}
            </div>
            <div
              data-slot="json-viewer-close"
              className="ps-6 text-muted-foreground"
            >
              {close}
              {!isLast ? "," : null}
            </div>
          </>
        ) : null}
      </div>
    </JsonViewerNodeContext.Provider>
  );
};

const JsonViewerToggle = ({
  className,
  ...props
}: Omit<React.ComponentProps<"span">, "children">) => {
  const { expandable, expanded } = useJsonViewerNode();
  return (
    <span
      data-slot="json-viewer-toggle"
      data-state={expandable ? (expanded ? "open" : "closed") : undefined}
      aria-hidden
      className={cn(
        "mt-[3px] inline-flex size-4 shrink-0 items-center justify-center text-muted-foreground",
        !expandable && "invisible",
        className,
      )}
      {...props}
    >
      <ChevronRight
        className={cn(
          "size-3.5 transition-transform motion-reduce:transition-none rtl:rotate-180",
          expanded && "rotate-90 rtl:rotate-90",
        )}
      />
    </span>
  );
};

const JsonViewerKey = ({ className, ...props }: React.ComponentProps<"span">) => {
  return (
    <span
      data-slot="json-viewer-key"
      className={cn("text-foreground", className)}
      {...props}
    />
  );
};

export interface JsonViewerValueProps extends Omit<
  React.ComponentProps<"span">,
  "children"
> {
  value: unknown;}

const JsonViewerValue = ({ value, className, ...props }: JsonViewerValueProps) => {
  const { maxStringLength } = useJsonViewer();
  const [showAll, setShowAll] = React.useState(false);
  const kind = kindOf(value);

  let text: string;
  switch (kind) {
    case "string":
      text = value as string;
      break;
    case "date":
      text = (value as Date).toISOString();
      break;
    case "number":
      text = Object.is(value, -0) ? "-0" : String(value);
      break;
    case "bigint":
      text = `${String(value)}n`;
      break;
    case "boolean":
      text = String(value);
      break;
    case "null":
      text = "null";
      break;
    case "undefined":
      text = "undefined";
      break;
    case "function":
      text = `ƒ ${(value as { name?: string }).name || "anonymous"}()`;
      break;
    case "symbol":
      text = String(value);
      break;
    default:
      text = stringify(value, 0) ?? String(value);
  }

  const isText = kind === "string" || kind === "date";
  const truncated = isText && !showAll && text.length > maxStringLength;
  const shown = truncated ? text.slice(0, maxStringLength) : text;

  return (
    <span
      data-slot="json-viewer-value"
      data-kind={kind}
      className={cn(
        "break-all whitespace-pre-wrap",
        isText && "text-success",
        (kind === "number" || kind === "bigint") && "text-info",
        kind === "boolean" && "text-warning",
        (kind === "null" || kind === "undefined") &&
          "text-muted-foreground italic",
        (kind === "function" || kind === "symbol") && "text-muted-foreground",
        className,
      )}
      {...props}
    >
      {isText ? `"${shown}` : shown}
      {truncated ? (
        <>
          <span className="text-muted-foreground">…</span>
          <button
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.stopPropagation();
              setShowAll(true);
            }}
            className="mx-1 rounded-sm bg-accent px-1 text-[10px] text-muted-foreground hover:text-foreground"
          >
            +{text.length - maxStringLength}
          </button>
        </>
      ) : null}
      {isText ? `"` : null}
    </span>
  );
};

export interface JsonViewerCopyProps extends Omit<
  React.ComponentProps<typeof CopyButton>,
  "value"
> {
  /** Defaults to the whole root value. */
  value?: unknown;
  indent?: number;}

const JsonViewerCopy = ({ value, indent = 2, ...props }: JsonViewerCopyProps) => {
  const root = useJsonViewer();
  const text = stringify(value === undefined ? root.value : value, indent);
  return (
    <CopyButton
      data-slot="json-viewer-copy"
      size="sm"
      value={text ?? ""}
      {...props}
    />
  );
};

const JsonViewerExpandAll = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Button>) => {
  const { expandAll } = useJsonViewer();
  return (
    <Button
      type="button"
      variant="ghost"
      size="xs"
      data-slot="json-viewer-expand-all"
      onClick={expandAll}
      className={cn("font-sans text-muted-foreground", className)}
      {...props}
    >
      <ChevronsUpDown aria-hidden />
      {children ?? "Expand all"}
    </Button>
  );
};

const JsonViewerCollapseAll = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Button>) => {
  const { collapseAll } = useJsonViewer();
  return (
    <Button
      type="button"
      variant="ghost"
      size="xs"
      data-slot="json-viewer-collapse-all"
      onClick={collapseAll}
      className={cn("font-sans text-muted-foreground", className)}
      {...props}
    >
      <ChevronsDownUp aria-hidden />
      {children ?? "Collapse all"}
    </Button>
  );
};

export {
  JsonViewer,
  JsonViewerTree,
  JsonViewerNode,
  JsonViewerToggle,
  JsonViewerKey,
  JsonViewerValue,
  JsonViewerCopy,
  JsonViewerExpandAll,
  JsonViewerCollapseAll,
  useJsonViewer,
};
