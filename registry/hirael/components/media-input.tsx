"use client";

import * as React from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/registry/hirael/ui/button";

export interface MediaInputValue {
  file: File;
  url: string;}

interface MediaInputContextValue {
  value: MediaInputValue | null;
  error: string | null;
  disabled: boolean;
  open: () => void;
  clear: () => void;}

const MediaInputContext = React.createContext<MediaInputContextValue | null>(
  null,
);

const useMediaInput = () => {
  const ctx = React.useContext(MediaInputContext);
  if (!ctx) throw new Error("useMediaInput must be used within <MediaInput>");
  return ctx;
};

const formatSize = (bytes: number) => {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
};

export interface MediaInputProps extends Omit<
  React.ComponentProps<"div">,
  "onError" | "defaultValue"
> {
  /** Native accept filter, e.g. "audio/*" or "image/png,image/webp". */
  accept?: string;
  /** Maximum file size in bytes. Larger picks are rejected with an error. */
  maxSize?: number;
  disabled?: boolean;
  value?: MediaInputValue | null;
  defaultValue?: MediaInputValue | null;
  onValueChange?: (value: MediaInputValue | null) => void;
  onError?: (message: string) => void;}

const MediaInput = ({
  accept,
  maxSize,
  disabled = false,
  value: valueProp,
  defaultValue = null,
  onValueChange,
  onError,
  className,
  children,
  ...props
}: MediaInputProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [internalValue, setInternalValue] =
    React.useState<MediaInputValue | null>(defaultValue);
  const value = valueProp !== undefined ? valueProp : internalValue;
  const [error, setError] = React.useState<string | null>(null);
  const createdUrlRef = React.useRef<string | null>(null);

  React.useEffect(
    () => () => {
      if (createdUrlRef.current) URL.revokeObjectURL(createdUrlRef.current);
    },
    [],
  );

  const open = React.useCallback(() => {
    if (!disabled) inputRef.current?.click();
  }, [disabled]);

  const setValue = React.useCallback(
    (next: MediaInputValue | null) => {
      if (valueProp === undefined) setInternalValue(next);
      onValueChange?.(next);
    },
    [valueProp, onValueChange],
  );

  const clear = React.useCallback(() => {
    if (createdUrlRef.current) {
      URL.revokeObjectURL(createdUrlRef.current);
      createdUrlRef.current = null;
    }
    setError(null);
    setValue(null);
  }, [setValue]);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (maxSize != null && file.size > maxSize) {
      const message = `File is larger than ${formatSize(maxSize)}`;
      setError(message);
      onError?.(message);
      return;
    }
    if (createdUrlRef.current) URL.revokeObjectURL(createdUrlRef.current);
    const url = URL.createObjectURL(file);
    createdUrlRef.current = url;
    setError(null);
    setValue({ file, url });
  };

  const ctx = React.useMemo<MediaInputContextValue>(
    () => ({ value, error, disabled, open, clear }),
    [value, error, disabled, open, clear],
  );

  return (
    <MediaInputContext.Provider value={ctx}>
      <div
        data-slot="media-input"
        data-state={value ? "selected" : "empty"}
        className={cn("grid w-full gap-2", className)}
        {...props}
      >
        <input
          ref={inputRef}
          data-slot="media-input-input"
          type="file"
          accept={accept}
          disabled={disabled}
          className="sr-only"
          tabIndex={-1}
          onChange={(event) => {
            handleFile(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
        {children}
      </div>
    </MediaInputContext.Provider>
  );
};

const MediaInputEmpty = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { value, error } = useMediaInput();
  if (value) return null;

  return (
    <div
      data-slot="media-input-empty"
      className={cn(
        "grid justify-items-center gap-3 rounded-md border border-dashed border-border px-6 py-10 text-center",
        className,
      )}
      {...props}
    >
      {children}
      {error && (
        <p
          data-slot="media-input-error"
          role="alert"
          className="text-xs text-destructive"
        >
          {error}
        </p>
      )}
    </div>
  );
};

const MediaInputContent = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { value, error } = useMediaInput();
  if (!value) return null;

  return (
    <div
      data-slot="media-input-content"
      className={cn("grid gap-2", className)}
      {...props}
    >
      {children}
      {error && (
        <p
          data-slot="media-input-error"
          role="alert"
          className="text-xs text-destructive"
        >
          {error}
        </p>
      )}
    </div>
  );
};

const MediaInputTrigger = ({
  variant = "outline",
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) => {
  const { open, disabled } = useMediaInput();

  return (
    <Button
      data-slot="media-input-trigger"
      variant={variant}
      disabled={disabled || props.disabled}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) open();
      }}
      {...props}
    />
  );
};

const MediaInputFile = ({ className, ...props }: React.ComponentProps<"p">) => {
  const { value } = useMediaInput();
  if (!value) return null;

  return (
    <p
      data-slot="media-input-file"
      className={cn(
        "min-w-0 truncate font-mono text-xs text-muted-foreground",
        className,
      )}
      {...props}
    >
      {value.file.name}
      <span className="text-muted-foreground/70">
        {" · "}
        {formatSize(value.file.size)}
      </span>
    </p>
  );
};

const MediaInputClear = ({
  onClick,
  className,
  children,
  ...props
}: React.ComponentProps<typeof Button>) => {
  const { clear, disabled } = useMediaInput();

  return (
    <Button
      data-slot="media-input-clear"
      variant="ghost"
      size="icon"
      aria-label="Remove file"
      disabled={disabled || props.disabled}
      className={cn("size-7", className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) clear();
      }}
      {...props}
    >
      {children ?? <X aria-hidden className="size-3.5" />}
    </Button>
  );
};

export {
  MediaInput,
  MediaInputEmpty,
  MediaInputContent,
  MediaInputTrigger,
  MediaInputFile,
  MediaInputClear,
  useMediaInput,
};
