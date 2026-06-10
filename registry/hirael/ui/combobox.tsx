"use client"

import * as React from "react"
import { Check, ChevronDown, Loader2, X } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/hirael/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/registry/hirael/ui/command"

export type ComboboxOption = {
  value: string
  label: string
  group?: string
  disabled?: boolean
}

type Ctx = {
  value: string | undefined
  setValue: (next: string | undefined) => void
  options: ComboboxOption[]
  open: boolean
  setOpen: (next: boolean) => void
  search: string
  setSearch: (next: string) => void
  loading?: boolean
  disabled?: boolean
  clearable: boolean
  externalFilter: boolean
}

const ComboboxContext = React.createContext<Ctx | null>(null)

function useCombobox() {
  const ctx = React.useContext(ComboboxContext)
  if (!ctx) {
    throw new Error(
      "Combobox compound parts must be used inside <Combobox>"
    )
  }
  return ctx
}

export type ComboboxProps = {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string | undefined) => void
  options?: ComboboxOption[]
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onSearchChange?: (search: string) => void
  externalFilter?: boolean
  loading?: boolean
  disabled?: boolean
  clearable?: boolean
  children?: React.ReactNode
}

function Combobox({
  value: valueProp,
  defaultValue,
  onValueChange,
  options = [],
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  onSearchChange,
  externalFilter = false,
  loading,
  disabled,
  clearable = true,
  children,
}: ComboboxProps) {
  const [internalValue, setInternalValue] = React.useState<string | undefined>(
    defaultValue
  )
  const value = valueProp !== undefined ? valueProp : internalValue
  const setValue = React.useCallback(
    (next: string | undefined) => {
      if (valueProp === undefined) setInternalValue(next)
      onValueChange?.(next)
    },
    [valueProp, onValueChange]
  )

  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
  const open = openProp ?? internalOpen
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setInternalOpen(next)
      onOpenChange?.(next)
    },
    [openProp, onOpenChange]
  )

  const [search, setSearchState] = React.useState("")
  const setSearch = React.useCallback(
    (next: string) => {
      setSearchState(next)
      onSearchChange?.(next)
    },
    [onSearchChange]
  )

  const ctx = React.useMemo<Ctx>(
    () => ({
      value,
      setValue,
      options,
      open,
      setOpen,
      search,
      setSearch,
      loading,
      disabled,
      clearable,
      externalFilter,
    }),
    [
      value,
      setValue,
      options,
      open,
      setOpen,
      search,
      setSearch,
      loading,
      disabled,
      clearable,
      externalFilter,
    ]
  )

  return (
    <ComboboxContext.Provider value={ctx}>
      <Popover open={open} onOpenChange={setOpen}>
        {children}
      </Popover>
    </ComboboxContext.Provider>
  )
}

type ComboboxTriggerProps = Omit<
  React.ComponentProps<"button">,
  "children"
> & {
  placeholder?: string
  className?: string
  children?: React.ReactNode | ((ctx: Ctx) => React.ReactNode)
}

function ComboboxTrigger({
  placeholder = "Select…",
  className,
  children,
  ...props
}: ComboboxTriggerProps) {
  const ctx = useCombobox()
  const selected = ctx.options.find((o) => o.value === ctx.value)

  return (
    <PopoverTrigger asChild>
      <button
        type="button"
        role="combobox"
        aria-expanded={ctx.open}
        aria-haspopup="listbox"
        disabled={ctx.disabled}
        data-slot="combobox-trigger"
        data-state={ctx.open ? "open" : "closed"}
        className={cn(
          "group flex h-9 w-full items-center justify-between gap-2 rounded-sm border border-input bg-transparent px-2.5 text-left text-sm outline-none transition-colors",
          "hover:border-ring/60 focus-visible:border-ring",
          "data-[state=open]:border-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        {typeof children === "function" ? (
          children(ctx)
        ) : children ? (
          children
        ) : (
          <>
            <span
              className={cn(
                "min-w-0 flex-1 truncate",
                !selected && "text-muted-foreground"
              )}
            >
              {selected ? selected.label : placeholder}
            </span>
            <span className="flex shrink-0 items-center gap-1 text-muted-foreground">
              {ctx.clearable && ctx.value !== undefined && !ctx.disabled && (
                <span
                  role="button"
                  tabIndex={-1}
                  aria-label="Clear selection"
                  onPointerDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    ctx.setValue(undefined)
                  }}
                  className="inline-flex size-4 items-center justify-center rounded-[2px] hover:bg-accent hover:text-foreground"
                >
                  <X className="size-3" />
                </span>
              )}
              <ChevronDown
                className={cn(
                  "size-3.5 transition-transform duration-150",
                  ctx.open && "rotate-180"
                )}
              />
            </span>
          </>
        )}
      </button>
    </PopoverTrigger>
  )
}

