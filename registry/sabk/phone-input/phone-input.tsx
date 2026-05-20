"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/sabk/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/registry/sabk/ui/command"

/* ============================================================================
 * Country data
 * ========================================================================== */

export type Country = {
  iso2: string
  name: string
  dialCode: string
}

export const COUNTRIES: readonly Country[] = [
  { iso2: "US", name: "United States", dialCode: "+1" },
  { iso2: "CA", name: "Canada", dialCode: "+1" },
  { iso2: "MX", name: "Mexico", dialCode: "+52" },
  { iso2: "BR", name: "Brazil", dialCode: "+55" },
  { iso2: "AR", name: "Argentina", dialCode: "+54" },
  { iso2: "GB", name: "United Kingdom", dialCode: "+44" },
  { iso2: "IE", name: "Ireland", dialCode: "+353" },
  { iso2: "FR", name: "France", dialCode: "+33" },
  { iso2: "DE", name: "Germany", dialCode: "+49" },
  { iso2: "ES", name: "Spain", dialCode: "+34" },
  { iso2: "IT", name: "Italy", dialCode: "+39" },
  { iso2: "NL", name: "Netherlands", dialCode: "+31" },
  { iso2: "SE", name: "Sweden", dialCode: "+46" },
  { iso2: "NO", name: "Norway", dialCode: "+47" },
  { iso2: "DK", name: "Denmark", dialCode: "+45" },
  { iso2: "PL", name: "Poland", dialCode: "+48" },
  { iso2: "CH", name: "Switzerland", dialCode: "+41" },
  { iso2: "AT", name: "Austria", dialCode: "+43" },
  { iso2: "PT", name: "Portugal", dialCode: "+351" },
  { iso2: "IN", name: "India", dialCode: "+91" },
  { iso2: "CN", name: "China", dialCode: "+86" },
  { iso2: "JP", name: "Japan", dialCode: "+81" },
  { iso2: "KR", name: "South Korea", dialCode: "+82" },
  { iso2: "AU", name: "Australia", dialCode: "+61" },
  { iso2: "NZ", name: "New Zealand", dialCode: "+64" },
] as const

function findCountry(iso2: string): Country | undefined {
  return COUNTRIES.find((c) => c.iso2 === iso2.toUpperCase())
}

function digitsOnly(input: string): string {
  return input.replace(/\D/g, "")
}

/** Parse an incoming E.164-ish string into country + national digits. */
function parseE164(
  value: string | undefined,
  fallback: Country
): { country: Country; national: string } {
  if (!value) return { country: fallback, national: "" }
  const trimmed = value.trim()
  if (!trimmed.startsWith("+")) {
    return { country: fallback, national: digitsOnly(trimmed) }
  }
  // Try the longest dial-code prefix first.
  const sorted = [...COUNTRIES].sort(
    (a, b) => b.dialCode.length - a.dialCode.length
  )
  for (const c of sorted) {
    if (trimmed.startsWith(c.dialCode)) {
      return { country: c, national: digitsOnly(trimmed.slice(c.dialCode.length)) }
    }
  }
  return { country: fallback, national: digitsOnly(trimmed) }
}

/* ============================================================================
 * Context
 * ========================================================================== */

type Ctx = {
  id: string
  country: Country
  setCountry: (next: Country) => void
  national: string
  setNational: (next: string) => void
  emit: (country: Country, national: string) => void
  disabled?: boolean
  open: boolean
  setOpen: (next: boolean) => void
}

const PhoneInputContext = React.createContext<Ctx | null>(null)

function usePhoneInput() {
  const ctx = React.useContext(PhoneInputContext)
  if (!ctx) {
    throw new Error(
      "PhoneInput compound parts must be used inside <PhoneInput>"
    )
  }
  return ctx
}

/* ============================================================================
 * Root
 *
 * The root renders the pill-style container itself; compose `<PhoneInputCountrySelect />`
 * and `<PhoneInputField />` as children.
 * ========================================================================== */

export type PhoneInputProps = Omit<
  React.ComponentProps<"div">,
  "children"
> & {
  id?: string
  value?: string
  defaultValue?: string
  onValueChange?: (e164: string) => void
  defaultCountry?: string
  disabled?: boolean
  children?: React.ReactNode
}

