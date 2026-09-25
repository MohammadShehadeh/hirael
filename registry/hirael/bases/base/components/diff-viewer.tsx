'use client';

import * as React from 'react';
import { diffLines } from 'diff';
import { ArrowRight, ChevronsUpDown, Columns2, Rows3 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { ToggleGroup, ToggleGroupItem } from '@/registry/hirael/bases/base/ui/toggle-group';

export type DiffLineType = 'equal' | 'add' | 'remove';

export interface DiffLine {
  type: DiffLineType;
  content: string;
  /** 1-based line number in the old text, null for added lines. */
  oldLine: number | null;
  /** 1-based line number in the new text, null for removed lines. */
  newLine: number | null;
}

export type DiffViewerMode = 'unified' | 'split';

const splitLines = (text: string) => {
  const lines = text.split(/\r?\n/);
  if (lines[lines.length - 1] === '') lines.pop();

  return lines;
};

const computeLineDiff = (oldValue: string, newValue: string): DiffLine[] => {
  // Past the edit cap jsdiff gives up; showing a full replace beats freezing on huge inputs.
  const changes = diffLines(oldValue, newValue, {
    stripTrailingCr: true,
    ignoreNewlineAtEof: true,
    maxEditLength: 1000,
  }) ?? [
    { value: oldValue, removed: true, added: false, count: 0 },
    { value: newValue, removed: false, added: true, count: 0 },
  ];
  const out: DiffLine[] = [];
  let oldNo = 1;
  let newNo = 1;
  for (const change of changes) {
    for (const content of splitLines(change.value)) {
      if (change.added) out.push({ type: 'add', content, oldLine: null, newLine: newNo++ });
      else if (change.removed) out.push({ type: 'remove', content, oldLine: oldNo++, newLine: null });
      else out.push({ type: 'equal', content, oldLine: oldNo++, newLine: newNo++ });
    }
  }

  return out;
};

interface LineItem {
  kind: 'line';
  index: number;
  line: DiffLine;
}
interface GapItem {
  kind: 'gap';
  start: number;
  count: number;
}
type Item = LineItem | GapItem;

const buildItems = (lines: DiffLine[], context: number, expandedGaps: ReadonlySet<number>) => {
  const hasChanges = lines.some((l) => l.type !== 'equal');
  if (!hasChanges || !Number.isFinite(context)) {
    return lines.map<Item>((line, index) => ({ kind: 'line', index, line }));
  }
  const visible = new Uint8Array(lines.length);
  lines.forEach((line, i) => {
    if (line.type === 'equal') return;
    const from = Math.max(0, i - context);
    const to = Math.min(lines.length - 1, i + context);
    for (let k = from; k <= to; k++) visible[k] = 1;
  });
  const items: Item[] = [];
  let i = 0;
  while (i < lines.length) {
    if (visible[i]) {
      items.push({ kind: 'line', index: i, line: lines[i] });
      i++;
      continue;
    }
    const start = i;
    while (i < lines.length && !visible[i]) i++;
    const count = i - start;
    if (expandedGaps.has(start)) {
      for (let k = start; k < i; k++) {
        items.push({ kind: 'line', index: k, line: lines[k] });
      }
    } else {
      items.push({ kind: 'gap', start, count });
    }
  }

  return items;
};

type SplitRow = { kind: 'row'; key: string; left: DiffLine | null; right: DiffLine | null } | GapItem;

const toSplitRows = (items: Item[]): SplitRow[] => {
  const rows: SplitRow[] = [];
  let removed: DiffLine[] = [];
  let added: DiffLine[] = [];
  const flush = () => {
    const len = Math.max(removed.length, added.length);
    for (let k = 0; k < len; k++) {
      const left = removed[k] ?? null;
      const right = added[k] ?? null;
      rows.push({
        kind: 'row',
        key: `${left?.oldLine ?? 'x'}-${right?.newLine ?? 'x'}`,
        left,
        right,
      });
    }
    removed = [];
    added = [];
  };
  for (const item of items) {
    if (item.kind === 'gap') {
      flush();
      rows.push(item);
      continue;
    }
    const { line } = item;
    if (line.type === 'remove') removed.push(line);
    else if (line.type === 'add') added.push(line);
    else {
      flush();
      rows.push({
        kind: 'row',
        key: `${line.oldLine}-${line.newLine}`,
        left: line,
        right: line,
      });
    }
  }
  flush();

  return rows;
};

interface DiffViewerCtx {
  lines: DiffLine[];
  items: Item[];
  mode: DiffViewerMode;
  setMode: (mode: DiffViewerMode) => void;
  oldTitle?: string;
  newTitle?: string;
  added: number;
  removed: number;
  expandGap: (start: number) => void;
}

const DiffViewerContext = React.createContext<DiffViewerCtx | null>(null);

const useDiffViewer = () => {
  const ctx = React.useContext(DiffViewerContext);
  if (!ctx) {
    throw new Error('DiffViewer compound parts must be used inside <DiffViewer>');
  }

  return ctx;
};

export interface DiffViewerProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  oldValue: string;
  newValue: string;
  oldTitle?: string;
  newTitle?: string;
  mode?: DiffViewerMode;
  defaultMode?: DiffViewerMode;
  onModeChange?: (mode: DiffViewerMode) => void;
  /** Unchanged lines to keep around each change. `Infinity` shows everything. */
  context?: number;
  children?: React.ReactNode;
}

