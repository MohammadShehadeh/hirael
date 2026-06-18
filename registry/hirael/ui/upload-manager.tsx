"use client";

import * as React from "react";
import {
  Check,
  CircleAlert,
  File as FileIcon,
  RotateCw,
  Upload,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/registry/hirael/ui/button";
import { Progress } from "@/registry/hirael/ui/progress";

export type UploadStatus = "queued" | "uploading" | "done" | "error";

export type UploadItem = {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: UploadStatus;
};

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"] as const;
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  const fixed = i === 0 ? n.toFixed(0) : n.toFixed(1);
  return `${fixed} ${units[i]}`;
}

const STATUS_LABEL: Record<UploadStatus, string> = {
  queued: "Queued",
  uploading: "Uploading",
  done: "Done",
  error: "Failed",
};

type Ctx = {
  items: UploadItem[];
  setItems: (next: UploadItem[]) => void;
  removeItem: (id: string) => void;
  nextId: () => string;
};

const UploadManagerContext = React.createContext<Ctx | null>(null);

function useUploadManager() {
  const ctx = React.useContext(UploadManagerContext);
  if (!ctx) {
    throw new Error(
      "UploadManager compound parts must be used inside <UploadManager>",
    );
  }
  return ctx;
}

export type UploadManagerProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue"
> & {
  /** Controlled queue of upload items. */
  value?: UploadItem[];
  /** Initial queue when uncontrolled. */
  defaultValue?: UploadItem[];
  /** Called whenever the queue changes (add, remove, or progress update). */
  onValueChange?: (items: UploadItem[]) => void;
};

function UploadManager({
  value: valueProp,
  defaultValue,
  onValueChange,
  className,
  children,
  ...props
}: UploadManagerProps) {
  const reactId = React.useId();
  const seedRef = React.useRef(0);

  const [internalItems, setInternalItems] = React.useState<UploadItem[]>(
    defaultValue ?? [],
  );
  const items = valueProp ?? internalItems;

  const setItems = React.useCallback(
    (next: UploadItem[]) => {
      if (valueProp === undefined) setInternalItems(next);
      onValueChange?.(next);
    },
    [valueProp, onValueChange],
  );

  const itemsRef = React.useRef(items);
  itemsRef.current = items;

  const removeItem = React.useCallback(
    (id: string) => {
      setItems(itemsRef.current.filter((item) => item.id !== id));
    },
    [setItems],
  );

  const nextId = React.useCallback(
    () => `${reactId}-upload-${seedRef.current++}`,
    [reactId],
  );

  const ctx = React.useMemo<Ctx>(
    () => ({ items, setItems, removeItem, nextId }),
    [items, setItems, removeItem, nextId],
  );

  return (
    <UploadManagerContext.Provider value={ctx}>
      <div
        data-slot="upload-manager"
        className={cn(
          "flex w-full flex-col gap-3 rounded-lg border border-border bg-card p-3 text-card-foreground",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </UploadManagerContext.Provider>
  );
}

export type UploadDropzoneProps = Omit<
  React.ComponentProps<"div">,
  "onDrop" | "onDragEnter" | "onDragLeave" | "onDragOver" | "children"
> & {
  /** Restrict the native file picker, e.g. "image/*,.pdf". */
  accept?: string;
  /** Allow selecting more than one file at a time. */
  multiple?: boolean;
  disabled?: boolean;
  /** Called with the selected or dropped files so the queue can append them. */
  onAdd?: (files: File[]) => void;
  headline?: string;
  subline?: React.ReactNode;
  children?: React.ReactNode;
};

function UploadDropzone({
  accept,
  multiple = true,
  disabled,
  onAdd,
  headline = "Drop files here, or click to browse",
  subline,
  className,
  children,
  ...props
}: UploadDropzoneProps) {
  const { nextId, setItems, items } = useUploadManager();
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const dragCounter = React.useRef(0);

  const itemsRef = React.useRef(items);
  itemsRef.current = items;

  const add = React.useCallback(
    (incoming: FileList | File[]) => {
      if (disabled) return;
      const list = Array.from(incoming);
      if (list.length === 0) return;
      onAdd?.(list);
      const appended: UploadItem[] = list.map((file) => ({
        id: nextId(),
        name: file.name,
        size: file.size,
        progress: 0,
        status: "queued",
      }));
      setItems([...itemsRef.current, ...appended]);
    },
    [disabled, nextId, onAdd, setItems],
  );

  const openPicker = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled || undefined}
      data-slot="upload-dropzone"
      data-dragging={isDragging || undefined}
      onClick={openPicker}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openPicker();
        }
      }}
      onDragEnter={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (disabled) return;
        dragCounter.current += 1;
        if (dragCounter.current === 1) setIsDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (disabled) return;
        dragCounter.current -= 1;
        if (dragCounter.current <= 0) {
          dragCounter.current = 0;
          setIsDragging(false);
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current = 0;
        setIsDragging(false);
        if (disabled) return;
        const dropped = e.dataTransfer.files;
        if (dropped && dropped.length > 0) add(dropped);
      }}
      className={cn(
        "flex min-w-0 flex-col items-center justify-center gap-1.5 rounded-md border border-dashed border-border bg-background px-4 py-6 text-center outline-none transition-colors",
        "hover:border-foreground/30 hover:bg-muted/50",
        "focus-visible:ring-2 focus-visible:ring-ring",
        isDragging && "border-foreground/30 bg-muted/50",
        disabled && "cursor-not-allowed opacity-60",
        className,
      )}
      {...props}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="sr-only"
        onChange={(e) => {
          const list = e.target.files;
          if (list && list.length > 0) add(list);
          e.target.value = "";
        }}
      />
      {children ?? (
        <>
          <Upload className="size-5 text-muted-foreground" aria-hidden />
          <p className="text-sm text-foreground">{headline}</p>
          {subline ? (
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
              {subline}
            </p>
          ) : null}
        </>
      )}
    </div>
  );
}

