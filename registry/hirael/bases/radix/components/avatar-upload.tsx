'use client';

import * as React from 'react';
import { Camera, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { composeRefs } from '@/registry/hirael/bases/radix/components/compose-refs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/registry/hirael/bases/radix/ui/dialog';
import {
  ImageCropper,
  ImageCropperZoom,
  type ImageCropperRef,
} from '@/registry/hirael/bases/radix/components/image-cropper';

const formatBytes = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes < 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'] as const;
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${i === 0 ? n.toFixed(0) : n.toFixed(1)} ${units[i]}`;
};

const matchesAccept = (file: File, accept: string): boolean => {
  const tokens = accept
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
  if (tokens.length === 0) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return tokens.some((token) => {
    if (token.startsWith('.')) return name.endsWith(token);
    if (token.endsWith('/*')) return type.startsWith(token.slice(0, -1));
    return type === token;
  });
};

const readAsDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
};

export type AvatarUploadShape = 'circle' | 'square';

export interface AvatarUploadErrorInfo {
  reason: 'type' | 'size' | 'read';
  message: string;
}

interface AvatarUploadContextValue {
  id: string;
  value: string | null;
  setValue: (next: string | null) => void;
  shape: AvatarUploadShape;
  size: number;
  accept: string;
  maxSize?: number;
  outputSize: number;
  disabled?: boolean;
  dragging: boolean;
  error: AvatarUploadErrorInfo | null;
  pending: string | null;
  registerInput: (el: HTMLInputElement | null) => void;
  registerCropper: (ref: ImageCropperRef | null) => void;
  openPicker: () => void;
  addFile: (file: File) => void;
  confirmCrop: () => void;
  cancelCrop: () => void;
  remove: () => void;
}

const AvatarUploadContext = React.createContext<AvatarUploadContextValue | null>(null);

const useAvatarUpload = () => {
  const ctx = React.useContext(AvatarUploadContext);
  if (!ctx) {
    throw new Error('AvatarUpload compound parts must be used inside <AvatarUpload>');
  }
  return ctx;
};

export interface AvatarUploadProps extends Omit<
  React.ComponentProps<'div'>,
  'onDrop' | 'onDragOver' | 'onDragEnter' | 'onDragLeave' | 'defaultValue' | 'onError'
> {
  id?: string;
  /** Data URL of the current image. */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  shape?: AvatarUploadShape;
  /** Preview edge in px. */
  size?: number;
  /** Max file size in bytes. */
  maxSize?: number;
  accept?: string;
  /** Edge of the exported square, in px. */
  outputSize?: number;
  /** Skip the crop dialog and use the file as-is. */
  crop?: boolean;
  disabled?: boolean;
  onError?: (error: AvatarUploadErrorInfo) => void;
}

const AvatarUpload = ({
  id,
  value: valueProp,
  defaultValue = null,
  onValueChange,
  shape = 'circle',
  size = 96,
  maxSize,
  accept = 'image/*',
  outputSize = 512,
  crop = true,
  disabled,
  onError,
  className,
  children,
  ...props
}: AvatarUploadProps) => {
  const reactId = React.useId();
  const rootId = id ?? reactId;
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const cropperRef = React.useRef<ImageCropperRef | null>(null);
  const dragDepth = React.useRef(0);

  const [internal, setInternal] = React.useState<string | null>(defaultValue);
  const value = valueProp === undefined ? internal : valueProp;
  const [pending, setPending] = React.useState<string | null>(null);
  const [error, setError] = React.useState<AvatarUploadErrorInfo | null>(null);
  const [dragging, setDragging] = React.useState(false);

  const setValue = React.useCallback(
    (next: string | null) => {
      if (valueProp === undefined) setInternal(next);
      onValueChange?.(next);
    },
    [valueProp, onValueChange],
  );

  const fail = React.useCallback(
    (err: AvatarUploadErrorInfo) => {
      setError(err);
      onError?.(err);
    },
    [onError],
  );

  const addFile = React.useCallback(
    (file: File) => {
      if (disabled) return;
      if (!matchesAccept(file, accept)) {
        fail({ reason: 'type', message: 'That file type is not supported.' });
        return;
      }
      if (maxSize !== undefined && file.size > maxSize) {
        fail({
          reason: 'size',
          message: `Image must be under ${formatBytes(maxSize)}.`,
        });
        return;
      }
      setError(null);
      readAsDataUrl(file)
        .then((url) => {
          if (crop) setPending(url);
          else setValue(url);
        })
        .catch(() => fail({ reason: 'read', message: 'Could not read that file.' }));
    },
    [disabled, accept, maxSize, crop, fail, setValue],
  );

  const registerInput = React.useCallback((el: HTMLInputElement | null) => {
    inputRef.current = el;
  }, []);

  const registerCropper = React.useCallback((ref: ImageCropperRef | null) => {
    cropperRef.current = ref;
  }, []);

  const openPicker = React.useCallback(() => {
    if (disabled) return;
    inputRef.current?.click();
  }, [disabled]);

  const confirmCrop = React.useCallback(() => {
    const url = cropperRef.current?.getCroppedDataUrl({ size: outputSize });
    setValue(url ?? pending);
    setPending(null);
  }, [outputSize, pending, setValue]);

  const cancelCrop = React.useCallback(() => setPending(null), []);

  const remove = React.useCallback(() => {
    if (disabled) return;
    setError(null);
    setValue(null);
  }, [disabled, setValue]);

  const ctx = React.useMemo<AvatarUploadContextValue>(
    () => ({
      id: rootId,
      value,
      setValue,
      shape,
      size,
      accept,
      maxSize,
      outputSize,
      disabled,
      dragging,
      error,
      pending,
      registerInput,
      registerCropper,
      openPicker,
      addFile,
      confirmCrop,
      cancelCrop,
      remove,
    }),
    [
      rootId,
      value,
      setValue,
      shape,
      size,
      accept,
      maxSize,
      outputSize,
      disabled,
      dragging,
      error,
      pending,
      registerInput,
      registerCropper,
      openPicker,
      addFile,
      confirmCrop,
      cancelCrop,
      remove,
    ],
  );

  return (
    <AvatarUploadContext.Provider value={ctx}>
      <div
        data-slot="avatar-upload"
        data-shape={shape}
        data-dragging={dragging || undefined}
        data-disabled={disabled || undefined}
        className={cn('inline-grid w-fit justify-items-center gap-2', className)}
        onDragEnter={(e) => {
          e.preventDefault();
          if (disabled) return;
          dragDepth.current += 1;
          if (dragDepth.current === 1) setDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          if (disabled) return;
          dragDepth.current -= 1;
          if (dragDepth.current <= 0) {
            dragDepth.current = 0;
            setDragging(false);
          }
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          dragDepth.current = 0;
          setDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) addFile(file);
        }}
        {...props}
      >
        {children}
      </div>
    </AvatarUploadContext.Provider>
  );
};

interface AvatarUploadPreviewProps extends React.ComponentProps<'div'> {
  /** Initials or a short label shown when there is no image. */
  fallback?: React.ReactNode;
  alt?: string;
}

const AvatarUploadPreview = ({
  fallback,
  alt = 'Avatar',
  className,
  children,
  style,
  ...props
}: AvatarUploadPreviewProps) => {
  const ctx = useAvatarUpload();
  return (
    <div
      data-slot="avatar-upload-preview"
      data-empty={ctx.value ? undefined : ''}
      className="group/avatar relative shrink-0"
      style={{ width: ctx.size, height: ctx.size, ...style }}
      {...props}
    >
      <div
        data-slot="avatar-upload-frame"
        className={cn(
          'flex size-full items-center justify-center overflow-hidden border border-border bg-muted text-muted-foreground transition-colors motion-reduce:transition-none',
          ctx.shape === 'circle' ? 'rounded-full' : 'rounded-md',
          ctx.dragging && 'border-foreground/40 bg-accent',
          className,
        )}
      >
        {ctx.value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={ctx.value}
            alt={alt}
            draggable={false}
            data-slot="avatar-upload-image"
            className="size-full select-none object-cover"
          />
        ) : (
          <span
            aria-hidden
            data-slot="avatar-upload-fallback"
            className="font-medium uppercase tracking-[0.04em]"
            style={{ fontSize: Math.max(12, Math.round(ctx.size / 3)) }}
          >
            {fallback ?? <Camera className="size-[35%]" />}
          </span>
        )}
      </div>
      {children}
    </div>
  );
};

interface AvatarUploadTriggerProps extends Omit<React.ComponentProps<'button'>, 'type'> {
  /** `overlay` sits on top of the preview; `button` is a plain control. */
  variant?: 'overlay' | 'button';
}

const AvatarUploadTrigger = ({
  variant = 'overlay',
  className,
  children,
  onClick,
  ...props
}: AvatarUploadTriggerProps) => {
  const ctx = useAvatarUpload();
  const label = ctx.value ? 'Change photo' : 'Upload photo';

  if (variant === 'button') {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={ctx.disabled}
        data-slot="avatar-upload-trigger"
        className={className}
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) ctx.openPicker();
        }}
        {...props}
      >
        {children ?? (
          <>
            <Camera aria-hidden />
            {label}
          </>
        )}
      </Button>
    );
  }

  return (
    <button
      type="button"
      aria-label={typeof children === 'string' ? children : label}
      disabled={ctx.disabled}
      data-slot="avatar-upload-trigger"
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) ctx.openPicker();
      }}
      className={cn(
        'absolute inset-0 flex items-center justify-center bg-background/70 text-foreground opacity-0 backdrop-blur-[2px] transition-opacity outline-none',
        'hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
        'group-data-[empty]/avatar:opacity-100 group-data-[empty]/avatar:bg-transparent group-data-[empty]/avatar:backdrop-blur-none',
        'disabled:pointer-events-none motion-reduce:transition-none',
        ctx.shape === 'circle' ? 'rounded-full' : 'rounded-md',
        className,
      )}
      {...props}
    >
      {ctx.value ? <Camera className="size-5" aria-hidden /> : <span className="sr-only">{label}</span>}
    </button>
  );
};

type AvatarUploadInputProps = Omit<React.ComponentProps<'input'>, 'type' | 'accept' | 'onChange' | 'multiple'>;

const AvatarUploadInput = ({ className, ref, ...props }: AvatarUploadInputProps) => {
  const ctx = useAvatarUpload();
  const composedRef = React.useMemo(() => composeRefs(ctx.registerInput, ref), [ctx.registerInput, ref]);
  return (
    <input
      ref={composedRef}
      id={`${ctx.id}-input`}
      type="file"
      accept={ctx.accept}
      disabled={ctx.disabled}
      data-slot="avatar-upload-input"
      className={cn('sr-only', className)}
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) ctx.addFile(file);
        e.target.value = '';
      }}
      {...props}
    />
  );
};

type AvatarUploadRemoveProps = Omit<React.ComponentProps<'button'>, 'type'>;

const AvatarUploadRemove = ({ className, children, onClick, ...props }: AvatarUploadRemoveProps) => {
  const ctx = useAvatarUpload();
  if (!ctx.value) return null;
  return (
    <Button
      type="button"
      variant="outline"
      size="icon-xs"
      aria-label="Remove photo"
      disabled={ctx.disabled}
      data-slot="avatar-upload-remove"
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) ctx.remove();
      }}
      className={cn('absolute -end-1 -top-1 z-10 rounded-full', className)}
      {...props}
    >
      {children ?? <X className="size-3" aria-hidden />}
    </Button>
  );
};

interface AvatarUploadCropDialogProps extends Omit<React.ComponentProps<typeof DialogContent>, 'children'> {
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  zoomLabel?: string;
  maxZoom?: number;
}

const AvatarUploadCropDialog = ({
  title = 'Adjust your photo',
  description = 'Drag to reposition. Scroll or use the slider to zoom.',
  confirmLabel = 'Apply',
  cancelLabel = 'Cancel',
  zoomLabel = 'Zoom',
  maxZoom = 3,
  className,
  ...props
}: AvatarUploadCropDialogProps) => {
  const ctx = useAvatarUpload();
  // Destructured: `ctx.registerCropper` at a ref site makes the compiler read every ctx.* as a ref.
  const { registerCropper } = ctx;
  return (
    <Dialog
      open={ctx.pending !== null}
      onOpenChange={(open) => {
        if (!open) ctx.cancelCrop();
      }}
    >
      <DialogContent data-slot="avatar-upload-crop-dialog" className={cn('sm:max-w-sm', className)} {...props}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {ctx.pending && (
          <ImageCropper
            ref={registerCropper}
            src={ctx.pending}
            alt={title}
            aspect={1}
            shape={ctx.shape === 'circle' ? 'round' : 'rect'}
            maxZoom={maxZoom}
            data-slot="avatar-upload-cropper"
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                {zoomLabel}
              </span>
              <ImageCropperZoom aria-label={zoomLabel} />
            </div>
          </ImageCropper>
        )}
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={ctx.cancelCrop}>
            {cancelLabel}
          </Button>
          <Button type="button" onClick={ctx.confirmCrop}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface AvatarUploadErrorProps extends Omit<React.ComponentProps<'p'>, 'children'> {
  /** Override the message per reason. */
  messages?: Partial<Record<AvatarUploadErrorInfo['reason'], string>>;
}

const AvatarUploadErrorMessage = ({ messages, className, ...props }: AvatarUploadErrorProps) => {
  const ctx = useAvatarUpload();
  if (!ctx.error) return null;
  return (
    <p
      role="alert"
      data-slot="avatar-upload-error"
      data-reason={ctx.error.reason}
      className={cn('text-center text-[11px] text-destructive', className)}
      {...props}
    >
      {messages?.[ctx.error.reason] ?? ctx.error.message}
    </p>
  );
};

export {
  AvatarUpload,
  AvatarUploadPreview,
  AvatarUploadTrigger,
  AvatarUploadInput,
  AvatarUploadRemove,
  AvatarUploadCropDialog,
  AvatarUploadErrorMessage as AvatarUploadError,
};
