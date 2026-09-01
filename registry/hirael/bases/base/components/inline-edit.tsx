'use client';

import * as React from 'react';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { Check, Pencil, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Input } from '@/registry/hirael/bases/base/ui/input';
import { Spinner } from '@/registry/hirael/bases/base/components/spinner';
import { Textarea } from '@/registry/hirael/bases/base/ui/textarea';
import { composeRefs } from '@/registry/hirael/bases/base/components/compose-refs';

interface InlineEditCtx {
  value: string;
  draft: string;
  setDraft: (draft: string) => void;
  editing: boolean;
  pending: boolean;
  error: string | null;
  errorId: string;
  disabled: boolean;
  placeholder?: string;
  selectOnFocus: boolean;
  submitOnBlur: boolean;
  startEditing: () => void;
  submit: () => void;
  cancel: () => void;
  previewRef: React.RefObject<HTMLSpanElement | null>;
}

const InlineEditContext = React.createContext<InlineEditCtx | null>(null);

const useInlineEdit = () => {
  const ctx = React.useContext(InlineEditContext);
  if (!ctx) {
    throw new Error('InlineEdit compound parts must be used inside <InlineEdit>');
  }
  return ctx;
};

export interface InlineEditProps extends Omit<React.ComponentProps<'div'>, 'defaultValue' | 'onSubmit' | 'onCancel'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Called with the draft when a submit passes validation. Return a promise to show a pending state. */
  onSubmit?: (value: string) => void | Promise<void>;
  onCancel?: () => void;
  editing?: boolean;
  defaultEditing?: boolean;
  onEditingChange?: (editing: boolean) => void;
  submitOnBlur?: boolean;
  selectOnFocus?: boolean;
  /** Return an error message to block the submit, or null to allow it. */
  validate?: (value: string) => string | null;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

const InlineEdit = ({
  value: valueProp,
  defaultValue = '',
  onValueChange,
  onSubmit,
  onCancel,
  editing: editingProp,
  defaultEditing = false,
  onEditingChange,
  submitOnBlur = true,
  selectOnFocus = true,
  validate,
  required = false,
  disabled = false,
  placeholder,
  className,
  children,
  ...props
}: InlineEditProps) => {
  const errorId = React.useId();

  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const value = valueProp ?? internalValue;

  const [internalEditing, setInternalEditing] = React.useState(defaultEditing);
  const editing = editingProp ?? internalEditing;

  const [draft, setDraft] = React.useState(value);
  const [error, setError] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);

  const setValue = React.useCallback(
    (next: string) => {
      if (valueProp === undefined) setInternalValue(next);
      onValueChange?.(next);
    },
    [valueProp, onValueChange],
  );

  const setEditing = React.useCallback(
    (next: boolean) => {
      if (editingProp === undefined) setInternalEditing(next);
      onEditingChange?.(next);
    },
    [editingProp, onEditingChange],
  );

  // Reset the draft whenever edit mode is entered, controlled or not.
  const [prevEditing, setPrevEditing] = React.useState(editing);
  if (editing !== prevEditing) {
    setPrevEditing(editing);
    if (editing) {
      setDraft(value);
      setError(null);
    }
  }

  const startEditing = React.useCallback(() => {
    if (disabled) return;
    setEditing(true);
  }, [disabled, setEditing]);

  const submit = React.useCallback(() => {
    if (pending) return;
    const next = draft;
    const message = required && next.trim() === '' ? 'This field is required' : (validate?.(next) ?? null);
    if (message) {
      setError(message);
      return;
    }
    setError(null);
    const result = onSubmit?.(next);
    if (result instanceof Promise) {
      setPending(true);
      result
        .then(() => {
          setValue(next);
          setEditing(false);
        })
        .catch((reason: unknown) => {
          setError(reason instanceof Error && reason.message ? reason.message : 'Could not save');
        })
        .finally(() => setPending(false));
    } else {
      setValue(next);
      setEditing(false);
    }
  }, [pending, draft, required, validate, onSubmit, setValue, setEditing]);

  const cancel = React.useCallback(() => {
    if (pending) return;
    setDraft(value);
    setError(null);
    setEditing(false);
    onCancel?.();
  }, [pending, value, setEditing, onCancel]);

  const previewRef = React.useRef<HTMLSpanElement | null>(null);
  const wasEditingRef = React.useRef(editing);

  // The editor unmounts when editing ends, dropping focus to <body>; return it
  // to the preview unless the user already moved focus elsewhere (blur-submit).
  React.useEffect(() => {
    const wasEditing = wasEditingRef.current;
    wasEditingRef.current = editing;
    if (!wasEditing || editing) return;
    const active = document.activeElement;
    if (active === null || active === document.body) {
      previewRef.current?.focus({ preventScroll: true });
    }
  }, [editing]);

  const ctx = React.useMemo<InlineEditCtx>(
    () => ({
      value,
      draft,
      setDraft,
      editing,
      pending,
      error,
      errorId,
      disabled,
      placeholder,
      selectOnFocus,
      submitOnBlur,
      startEditing,
      submit,
      cancel,
      previewRef,
    }),
    [
      value,
      draft,
      editing,
      pending,
      error,
      errorId,
      disabled,
      placeholder,
      selectOnFocus,
      submitOnBlur,
      startEditing,
      submit,
      cancel,
    ],
  );

  return (
    <InlineEditContext.Provider value={ctx}>
      <div
        data-slot="inline-edit"
        data-state={editing ? 'editing' : 'idle'}
        data-disabled={disabled || undefined}
        className={cn('group/inline-edit w-full', className)}
        {...props}
      >
        {children}
        {editing && error && (
          <p data-slot="inline-edit-error" id={errorId} role="alert" className="mt-1.5 text-xs text-destructive">
            {error}
          </p>
        )}
      </div>
    </InlineEditContext.Provider>
  );
};

