'use client';

import * as React from 'react';
import { useDropzone, type Accept, type DropzoneState } from 'react-dropzone';
import { Camera, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
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
  const units = ['B', 'KB', 'MB', 'GB', 'TB'] as const;
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }

  return `${i === 0 ? n.toFixed(0) : n.toFixed(1)} ${units[i]}`;
};

const readAsDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
};

const IMAGE_TYPES: Accept = { 'image/*': [] };

export type AvatarUploadShape = 'circle' | 'square';

export interface AvatarUploadErrorInfo {
  reason: 'type' | 'size' | 'read';
  message: string;
}

interface AvatarUploadContextValue {
  id: string;
  value: string | null;
  shape: AvatarUploadShape;
  size: number;
  disabled?: boolean;
  dragging: boolean;
  getInputProps: DropzoneState['getInputProps'];
  error: AvatarUploadErrorInfo | null;
  pending: string | null;
  registerCropper: (ref: ImageCropperRef | null) => void;
  openPicker: () => void;
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
  /** MIME types mapped to extensions. Defaults to any image. */
  accept?: Accept;
  /** Edge of the exported square, in px. */
  outputSize?: number;
  /** Set false to skip the crop dialog and use the file as-is. */
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
  accept = IMAGE_TYPES,
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
  const cropperRef = React.useRef<ImageCropperRef | null>(null);

  const [internal, setInternal] = React.useState<string | null>(defaultValue);
  const value = valueProp === undefined ? internal : valueProp;
  const [pending, setPending] = React.useState<string | null>(null);
  const [error, setError] = React.useState<AvatarUploadErrorInfo | null>(null);
  // Only the latest read may land, and never after unmount.
  const readIdRef = React.useRef(0);
  React.useEffect(
    () => () => {
      readIdRef.current += 1;
    },
    [],
  );

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

  const readFile = (file: File) => {
    setError(null);
    const readId = ++readIdRef.current;
    readAsDataUrl(file)
      .then((url) => {
        if (readId !== readIdRef.current) return;
        if (crop) setPending(url);
        else setValue(url);
      })
      .catch(() => {
        if (readId !== readIdRef.current) return;
        fail({ reason: 'read', message: 'Could not read that file.' });
      });
  };

  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    accept,
    maxSize,
    multiple: false,
    disabled,
    noClick: true,
    noKeyboard: true,
    onDropAccepted: ([file]) => readFile(file),
    onDropRejected: ([rejection]) =>
      rejection.errors[0]?.code === 'file-too-large'
        ? fail({ reason: 'size', message: `Image must be under ${formatBytes(maxSize ?? 0)}.` })
        : fail({ reason: 'type', message: 'That file type is not supported.' }),
  });

  const registerCropper = React.useCallback((ref: ImageCropperRef | null) => {
    cropperRef.current = ref;
  }, []);

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
      shape,
      size,
      disabled,
      dragging: isDragActive,
      getInputProps,
      error,
      pending,
      registerCropper,
      openPicker: open,
      confirmCrop,
      cancelCrop,
      remove,
    }),
    [
      rootId,
      value,
      shape,
      size,
      disabled,
      isDragActive,
      getInputProps,
      error,
      pending,
      registerCropper,
      open,
      confirmCrop,
      cancelCrop,
      remove,
    ],
  );

  return (
    <AvatarUploadContext.Provider value={ctx}>
      <div
        {...getRootProps({ className: cn('inline-grid w-fit justify-items-center gap-2', className), ...props })}
        data-slot="avatar-upload"
        data-shape={shape}
        data-dragging={isDragActive || undefined}
        data-disabled={disabled || undefined}
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
      className={cn('group/avatar relative shrink-0', className)}
      style={{ width: ctx.size, height: ctx.size, ...style }}
      {...props}
    >
      <div
        data-slot="avatar-upload-frame"
        className={cn(
          'flex size-full items-center justify-center overflow-hidden border border-border bg-muted text-muted-foreground transition-colors motion-reduce:transition-none',
          ctx.shape === 'circle' ? 'rounded-full' : 'rounded-md',
          ctx.dragging && 'border-foreground/40 bg-accent',
        )}
      >
        {ctx.value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={ctx.value}
            alt={alt}
            draggable={false}
            data-slot="avatar-upload-image"
            className="size-full object-cover select-none"
          />
        ) : (
          <span
            aria-hidden
            data-slot="avatar-upload-fallback"
            className="font-medium tracking-[0.04em] uppercase"
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
            <Camera />
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
        'group-data-[empty]/avatar:bg-transparent group-data-[empty]/avatar:opacity-100 group-data-[empty]/avatar:backdrop-blur-none',
        'disabled:pointer-events-none motion-reduce:transition-none',
        ctx.shape === 'circle' ? 'rounded-full' : 'rounded-md',
        className,
      )}
      {...props}
    >
      {children ?? (ctx.value ? <Camera className="size-5" /> : <span className="sr-only">{label}</span>)}
    </button>
  );
};

type AvatarUploadInputProps = Omit<React.ComponentProps<'input'>, 'type' | 'accept' | 'onChange' | 'multiple' | 'ref'>;

const AvatarUploadInput = (props: AvatarUploadInputProps) => {
  const ctx = useAvatarUpload();

  return <input {...ctx.getInputProps({ id: `${ctx.id}-input`, ...props })} data-slot="avatar-upload-input" />;
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
      {children ?? <X className="size-3" />}
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
              <span className="text-xs text-muted-foreground uppercase">{zoomLabel}</span>
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
