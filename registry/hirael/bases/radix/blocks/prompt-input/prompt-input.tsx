'use client';

import * as React from 'react';
import { ArrowUp, ChevronDown, FileText, Paperclip, Square, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/registry/hirael/bases/radix/ui/dropdown-menu';

export interface PromptAttachment {
  id: string;
  name: string;
  /** Bytes. */
  size: number;
  type?: string;
  /** Present when the attachment came from the file picker or a paste. */
  file?: File;
}

export interface PromptInputModel {
  id: string;
  label: string;
  hint?: string;
}

interface PromptInputContextValue {
  value: string;
  setValue: (next: string) => void;
  attachments: PromptAttachment[];
  addFiles: (files: Iterable<File>) => void;
  removeAttachment: (id: string) => void;
  disabled: boolean;
  isStreaming: boolean;
  canSubmit: boolean;
  submit: () => void;
  stop: () => void;
  textareaId: string;
}

const PromptInputContext = React.createContext<PromptInputContextValue | null>(null);

const usePromptInput = () => {
  const context = React.useContext(PromptInputContext);
  if (!context) {
    throw new Error('PromptInput parts must be rendered inside <PromptInput>.');
  }

  return context;
};

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

let attachmentSeq = 0;

const toAttachment = (file: File): PromptAttachment => {
  attachmentSeq += 1;

  return {
    id: `${file.name}-${file.size}-${attachmentSeq}`,
    name: file.name,
    size: file.size,
    type: file.type,
    file,
  };
};

interface PromptSubmitOptions {
  attachments: PromptAttachment[];
}

interface PromptInputProps extends Omit<React.ComponentProps<'form'>, 'onSubmit' | 'defaultValue' | 'value'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  defaultAttachments?: PromptAttachment[];
  onAttachmentsChange?: (attachments: PromptAttachment[]) => void;
  /**
   * Called with the trimmed text and the current attachments. In
   * uncontrolled mode the text clears afterwards; when `value` is
   * controlled, clear it yourself here. Attachments always clear.
   */
  onSubmit?: (value: string, options: PromptSubmitOptions) => void;
  disabled?: boolean;
  /** Turns the submit button into a Stop button that calls `onStop`. */
  isStreaming?: boolean;
  onStop?: () => void;
}

