"use client";

import * as React from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/registry/hirael/ui/badge";

export type TagValidator = (
  candidate: string,
  current: string[],
) => true | string;

type Ctx = {
  value: string[];
  setValue: (next: string[]) => void;
  draft: string;
  setDraft: (next: string) => void;
  error: string | null;
  setError: (next: string | null) => void;
  errorId: string;
  add: (candidates: string | string[]) => boolean;
  remove: (index: number) => void;
  disabled?: boolean;
  readOnly?: boolean;
  maxTags?: number;
  caseSensitive: boolean;
  validate?: TagValidator;
  commitKeys: string[];
  splitOn: RegExp;
  inputRef: React.RefObject<HTMLInputElement | null>;
};

const TagInputContext = React.createContext<Ctx | null>(null);

function useTagInput() {
  const ctx = React.useContext(TagInputContext);
  if (!ctx) {
    throw new Error("TagInput compound parts must be used inside <TagInput>");
  }
  return ctx;
}

export type TagInputProps = {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  disabled?: boolean;
  readOnly?: boolean;
  maxTags?: number;
  unique?: boolean;
  caseSensitive?: boolean;
  validate?: TagValidator;
  commitKeys?: string[];
  splitOn?: RegExp;
  children?: React.ReactNode;
};

function TagInput({
  value: valueProp,
  defaultValue,
  onValueChange,
  disabled,
  readOnly,
  maxTags,
  unique = true,
  caseSensitive = false,
  validate,
  commitKeys = ["Enter", ","],
  splitOn = /[,\n\t]+/,
  children,
}: TagInputProps) {
  const [internalValue, setInternalValue] = React.useState<string[]>(
    defaultValue ?? [],
  );
  const value = valueProp ?? internalValue;
  const setValue = React.useCallback(
    (next: string[]) => {
      if (valueProp === undefined) setInternalValue(next);
      onValueChange?.(next);
    },
    [valueProp, onValueChange],
  );

  const [draft, setDraft] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const errorId = React.useId();
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const norm = React.useCallback(
    (s: string) => (caseSensitive ? s : s.toLowerCase()),
    [caseSensitive],
  );

  const add = React.useCallback(
    (candidates: string | string[]): boolean => {
      if (disabled || readOnly) return false;
      const list = Array.isArray(candidates) ? candidates : [candidates];
      const next = [...value];
      let anyAdded = false;
      let batchError: string | null = null;
      for (const raw of list) {
        const tag = raw.trim();
        if (!tag) continue;
        if (maxTags !== undefined && next.length >= maxTags) {
          batchError = `Limit ${maxTags} tag${maxTags === 1 ? "" : "s"}.`;
          break;
        }
        if (unique) {
          const haystack = next.map(norm);
          if (haystack.includes(norm(tag))) continue;
        }
        if (validate) {
          const result = validate(tag, next);
          if (result !== true) {
            batchError = result;
            continue;
          }
        }
        next.push(tag);
        anyAdded = true;
      }
      if (anyAdded) setValue(next);
      if (batchError) {
        setError(batchError);
      } else if (anyAdded) {
        setError(null);
      }
      return anyAdded;
    },
    [disabled, readOnly, value, maxTags, unique, norm, validate, setValue],
  );

  const remove = React.useCallback(
    (index: number) => {
      if (disabled || readOnly) return;
      const next = value.filter((_, i) => i !== index);
      setValue(next);
      setError(null);
    },
    [disabled, readOnly, value, setValue],
  );

  const ctx = React.useMemo<Ctx>(
    () => ({
      value,
      setValue,
      draft,
      setDraft,
      error,
      setError,
      errorId,
      add,
      remove,
      disabled,
      readOnly,
      maxTags,
      caseSensitive,
      validate,
      commitKeys,
      splitOn,
      inputRef,
    }),
    [
      value,
      setValue,
      draft,
      error,
      errorId,
      add,
      remove,
      disabled,
      readOnly,
      maxTags,
      caseSensitive,
      validate,
      commitKeys,
      splitOn,
    ],
  );

  return (
    <TagInputContext.Provider value={ctx}>{children}</TagInputContext.Provider>
  );
}

