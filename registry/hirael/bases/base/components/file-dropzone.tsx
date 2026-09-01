'use client';

import * as React from 'react';
import { File as FileIcon, FileText, UploadCloud, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';

const formatBytes = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes < 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'] as const;
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  const fixed = i === 0 ? n.toFixed(0) : n.toFixed(1);
  return `${fixed} ${units[i]}`;
};

const matchesAccept = (file: File, accept?: string): boolean => {
  if (!accept) return true;
  const tokens = accept
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
  if (tokens.length === 0) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  for (const token of tokens) {
    if (token.startsWith('.')) {
      if (name.endsWith(token)) return true;
    } else if (token.endsWith('/*')) {
      const prefix = token.slice(0, -1);
      if (type.startsWith(prefix)) return true;
    } else if (token.includes('/')) {
      if (type === token) return true;
    }
  }
  return false;
};

export interface FileDropzoneError {
  file: File;
  reason: 'size' | 'type';
  message: string;
}

interface Ctx {
  files: File[];
  setFiles: (next: File[]) => void;
  accept?: string;
  maxSize?: number;
  multiple: boolean;
  disabled?: boolean;
  errors: FileDropzoneError[];
  setErrors: (next: FileDropzoneError[]) => void;
  addFiles: (incoming: FileList | File[]) => void;
  removeAt: (index: number) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

const FileDropzoneContext = React.createContext<Ctx | null>(null);

const useFileDropzone = () => {
  const ctx = React.useContext(FileDropzoneContext);
  if (!ctx) {
    throw new Error('FileDropzone compound parts must be used inside <FileDropzone>');
  }
  return ctx;
};

export interface FileDropzoneProps extends Omit<React.ComponentProps<'div'>, 'defaultValue'> {
  value?: File[];
  defaultValue?: File[];
  onValueChange?: (files: File[]) => void;
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
  disabled?: boolean;
}

const FileDropzone = ({
  value: valueProp,
  defaultValue,
  onValueChange,
  accept,
  maxSize,
  multiple = false,
  disabled,
  className,
  children,
  ...props
}: FileDropzoneProps) => {
  const [internalFiles, setInternalFiles] = React.useState<File[]>(defaultValue ?? []);
  const files = valueProp ?? internalFiles;
  const setFiles = React.useCallback(
    (next: File[]) => {
      if (valueProp === undefined) setInternalFiles(next);
      onValueChange?.(next);
    },
    [valueProp, onValueChange],
  );

  const [errors, setErrors] = React.useState<FileDropzoneError[]>([]);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const addFiles = React.useCallback(
    (incoming: FileList | File[]) => {
      if (disabled) return;
      const list = Array.from(incoming);
      const nextErrors: FileDropzoneError[] = [];
      const accepted: File[] = [];
      for (const file of list) {
        if (!matchesAccept(file, accept)) {
          nextErrors.push({
            file,
            reason: 'type',
            message: `"${file.name}" type not allowed.`,
          });
          continue;
        }
        if (maxSize !== undefined && file.size > maxSize) {
          nextErrors.push({
            file,
            reason: 'size',
            message: `"${file.name}" exceeds ${formatBytes(maxSize)}.`,
          });
          continue;
        }
        accepted.push(file);
      }
      if (accepted.length > 0) {
        const merged = multiple ? [...files, ...accepted] : [accepted[0]];
        setFiles(merged);
      }
      setErrors(nextErrors);
    },
    [accept, disabled, files, maxSize, multiple, setFiles],
  );

  const removeAt = React.useCallback(
    (index: number) => {
      if (disabled) return;
      const next = files.filter((_, i) => i !== index);
      setFiles(next);
    },
    [disabled, files, setFiles],
  );

  const ctx = React.useMemo<Ctx>(
    () => ({
      files,
      setFiles,
      accept,
      maxSize,
      multiple,
      disabled,
      errors,
      setErrors,
      addFiles,
      removeAt,
      inputRef,
    }),
    [files, setFiles, accept, maxSize, multiple, disabled, errors, addFiles, removeAt],
  );

  return (
    <FileDropzoneContext.Provider value={ctx}>
      <div data-slot="file-dropzone" className={className} {...props}>
        {children}
      </div>
    </FileDropzoneContext.Provider>
  );
};

interface FileDropzoneZoneProps extends Omit<
  React.ComponentProps<'div'>,
  'onDrop' | 'onDragEnter' | 'onDragLeave' | 'onDragOver' | 'children'
> {
  headline?: string;
  subline?: React.ReactNode;
  children?: React.ReactNode;
}

const FileDropzoneZone = ({
  className,
  headline = 'Drop files here, or click to browse',
  subline,
  children,
  ...props
}: FileDropzoneZoneProps) => {
  const ctx = useFileDropzone();
  const [isDragging, setIsDragging] = React.useState(false);
  const dragCounter = React.useRef(0);

  const handleClick = () => {
    if (ctx.disabled) return;
    ctx.inputRef.current?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (ctx.disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      ctx.inputRef.current?.click();
    }
  };

  const resolvedSubline = React.useMemo(() => {
    if (subline !== undefined) return subline;
    const parts: string[] = [];
    if (ctx.accept) parts.push(ctx.accept);
    if (ctx.maxSize !== undefined) parts.push(`up to ${formatBytes(ctx.maxSize)}`);
    return parts.length > 0 ? parts.join(' · ') : null;
  }, [subline, ctx.accept, ctx.maxSize]);

  return (
    <div
      role="button"
      tabIndex={ctx.disabled ? -1 : 0}
      aria-disabled={ctx.disabled || undefined}
      data-slot="file-dropzone-zone"
      data-dragging={isDragging || undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onDragEnter={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (ctx.disabled) return;
        dragCounter.current += 1;
        if (dragCounter.current === 1) setIsDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (ctx.disabled) return;
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
        if (ctx.disabled) return;
        const dropped = e.dataTransfer.files;
        if (dropped && dropped.length > 0) ctx.addFiles(dropped);
      }}
      className={cn(
        'flex min-w-0 flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-background px-6 py-10 text-center transition-colors outline-none',
        'hover:border-foreground/30 hover:bg-accent/50',
        'focus-visible:ring-2 focus-visible:ring-ring',
        isDragging && 'border-foreground/30 bg-accent/50',
        ctx.disabled && 'cursor-not-allowed opacity-60',
        className,
      )}
      {...props}
    >
      <input
        ref={ctx.inputRef}
        type="file"
        accept={ctx.accept}
        multiple={ctx.multiple}
        disabled={ctx.disabled}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(e) => {
          const list = e.target.files;
          if (list && list.length > 0) ctx.addFiles(list);
          e.target.value = '';
        }}
      />
      {children ?? (
        <>
          <UploadCloud className="size-6 text-muted-foreground" aria-hidden />
          <p className="text-sm text-foreground">{headline}</p>
          {resolvedSubline && (
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">{resolvedSubline}</p>
          )}
        </>
      )}
    </div>
  );
};