const PromptInput = ({
  value: valueProp,
  defaultValue = '',
  onValueChange,
  defaultAttachments,
  onAttachmentsChange,
  onSubmit,
  disabled = false,
  isStreaming = false,
  onStop,
  className,
  children,
  ...props
}: PromptInputProps) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : internalValue;
  const [attachments, setAttachments] = React.useState<PromptAttachment[]>(() => defaultAttachments ?? []);
  const textareaId = React.useId();

  const setValue = React.useCallback(
    (next: string) => {
      if (!isControlled) setInternalValue(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const addFiles = React.useCallback(
    (files: Iterable<File>) => {
      const added = Array.from(files).map(toAttachment);
      if (added.length === 0) return;
      const next = [...attachments, ...added];
      setAttachments(next);
      onAttachmentsChange?.(next);
    },
    [attachments, onAttachmentsChange],
  );

  const removeAttachment = React.useCallback(
    (id: string) => {
      const next = attachments.filter((a) => a.id !== id);
      setAttachments(next);
      onAttachmentsChange?.(next);
    },
    [attachments, onAttachmentsChange],
  );

  const canSubmit = !disabled && (value.trim().length > 0 || attachments.length > 0);

  const submit = React.useCallback(() => {
    if (isStreaming || !canSubmit) return;
    onSubmit?.(value.trim(), { attachments });
    if (!isControlled) setInternalValue('');
    if (attachments.length > 0) {
      setAttachments([]);
      onAttachmentsChange?.([]);
    }
  }, [isStreaming, canSubmit, onSubmit, value, attachments, isControlled, onAttachmentsChange]);

  const stop = React.useCallback(() => onStop?.(), [onStop]);

  const context = React.useMemo<PromptInputContextValue>(
    () => ({
      value,
      setValue,
      attachments,
      addFiles,
      removeAttachment,
      disabled,
      isStreaming,
      canSubmit,
      submit,
      stop,
      textareaId,
    }),
    [
      value,
      setValue,
      attachments,
      addFiles,
      removeAttachment,
      disabled,
      isStreaming,
      canSubmit,
      submit,
      stop,
      textareaId,
    ],
  );

  return (
    <PromptInputContext.Provider value={context}>
      <form
        data-slot="prompt-input"
        data-streaming={isStreaming || undefined}
        data-disabled={disabled || undefined}
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
        className={cn(
          'flex w-full flex-col gap-2 rounded-xl border border-input bg-card p-2 text-card-foreground shadow-xs transition-[border-color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 data-[disabled]:opacity-60 motion-reduce:transition-none',
          className,
        )}
        {...props}
      >
        {children}
      </form>
    </PromptInputContext.Provider>
  );
};

interface PromptInputTextareaProps extends Omit<
  React.ComponentProps<'textarea'>,
  'value' | 'defaultValue' | 'onChange'
> {
  /** Grows with the text up to this many rows, then scrolls. */
  maxRows?: number;
  minRows?: number;
}

const PromptInputTextarea = ({
  maxRows = 6,
  minRows = 1,
  placeholder = 'Ask anything',
  className,
  onKeyDown,
  onPaste,
  ...props
}: PromptInputTextareaProps) => {
  const { value, setValue, submit, addFiles, disabled, textareaId } = usePromptInput();
  const ref = React.useRef<HTMLTextAreaElement>(null);

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    const styles = getComputedStyle(el);
    const lineHeight = parseFloat(styles.lineHeight) || 24;
    const padding = (parseFloat(styles.paddingTop) || 0) + (parseFloat(styles.paddingBottom) || 0);
    const min = lineHeight * minRows + padding;
    const max = lineHeight * maxRows + padding;
    el.style.height = `${Math.min(Math.max(el.scrollHeight, min), max)}px`;
    el.style.overflowY = el.scrollHeight > max ? 'auto' : 'hidden';
  }, [value, maxRows, minRows]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    // An IME still composing (Japanese, Chinese, Korean) uses Enter to commit the candidate.
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    onPaste?.(event);
    if (event.defaultPrevented) return;
    const files = event.clipboardData?.files;
    if (files && files.length > 0) {
      event.preventDefault();
      addFiles(files);
    }
  };

  return (
    <textarea
      ref={ref}
      id={textareaId}
      data-slot="prompt-input-textarea"
      rows={minRows}
      value={value}
      disabled={disabled}
      placeholder={placeholder}
      onChange={(event) => setValue(event.target.value)}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      className={cn(
        'flex field-sizing-content min-h-0 w-full resize-none bg-transparent px-2 py-1.5 text-sm leading-6 outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
};

type PromptInputToolbarProps = React.ComponentProps<'div'>;

const PromptInputToolbar = ({ className, ...props }: PromptInputToolbarProps) => {
  return <div data-slot="prompt-input-toolbar" className={cn('flex items-center gap-1', className)} {...props} />;
};

type PromptInputActionsProps = React.ComponentProps<'div'>;

const PromptInputActions = ({ className, ...props }: PromptInputActionsProps) => {
  return (
    <div data-slot="prompt-input-actions" className={cn('me-auto flex items-center gap-1', className)} {...props} />
  );
};

interface PromptInputAttachProps extends Omit<React.ComponentProps<typeof Button>, 'onChange' | 'type'> {
  accept?: string;
  multiple?: boolean;
}

const PromptInputAttach = ({ accept, multiple = true, className, children, ...props }: PromptInputAttachProps) => {
  const { addFiles, disabled } = usePromptInput();
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        data-slot="prompt-input-attach-input"
        className="hidden"
        tabIndex={-1}
        accept={accept}
        multiple={multiple}
        onChange={(event) => {
          if (event.target.files) addFiles(event.target.files);
          // Reset so picking the same file twice still fires a change.
          event.target.value = '';
        }}
      />
      <Button
        type="button"
        data-slot="prompt-input-attach"
        variant="ghost"
        size="icon-sm"
        disabled={disabled}
        aria-label="Attach files"
        onClick={() => inputRef.current?.click()}
        className={className}
        {...props}
      >
        {children ?? <Paperclip aria-hidden />}
      </Button>
    </>
  );
};

type PromptInputAttachmentsProps = React.ComponentProps<'div'>;

const PromptInputAttachments = ({ className, children, ...props }: PromptInputAttachmentsProps) => {
  const { attachments, removeAttachment } = usePromptInput();
  if (children == null && attachments.length === 0) return null;

  return (
    <div data-slot="prompt-input-attachments" className={cn('flex flex-wrap gap-1.5 px-1 pt-1', className)} {...props}>
      {children ??
        attachments.map((attachment) => (
          <PromptInputAttachment
            key={attachment.id}
            name={attachment.name}
            size={attachment.size}
            onRemove={() => removeAttachment(attachment.id)}
          />
        ))}
    </div>
  );
};

interface PromptInputAttachmentProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  name: string;
  /** Bytes. */
  size?: number;
  icon?: React.ReactNode;
  onRemove?: () => void;
}

const PromptInputAttachment = ({ name, size, icon, onRemove, className, ...props }: PromptInputAttachmentProps) => {
  return (
    <div
      data-slot="prompt-input-attachment"
      className={cn(
        'inline-flex max-w-full items-center gap-1.5 rounded-md border border-border bg-muted/40 py-1 ps-2 pe-1 text-xs text-foreground',
        className,
      )}
      {...props}
    >
      <span className="shrink-0 text-muted-foreground [&_svg]:size-3.5">{icon ?? <FileText aria-hidden />}</span>
      <span className="max-w-40 truncate">{name}</span>
      {size != null ? (
        <span className="shrink-0 text-[10px] text-muted-foreground tabular-nums">{formatBytes(size)}</span>
      ) : null}
      {onRemove ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={onRemove}
          aria-label={`Remove ${name}`}
          className="ms-0.5 size-5"
        >
          <X className="size-3" aria-hidden />
        </Button>
      ) : null}
    </div>
  );
};