const DiffViewer = ({
  oldValue,
  newValue,
  oldTitle,
  newTitle,
  mode: modeProp,
  defaultMode = 'unified',
  onModeChange,
  context = 3,
  className,
  children,
  ...props
}: DiffViewerProps) => {
  const [internalMode, setInternalMode] = React.useState(defaultMode);
  const [expandedGaps, setExpandedGaps] = React.useState<ReadonlySet<number>>(() => new Set());
  const mode = modeProp ?? internalMode;

  const lines = React.useMemo(() => computeLineDiff(oldValue, newValue), [oldValue, newValue]);
  // Gaps are keyed by line index, so an expansion from the previous diff would open the wrong hunk.
  const [prevLines, setPrevLines] = React.useState(lines);
  if (lines !== prevLines) {
    setPrevLines(lines);
    setExpandedGaps(new Set());
  }
  const items = React.useMemo(() => buildItems(lines, context, expandedGaps), [lines, context, expandedGaps]);
  const { added, removed } = React.useMemo(() => {
    let a = 0;
    let r = 0;
    for (const l of lines) {
      if (l.type === 'add') a++;
      else if (l.type === 'remove') r++;
    }

    return { added: a, removed: r };
  }, [lines]);

  const setMode = React.useCallback(
    (next: DiffViewerMode) => {
      if (modeProp === undefined) setInternalMode(next);
      onModeChange?.(next);
    },
    [modeProp, onModeChange],
  );

  const expandGap = React.useCallback((start: number) => {
    setExpandedGaps((prev) => {
      const next = new Set(prev);
      next.add(start);

      return next;
    });
  }, []);

  const ctx = React.useMemo<DiffViewerCtx>(
    () => ({
      lines,
      items,
      mode,
      setMode,
      oldTitle,
      newTitle,
      added,
      removed,
      expandGap,
    }),
    [lines, items, mode, setMode, oldTitle, newTitle, added, removed, expandGap],
  );

  return (
    <DiffViewerContext.Provider value={ctx}>
      <div
        data-slot="diff-viewer"
        data-mode={mode}
        className={cn(
          'overflow-hidden rounded-md border border-border bg-card font-mono text-xs text-card-foreground',
          className,
        )}
        {...props}
      >
        {children ?? (
          <>
            <DiffViewerHeader />
            <DiffViewerContent />
          </>
        )}
      </div>
    </DiffViewerContext.Provider>
  );
};