function PhoneInput({
  id,
  value: valueProp,
  defaultValue,
  onValueChange,
  defaultCountry = "US",
  disabled,
  className,
  children,
  ...props
}: PhoneInputProps) {
  const reactId = React.useId()
  const fieldId = id ?? reactId

  const fallback = React.useMemo<Country>(
    () => findCountry(defaultCountry) ?? COUNTRIES[0],
    [defaultCountry]
  )

  const initial = React.useMemo(
    () => parseE164(valueProp ?? defaultValue, fallback),
    // Run once for defaults; controlled sync happens in effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const [country, setCountryState] = React.useState<Country>(initial.country)
  const [national, setNationalState] = React.useState<string>(initial.national)
  const [open, setOpen] = React.useState(false)

  const isControlled = valueProp !== undefined

  // Sync from controlled value when it changes externally.
  const lastSeen = React.useRef<string | undefined>(valueProp)
  React.useEffect(() => {
    if (!isControlled) return
    if (lastSeen.current === valueProp) return
    lastSeen.current = valueProp
    const parsed = parseE164(valueProp, fallback)
    setCountryState(parsed.country)
    setNationalState(parsed.national)
  }, [isControlled, valueProp, fallback])

  const emit = React.useCallback(
    (c: Country, n: string) => {
      const digits = digitsOnly(n)
      const e164 = digits ? `${c.dialCode}${digits}` : ""
      lastSeen.current = e164
      onValueChange?.(e164)
    },
    [onValueChange]
  )

  const setCountry = React.useCallback(
    (next: Country) => {
      setCountryState(next)
      emit(next, national)
    },
    [emit, national]
  )

  const setNational = React.useCallback(
    (next: string) => {
      setNationalState(next)
      emit(country, next)
    },
    [emit, country]
  )

  const ctx = React.useMemo<Ctx>(
    () => ({
      id: fieldId,
      country,
      setCountry,
      national,
      setNational,
      emit,
      disabled,
      open,
      setOpen,
    }),
    [fieldId, country, setCountry, national, setNational, emit, disabled, open]
  )

  return (
    <PhoneInputContext.Provider value={ctx}>
      <div
        data-slot="phone-input"
        data-disabled={disabled || undefined}
        className={cn(
          "flex items-stretch overflow-hidden rounded-md border border-input bg-background text-sm transition-colors",
          "focus-within:border-ring",
          disabled && "opacity-60",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </PhoneInputContext.Provider>
  )
}

/* ============================================================================
 * Country select
 * ========================================================================== */

type PhoneInputCountrySelectProps = Omit<
  React.ComponentProps<"button">,
  "children" | "type"
>

function PhoneInputCountrySelect({
  className,
  ...props
}: PhoneInputCountrySelectProps) {
  const ctx = usePhoneInput()

  return (
    <Popover open={ctx.open} onOpenChange={ctx.setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={ctx.open}
          aria-haspopup="listbox"
          aria-label={`Country code, currently ${ctx.country.name} ${ctx.country.dialCode}`}
          disabled={ctx.disabled}
          data-slot="phone-input-country-select"
          data-state={ctx.open ? "open" : "closed"}
          className={cn(
            "flex items-center gap-1.5 border-r border-border bg-muted/50 px-3 transition-colors outline-none",
            "hover:bg-accent/60",
            "focus-visible:bg-accent/60",
            "disabled:cursor-not-allowed",
            className
          )}
          {...props}
        >
          <span className="font-mono text-xs font-medium">{ctx.country.iso2}</span>
          <span className="font-mono text-xs text-muted-foreground">
            {ctx.country.dialCode}
          </span>
          <ChevronDown
            className={cn(
              "size-3 text-muted-foreground transition-transform duration-150",
              ctx.open && "rotate-180"
            )}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={6}
        className="w-64 p-0"
        onOpenAutoFocus={(e) => {
          // Let cmdk autofocus its input.
          e.preventDefault()
        }}
      >
        <Command loop>
          <CommandInput placeholder="Search countries…" />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {COUNTRIES.map((c) => (
                <CommandItem
                  key={c.iso2}
                  value={`${c.name} ${c.iso2} ${c.dialCode}`}
                  onSelect={() => {
                    ctx.setCountry(c)
                    ctx.setOpen(false)
                  }}
                  className="justify-between"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="shrink-0 font-mono text-xs font-medium">
                      {c.iso2}
                    </span>
                    <span className="min-w-0 truncate">{c.name}</span>
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {c.dialCode}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

/* ============================================================================
 * Field
 * ========================================================================== */

type PhoneInputFieldProps = Omit<
  React.ComponentProps<"input">,
  "type" | "value" | "defaultValue" | "onChange" | "id"
>

function PhoneInputField({
  className,
  placeholder = "Phone number",
  onBlur,
  inputMode = "tel",
  ...props
}: PhoneInputFieldProps) {
  const ctx = usePhoneInput()
  return (
    <input
      id={ctx.id}
      type="tel"
      inputMode={inputMode}
      autoComplete="tel-national"
      value={ctx.national}
      placeholder={placeholder}
      disabled={ctx.disabled}
      data-slot="phone-input-field"
      onChange={(e) => {
        // Allow digits and spaces while typing; strip everything else.
        const cleaned = e.target.value.replace(/[^\d\s]/g, "")
        ctx.setNational(cleaned)
      }}
      onBlur={(e) => {
        onBlur?.(e)
        // Normalize on blur: collapse whitespace.
        const normalized = ctx.national.replace(/\s+/g, " ").trim()
        if (normalized !== ctx.national) ctx.setNational(normalized)
      }}
      className={cn(
        "flex h-9 w-full min-w-0 flex-1 bg-transparent px-3 py-1 text-sm outline-none",
        "placeholder:text-muted-foreground",
        "disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  )
}

export {
  PhoneInput,
  PhoneInputCountrySelect,
  PhoneInputField,
}
