'use client';

import * as React from 'react';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { composeRefs } from '@/registry/hirael/bases/radix/components/compose-refs';
import { Badge } from '@/registry/hirael/bases/radix/ui/badge';

export type TagValidator = (candidate: string, current: string[]) => true | string;

interface Ctx {
  value: string[];
  draft: string;
  setDraft: (next: string) => void;
  error: string | null;
  setError: (next: string | null) => void;
  errorId: string;
  add: (candidates: string[]) => boolean;
  remove: (index: number) => void;
  disabled?: boolean;
  readOnly?: boolean;
  commitKeys: string[];
  splitOn: RegExp;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

const DEFAULT_COMMIT_KEYS = ['Enter', ','];
const DEFAULT_SPLIT_ON = /[,\n\t]+/;

const TagInputContext = React.createContext<Ctx | null>(null);

const useTagInput = () => {
  const ctx = React.useContext(TagInputContext);
  if (!ctx) {
    throw new Error('TagInput compound parts must be used inside <TagInput>');
  }

  return ctx;
};

export interface TagInputProps extends Omit<React.ComponentProps<'div'>, 'defaultValue'> {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  disabled?: boolean;
  readOnly?: boolean;
  maxTags?: number;
  validate?: TagValidator;
  commitKeys?: string[];
  splitOn?: RegExp;
  children?: React.ReactNode;
}

const TagInput = ({
  value: valueProp,
  defaultValue,
  onValueChange,
  disabled,
  readOnly,
  maxTags,
  validate,
  commitKeys = DEFAULT_COMMIT_KEYS,
  splitOn = DEFAULT_SPLIT_ON,
  className,
  children,
  ...props
}: TagInputProps) => {
  const [internalValue, setInternalValue] = React.useState<string[]>(defaultValue ?? []);
  const value = valueProp ?? internalValue;
  const setValue = React.useCallback(
    (next: string[]) => {
      if (valueProp === undefined) setInternalValue(next);
      onValueChange?.(next);
    },
    [valueProp, onValueChange],
  );

  const [draft, setDraft] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const errorId = React.useId();
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const add = React.useCallback(
    (candidates: string[]): boolean => {
      if (disabled || readOnly) return false;
      const next = [...value];
      let added = false;
      let duplicate = false;
      let failure: string | null = null;
      for (const tag of candidates.map((c) => c.trim()).filter(Boolean)) {
        if (maxTags !== undefined && next.length >= maxTags) {
          failure = `Limit ${maxTags} tag${maxTags === 1 ? '' : 's'}.`;
          break;
        }
        if (next.some((t) => t.toLowerCase() === tag.toLowerCase())) {
          duplicate = true;
          continue;
        }
        const result = validate?.(tag, next) ?? true;
        if (result !== true) {
          failure = result;
          continue;
        }
        next.push(tag);
        added = true;
      }
      if (added) setValue(next);
      if (added || failure) setError(failure);

      // A duplicate is already there, so it counts as handled and the draft clears.
      return added || (duplicate && !failure);
    },
    [disabled, readOnly, value, maxTags, validate, setValue],
  );

  const remove = React.useCallback(
    (index: number) => {
      if (disabled || readOnly) return;
      setValue(value.filter((_, i) => i !== index));
      setError(null);
    },
    [disabled, readOnly, value, setValue],
  );

  const ctx = React.useMemo<Ctx>(
    () => ({
      value,
      draft,
      setDraft,
      error,
      setError,
      errorId,
      add,
      remove,
      disabled,
      readOnly,
      commitKeys,
      splitOn,
      inputRef,
    }),
    [value, draft, error, errorId, add, remove, disabled, readOnly, commitKeys, splitOn],
  );

  return (
    <TagInputContext.Provider value={ctx}>
      <div data-slot="tag-input" className={cn('flex flex-col gap-2', className)} {...props}>
        {children}
      </div>
    </TagInputContext.Provider>
  );
};

type TagInputContainerProps = React.ComponentProps<'div'>;

const TagInputContainer = ({ className, children, onMouseDown, ...props }: TagInputContainerProps) => {
  const ctx = useTagInput();

  return (
    <div
      data-slot="tag-input-container"
      data-disabled={ctx.disabled || undefined}
      data-readonly={ctx.readOnly || undefined}
      onMouseDown={(e) => {
        onMouseDown?.(e);
        if (e.defaultPrevented) return;
        if (e.target === e.currentTarget) {
          e.preventDefault();
          ctx.inputRef.current?.focus();
        }
      }}
      className={cn(
        'flex min-h-9 w-full flex-wrap items-center gap-1 rounded-sm border border-input bg-transparent px-1.5 py-1 text-sm transition-colors outline-none',
        'focus-within:border-ring',
        ctx.error && 'border-destructive focus-within:border-destructive',
        (ctx.disabled || ctx.readOnly) && 'cursor-not-allowed opacity-60',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface TagInputTagProps extends Omit<React.ComponentProps<'span'>, 'children'> {
  index: number;
}

const TagInputTag = ({ index, className, ...props }: TagInputTagProps) => {
  const ctx = useTagInput();
  const tag = ctx.value[index];
  if (tag === undefined) return null;

  return (
    <Badge variant="secondary" data-slot="tag-input-tag" className={cn('gap-1 pe-1 font-normal', className)} {...props}>
      <span className="min-w-0 truncate">{tag}</span>
      {!(ctx.disabled || ctx.readOnly) && (
        <button
          type="button"
          tabIndex={-1}
          aria-label={`Remove ${tag}`}
          onClick={() => ctx.remove(index)}
          className="inline-flex size-3.5 items-center justify-center rounded-[2px] text-secondary-foreground/70 transition-colors hover:bg-secondary-foreground/20 hover:text-secondary-foreground"
        >
          <X className="size-2.5" />
        </button>
      )}
    </Badge>
  );
};

const TagInputTags = () => {
  const ctx = useTagInput();

  return (
    <>
      {ctx.value.map((tag, i) => (
        <TagInputTag key={`${tag}-${i}`} index={i} />
      ))}
    </>
  );
};

type TagInputFieldProps = Omit<React.ComponentProps<'input'>, 'value' | 'defaultValue' | 'onChange' | 'type'>;

const TagInputField = ({
  placeholder = 'Add tag…',
  className,
  onKeyDown,
  onPaste,
  onBlur,
  ref,
  ...props
}: TagInputFieldProps) => {
  const ctx = useTagInput();
  const { inputRef } = ctx;
  const composedRef = React.useMemo(() => composeRefs(inputRef, ref), [inputRef, ref]);

  const commitDraft = () => {
    if (ctx.draft.trim() && ctx.add([ctx.draft])) ctx.setDraft('');
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    // Enter or comma confirming an IME composition must not commit the half-composed draft.
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    if (ctx.commitKeys.includes(e.key)) {
      // Enter on an empty draft still submits the surrounding form.
      if (ctx.draft.trim() || e.key !== 'Enter') e.preventDefault();
      commitDraft();
    } else if (e.key === 'Backspace' && !ctx.draft && ctx.value.length > 0) {
      e.preventDefault();
      ctx.remove(ctx.value.length - 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    onPaste?.(e);
    const text = e.clipboardData.getData('text');
    if (e.defaultPrevented || !ctx.splitOn.test(text)) return;
    e.preventDefault();
    ctx.add(text.split(ctx.splitOn));
  };

  return (
    <input
      ref={composedRef}
      value={ctx.draft}
      onChange={(e) => {
        ctx.setDraft(e.target.value);
        if (ctx.error) ctx.setError(null);
      }}
      onKeyDown={handleKey}
      onPaste={handlePaste}
      onBlur={(e) => {
        onBlur?.(e);
        commitDraft();
      }}
      placeholder={ctx.value.length === 0 ? placeholder : undefined}
      disabled={ctx.disabled}
      readOnly={ctx.readOnly}
      aria-invalid={ctx.error ? true : undefined}
      aria-describedby={ctx.error ? ctx.errorId : undefined}
      data-slot="tag-input-field"
      className={cn(
        'min-w-[6rem] flex-1 bg-transparent px-1.5 py-0.5 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    />
  );
};

const TagInputError = ({ className, ...props }: React.ComponentProps<'p'>) => {
  const ctx = useTagInput();
  if (!ctx.error) return null;

  return (
    <p
      role="alert"
      id={ctx.errorId}
      data-slot="tag-input-error"
      className={cn('text-[11px] text-destructive', className)}
      {...props}
    >
      {ctx.error}
    </p>
  );
};

export { TagInput, TagInputContainer, TagInputTag, TagInputTags, TagInputField, TagInputError };
