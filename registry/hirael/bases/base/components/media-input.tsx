'use client';

import * as React from 'react';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { formatBytes } from '@/registry/hirael/bases/base/components/format-bytes';
import { useControllableState } from '@/registry/hirael/bases/base/components/use-controllable-state';

export interface MediaInputValue {
  file: File;
  url: string;
}

interface MediaInputContextValue {
  value: MediaInputValue | null;
  error: string | null;
  disabled: boolean;
  open: () => void;
  clear: () => void;
}

const MediaInputContext = React.createContext<MediaInputContextValue | null>(null);

const useMediaInput = () => {
  const ctx = React.useContext(MediaInputContext);
  if (!ctx) throw new Error('useMediaInput must be used within <MediaInput>');

  return ctx;
};

const matchesAccept = (file: File, accept?: string): boolean => {
  const tokens = (accept ?? '')
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

export interface MediaInputProps extends Omit<React.ComponentProps<'div'>, 'onError' | 'defaultValue'> {
  /** Accept filter, e.g. "audio/*" or "image/png,.webp". Also checked on pick, since the native filter can be bypassed. */
  accept?: string;
  /** Maximum file size in bytes. Larger picks are rejected with an error. */
  maxSize?: number;
  /** Field name for the native input, so the picked file can join form submission. */
  name?: string;
  disabled?: boolean;
  value?: MediaInputValue | null;
  defaultValue?: MediaInputValue | null;
  onValueChange?: (value: MediaInputValue | null) => void;
  onError?: (message: string) => void;
  /** Override the rejection message per reason, e.g. for another language. */
  messages?: Partial<Record<'type' | 'size', string>>;
}

const MediaInput = ({
  accept,
  maxSize,
  name,
  disabled = false,
  value: valueProp,
  defaultValue = null,
  onValueChange,
  onError,
  messages,
  className,
  children,
  ...props
}: MediaInputProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [value, setValue] = useControllableState<MediaInputValue | null>({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });
  const [error, setError] = React.useState<string | null>(null);
  const createdUrlsRef = React.useRef(new Set<string>());

  // Revoke object URLs this input created once they are no longer the value, so a controlled parent that
  // rejects a change keeps its current preview.
  const currentUrl = value?.url;
  React.useEffect(() => {
    const created = createdUrlsRef.current;
    for (const url of created) {
      if (url === currentUrl) continue;
      URL.revokeObjectURL(url);
      created.delete(url);
    }
  }, [currentUrl]);

  React.useEffect(() => {
    const created = createdUrlsRef.current;

    return () => {
      for (const url of created) URL.revokeObjectURL(url);
      created.clear();
    };
  }, []);

  const open = React.useCallback(() => {
    if (!disabled) inputRef.current?.click();
  }, [disabled]);

  const clear = React.useCallback(() => {
    // Emptied here, not on change, so a named input still submits its file and re-picking the same file fires change.
    if (inputRef.current) inputRef.current.value = '';
    setError(null);
    setValue(null);
  }, [setValue]);

  const reject = (message: string) => {
    // Put the accepted file back in the native input, so a named input doesn't submit the rejected one.
    const input = inputRef.current;
    if (input) {
      if (value && typeof DataTransfer !== 'undefined') {
        const transfer = new DataTransfer();
        transfer.items.add(value.file);
        input.files = transfer.files;
      } else {
        input.value = '';
      }
    }
    setError(message);
    onError?.(message);
  };

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (!matchesAccept(file, accept)) {
      reject(messages?.type ?? 'That file type is not supported.');

      return;
    }
    if (maxSize != null && file.size > maxSize) {
      reject(messages?.size ?? `File is larger than ${formatBytes(maxSize)}.`);

      return;
    }
    const url = URL.createObjectURL(file);
    createdUrlsRef.current.add(url);
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
        data-state={value ? 'selected' : 'empty'}
        className={cn('grid w-full gap-2', className)}
        {...props}
      >
        <input
          ref={inputRef}
          data-slot="media-input-input"
          type="file"
          name={name}
          accept={accept}
          disabled={disabled}
          className="sr-only"
          tabIndex={-1}
          onChange={(event) => handleFile(event.target.files?.[0])}
        />
        {children}
      </div>
    </MediaInputContext.Provider>
  );
};

const MediaInputEmpty = ({ className, children, ...props }: React.ComponentProps<'div'>) => {
  const { value, error } = useMediaInput();
  if (value) return null;

  return (
    <div
      data-slot="media-input-empty"
      className={cn(
        'grid justify-items-center gap-3 rounded-md border border-dashed border-border px-6 py-10 text-center',
        className,
      )}
      {...props}
    >
      {children}
      {error && (
        <p data-slot="media-input-error" role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
};

const MediaInputContent = ({ className, children, ...props }: React.ComponentProps<'div'>) => {
  const { value, error } = useMediaInput();
  if (!value) return null;

  return (
    <div data-slot="media-input-content" className={cn('grid gap-2', className)} {...props}>
      {children}
      {error && (
        <p data-slot="media-input-error" role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
};

const MediaInputTrigger = ({
  variant = 'outline',
  onClick,
  disabled: disabledProp,
  ...props
}: React.ComponentProps<typeof Button>) => {
  const { open, disabled } = useMediaInput();

  return (
    <Button
      type="button"
      data-slot="media-input-trigger"
      variant={variant}
      {...props}
      disabled={disabled || disabledProp}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) open();
      }}
    />
  );
};

const MediaInputFile = ({ className, ...props }: React.ComponentProps<'p'>) => {
  const { value } = useMediaInput();
  if (!value) return null;

  return (
    <p
      data-slot="media-input-file"
      className={cn('min-w-0 truncate text-xs text-muted-foreground', className)}
      {...props}
    >
      {value.file.name}
      <span className="ms-2 text-muted-foreground/70">{formatBytes(value.file.size)}</span>
    </p>
  );
};

const MediaInputClear = ({
  onClick,
  className,
  children,
  disabled: disabledProp,
  ...props
}: React.ComponentProps<typeof Button>) => {
  const { clear, disabled } = useMediaInput();

  return (
    <Button
      type="button"
      data-slot="media-input-clear"
      variant="ghost"
      size="icon"
      aria-label="Remove file"
      {...props}
      disabled={disabled || disabledProp}
      className={cn('size-7', className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) clear();
      }}
    >
      {children ?? <X className="size-3.5" />}
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
