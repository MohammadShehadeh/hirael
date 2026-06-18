"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const VARIABLE_RE = /\{\{\s*[\w.-]+\s*\}\}/g;

type PromptEditorContextValue = {
  value: string;
  setValue: (next: string) => void;
  disabled?: boolean;
  fieldRef: React.RefObject<HTMLTextAreaElement | null>;
  insertVariable: (name: string) => void;
};

const PromptEditorContext =
  React.createContext<PromptEditorContextValue | null>(null);

function usePromptEditor(part: string): PromptEditorContextValue {
  const ctx = React.useContext(PromptEditorContext);
  if (!ctx) {
    throw new Error(`${part} must be used within <PromptEditor>.`);
  }
  return ctx;
}

type Segment = { text: string; variable: boolean };

function segmentValue(value: string): Segment[] {
  const segments: Segment[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  VARIABLE_RE.lastIndex = 0;
  while ((m = VARIABLE_RE.exec(value)) !== null) {
    if (m.index > last) {
      segments.push({ text: value.slice(last, m.index), variable: false });
    }
    segments.push({ text: m[0], variable: true });
    last = m.index + m[0].length;
  }
  if (last < value.length) {
    segments.push({ text: value.slice(last), variable: false });
  }
  return segments;
}

export type PromptEditorProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange"
> & {
  /** Controlled template text. Use with `onValueChange`. */
  value?: string;
  /** Initial template text when uncontrolled. */
  defaultValue?: string;
  /** Called with the next template text whenever it changes. */
  onValueChange?: (value: string) => void;
  /** Disable the field and variable chips. */
  disabled?: boolean;
};

function PromptEditor({
  value: valueProp,
  defaultValue,
  onValueChange,
  disabled,
  className,
  ...props
}: PromptEditorProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const value = valueProp ?? internalValue;
  const fieldRef = React.useRef<HTMLTextAreaElement | null>(null);

  const setValue = React.useCallback(
    (next: string) => {
      if (valueProp === undefined) setInternalValue(next);
      onValueChange?.(next);
    },
    [valueProp, onValueChange],
  );

  const insertVariable = React.useCallback(
    (name: string) => {
      const token = `{{${name}}}`;
      const ta = fieldRef.current;
      const start = ta ? ta.selectionStart : value.length;
      const end = ta ? ta.selectionEnd : value.length;
      const next = value.slice(0, start) + token + value.slice(end);
      setValue(next);
      const caret = start + token.length;
      requestAnimationFrame(() => {
        const el = fieldRef.current;
        if (!el) return;
        el.focus();
        el.setSelectionRange(caret, caret);
      });
    },
    [value, setValue],
  );

  const ctx = React.useMemo<PromptEditorContextValue>(
    () => ({ value, setValue, disabled, fieldRef, insertVariable }),
    [value, setValue, disabled, insertVariable],
  );

  return (
    <PromptEditorContext.Provider value={ctx}>
      <div
        data-slot="prompt-editor"
        data-disabled={disabled || undefined}
        className={cn(
          "flex w-full flex-col rounded-md border border-border bg-card text-card-foreground shadow-xs",
          "focus-within:border-ring focus-within:ring-1 focus-within:ring-ring",
          "data-disabled:opacity-60",
          className,
        )}
        {...props}
      />
    </PromptEditorContext.Provider>
  );
}

export type PromptEditorToolbarProps = React.ComponentProps<"div">;

function PromptEditorToolbar({
  className,
  ...props
}: PromptEditorToolbarProps) {
  return (
    <div
      data-slot="prompt-editor-toolbar"
      className={cn(
        "flex flex-wrap items-center gap-1 border-b border-border px-2 py-1.5",
        className,
      )}
      {...props}
    />
  );
}

export type PromptEditorFieldProps = Omit<
  React.ComponentProps<"textarea">,
  "value" | "defaultValue" | "onChange"
> & {
  /** Minimum number of visible text rows. */
  rows?: number;
};

function PromptEditorField({
  className,
  rows = 6,
  disabled: disabledProp,
  onScroll,
  ...props
}: PromptEditorFieldProps) {
  const { value, setValue, disabled, fieldRef } =
    usePromptEditor("PromptEditorField");
  const backdropRef = React.useRef<HTMLDivElement | null>(null);
  const segments = React.useMemo(() => segmentValue(value), [value]);

  const syncScroll = React.useCallback(() => {
    const ta = fieldRef.current;
    const backdrop = backdropRef.current;
    if (!ta || !backdrop) return;
    backdrop.scrollTop = ta.scrollTop;
    backdrop.scrollLeft = ta.scrollLeft;
  }, [fieldRef]);

  React.useLayoutEffect(() => {
    syncScroll();
  }, [value, syncScroll]);

  const metrics =
    "w-full px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap break-words font-mono";

  return (
    <div data-slot="prompt-editor-field" className="relative w-full">
      <div
        ref={backdropRef}
        aria-hidden
        data-slot="prompt-editor-highlight"
        className={cn(
          metrics,
          "pointer-events-none absolute inset-0 overflow-hidden text-transparent select-none",
        )}
      >
        {segments.map((seg, i) =>
          seg.variable ? (
            <span
              key={i}
              data-slot="prompt-editor-token"
              className="rounded-[3px] bg-primary/15 text-primary box-decoration-clone"
            >
              {seg.text}
            </span>
          ) : (
            <span key={i}>{seg.text}</span>
          ),
        )}
        {"​"}
      </div>
      <textarea
        ref={fieldRef}
        rows={rows}
        value={value}
        spellCheck={false}
        disabled={disabledProp ?? disabled}
        data-slot="prompt-editor-textarea"
        onChange={(e) => setValue(e.target.value)}
        onScroll={(e) => {
          syncScroll();
          onScroll?.(e);
        }}
        className={cn(
          metrics,
          "relative block resize-none bg-transparent text-foreground caret-foreground outline-none",
          "placeholder:text-muted-foreground",
          "disabled:cursor-not-allowed",
          className,
        )}
        {...props}
      />
    </div>
  );
}

export type PromptEditorVariablesProps = React.ComponentProps<"div"> & {
  /** Heading text shown before the chips. */
  label?: string;
};

function PromptEditorVariables({
  className,
  label,
  children,
  ...props
}: PromptEditorVariablesProps) {
  return (
    <div
      data-slot="prompt-editor-variables"
      className={cn(
        "flex flex-wrap items-center gap-1.5 border-t border-border px-3 py-2",
        className,
      )}
      {...props}
    >
      {label ? (
        <span className="me-1 text-xs text-muted-foreground">{label}</span>
      ) : null}
      {children}
    </div>
  );
}

export type PromptEditorVariableProps = Omit<
  React.ComponentProps<"button">,
  "value"
> & {
  /** Variable name inserted as `{{name}}` at the caret on click. */
  name: string;
};

function PromptEditorVariable({
  className,
  name,
  onClick,
  disabled: disabledProp,
  children,
  ...props
}: PromptEditorVariableProps) {
  const { disabled, insertVariable } = usePromptEditor("PromptEditorVariable");
  return (
    <button
      type="button"
      data-slot="prompt-editor-variable"
      disabled={disabledProp ?? disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) insertVariable(name);
      }}
      className={cn(
        "inline-flex items-center rounded-sm border border-border bg-accent px-2 py-0.5 font-mono text-xs text-accent-foreground transition-colors",
        "hover:border-primary/40 hover:bg-primary/10 hover:text-primary",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children ?? `{{${name}}}`}
    </button>
  );
}

export type PromptEditorFooterProps = React.ComponentProps<"div"> & {
  /** Render custom footer content instead of the default counts. */
  children?: React.ReactNode;
};

function PromptEditorFooter({
  className,
  children,
  ...props
}: PromptEditorFooterProps) {
  const { value } = usePromptEditor("PromptEditorFooter");
  const chars = value.length;
  const tokens = Math.ceil(chars / 4);
  return (
    <div
      data-slot="prompt-editor-footer"
      className={cn(
        "flex items-center justify-between gap-3 border-t border-border px-3 py-1.5 text-xs text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children ?? (
        <>
          <span data-slot="prompt-editor-chars">{chars} chars</span>
          <span data-slot="prompt-editor-tokens">~{tokens} tokens</span>
        </>
      )}
    </div>
  );
}

export {
  PromptEditor,
  PromptEditorToolbar,
  PromptEditorField,
  PromptEditorVariables,
  PromptEditorVariable,
  PromptEditorFooter,
};