const DiffViewerHeader = ({ className, children, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="diff-viewer-header"
      className={cn(
        'flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/40 px-3 py-2',
        className,
      )}
      {...props}
    >
      {children ?? (
        <>
          <DiffViewerTitle />
          <div className="flex items-center gap-3">
            <DiffViewerStats />
            <DiffViewerModeToggle />
          </div>
        </>
      )}
    </div>
  );
};

const DiffViewerTitle = ({ className, children, ...props }: React.ComponentProps<'div'>) => {
  const { oldTitle, newTitle } = useDiffViewer();
  const same = !oldTitle || !newTitle || oldTitle === newTitle;

  return (
    <div
      data-slot="diff-viewer-title"
      className={cn('flex min-w-0 items-center gap-1.5 font-sans text-sm text-foreground', className)}
      {...props}
    >
      {children ??
        (same ? (
          <span className="truncate">{newTitle ?? oldTitle}</span>
        ) : (
          <>
            <span className="truncate text-muted-foreground">{oldTitle}</span>
            <ArrowRight className="size-3.5 shrink-0 text-muted-foreground rtl:rotate-180" />
            <span className="truncate">{newTitle}</span>
          </>
        ))}
    </div>
  );
};

const DiffViewerStats = ({ className, ...props }: Omit<React.ComponentProps<'div'>, 'children'>) => {
  const { added, removed } = useDiffViewer();

  return (
    <div data-slot="diff-viewer-stats" className={cn('flex items-center gap-2 tabular-nums', className)} {...props}>
      <span data-slot="diff-viewer-added" className="text-success">
        +{added}
      </span>
      <span data-slot="diff-viewer-removed" className="text-destructive">
        −{removed}
      </span>
    </div>
  );
};

export interface DiffViewerModeToggleProps extends Omit<
  React.ComponentProps<'div'>,
  'defaultValue' | 'dir' | 'children'
> {
  /** Accessible name of the toggle group. */
  label?: string;
  unifiedLabel?: React.ReactNode;
  splitLabel?: React.ReactNode;
}

const DiffViewerModeToggle = ({
  label = 'Diff layout',
  unifiedLabel = 'Unified',
  splitLabel = 'Split',
  className,
  ...props
}: DiffViewerModeToggleProps) => {
  const { mode, setMode } = useDiffViewer();

  return (
    <ToggleGroup
      variant="outline"
      size="sm"
      value={[mode]}
      onValueChange={([next]) => {
        if (next === 'unified' || next === 'split') setMode(next);
      }}
      data-slot="diff-viewer-mode-toggle"
      aria-label={label}
      className={cn('font-sans', className)}
      {...props}
    >
      <ToggleGroupItem value="unified">
        <Rows3 />
        <span className="sr-only sm:not-sr-only">{unifiedLabel}</span>
      </ToggleGroupItem>
      <ToggleGroupItem value="split">
        <Columns2 />
        <span className="sr-only sm:not-sr-only">{splitLabel}</span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export interface DiffViewerContentProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  showLineNumbers?: boolean;
  /** Label for a collapsed run of unchanged lines. */
  gapLabel?: (count: number) => React.ReactNode;
  /** Screen reader text for the + marker. */
  addedLabel?: string;
  /** Screen reader text for the - marker. */
  removedLabel?: string;
}

const DiffViewerContent = ({
  showLineNumbers = true,
  gapLabel,
  addedLabel,
  removedLabel,
  className,
  ...props
}: DiffViewerContentProps) => {
  const { items, mode, expandGap } = useDiffViewer();
  const label = gapLabel ?? ((count: number) => `Expand ${count} lines`);
  const rows = React.useMemo(() => (mode === 'split' ? toSplitRows(items) : []), [items, mode]);

  const gap = (item: GapItem) => (
    <button
      key={`gap-${item.start}`}
      type="button"
      data-slot="diff-viewer-gap"
      onClick={() => expandGap(item.start)}
      className={cn(
        'flex w-full items-center gap-2 bg-muted/50 px-3 py-1 text-start text-[11px] text-muted-foreground transition-colors outline-none',
        'hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
      )}
    >
      <ChevronsUpDown className="size-3.5" />
      {label(item.count)}
    </button>
  );

  if (mode === 'split') {
    return (
      <div
        dir="ltr"
        data-slot="diff-viewer-content"
        data-mode="split"
        className={cn('overflow-x-auto', className)}
        {...props}
      >
        {rows.map((row) =>
          row.kind === 'gap' ? (
            gap(row)
          ) : (
            <div key={row.key} data-slot="diff-viewer-split-row" className="grid grid-cols-2 divide-x divide-border">
              <DiffViewerLine
                line={row.left}
                side="old"
                showLineNumbers={showLineNumbers}
                addedLabel={addedLabel}
                removedLabel={removedLabel}
              />
              <DiffViewerLine
                line={row.right}
                side="new"
                showLineNumbers={showLineNumbers}
                addedLabel={addedLabel}
                removedLabel={removedLabel}
              />
            </div>
          ),
        )}
      </div>
    );
  }

  return (
    <div
      dir="ltr"
      data-slot="diff-viewer-content"
      data-mode="unified"
      className={cn('overflow-x-auto', className)}
      {...props}
    >
      {items.map((item) =>
        item.kind === 'gap' ? (
          gap(item)
        ) : (
          <DiffViewerLine
            key={item.index}
            line={item.line}
            showLineNumbers={showLineNumbers}
            addedLabel={addedLabel}
            removedLabel={removedLabel}
          />
        ),
      )}
    </div>
  );
};

export interface DiffViewerLineProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** `null` renders an empty filler cell (split mode). */
  line: DiffLine | null;
  /** Which pane this line sits in. Omit for unified. */
  side?: 'old' | 'new';
  showLineNumbers?: boolean;
  /** Screen reader text for the + marker. */
  addedLabel?: string;
  /** Screen reader text for the - marker. */
  removedLabel?: string;
}