type UploadListProps = React.ComponentProps<"ul"> & {
  /** Shown when the queue is empty. Hides the list entirely if omitted. */
  empty?: React.ReactNode;
};

function UploadList({ className, empty, children, ...props }: UploadListProps) {
  const { items } = useUploadManager();
  if (items.length === 0) {
    if (empty === undefined) return null;
    return (
      <div
        data-slot="upload-list-empty"
        className="rounded-md border border-dashed border-border px-3 py-6 text-center text-sm text-muted-foreground"
      >
        {empty}
      </div>
    );
  }
  return (
    <ul
      data-slot="upload-list"
      className={cn("flex min-w-0 flex-col gap-1.5", className)}
      {...props}
    >
      {children}
    </ul>
  );
}

export type UploadItemRowProps = Omit<
  React.ComponentProps<"li">,
  "children"
> & {
  /** The queue entry to render. */
  item: UploadItem;
  /** Called when the user cancels an in-flight upload. */
  onCancel?: (id: string) => void;
  /** Called when the user retries a failed upload. */
  onRetry?: (id: string) => void;
  /** Called when the user removes the entry. Falls back to the root's remove. */
  onRemove?: (id: string) => void;
};

function UploadItem({
  item,
  onCancel,
  onRetry,
  onRemove,
  className,
  ...props
}: UploadItemRowProps) {
  const { removeItem } = useUploadManager();
  const isUploading = item.status === "uploading";
  const isError = item.status === "error";
  const isDone = item.status === "done";

  const handleRemove = () => {
    if (onRemove) onRemove(item.id);
    else removeItem(item.id);
  };

  return (
    <li
      data-slot="upload-item"
      data-status={item.status}
      className={cn(
        "flex min-w-0 items-start gap-3 rounded-md border border-border bg-background px-3 py-2.5",
        className,
      )}
      {...props}
    >
      <span
        data-slot="upload-item-icon"
        className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground [&_svg]:size-4"
      >
        {isError ? (
          <CircleAlert className="text-destructive" aria-hidden />
        ) : isDone ? (
          <Check className="text-foreground" aria-hidden />
        ) : (
          <FileIcon aria-hidden />
        )}
      </span>

      <div data-slot="upload-item-main" className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex min-w-0 items-center gap-2">
          <span
            data-slot="upload-item-name"
            className="min-w-0 flex-1 truncate text-sm text-foreground"
            title={item.name}
          >
            {item.name}
          </span>
          <span
            data-slot="upload-item-size"
            className="shrink-0 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground"
          >
            {formatBytes(item.size)}
          </span>
        </div>

        {isError ? (
          <p
            data-slot="upload-item-status"
            className="text-xs text-destructive"
          >
            {STATUS_LABEL.error}
          </p>
        ) : (
          <div className="flex items-center gap-2">
            <Progress
              data-slot="upload-item-progress"
              value={item.progress}
              className="h-1.5 flex-1"
            />
            <span
              data-slot="upload-item-status"
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em]",
                isUploading ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {isUploading ? (
                <span className="state-dot" aria-hidden />
              ) : null}
              {isDone
                ? STATUS_LABEL.done
                : isUploading
                  ? `${Math.round(item.progress)}%`
                  : STATUS_LABEL.queued}
            </span>
          </div>
        )}
      </div>

      <div
        data-slot="upload-item-actions"
        className="flex shrink-0 items-center gap-1"
      >
        {isUploading ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Cancel upload of ${item.name}`}
            onClick={() => onCancel?.(item.id)}
          >
            <X aria-hidden />
          </Button>
        ) : isError ? (
          <>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={`Retry upload of ${item.name}`}
              onClick={() => onRetry?.(item.id)}
            >
              <RotateCw aria-hidden />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={`Remove ${item.name}`}
              onClick={handleRemove}
            >
              <X aria-hidden />
            </Button>
          </>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Remove ${item.name}`}
            onClick={handleRemove}
          >
            <X aria-hidden />
          </Button>
        )}
      </div>
    </li>
  );
}