type TagInputContainerProps = React.ComponentProps<"div">;

function TagInputContainer({
  className,
  children,
  onMouseDown,
  ...props
}: TagInputContainerProps) {
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
        "flex min-h-9 w-full flex-wrap items-center gap-1 rounded-sm border border-input bg-transparent px-1.5 py-1 text-sm outline-none transition-colors",
        "focus-within:border-ring",
        ctx.error && "border-destructive focus-within:border-destructive",
        (ctx.disabled || ctx.readOnly) && "opacity-60 cursor-not-allowed",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type TagInputTagProps = Omit<React.ComponentProps<"span">, "children"> & {
  index: number;
  children?: React.ReactNode;
};

function TagInputTag({
  index,
  children,
  className,
  ...props
}: TagInputTagProps) {
  const ctx = useTagInput();
  const tag = ctx.value[index];
  if (tag === undefined) return null;
  return (
    <Badge
      variant="secondary"
      data-slot="tag-input-tag"
      className={cn("gap-1 pe-1 font-normal", className)}
      {...props}
    >
      <span className="min-w-0 truncate">{children ?? tag}</span>
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
}

function TagInputTags() {
  const ctx = useTagInput();
  return (
    <>
      {ctx.value.map((_, i) => (
        <TagInputTag key={`${ctx.value[i]}-${i}`} index={i} />
      ))}
    </>
  );
}

type TagInputFieldProps = Omit<
  React.ComponentProps<"input">,
  "value" | "defaultValue" | "onChange" | "type"
>;

function TagInputField({
  placeholder = "Add tag…",
  className,
  onKeyDown,
  onPaste,
  onBlur,
  ...props
}: TagInputFieldProps) {
  const ctx = useTagInput();

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    if (ctx.commitKeys.includes(e.key)) {
      if (ctx.draft.trim()) {
        e.preventDefault();
        if (ctx.add(ctx.draft)) ctx.setDraft("");
      } else if (e.key !== "Enter") {
        e.preventDefault();
      }
      return;
    }
    if (e.key === "Backspace" && !ctx.draft && ctx.value.length > 0) {
      e.preventDefault();
      ctx.remove(ctx.value.length - 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    onPaste?.(e);
    if (e.defaultPrevented) return;
    const text = e.clipboardData.getData("text");
    if (!text) return;
    if (ctx.splitOn.test(text)) {
      e.preventDefault();
      const parts = text
        .split(ctx.splitOn)
        .map((p) => p.trim())
        .filter(Boolean);
      ctx.add(parts);
    }
  };

  return (
    <input
      ref={ctx.inputRef}
      type="text"
      value={ctx.draft}
      onChange={(e) => {
        ctx.setDraft(e.target.value);
        if (ctx.error) ctx.setError(null);
      }}
      onKeyDown={handleKey}
      onPaste={handlePaste}
      onBlur={(e) => {
        onBlur?.(e);
        if (ctx.draft.trim()) {
          if (ctx.add(ctx.draft)) ctx.setDraft("");
        }
      }}
      placeholder={ctx.value.length === 0 ? placeholder : undefined}
      disabled={ctx.disabled}
      readOnly={ctx.readOnly}
      aria-invalid={ctx.error ? true : undefined}
      aria-describedby={ctx.error ? ctx.errorId : undefined}
      data-slot="tag-input-field"
      className={cn(
        "flex-1 min-w-[6rem] bg-transparent px-1.5 py-0.5 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    />
  );
}

function TagInputError({ className, ...props }: React.ComponentProps<"p">) {
  const ctx = useTagInput();
  if (!ctx.error) return null;
  return (
    <p
      role="alert"
      id={ctx.errorId}
      data-slot="tag-input-error"
      className={cn("text-[11px] text-destructive", className)}
      {...props}
    >
      {ctx.error}
    </p>
  );
}

export {
  TagInput,
  TagInputContainer,
  TagInputTag,
  TagInputTags,
  TagInputField,
  TagInputError,
};