interface PromptInputModelSelectProps {
  models: PromptInputModel[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  align?: 'start' | 'end';
  className?: string;
}

const PromptInputModelSelect = ({
  models,
  value: valueProp,
  defaultValue,
  onValueChange,
  align = 'end',
  className,
}: PromptInputModelSelectProps) => {
  const { disabled } = usePromptInput();
  const [internalValue, setInternalValue] = React.useState(() => defaultValue ?? models[0]?.id ?? '');
  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : internalValue;
  const selected = models.find((m) => m.id === value) ?? models[0];

  const handleChange = (id: string) => {
    if (!isControlled) setInternalValue(id);
    onValueChange?.(id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          data-slot="prompt-input-model-select"
          variant="ghost"
          size="sm"
          disabled={disabled}
          aria-label={`Model: ${selected?.label ?? 'none'}`}
          className={className}
        >
          <span className="truncate">{selected?.label}</span>
          <ChevronDown className="size-3 opacity-70" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-64" data-slot="prompt-input-model-select-content">
        <DropdownMenuRadioGroup value={value} onValueChange={handleChange}>
          {models.map((model) => (
            <DropdownMenuRadioItem key={model.id} value={model.id} className="flex-col items-start">
              <span className="text-sm text-foreground">{model.label}</span>
              {model.hint ? <span className="text-xs text-muted-foreground">{model.hint}</span> : null}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

type PromptInputSubmitProps = Omit<React.ComponentProps<typeof Button>, 'type' | 'children'>;

const PromptInputSubmit = ({ className, ...props }: PromptInputSubmitProps) => {
  const { canSubmit, isStreaming, stop } = usePromptInput();

  if (isStreaming) {
    return (
      <Button
        type="button"
        data-slot="prompt-input-submit"
        data-state="streaming"
        size="icon-sm"
        aria-label="Stop generating"
        onClick={stop}
        className={className}
        {...props}
      >
        <Square className="size-3 fill-current" aria-hidden />
      </Button>
    );
  }

  return (
    <Button
      type="submit"
      data-slot="prompt-input-submit"
      data-state="idle"
      size="icon-sm"
      aria-label="Send message"
      disabled={!canSubmit}
      className={className}
      {...props}
    >
      <ArrowUp aria-hidden />
    </Button>
  );
};

type PromptInputHintProps = React.ComponentProps<'p'>;

const PromptInputHint = ({
  className,
  children = (
    <>
      <span>Enter to send</span>
      <span>Shift+Enter for a new line</span>
    </>
  ),
  ...props
}: PromptInputHintProps) => {
  return (
    <p
      data-slot="prompt-input-hint"
      className={cn('flex flex-wrap gap-x-3 px-1 text-xs text-muted-foreground', className)}
      {...props}
    >
      {children}
    </p>
  );
};

export {
  PromptInput,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputActions,
  PromptInputAttach,
  PromptInputAttachments,
  PromptInputAttachment,
  PromptInputModelSelect,
  PromptInputSubmit,
  PromptInputHint,
  usePromptInput,
};

const MODELS: PromptInputModel[] = [
  {
    id: 'hirael-2-pro',
    label: 'Hirael 2 Pro',
    hint: 'Slower and more careful, for hard problems',
  },
  {
    id: 'hirael-2-flash',
    label: 'Hirael 2 Flash',
    hint: 'Fast and good enough for most work',
  },
  {
    id: 'hirael-mini',
    label: 'Hirael Mini',
    hint: 'Cheapest, for short tasks',
  },
];

const MAX_CHARS = 2000;

const ENTER =
  'animate-in fade-in slide-in-from-bottom-2 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
const SWAP =
  'animate-in fade-in slide-in-from-bottom-1 duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const SEED_ATTACHMENTS: PromptAttachment[] = [
  {
    id: 'seed-report',
    name: 'q3-latency-report.pdf',
    size: 248_320,
    type: 'application/pdf',
  },
];

interface CharacterCounterProps {
  max: number;
}

const CharacterCounter = ({ max }: CharacterCounterProps) => {
  const { value } = usePromptInput();
  const over = value.length > max;

  return (
    <span
      data-slot="prompt-input-counter"
      aria-live="polite"
      className={cn('shrink-0 px-1 text-xs tabular-nums', over ? 'text-destructive' : 'text-muted-foreground')}
    >
      {value.length.toLocaleString('en-US')} / {max.toLocaleString('en-US')}
    </span>
  );
};

interface Sent {
  text: string;
  attachments: number;
  model: string;
}

const PromptInputBlock = () => {
  const [model, setModel] = React.useState(MODELS[0].id);
  const [isStreaming, setIsStreaming] = React.useState(false);
  const [lastSent, setLastSent] = React.useState<Sent | null>(null);
  const timer = React.useRef<number | undefined>(undefined);

  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  const stop = () => {
    window.clearTimeout(timer.current);
    setIsStreaming(false);
  };

  const handleSubmit = (text: string, { attachments }: PromptSubmitOptions) => {
    setLastSent({ text, attachments: attachments.length, model });
    setIsStreaming(true);
    timer.current = window.setTimeout(() => setIsStreaming(false), 2500);
  };

  const modelLabel = MODELS.find((m) => m.id === lastSent?.model)?.label;

  return (
    <section data-slot="prompt-input-block" className="flex w-full justify-center bg-background p-6 sm:p-10">
      <div className={cn(ENTER, 'flex w-full max-w-2xl flex-col gap-3')}>
        <span className="text-xs text-muted-foreground uppercase">New message</span>

        <PromptInput
          onSubmit={handleSubmit}
          isStreaming={isStreaming}
          onStop={stop}
          defaultAttachments={SEED_ATTACHMENTS}
          aria-label="Message composer"
        >
          <PromptInputAttachments />
          <PromptInputTextarea placeholder="Ask about the report, or paste a stack trace" />
          <PromptInputToolbar>
            <PromptInputActions>
              <PromptInputAttach accept="image/*,.pdf,.txt,.md,.csv" />
            </PromptInputActions>
            <PromptInputModelSelect models={MODELS} value={model} onValueChange={setModel} />
            <PromptInputSubmit />
          </PromptInputToolbar>
          <div className="flex items-center justify-between gap-3">
            <PromptInputHint />
            <CharacterCounter max={MAX_CHARS} />
          </div>
        </PromptInput>

        <p aria-live="polite" className="flex min-h-5 items-center px-1 text-xs text-muted-foreground">
          <span
            key={isStreaming ? 'streaming' : lastSent ? 'sent' : 'idle'}
            className={cn(SWAP, 'flex min-w-0 items-center gap-2')}
          >
            {isStreaming ? (
              <>
                <span
                  aria-hidden
                  className="size-1.5 animate-pulse rounded-full bg-primary motion-reduce:animate-none"
                />
                Generating a reply, press Stop to cancel
              </>
            ) : lastSent ? (
              <>
                <span className="tracking-[0.1em] uppercase">Sent</span>
                <span className="truncate text-foreground">{lastSent.text || '(no text)'}</span>
                <span className="shrink-0">
                  {lastSent.attachments} {lastSent.attachments === 1 ? 'attachment' : 'attachments'}
                </span>
                <span className="shrink-0">{modelLabel}</span>
              </>
            ) : (
              'Nothing sent yet'
            )}
          </span>
        </p>
      </div>
    </section>
  );
};

export default PromptInputBlock;