const DiffViewerLine = ({
  line,
  side,
  showLineNumbers = true,
  addedLabel = 'added',
  removedLabel = 'removed',
  className,
  ...props
}: DiffViewerLineProps) => {
  const type = line?.type ?? 'empty';
  const marker = type === 'add' ? '+' : type === 'remove' ? '-' : ' ';
  const numberClass = 'w-10 shrink-0 select-none pe-2 text-end tabular-nums text-muted-foreground';

  return (
    <div
      data-slot="diff-viewer-line"
      data-type={type}
      className={cn(
        'flex items-stretch leading-5',
        side ? 'min-w-0' : 'min-w-max',
        type === 'add' && 'bg-success/10',
        type === 'remove' && 'bg-destructive/10',
        type === 'empty' && 'bg-muted/30',
        className,
      )}
      {...props}
    >
      {showLineNumbers &&
        (side ? (
          <span data-slot="diff-viewer-line-number" className={numberClass}>
            {side === 'old' ? line?.oldLine : line?.newLine}
          </span>
        ) : (
          <>
            <span data-slot="diff-viewer-line-number" className={numberClass}>
              {line?.oldLine}
            </span>
            <span data-slot="diff-viewer-line-number" className={numberClass}>
              {line?.newLine}
            </span>
          </>
        ))}
      <span
        data-slot="diff-viewer-line-marker"
        aria-hidden
        className={cn(
          'w-5 shrink-0 text-center select-none',
          type === 'add' && 'text-success',
          type === 'remove' && 'text-destructive',
        )}
      >
        {marker}
      </span>
      {(type === 'add' || type === 'remove') && (
        <span className="sr-only">{type === 'add' ? addedLabel : removedLabel}</span>
      )}
      <span
        data-slot="diff-viewer-line-content"
        className={cn('flex-1 pe-3', side ? 'break-all whitespace-pre-wrap' : 'whitespace-pre')}
      >
        {line?.content ?? ''}
      </span>
    </div>
  );
};

export {
  DiffViewer,
  DiffViewerHeader,
  DiffViewerTitle,
  DiffViewerStats,
  DiffViewerModeToggle,
  DiffViewerContent,
  DiffViewerLine,
  computeLineDiff,
  useDiffViewer,
};