type UploadSummaryProps = Omit<React.ComponentProps<"div">, "children"> & {
  children?: (summary: {
    total: number;
    done: number;
    uploading: number;
    error: number;
    queued: number;
    progress: number;
  }) => React.ReactNode;
};

function UploadSummary({ className, children, ...props }: UploadSummaryProps) {
  const { items } = useUploadManager();

  const summary = React.useMemo(() => {
    const total = items.length;
    let done = 0;
    let uploading = 0;
    let error = 0;
    let queued = 0;
    let progressSum = 0;
    for (const item of items) {
      progressSum += item.status === "done" ? 100 : item.progress;
      if (item.status === "done") done++;
      else if (item.status === "uploading") uploading++;
      else if (item.status === "error") error++;
      else queued++;
    }
    const progress = total === 0 ? 0 : progressSum / total;
    return { total, done, uploading, error, queued, progress };
  }, [items]);

  if (summary.total === 0) return null;

  if (children) {
    return (
      <div data-slot="upload-summary" className={className} {...props}>
        {children(summary)}
      </div>
    );
  }

  const parts: string[] = [];
  if (summary.uploading > 0) parts.push(`${summary.uploading} uploading`);
  if (summary.queued > 0) parts.push(`${summary.queued} queued`);
  if (summary.done > 0) parts.push(`${summary.done} done`);
  if (summary.error > 0) parts.push(`${summary.error} failed`);

  return (
    <div
      data-slot="upload-summary"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          data-slot="upload-summary-counts"
          className="text-sm font-medium text-foreground"
        >
          {summary.done} of {summary.total} uploaded
        </span>
        <span
          data-slot="upload-summary-detail"
          className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground"
        >
          {parts.length > 0 ? parts.join(" · ") : "Ready"}
        </span>
      </div>
      <Progress
        data-slot="upload-summary-progress"
        value={summary.progress}
        className="h-1.5"
      />
    </div>
  );
}

export {
  UploadManager,
  UploadDropzone,
  UploadList,
  UploadItem,
  UploadSummary,
  useUploadManager,
};
