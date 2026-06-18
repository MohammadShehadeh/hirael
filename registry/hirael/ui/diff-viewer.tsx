"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type DiffType = "add" | "remove" | "context";

type DiffRow = {
  type: DiffType;
  oldNumber?: number;
  newNumber?: number;
  content: string;
};

function diffLines(oldText: string, newText: string): DiffRow[] {
  const oldLines = oldText.split("\n");
  const newLines = newText.split("\n");
  const rows = oldLines.length;
  const cols = newLines.length;

  const table: number[][] = Array.from({ length: rows + 1 }, () =>
    new Array<number>(cols + 1).fill(0),
  );

  for (let i = rows - 1; i >= 0; i--) {
    for (let j = cols - 1; j >= 0; j--) {
      table[i][j] =
        oldLines[i] === newLines[j]
          ? table[i + 1][j + 1] + 1
          : Math.max(table[i + 1][j], table[i][j + 1]);
    }
  }

  const result: DiffRow[] = [];
  let i = 0;
  let j = 0;
  let oldNumber = 1;
  let newNumber = 1;

  while (i < rows && j < cols) {
    if (oldLines[i] === newLines[j]) {
      result.push({
        type: "context",
        oldNumber: oldNumber++,
        newNumber: newNumber++,
        content: oldLines[i],
      });
      i++;
      j++;
    } else if (table[i + 1][j] >= table[i][j + 1]) {
      result.push({ type: "remove", oldNumber: oldNumber++, content: oldLines[i] });
      i++;
    } else {
      result.push({ type: "add", newNumber: newNumber++, content: newLines[j] });
      j++;
    }
  }
  while (i < rows) {
    result.push({ type: "remove", oldNumber: oldNumber++, content: oldLines[i] });
    i++;
  }
  while (j < cols) {
    result.push({ type: "add", newNumber: newNumber++, content: newLines[j] });
    j++;
  }

  return result;
}

type SplitPair = { old?: DiffRow; new?: DiffRow };

function pairForSplit(rows: DiffRow[]): SplitPair[] {
  const pairs: SplitPair[] = [];
  let index = 0;

  while (index < rows.length) {
    const row = rows[index];
    if (row.type === "context") {
      pairs.push({ old: row, new: row });
      index++;
      continue;
    }

    const removed: DiffRow[] = [];
    const added: DiffRow[] = [];
    while (index < rows.length && rows[index].type === "remove") {
      removed.push(rows[index]);
      index++;
    }
    while (index < rows.length && rows[index].type === "add") {
      added.push(rows[index]);
      index++;
    }

    const span = Math.max(removed.length, added.length);
    for (let offset = 0; offset < span; offset++) {
      pairs.push({ old: removed[offset], new: added[offset] });
    }
  }

  return pairs;
}

const DIFF_SIGN: Record<DiffType, string> = {
  add: "+",
  remove: "−",
  context: " ",
};

export type DiffLineProps = Omit<React.ComponentProps<"div">, "content"> & {
  /** Classification of the line relative to the old text. */
  type: DiffType;
  oldNumber?: number;
  newNumber?: number;
  content?: string;
  /** Render only the start-side gutter (old number, then sign). */
  showOldNumber?: boolean;
  /** Render the end-side gutter (new number). */
  showNewNumber?: boolean;
};

function DiffLine({
  type,
  oldNumber,
  newNumber,
  content,
  showOldNumber = true,
  showNewNumber = true,
  className,
  children,
  ...props
}: DiffLineProps) {
  return (
    <div
      data-slot="diff-line"
      data-diff={type}
      className={cn(
        "flex border-s-2 border-transparent",
        type === "add" && "border-primary bg-primary/10",
        type === "remove" && "border-destructive bg-destructive/10",
        className,
      )}
      {...props}
    >
      {showOldNumber && (
        <span
          aria-hidden
          data-slot="diff-line-old-number"
          data-line-number={oldNumber}
          className="w-9 shrink-0 select-none pe-2 text-end text-muted-foreground before:content-[attr(data-line-number)]"
        />
      )}
      {showNewNumber && (
        <span
          aria-hidden
          data-slot="diff-line-new-number"
          data-line-number={newNumber}
          className="w-9 shrink-0 select-none pe-2 text-end text-muted-foreground before:content-[attr(data-line-number)]"
        />
      )}
      <span
        aria-hidden
        data-slot="diff-line-sign"
        className={cn(
          "w-4 shrink-0 select-none text-center",
          type === "add" && "text-primary",
          type === "remove" && "text-destructive",
        )}
      >
        {DIFF_SIGN[type]}
      </span>
      <span data-slot="diff-line-content" className="flex-1 whitespace-pre pe-4">
        {children ?? (content === "" ? "​" : content)}
      </span>
    </div>
  );
}