/** Content is always the current value; swap the element with `render` (e.g. `render={<h2 />}`). */
export type InlineEditPreviewProps = Omit<useRender.ComponentProps<'span'>, 'children'>;

const InlineEditPreview = ({ render, className, ref, ...props }: InlineEditPreviewProps) => {
  const { value, editing, disabled, placeholder, startEditing, previewRef } = useInlineEdit();

  const content = (
    <>
      {value === '' ? <span className="text-muted-foreground">{placeholder}</span> : value}
      <Pencil
        aria-hidden
        className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover/preview:opacity-100 group-focus-visible/preview:opacity-100"
      />
    </>
  );

  // Hooks run unconditionally; the editing branch bails after them.
  const element = useRender({
    defaultTagName: 'span',
    render,
    ref: [previewRef, ref ?? null],
    props: mergeProps<'span'>(
      {
        role: 'button',
        tabIndex: disabled ? -1 : 0,
        'aria-disabled': disabled || undefined,
        onClick: () => startEditing(),
        onKeyDown: (event: React.KeyboardEvent) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            startEditing();
          }
        },
        className: cn(
          'group/preview inline-flex max-w-full cursor-pointer items-center gap-1.5 rounded-sm px-1.5 py-0.5 outline-none transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          disabled && 'pointer-events-none opacity-50',
          className,
        ),
        children: content,
      },
      props,
    ),
    state: { slot: 'inline-edit-preview' },
  });

  if (editing) return null;
  return element;
};