const iconForFile = (file: File) => {
  if (file.type.startsWith('text/') || /\.(md|txt|csv|json)$/i.test(file.name)) {
    return FileText;
  }
  return FileIcon;
};

type FileDropzoneListProps = React.ComponentProps<'ul'>;

const FileDropzoneList = ({ className, ...props }: FileDropzoneListProps) => {
  const ctx = useFileDropzone();
  if (ctx.files.length === 0) return null;
  return (
    <ul data-slot="file-dropzone-list" className={cn('mt-3 flex min-w-0 flex-col gap-1.5', className)} {...props}>
      {ctx.files.map((file, index) => {
        const Icon = iconForFile(file);
        return (
          <li
            key={`${file.name}-${file.lastModified}-${index}`}
            data-slot="file-dropzone-item"
            className="flex min-w-0 items-center gap-2 rounded-sm border border-border bg-card px-2.5 py-1.5 text-sm"
          >
            <Icon className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
            <span className="min-w-0 flex-1 truncate" title={file.name}>
              {file.name}
            </span>
            <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
              {formatBytes(file.size)}
            </span>
            {!ctx.disabled && (
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label={`Remove ${file.name}`}
                onClick={() => ctx.removeAt(index)}
                className="shrink-0"
              >
                <X className="size-3" />
              </Button>
            )}
          </li>
        );
      })}
    </ul>
  );
};

type FileDropzoneErrorsProps = React.ComponentProps<'ul'>;

const FileDropzoneErrors = ({ className, ...props }: FileDropzoneErrorsProps) => {
  const ctx = useFileDropzone();
  if (ctx.errors.length === 0) return null;
  return (
    <ul
      role="alert"
      data-slot="file-dropzone-errors"
      className={cn('mt-2 flex min-w-0 flex-col gap-1', className)}
      {...props}
    >
      {ctx.errors.map((err, i) => (
        <li
          key={`${err.file.name}-${i}`}
          data-slot="file-dropzone-error"
          className="break-words text-[11px] text-destructive"
        >
          {err.message}
        </li>
      ))}
    </ul>
  );
};

export { FileDropzone, FileDropzoneZone, FileDropzoneList, FileDropzoneErrors };