export type DiffViewerHeaderProps = React.ComponentProps<"div"> & {
  /** Name of the file or label shown before the old → new pair. */
  fileName?: string;
  oldLabel?: string;
  newLabel?: string;
};

function DiffViewerHeader({
  fileName,
  oldLabel,
  newLabel,
  className,
  children,
  ...props
}: DiffViewerHeaderProps) {
  return (
    <div
      data-slot="diff-viewer-header"
      className={cn(
        "flex min-h-10 flex-wrap items-center gap-2 border-b border-border px-3 py-1 font-mono text-xs",
        className,
      )}
      {...props}
    >
      {children ?? (
        <>
          {fileName && (
            <span data-slot="diff-viewer-filename" className="text-foreground">
              {fileName}
            </span>
          )}
          {(oldLabel || newLabel) && (
            <span
              data-slot="diff-viewer-range"
              className="flex items-center gap-1.5 text-muted-foreground"
            >
              {oldLabel && (
                <span className="text-destructive">{oldLabel}</span>
              )}
              <span aria-hidden>→</span>
              {newLabel && <span className="text-primary">{newLabel}</span>}
            </span>
          )}
        </>
      )}
    </div>
  );
}

export type DiffViewerProps = React.ComponentProps<"div"> & {
  /** Original text. Lines are compared against `newText` with a line LCS. */
  oldText: string;
  /** Updated text. Lines absent from `oldText` are marked as additions. */
  newText: string;
  /** Single column of +/- lines, or old and new side by side. */
  mode?: "unified" | "split";
};

function DiffViewer({
  oldText,
  newText,
  mode = "unified",
  className,
  children,
  ...props
}: DiffViewerProps) {
  const rows = React.useMemo(
    () => diffLines(oldText, newText),
    [oldText, newText],
  );

  const splitRows = React.useMemo(() => pairForSplit(rows), [rows]);

  return (
    <div
      data-slot="diff-viewer"
      data-mode={mode}
      className={cn(
        "overflow-hidden rounded-md border border-border bg-card text-card-foreground",
        className,
      )}
      {...props}
    >
      {children}
      <div
        data-slot="diff-viewer-body"
        dir="ltr"
        className="overflow-x-auto font-mono text-[13px] leading-6"
      >
        {mode === "unified" ? (
          <div data-slot="diff-viewer-unified" className="w-fit min-w-full py-2">
            {rows.map((row, index) => (
              <DiffLine
                key={index}
                type={row.type}
                oldNumber={row.oldNumber}
                newNumber={row.newNumber}
                content={row.content}
              />
            ))}
          </div>
        ) : (
          <div
            data-slot="diff-viewer-split"
            className="grid w-fit min-w-full grid-cols-2 py-2"
          >
            <div
              data-slot="diff-viewer-split-old"
              className="border-e border-border"
            >
              {splitRows.map((pair, index) =>
                pair.old ? (
                  <DiffLine
                    key={index}
                    type={pair.old.type}
                    oldNumber={pair.old.oldNumber}
                    content={pair.old.content}
                    showNewNumber={false}
                  />
                ) : (
                  <DiffLine
                    key={index}
                    type="context"
                    content=""
                    showNewNumber={false}
                    className="opacity-0"
                  />
                ),
              )}
            </div>
            <div data-slot="diff-viewer-split-new">
              {splitRows.map((pair, index) =>
                pair.new ? (
                  <DiffLine
                    key={index}
                    type={pair.new.type}
                    newNumber={pair.new.newNumber}
                    content={pair.new.content}
                    showOldNumber={false}
                  />
                ) : (
                  <DiffLine
                    key={index}
                    type="context"
                    content=""
                    showOldNumber={false}
                    className="opacity-0"
                  />
                ),
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { DiffViewer, DiffLine, DiffViewerHeader };
