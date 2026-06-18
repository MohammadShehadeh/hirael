"use client";

import * as React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

type JsonValueKind =
  | "object"
  | "array"
  | "string"
  | "number"
  | "boolean"
  | "null";

const VALUE_CLASSES: Record<Exclude<JsonValueKind, "object" | "array">, string> =
  {
    string: "text-chart-2",
    number: "text-chart-3",
    boolean: "text-primary",
    null: "text-muted-foreground",
  };

function kindOf(value: unknown): JsonValueKind {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  if (typeof value === "object") return "object";
  if (typeof value === "string") return "string";
  if (typeof value === "boolean") return "boolean";
  return "number";
}

function isExpandable(value: unknown): value is object {
  const kind = kindOf(value);
  return kind === "object" || kind === "array";
}

function entriesOf(value: object): [string, unknown][] {
  if (Array.isArray(value)) {
    return value.map((item, index) => [String(index), item]);
  }
  return Object.entries(value);
}

function formatPrimitive(value: unknown): string {
  const kind = kindOf(value);
  if (kind === "string") return JSON.stringify(value);
  if (kind === "null") return "null";
  return String(value);
}

function previewLabel(value: object): string {
  const count = entriesOf(value).length;
  if (Array.isArray(value)) {
    return count === 1 ? "[ 1 item ]" : `[ ${count} items ]`;
  }
  return count === 1 ? "{ 1 key }" : `{ ${count} keys }`;
}

const INDENT_PER_LEVEL = 14;

export type JsonViewerRootProps = React.ComponentProps<"div">;

function JsonViewerRoot({ className, ...props }: JsonViewerRootProps) {
  return (
    <div
      data-slot="json-viewer-root"
      className={cn(
        "w-full overflow-x-auto rounded-md border border-border bg-card p-2 font-mono text-[13px] leading-6 text-card-foreground",
        className,
      )}
      {...props}
    />
  );
}

export type JsonNodeProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** The JSON value rendered by this node. */
  value: unknown;
  /** The object key or array index labeling this node, if any. */
  nodeKey?: string;
  /** Render this node's key as a quoted array index rather than a plain key. */
  isIndex?: boolean;
  /** Nesting level, used for indentation. */
  depth?: number;
  /** Depth up to which expandable nodes start open. */
  defaultExpandedDepth?: number;
};

function JsonNode({
  value,
  nodeKey,
  isIndex = false,
  depth = 0,
  defaultExpandedDepth = 1,
  className,
  ...props
}: JsonNodeProps) {
  const expandable = isExpandable(value);
  const [open, setOpen] = React.useState(
    () => expandable && depth < defaultExpandedDepth,
  );

  const indentStyle: React.CSSProperties = {
    paddingInlineStart: depth * INDENT_PER_LEVEL,
  };

  const keyLabel =
    nodeKey === undefined ? null : (
      <>
        <span
          data-slot="json-viewer-key"
          className={cn(isIndex ? "text-muted-foreground" : "text-foreground")}
        >
          {isIndex ? nodeKey : JSON.stringify(nodeKey)}
        </span>
        <span data-slot="json-viewer-punctuation" className="text-muted-foreground">
          :{" "}
        </span>
      </>
    );

  if (!expandable) {
    const kind = kindOf(value) as Exclude<JsonValueKind, "object" | "array">;
    return (
      <div
        data-slot="json-node"
        data-kind={kind}
        style={indentStyle}
        className={cn("flex items-start py-0.5 ps-[18px]", className)}
        {...props}
      >
        <span className="min-w-0 break-words">
          {keyLabel}
          <span data-slot="json-viewer-value" className={VALUE_CLASSES[kind]}>
            {formatPrimitive(value)}
          </span>
        </span>
      </div>
    );
  }

  const entries = entriesOf(value);
  const empty = entries.length === 0;
  const isArray = Array.isArray(value);
  const open$ = open && !empty;

  return (
    <div
      data-slot="json-node"
      data-kind={isArray ? "array" : "object"}
      data-state={open$ ? "open" : "closed"}
      className={cn("min-w-fit", className)}
      {...props}
    >
      <button
        type="button"
        data-slot="json-node-trigger"
        aria-expanded={open$}
        disabled={empty}
        onClick={() => setOpen((value) => !value)}
        style={indentStyle}
        className={cn(
          "flex w-full items-start gap-1 rounded-sm py-0.5 pe-2 text-start outline-none transition-colors",
          "hover:bg-accent focus-visible:bg-accent focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:pointer-events-none",
        )}
      >
        <span className="flex size-[18px] shrink-0 items-center justify-center text-muted-foreground">
          {empty ? null : open$ ? (
            <ChevronDown aria-hidden className="size-3.5" />
          ) : (
            <ChevronRight aria-hidden className="size-3.5 rtl:rotate-180" />
          )}
        </span>
        <span className="min-w-0 break-words">
          {keyLabel}
          {empty ? (
            <span data-slot="json-viewer-value" className="text-muted-foreground">
              {isArray ? "[]" : "{}"}
            </span>
          ) : open$ ? (
            <span
              data-slot="json-viewer-punctuation"
              className="text-muted-foreground"
            >
              {isArray ? "[" : "{"}
            </span>
          ) : (
            <span
              data-slot="json-viewer-preview"
              className="text-muted-foreground"
            >
              {previewLabel(value)}
            </span>
          )}
        </span>
      </button>

      {open$ && (
        <div
          data-slot="json-node-children"
          role="group"
          className="ms-[26px] border-s border-border"
        >
          {entries.map(([childKey, childValue]) => (
            <JsonNode
              key={childKey}
              value={childValue}
              nodeKey={childKey}
              isIndex={isArray}
              depth={depth + 1}
              defaultExpandedDepth={defaultExpandedDepth}
            />
          ))}
          <div
            data-slot="json-viewer-punctuation"
            style={indentStyle}
            className="py-0.5 ps-[18px] text-muted-foreground"
          >
            {isArray ? "]" : "}"}
          </div>
        </div>
      )}
    </div>
  );
}

export type JsonViewerProps = Omit<JsonViewerRootProps, "children"> & {
  /** The value to render as a collapsible JSON tree. */
  data: unknown;
  /** Depth up to which nodes start expanded. Defaults to 1. */
  defaultExpandedDepth?: number;
  /** Optional label shown as the key of the root node. */
  rootName?: string;
};

function JsonViewer({
  data,
  defaultExpandedDepth = 1,
  rootName,
  ...props
}: JsonViewerProps) {
  return (
    <JsonViewerRoot {...props}>
      <JsonNode
        value={data}
        nodeKey={rootName}
        defaultExpandedDepth={defaultExpandedDepth}
      />
    </JsonViewerRoot>
  );
}

export { JsonViewer, JsonViewerRoot, JsonNode };
