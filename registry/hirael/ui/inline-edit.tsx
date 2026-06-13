"use client"

import * as React from "react"
import { Check, Pencil, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/hirael/ui/button"
import { Input } from "@/registry/hirael/ui/input"
import { Spinner } from "@/registry/hirael/ui/spinner"
import { Textarea } from "@/registry/hirael/ui/textarea"

type InlineEditCtx = {
  value: string
  draft: string
  setDraft: (draft: string) => void
  editing: boolean
  pending: boolean
  error: string | null
  errorId: string
  disabled: boolean
  placeholder?: string
  selectOnFocus: boolean
  submitOnBlur: boolean
  startEditing: () => void
  submit: () => void
  cancel: () => void
}

const InlineEditContext = React.createContext<InlineEditCtx | null>(null)

function useInlineEdit() {
  const ctx = React.useContext(InlineEditContext)
  if (!ctx) {
    throw new Error("InlineEdit compound parts must be used inside <InlineEdit>")
  }
  return ctx
}

export type InlineEditProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onSubmit" | "onCancel"
> & {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** Called with the draft when a submit passes validation. Return a promise to show a pending state. */
  onSubmit?: (value: string) => void | Promise<void>
  onCancel?: () => void
  editing?: boolean
  defaultEditing?: boolean
  onEditingChange?: (editing: boolean) => void
  submitOnBlur?: boolean
  selectOnFocus?: boolean
  /** Return an error message to block the submit, or null to allow it. */
  validate?: (value: string) => string | null
  required?: boolean
  disabled?: boolean
  placeholder?: string
}

function InlineEdit({
  value: valueProp,
  defaultValue = "",
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
}: InlineEditProps) {
  const errorId = React.useId()

  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const value = valueProp ?? internalValue

  const [internalEditing, setInternalEditing] = React.useState(defaultEditing)
  const editing = editingProp ?? internalEditing

  const [draft, setDraft] = React.useState(value)
  const [error, setError] = React.useState<string | null>(null)
  const [pending, setPending] = React.useState(false)

  const setValue = React.useCallback(
    (next: string) => {
      if (valueProp === undefined) setInternalValue(next)
      onValueChange?.(next)
    },
    [valueProp, onValueChange]
  )

  const setEditing = React.useCallback(
    (next: boolean) => {
      if (editingProp === undefined) setInternalEditing(next)
      onEditingChange?.(next)
    },
    [editingProp, onEditingChange]
  )

  // Reset the draft whenever edit mode is entered, controlled or not.
  const [prevEditing, setPrevEditing] = React.useState(editing)
  if (editing !== prevEditing) {
    setPrevEditing(editing)
    if (editing) {
      setDraft(value)
      setError(null)
    }
  }

  const startEditing = React.useCallback(() => {
    if (disabled) return
    setEditing(true)
  }, [disabled, setEditing])

  const submit = React.useCallback(() => {
    if (pending) return
    const next = draft
    const message =
      required && next.trim() === ""
        ? "This field is required"
        : (validate?.(next) ?? null)
    if (message) {
      setError(message)
      return
    }
    setError(null)
    const result = onSubmit?.(next)
    if (result instanceof Promise) {
      setPending(true)
      result
        .then(() => {
          setValue(next)
          setEditing(false)
        })
        .finally(() => setPending(false))
    } else {
      setValue(next)
      setEditing(false)
    }
  }, [pending, draft, required, validate, onSubmit, setValue, setEditing])

  const cancel = React.useCallback(() => {
    if (pending) return
    setDraft(value)
    setError(null)
    setEditing(false)
    onCancel?.()
  }, [pending, value, setEditing, onCancel])

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
    ]
  )

  return (
    <InlineEditContext.Provider value={ctx}>
      <div
        data-slot="inline-edit"
        data-state={editing ? "editing" : "idle"}
        data-disabled={disabled || undefined}
        className={cn("group/inline-edit w-full", className)}
        {...props}
      >
        {children}
        {editing && error && (
          <p
            data-slot="inline-edit-error"
            id={errorId}
            className="mt-1.5 text-xs text-destructive"
          >
            {error}
          </p>
        )}
      </div>
    </InlineEditContext.Provider>
  )
}

export type InlineEditPreviewProps = React.ComponentProps<"span"> & {
  asChild?: boolean
}