const InlineEditInput = ({
  className,
  onKeyDown,
  onBlur,
  onChange,
  ref,
  ...props
}: React.ComponentProps<typeof Input>) => {
  const {
    draft,
    setDraft,
    editing,
    pending,
    error,
    errorId,
    disabled,
    placeholder,
    selectOnFocus,
    submitOnBlur,
    submit,
    cancel,
  } = useInlineEdit();

  // Focus/select once per mounted node. A consumer's inline callback ref gives
  // the composed ref a new identity every render, so React re-invokes it, and
  // re-selecting mid-typing would swallow the next keystroke.
  const focusedRef = React.useRef<HTMLInputElement | null>(null);
  const focusOnMount = React.useCallback(
    (node: HTMLInputElement | null) => {
      if (!node || node === focusedRef.current) return;
      focusedRef.current = node;
      node.focus();
      if (selectOnFocus) node.select();
    },
    [selectOnFocus],
  );

  const composedRef = React.useMemo(() => composeRefs(focusOnMount, ref), [focusOnMount, ref]);

  if (!editing) return null;

  return (
    <Input
      data-slot="inline-edit-input"
      value={draft}
      placeholder={placeholder}
      disabled={disabled || pending}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? errorId : undefined}
      onChange={(event) => {
        onChange?.(event);
        if (event.defaultPrevented) return;
        setDraft(event.target.value);
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.key === 'Enter') {
          event.preventDefault();
          submit();
        }
        if (event.key === 'Escape') {
          event.preventDefault();
          cancel();
        }
      }}
      onBlur={(event) => {
        onBlur?.(event);
        if (submitOnBlur && !pending) submit();
      }}
      className={cn('h-8', className)}
      {...props}
      ref={composedRef}
    />
  );
};

const InlineEditTextarea = ({
  className,
  onKeyDown,
  onBlur,
  onChange,
  ref,
  ...props
}: React.ComponentProps<typeof Textarea>) => {
  const {
    draft,
    setDraft,
    editing,
    pending,
    error,
    errorId,
    disabled,
    placeholder,
    selectOnFocus,
    submitOnBlur,
    submit,
    cancel,
  } = useInlineEdit();

  // Focus/select once per mounted node; see InlineEditInput.
  const focusedRef = React.useRef<HTMLTextAreaElement | null>(null);
  const focusOnMount = React.useCallback(
    (node: HTMLTextAreaElement | null) => {
      if (!node || node === focusedRef.current) return;
      focusedRef.current = node;
      node.focus();
      if (selectOnFocus) node.select();
    },
    [selectOnFocus],
  );

  const composedRef = React.useMemo(() => composeRefs(focusOnMount, ref), [focusOnMount, ref]);

  if (!editing) return null;

  return (
    <Textarea
      data-slot="inline-edit-textarea"
      value={draft}
      placeholder={placeholder}
      disabled={disabled || pending}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? errorId : undefined}
      onChange={(event) => {
        onChange?.(event);
        if (event.defaultPrevented) return;
        setDraft(event.target.value);
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
          event.preventDefault();
          submit();
        }
        if (event.key === 'Escape') {
          event.preventDefault();
          cancel();
        }
      }}
      onBlur={(event) => {
        onBlur?.(event);
        if (submitOnBlur && !pending) submit();
      }}
      className={className}
      {...props}
      ref={composedRef}
    />
  );
};

export interface InlineEditControlsProps extends React.ComponentProps<'div'> {
  submitLabel?: string;
  cancelLabel?: string;
}

const InlineEditControls = ({
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  className,
  children,
  ...props
}: InlineEditControlsProps) => {
  const { editing, pending, submit, cancel } = useInlineEdit();

  if (!editing) return null;

  return (
    <div
      data-slot="inline-edit-controls"
      // Prevent the editor from blurring so blur-submit cannot double-fire.
      onMouseDown={(event) => event.preventDefault()}
      className={cn('flex items-center gap-1', className)}
      {...props}
    >
      {children ?? (
        <>
          <Button
            type="button"
            variant="default"
            size="icon"
            aria-label={submitLabel}
            disabled={pending}
            onClick={() => submit()}
            className="size-8"
          >
            {pending ? <Spinner size="sm" /> : <Check aria-hidden />}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={cancelLabel}
            disabled={pending}
            onClick={() => cancel()}
            className="size-8"
          >
            <X aria-hidden />
          </Button>
        </>
      )}
    </div>
  );
};

export { InlineEdit, InlineEditPreview, InlineEditInput, InlineEditTextarea, InlineEditControls };
