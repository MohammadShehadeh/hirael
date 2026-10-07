'use client';

import * as React from 'react';
import { CircleAlert, CircleCheck, RotateCw, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Progress } from '@/registry/hirael/bases/base/ui/progress';
import { FileIcon } from '@/registry/hirael/bases/base/components/file-card';
import { formatBytes } from '@/registry/hirael/lib/format-bytes';

export type UploadStatus = 'queued' | 'uploading' | 'done' | 'error' | 'canceled';

export interface UploadItem {
  id: string;
  file: File;
  status: UploadStatus;
  /** 0 to 100. */
  progress: number;
  /** The message of the error `upload` threw, shown under the file. */
  error?: string;
}

export interface UploadContext {
  /** Report how far along the upload is, 0 to 100. */
  onProgress: (percent: number) => void;
  /** Aborts when the upload is canceled; pass it to fetch or XMLHttpRequest. */
  signal: AbortSignal;
}

export interface UseUploadQueueOptions {
  /**
   * Sends one file. Resolve when it is stored, throw or reject to mark it failed.
   * The error's message is shown to the reader, so throw one written for them.
   */
  upload: (file: File, context: UploadContext) => Promise<unknown>;
  /** Files uploading at the same time. */
  concurrency?: number;
}

let nextId = 0;

/** Queue state and actions: add files, and they upload a few at a time with progress, cancel and retry. */
export const useUploadQueue = ({ upload, concurrency = 3 }: UseUploadQueueOptions) => {
  const [items, setItems] = React.useState<UploadItem[]>([]);
  const controllers = React.useRef(new Map<string, AbortController>());
  const uploadRef = React.useRef(upload);

  React.useLayoutEffect(() => {
    uploadRef.current = upload;
  });

  const patch = React.useCallback((id: string, change: Partial<UploadItem>) => {
    setItems((list) => list.map((item) => (item.id === id ? { ...item, ...change } : item)));
  }, []);

  const start = React.useCallback(
    (item: UploadItem) => {
      const controller = new AbortController();
      controllers.current.set(item.id, controller);
      patch(item.id, { status: 'uploading', progress: 0, error: undefined });
      uploadRef
        .current(item.file, {
          signal: controller.signal,
          onProgress: (percent) => patch(item.id, { progress: Math.min(100, Math.max(0, percent)) }),
        })
        .then(() => {
          if (!controller.signal.aborted) patch(item.id, { status: 'done', progress: 100 });
        })
        .catch((error: unknown) => {
          if (controller.signal.aborted) return;
          patch(item.id, { status: 'error', error: error instanceof Error ? error.message : String(error) });
        })
        .finally(() => controllers.current.delete(item.id));
    },
    [patch],
  );

  // Starts queued files whenever a slot frees up.
  React.useEffect(() => {
    const active = items.filter((item) => item.status === 'uploading').length;
    const waiting = items.filter((item) => item.status === 'queued' && !controllers.current.has(item.id));
    waiting.slice(0, Math.max(0, concurrency - active)).forEach(start);
  }, [items, concurrency, start]);

  React.useEffect(() => {
    const map = controllers.current;

    return () => map.forEach((controller) => controller.abort());
  }, []);

  const add = React.useCallback((files: Iterable<File>) => {
    const added = [...files].map((file) => ({
      id: `upload-${++nextId}`,
      file,
      status: 'queued' as const,
      progress: 0,
    }));
    setItems((list) => [...list, ...added]);
  }, []);

  const cancel = React.useCallback(
    (id: string) => {
      controllers.current.get(id)?.abort();
      controllers.current.delete(id);
      patch(id, { status: 'canceled' });
    },
    [patch],
  );

  const retry = React.useCallback(
    (id: string) => patch(id, { status: 'queued', progress: 0, error: undefined }),
    [patch],
  );

  const remove = React.useCallback((id: string) => {
    controllers.current.get(id)?.abort();
    controllers.current.delete(id);
    setItems((list) => list.filter((item) => item.id !== id));
  }, []);

  const clearFinished = React.useCallback(
    () => setItems((list) => list.filter((item) => item.status !== 'done' && item.status !== 'canceled')),
    [],
  );

  return { items, add, cancel, retry, remove, clearFinished };
};

export interface UploadQueueLabels {
  summary: (done: number, total: number) => string;
  clear: string;
  cancel: string;
  retry: string;
  remove: string;
  status: Record<UploadStatus, string>;
}