function InlineEditPreview({
  asChild = false,
  className,
  children,
  ...props
}: InlineEditPreviewProps) {
  const { value, editing, disabled, placeholder, startEditing } = useInlineEdit()

  if (editing) return null

  const content = (
    <>
      {value === "" ? (
        <span className="text-muted-foreground">{placeholder}</span>
      ) : (
        value
      )}
      <Pencil
        aria-hidden
        className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover/preview:opacity-100 group-focus-visible/preview:opacity-100"
      />
    </>
  )

  const sharedProps = {
    "data-slot": "inline-edit-preview",
    role: "button",
    tabIndex: disabled ? -1 : 0,
    "aria-disabled": disabled || undefined,
    onClick: () => startEditing(),
    onKeyDown: (event: React.KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        startEditing()
      }
    },
    ...props,
  }

  const sharedClassName = cn(
    "group/preview inline-flex max-w-full cursor-pointer items-center gap-1.5 rounded-sm px-1.5 py-0.5 outline-none transition-colors",
    "hover:bg-accent hover:text-accent-foreground",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    disabled && "pointer-events-none opacity-50",
    className
  )

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{ className?: string }>
    return React.cloneElement(child, {
      ...sharedProps,
      className: cn(sharedClassName, child.props.className),
      children: content,
    } as React.HTMLAttributes<HTMLElement>)
  }

  return (
    <span {...sharedProps} className={sharedClassName}>
      {content}
    </span>
  )
}

function InlineEditInput({
  className,
  onKeyDown,
  onBlur,
  ...props
}: React.ComponentProps<typeof Input>) {
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
  } = useInlineEdit()

  // Stable callback ref: focus/select run once when the input mounts. An inline
  // ref would be re-invoked on every render, re-selecting the text mid-typing.
  const focusOnMount = React.useCallback(
    (node: HTMLInputElement | null) => {
      if (node) {
        node.focus()
        if (selectOnFocus) node.select()
      }
    },
    [selectOnFocus]
  )

  if (!editing) return null

  return (
    <Input
      data-slot="inline-edit-input"
      value={draft}
      placeholder={placeholder}
      disabled={disabled || pending}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? errorId : undefined}
      onChange={(event) => setDraft(event.target.value)}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (event.key === "Enter") {
          event.preventDefault()
          submit()
        }
        if (event.key === "Escape") {
          event.preventDefault()
          cancel()
        }
      }}
      onBlur={(event) => {
        onBlur?.(event)
        if (submitOnBlur && !pending) submit()
      }}
      className={cn("h-8", className)}
      {...props}
      ref={focusOnMount}
    />
  )
}

function InlineEditTextarea({
  className,
  onKeyDown,
  onBlur,
  ...props
}: React.ComponentProps<typeof Textarea>) {
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
  } = useInlineEdit()

  // Stable callback ref: focus/select run once when the textarea mounts. An
  // inline ref would re-run every render, re-selecting the text mid-typing.
  const focusOnMount = React.useCallback(
    (node: HTMLTextAreaElement | null) => {
      if (node) {
        node.focus()
        if (selectOnFocus) node.select()
      }
    },
    [selectOnFocus]
  )

  if (!editing) return null

  return (
    <Textarea
      data-slot="inline-edit-textarea"
      value={draft}
      placeholder={placeholder}
      disabled={disabled || pending}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? errorId : undefined}
      onChange={(event) => setDraft(event.target.value)}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
          event.preventDefault()
          submit()
        }
        if (event.key === "Escape") {
          event.preventDefault()
          cancel()
        }
      }}
      onBlur={(event) => {
        onBlur?.(event)
        if (submitOnBlur && !pending) submit()
      }}
      className={className}
      {...props}
      ref={focusOnMount}
    />
  )
}

export type InlineEditControlsProps = React.ComponentProps<"div"> & {
  submitLabel?: string
  cancelLabel?: string
}

function InlineEditControls({
  submitLabel = "Save",
  cancelLabel = "Cancel",
  className,
  children,
  ...props
}: InlineEditControlsProps) {
  const { editing, pending, submit, cancel } = useInlineEdit()

  if (!editing) return null

  return (
    <div
      data-slot="inline-edit-controls"
      // Prevent the editor from blurring so blur-submit cannot double-fire.
      onMouseDown={(event) => event.preventDefault()}
      className={cn("flex items-center gap-1", className)}
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
  )
}

export {
  InlineEdit,
  InlineEditPreview,
  InlineEditInput,
  InlineEditTextarea,
  InlineEditControls,
}
