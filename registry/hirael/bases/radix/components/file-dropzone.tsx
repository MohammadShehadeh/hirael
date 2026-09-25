'use client';

import * as React from 'react';
import { useDropzone, type Accept, type DropzoneState, type FileRejection } from 'react-dropzone';
import { File as FileIcon, FileText, UploadCloud, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/radix/ui/button';

const formatBytes = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes < 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'] as const;
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }

  return `${i === 0 ? n.toFixed(0) : n.toFixed(1)} ${units[i]}`;
};

export interface FileDropzoneError {
  file: File;
  /** Which rule turned the file away. */
  reason: 'size' | 'type' | 'count';
  message: string;
}

const toError = ({ file, errors: [error] }: FileRejection, maxSize?: number): FileDropzoneError => {
  if (error?.code === 'file-too-large') {
    return { file, reason: 'size', message: `"${file.name}" exceeds ${formatBytes(maxSize ?? 0)}.` };
  }
  if (error?.code === 'too-many-files') {
    return { file, reason: 'count', message: `"${file.name}" not added. Only one file is allowed.` };
  }

  return { file, reason: 'type', message: `"${file.name}" type not allowed.` };
};

interface Ctx {
  files: File[];
  accept?: Accept;
  maxSize?: number;
  disabled?: boolean;
  errors: FileDropzoneError[];
  removeAt: (index: number) => void;
  dropzone: DropzoneState;
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
  /** MIME types mapped to extensions, e.g. `{ 'image/*': [], 'application/pdf': ['.pdf'] }`. */
  accept?: Accept;
  /** Largest file in bytes. */
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

  const dropzone = useDropzone({
    accept,
    maxSize,
    multiple,
    disabled,
    onDrop: (accepted, rejections) => {
      if (accepted.length > 0) setFiles(multiple ? [...files, ...accepted] : accepted);
      setErrors(rejections.map((rejection) => toError(rejection, maxSize)));
    },
  });

  const removeAt = React.useCallback(
    (index: number) => {
      const removed = files[index];
      setFiles(files.filter((_, i) => i !== index));
      // Errors about this file, or about the one-file limit, no longer apply once it's gone.
      setErrors((prev) => prev.filter((err) => err.file !== removed && err.reason !== 'count'));
    },
    [files, setFiles],
  );

  const ctx = React.useMemo<Ctx>(
    () => ({ files, accept, maxSize, disabled, errors, removeAt, dropzone }),
    [files, accept, maxSize, disabled, errors, removeAt, dropzone],
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
  const { getRootProps, getInputProps, isDragActive } = ctx.dropzone;
  const types = ctx.accept && Object.entries(ctx.accept).flatMap(([mime, exts]) => (exts.length ? exts : [mime]));
  const resolvedSubline =
    subline !== undefined
      ? subline
      : [types?.join(', '), ctx.maxSize !== undefined && `up to ${formatBytes(ctx.maxSize)}`]
          .filter(Boolean)
          .join(' · ') || null;

  return (
    <div
      {...getRootProps({
        role: 'button',
        'aria-disabled': ctx.disabled || undefined,
        className: cn(
          'flex min-w-0 flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-background px-6 py-10 text-center transition-colors outline-none',
          'hover:border-foreground/30 hover:bg-accent/50',
          'focus-visible:ring-2 focus-visible:ring-ring',
          isDragActive && 'border-foreground/30 bg-accent/50',
          ctx.disabled && 'cursor-not-allowed opacity-60',
          className,
        ),
        ...props,
      })}
      data-slot="file-dropzone-zone"
      data-dragging={isDragActive || undefined}
    >
      <input {...getInputProps()} />
      {children ?? (
        <>
          <UploadCloud className="size-6 text-muted-foreground" />
          <p className="text-sm text-foreground">{headline}</p>
          {resolvedSubline && <p className="text-xs text-muted-foreground uppercase">{resolvedSubline}</p>}
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
            <Icon className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="min-w-0 flex-1 truncate" title={file.name}>
              {file.name}
            </span>
            <span className="shrink-0 text-xs text-muted-foreground uppercase">{formatBytes(file.size)}</span>
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
          className="text-[11px] break-words text-destructive"
        >
          {err.message}
        </li>
      ))}
    </ul>
  );
};

export { FileDropzone, FileDropzoneZone, FileDropzoneList, FileDropzoneErrors };