const DEFAULT_LABELS: UploadQueueLabels = {
  summary: (done, total) => `${done} of ${total} uploaded`,
  clear: 'Clear finished',
  cancel: 'Cancel upload',
  retry: 'Try again',
  remove: 'Remove',
  status: { queued: 'Waiting', uploading: 'Uploading', done: 'Uploaded', error: 'Failed', canceled: 'Canceled' },
};

export type UploadQueueLabelOverrides = Partial<Omit<UploadQueueLabels, 'status'>> & {
  status?: Partial<UploadQueueLabels['status']>;
};

export interface UploadQueueProps extends React.ComponentProps<'div'> {
  /** The `useUploadQueue` result. */
  queue: ReturnType<typeof useUploadQueue>;
  labels?: UploadQueueLabelOverrides;
}

/** The list of uploads with an overall bar, per-file progress, and cancel, retry and remove buttons. */
const UploadQueue = ({ queue, labels, className, ...props }: UploadQueueProps) => {
  const text = { ...DEFAULT_LABELS, ...labels, status: { ...DEFAULT_LABELS.status, ...labels?.status } };
  const { items } = queue;
  if (items.length === 0) return null;

  const counted = items.filter((item) => item.status !== 'canceled');
  const done = counted.filter((item) => item.status === 'done').length;
  const overall = counted.length ? counted.reduce((sum, item) => sum + item.progress, 0) / counted.length : 0;
  const finished = items.some((item) => item.status === 'done' || item.status === 'canceled');

  return (
    <div
      data-slot="upload-queue"
      className={cn('grid gap-3 rounded-lg border border-border bg-card p-3 text-card-foreground', className)}
      {...props}
    >
      <div className="grid gap-2">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span aria-live="polite" className="font-medium tabular-nums">
            {text.summary(done, counted.length)}
          </span>
          {finished && (
            <Button type="button" variant="ghost" size="xs" onClick={queue.clearFinished}>
              {text.clear}
            </Button>
          )}
        </div>
        <Progress value={overall} aria-label={text.summary(done, counted.length)} />
      </div>
      <ul className="grid gap-1">
        {items.map((item) => (
          <UploadQueueItem
            key={item.id}
            item={item}
            labels={text}
            onRetry={() => queue.retry(item.id)}
            onCancel={() => queue.cancel(item.id)}
            onRemove={() => queue.remove(item.id)}
          />
        ))}
      </ul>
    </div>
  );
};

const STATUS_ICON: Partial<Record<UploadStatus, React.ReactNode>> = {
  done: <CircleCheck aria-hidden className="size-4 text-success" />,
  error: <CircleAlert aria-hidden className="size-4 text-destructive" />,
};

const statusLine = (item: UploadItem, labels: UploadQueueLabels) => {
  if (item.status === 'uploading') {
    return `${formatBytes((item.file.size * item.progress) / 100)} / ${formatBytes(item.file.size)}`;
  }
  if (item.status === 'error' && item.error) return item.error;

  return `${formatBytes(item.file.size)}, ${labels.status[item.status]}`;
};

interface UploadQueueItemProps {
  item: UploadItem;
  labels: UploadQueueLabels;
  onRetry: () => void;
  onCancel: () => void;
  onRemove: () => void;
}

const UploadQueueItem = ({ item, labels, onRetry, onCancel, onRemove }: UploadQueueItemProps) => {
  const active = item.status === 'uploading' || item.status === 'queued';

  return (
    <li data-slot="upload-queue-item" data-status={item.status} className="flex items-center gap-3 rounded-md p-1.5">
      <FileIcon name={item.file.name} type={item.file.type} className="size-9" />
      <div className="grid min-w-0 flex-1 gap-1">
        <div className="flex items-center gap-2 text-sm">
          <span className="min-w-0 flex-1 truncate font-medium" title={item.file.name}>
            {item.file.name}
          </span>
          {STATUS_ICON[item.status]}
        </div>
        {item.status === 'uploading' && (
          <Progress value={item.progress} aria-label={`${item.file.name}: ${Math.round(item.progress)}%`} />
        )}
        <span
          className={cn(
            'truncate text-xs text-muted-foreground tabular-nums',
            item.status === 'error' && 'text-destructive',
          )}
        >
          {statusLine(item, labels)}
        </span>
      </div>
      <div className="flex shrink-0 gap-0.5">
        {item.status === 'error' && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={labels.retry}
            title={labels.retry}
            onClick={onRetry}
          >
            <RotateCw />
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={active ? labels.cancel : labels.remove}
          title={active ? labels.cancel : labels.remove}
          onClick={active ? onCancel : onRemove}
        >
          <X />
        </Button>
      </div>
    </li>
  );
};

export { UploadQueue };
