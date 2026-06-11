"use client"

import * as React from "react"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/hirael/ui/button"

export type MediaInputValue = {
  file: File
  url: string
}

type MediaInputContextValue = {
  value: MediaInputValue | null
  error: string | null
  disabled: boolean
  open: () => void
  clear: () => void
}

const MediaInputContext = React.createContext<MediaInputContextValue | null>(
  null
)

function useMediaInput() {
  const ctx = React.useContext(MediaInputContext)
  if (!ctx) throw new Error("useMediaInput must be used within <MediaInput>")
  return ctx
}

function formatSize(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`
  return `${bytes} B`
}

export type MediaInputProps = Omit<React.ComponentProps<"div">, "onError"> & {
  /** Native accept filter, e.g. "audio/*" or "image/png,image/webp". */
  accept?: string
  /** Maximum file size in bytes. Larger picks are rejected with an error. */
  maxSize?: number
  disabled?: boolean
  onValueChange?: (value: MediaInputValue | null) => void
  onError?: (message: string) => void
}

function MediaInput({
  accept,
  maxSize,
  disabled = false,
  onValueChange,
  onError,
  className,
  children,
  ...props
}: MediaInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [value, setValue] = React.useState<MediaInputValue | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const valueRef = React.useRef(value)
  valueRef.current = value

  React.useEffect(
    () => () => {
      if (valueRef.current) URL.revokeObjectURL(valueRef.current.url)
    },
    []
  )

  const open = React.useCallback(() => {
    if (!disabled) inputRef.current?.click()
  }, [disabled])

  const clear = React.useCallback(() => {
    if (valueRef.current) URL.revokeObjectURL(valueRef.current.url)
    setValue(null)
    setError(null)
    onValueChange?.(null)
  }, [onValueChange])

  const handleFile = (file: File | undefined) => {
    if (!file) return
    if (maxSize != null && file.size > maxSize) {
      const message = `File is larger than ${formatSize(maxSize)}`
      setError(message)
      onError?.(message)
      return
    }
    if (valueRef.current) URL.revokeObjectURL(valueRef.current.url)
    const next = { file, url: URL.createObjectURL(file) }
    setError(null)
    setValue(next)
    onValueChange?.(next)
  }

  const ctx = React.useMemo<MediaInputContextValue>(
    () => ({ value, error, disabled, open, clear }),
    [value, error, disabled, open, clear]
  )

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
            handleFile(event.target.files?.[0])
            event.target.value = ""
          }}
        />
        {children}
      </div>
    </MediaInputContext.Provider>
  )
}

function MediaInputEmpty({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { value, error } = useMediaInput()
  if (value) return null

  return (
    <div
      data-slot="media-input-empty"
      className={cn(
        "grid justify-items-center gap-3 rounded-md border border-dashed border-border px-6 py-10 text-center",
        className
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
  )
}

function MediaInputContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { value } = useMediaInput()
  if (!value) return null

  return (
    <div
      data-slot="media-input-content"
      className={cn("grid gap-2", className)}
      {...props}
    >
      {children}
    </div>
  )
}

function MediaInputTrigger({
  variant = "outline",
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { open, disabled } = useMediaInput()

  return (
    <Button
      data-slot="media-input-trigger"
      variant={variant}
      disabled={disabled || props.disabled}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) open()
      }}
      {...props}
    />
  )
}

function MediaInputFile({
  className,
  ...props
}: React.ComponentProps<"p">) {
  const { value } = useMediaInput()
  if (!value) return null

  return (
    <p
      data-slot="media-input-file"
      className={cn(
        "min-w-0 truncate font-mono text-xs text-muted-foreground",
        className
      )}
      {...props}
    >
      {value.file.name}
      <span className="text-muted-foreground/70">
        {" · "}
        {formatSize(value.file.size)}
      </span>
    </p>
  )
}

function MediaInputClear({
  onClick,
  className,
  children,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { clear, disabled } = useMediaInput()

  return (
    <Button
      data-slot="media-input-clear"
      variant="ghost"
      size="icon"
      aria-label="Remove file"
      disabled={disabled || props.disabled}
      className={cn("size-7", className)}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) clear()
      }}
      {...props}
    >
      {children ?? <X aria-hidden className="size-3.5" />}
    </Button>
  )
}

export {
  MediaInput,
  MediaInputEmpty,
  MediaInputContent,
  MediaInputTrigger,
  MediaInputFile,
  MediaInputClear,
  useMediaInput,
}