type ComboboxContentProps = React.ComponentProps<typeof PopoverContent> & {
  searchPlaceholder?: string
  emptyMessage?: string
  loadingMessage?: string
  children?: React.ReactNode
}

function ComboboxContent({
  className,
  searchPlaceholder = "Search…",
  emptyMessage = "Nothing found.",
  loadingMessage = "Loading…",
  children,
  ...props
}: ComboboxContentProps) {
  const ctx = useCombobox()

  const groups = React.useMemo(() => {
    const map = new Map<string | undefined, ComboboxOption[]>()
    for (const opt of ctx.options) {
      const key = opt.group
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(opt)
    }
    return Array.from(map.entries())
  }, [ctx.options])

  return (
    <PopoverContent
      align="start"
      sideOffset={6}
      data-slot="combobox-content"
      className={cn(
        "w-(--radix-popover-trigger-width) min-w-[14rem] p-0",
        className
      )}
      onOpenAutoFocus={(e) => e.preventDefault()}
      {...props}
    >
      <Command shouldFilter={!ctx.externalFilter} loop>
        <CommandInput
          placeholder={searchPlaceholder}
          value={ctx.search}
          onValueChange={ctx.setSearch}
        />
        <CommandList>
          {ctx.loading ? (
            <div className="flex items-center justify-center gap-2 py-6 text-xs text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" />
              {loadingMessage}
            </div>
          ) : (
            <>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              {children ??
                groups.map(([group, items]) => (
                  <CommandGroup key={group ?? "__default"} heading={group}>
                    {items.map((opt) => (
                      <ComboboxItem key={opt.value} option={opt} />
                    ))}
                  </CommandGroup>
                ))}
            </>
          )}
        </CommandList>
      </Command>
    </PopoverContent>
  )
}

type ComboboxItemProps = Omit<
  React.ComponentProps<typeof CommandItem>,
  "value" | "onSelect" | "children"
> & {
  option: ComboboxOption
  children?: React.ReactNode
}

function ComboboxItem({
  option,
  children,
  className,
  ...props
}: ComboboxItemProps) {
  const ctx = useCombobox()
  const selected = ctx.value === option.value

  return (
    <CommandItem
      value={`${option.label} ${option.value}`}
      disabled={option.disabled}
      onSelect={() => {
        ctx.setValue(selected ? undefined : option.value)
        ctx.setOpen(false)
      }}
      data-slot="combobox-item"
      className={cn("justify-between", className)}
      {...props}
    >
      <span className="min-w-0 truncate">{children ?? option.label}</span>
      {selected && <Check className="size-3.5 text-foreground" strokeWidth={3} />}
    </CommandItem>
  )
}

export function useAsyncComboboxOptions<T>(
  loader: (query: string) => Promise<T[]>,
  map: (item: T) => ComboboxOption,
  { debounce = 200, initialQuery = "" }: { debounce?: number; initialQuery?: string } = {}
) {
  const [query, setQuery] = React.useState(initialQuery)
  const [options, setOptions] = React.useState<ComboboxOption[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<unknown>(null)
  const reqId = React.useRef(0)

  React.useEffect(() => {
    const id = ++reqId.current
    const t = setTimeout(async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await loader(query)
        if (id === reqId.current) setOptions(result.map(map))
      } catch (e) {
        if (id === reqId.current) setError(e)
      } finally {
        if (id === reqId.current) setLoading(false)
      }
    }, debounce)
    return () => clearTimeout(t)
  }, [query, loader, map, debounce])

  return { query, setQuery, options, loading, error }
}

export {
  Combobox,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxItem,
}
