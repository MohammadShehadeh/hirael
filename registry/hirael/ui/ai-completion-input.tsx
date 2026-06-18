"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type AiCompletionCtx = {
  value: string;
  setValue: (next: string) => void;
  suggestion: string;
  remainder: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  fieldId: string;
  hintId: string;
  disabled: boolean;
  accept: () => void;
  dismiss: () => void;
};

const AiCompletionContext = React.createContext<AiCompletionCtx | null>(null);

function useAiCompletion() {
  const ctx = React.useContext(AiCompletionContext);
  if (!ctx) {
    throw new Error(
      "AiCompletionInput compound parts must be used inside <AiCompletionInput>",
    );
  }
  return ctx;
}

function getRemainder(value: string, suggestion: string) {
  if (!suggestion) return "";
  if (!value) return suggestion;
  if (!suggestion.startsWith(value)) return "";
  return suggestion.slice(value.length);
}

export type AiCompletionInputProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange"
> & {
  /** The current text. Controls the field when provided. */
  value?: string;
  defaultValue?: string;
  /** Called with the next text whenever the typed value changes. */
  onValueChange?: (value: string) => void;
  /** The predicted completion string, supplied by the consumer. The part not already typed is shown as ghost text. */
  suggestion?: string;
  /** Called with the full accepted text when the ghost suggestion is accepted. */
  onAccept?: (value: string) => void;
  disabled?: boolean;
};

function AiCompletionInput({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  suggestion = "",
  onAccept,
  disabled = false,
  className,
  children,
  ...props
}: AiCompletionInputProps) {
  const fieldId = React.useId();
  const hintId = `${fieldId}-hint`;

  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const value = valueProp ?? internalValue;

  const setValue = React.useCallback(
    (next: string) => {
      if (valueProp === undefined) setInternalValue(next);
      onValueChange?.(next);
    },
    [valueProp, onValueChange],
  );

  const remainder = getRemainder(value, suggestion);

  const accept = React.useCallback(() => {
    if (disabled || !remainder) return;
    const next = value + remainder;
    setValue(next);
    onAccept?.(next);
    const node = inputRef.current;
    if (node) {
      requestAnimationFrame(() => {
        node.focus();
        node.setSelectionRange(next.length, next.length);
      });
    }
  }, [disabled, remainder, value, setValue, onAccept]);

  const dismiss = React.useCallback(() => {
    const node = inputRef.current;
    if (node) node.focus();
  }, []);

  const ctx = React.useMemo<AiCompletionCtx>(
    () => ({
      value,
      setValue,
      suggestion,
      remainder,
      inputRef,
      fieldId,
      hintId,
      disabled,
      accept,
      dismiss,
    }),
    [
      value,
      setValue,
      suggestion,
      remainder,
      fieldId,
      hintId,
      disabled,
      accept,
      dismiss,
    ],
  );

  return (
    <AiCompletionContext.Provider value={ctx}>
      <div
        data-slot="ai-completion-input"
        data-disabled={disabled || undefined}
        className={cn("group/ai-completion grid w-full gap-1.5", className)}
        {...props}
      >
        {children}
      </div>
    </AiCompletionContext.Provider>
  );
}

const METRICS =
  "h-9 w-full rounded-md border px-3 py-1 text-sm leading-normal";

export type AiCompletionFieldProps = Omit<
  React.ComponentProps<"input">,
  "value" | "defaultValue" | "onChange" | "type"
> & {
  placeholder?: string;
};

function AiCompletionField({
  className,
  placeholder,
  onKeyDown,
  ...props
}: AiCompletionFieldProps) {
  const {
    value,
    setValue,
    remainder,
    inputRef,
    fieldId,
    hintId,
    disabled,
    accept,
    dismiss,
  } = useAiCompletion();

  const [dismissed, setDismissed] = React.useState(false);
  const visible = remainder.length > 0 && !dismissed;

  return (
    <div
      data-slot="ai-completion-field"
      data-disabled={disabled || undefined}
      className={cn(
        "relative w-full",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      <div
        aria-hidden
        data-slot="ai-completion-overlay"
        className={cn(
          METRICS,
          "pointer-events-none absolute inset-0 flex items-center overflow-hidden whitespace-pre border-transparent text-transparent",
        )}
      >
        <span className="whitespace-pre">{value}</span>
        {visible ? (
          <span
            data-slot="ai-completion-ghost"
            className="whitespace-pre text-muted-foreground"
          >
            {remainder}
          </span>
        ) : null}
      </div>
      <input
        ref={inputRef}
        id={fieldId}
        type="text"
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        aria-describedby={visible ? hintId : undefined}
        data-slot="ai-completion-control"
        onChange={(event) => {
          setDismissed(false);
          setValue(event.target.value);
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented) return;
          if (!visible) return;
          const node = event.currentTarget;
          const atEnd =
            node.selectionStart === node.value.length &&
            node.selectionEnd === node.value.length;
          if (event.key === "Tab" || (event.key === "ArrowRight" && atEnd)) {
            event.preventDefault();
            accept();
          } else if (event.key === "Escape") {
            event.preventDefault();
            setDismissed(true);
            dismiss();
          }
        }}
        className={cn(
          METRICS,
          "relative bg-transparent text-foreground border-input shadow-xs transition-[color,box-shadow] outline-none",
          "selection:bg-primary selection:text-primary-foreground",
          "placeholder:text-muted-foreground",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "disabled:pointer-events-none",
        )}
        {...props}
      />
    </div>
  );
}

export type AiCompletionGhostProps = React.ComponentProps<"span">;

function AiCompletionGhost({
  className,
  children,
  ...props
}: AiCompletionGhostProps) {
  const { remainder } = useAiCompletion();

  if (!remainder) return null;

  return (
    <span
      data-slot="ai-completion-ghost"
      className={cn("text-muted-foreground", className)}
      {...props}
    >
      {children ?? remainder}
    </span>
  );
}

export type AiCompletionHintProps = React.ComponentProps<"div"> & {
  /** Shown when no suggestion is pending. Hidden by default. */
  idleChildren?: React.ReactNode;
};

function AiCompletionHint({
  className,
  children,
  idleChildren = null,
  ...props
}: AiCompletionHintProps) {
  const { remainder, hintId } = useAiCompletion();

  if (!remainder) {
    if (!idleChildren) return null;
    return (
      <div
        data-slot="ai-completion-hint"
        data-state="idle"
        className={cn(
          "flex items-center gap-1.5 text-xs text-muted-foreground",
          className,
        )}
        {...props}
      >
        {idleChildren}
      </div>
    );
  }

  return (
    <div
      id={hintId}
      data-slot="ai-completion-hint"
      data-state="active"
      className={cn(
        "flex items-center gap-1.5 text-xs text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children ?? (
        <>
          <span
            data-slot="ai-completion-hint-key"
            className="inline-flex h-5 min-w-5 items-center justify-center rounded-sm border border-border bg-muted px-1 font-sans text-[11px] font-medium text-muted-foreground"
          >
            Tab
          </span>
          <span>to accept</span>
        </>
      )}
    </div>
  );
}

export {
  AiCompletionInput,
  AiCompletionField,
  AiCompletionGhost,
  AiCompletionHint,
};
