"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/registry/msh-ui/ui/input-group"

function resolveCurrencySymbol(currency: string, locale: string): string {
  try {
    const parts = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
    }).formatToParts(0)
    const symbol = parts.find((p) => p.type === "currency")?.value
    return symbol ?? currency
  } catch {
    return currency
  }
}

function formatNumber(
  value: number,
  locale: string,
  decimals: number
): string {
  try {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value)
  } catch {
    return value.toFixed(decimals)
  }
}

function sanitizeInput(raw: string, decimals: number): string {
  if (!raw) return ""
  let str = raw.replace(/[^\d.\-]/g, "")
  const negative = str.startsWith("-")
  str = str.replace(/-/g, "")
  const firstDot = str.indexOf(".")
  if (firstDot !== -1) {
    str =
      str.slice(0, firstDot + 1) + str.slice(firstDot + 1).replace(/\./g, "")
  }
  if (decimals === 0) {
    str = str.replace(/\./g, "")
  } else if (firstDot !== -1) {
    const [whole, frac = ""] = str.split(".")
    str = `${whole}.${frac.slice(0, decimals)}`
  }
  return negative ? `-${str}` : str
}

function parseToNumber(view: string): number | null {
  if (!view || view === "-" || view === "." || view === "-.") return null
  const n = Number(view)
  return Number.isFinite(n) ? n : null
}

type Ctx = {
  id: string
  value: number | null
  setValue: (next: number | null) => void
  view: string
  setView: (next: string) => void
  currency: string
  locale: string
  decimals: number
  disabled?: boolean
  symbol: string
}

const CurrencyInputContext = React.createContext<Ctx | null>(null)

function useCurrencyInput() {
  const ctx = React.useContext(CurrencyInputContext)
  if (!ctx) {
    throw new Error(
      "CurrencyInput compound parts must be used inside <CurrencyInput>"
    )
  }
  return ctx
}

export type CurrencyInputProps = Omit<
  React.ComponentProps<"div">,
  "children" | "value" | "defaultValue" | "onChange"
> & {
  id?: string
  value?: number | null
  defaultValue?: number | null
  onValueChange?: (value: number | null) => void
  currency?: string
  locale?: string
  decimals?: number
  disabled?: boolean
  children?: React.ReactNode
}

function CurrencyInput({
  id,
  value: valueProp,
  defaultValue = null,
  onValueChange,
  currency = "USD",
  locale = "en-US",
  decimals = 2,
  disabled,
  className,
  children,
  ...props
}: CurrencyInputProps) {
  const reactId = React.useId()
  const fieldId = id ?? reactId

  const [internalValue, setInternalValue] = React.useState<number | null>(
    defaultValue
  )
  const value = valueProp !== undefined ? valueProp : internalValue
  const setValue = React.useCallback(
    (next: number | null) => {
      if (valueProp === undefined) setInternalValue(next)
      onValueChange?.(next)
    },
    [valueProp, onValueChange]
  )

  const [view, setView] = React.useState<string>(() =>
    value === null || value === undefined
      ? ""
      : formatNumber(value, locale, decimals)
  )

  const lastSeenValue = React.useRef<number | null | undefined>(value)
  React.useEffect(() => {
    if (lastSeenValue.current === value) return
    lastSeenValue.current = value
    setView(
      value === null || value === undefined
        ? ""
        : formatNumber(value, locale, decimals)
    )
  }, [value, locale, decimals])

  const symbol = React.useMemo(
    () => resolveCurrencySymbol(currency, locale),
    [currency, locale]
  )

  const ctx = React.useMemo<Ctx>(
    () => ({
      id: fieldId,
      value: value ?? null,
      setValue,
      view,
      setView,
      currency,
      locale,
      decimals,
      disabled,
      symbol,
    }),
    [fieldId, value, setValue, view, currency, locale, decimals, disabled, symbol]
  )

  return (
    <CurrencyInputContext.Provider value={ctx}>
      <InputGroup
        data-slot="currency-input"
        data-disabled={disabled || undefined}
        className={cn(disabled && "opacity-60", className)}
        {...props}
      >
        {children}
      </InputGroup>
    </CurrencyInputContext.Provider>
  )
}

type CurrencyInputPrefixProps = Omit<
  React.ComponentProps<typeof InputGroupAddon>,
  "align" | "children"
> & {
  children?: React.ReactNode
}

function CurrencyInputPrefix({
  className,
  children,
  ...props
}: CurrencyInputPrefixProps) {
  const ctx = useCurrencyInput()
  return (
    <InputGroupAddon
      data-slot="currency-input-prefix"
      align="inline-start"
      className={className}
      {...props}
    >
      <InputGroupText className="font-mono">
        {children ?? ctx.symbol}
      </InputGroupText>
    </InputGroupAddon>
  )
}

type CurrencyInputFieldProps = Omit<
  React.ComponentProps<"input">,
  "type" | "value" | "defaultValue" | "onChange" | "id"
>

function CurrencyInputField({
  placeholder = "0",
  onBlur,
  onFocus,
  inputMode = "decimal",
  ...props
}: CurrencyInputFieldProps) {
  const ctx = useCurrencyInput()

  return (
    <InputGroupInput
      id={ctx.id}
      type="text"
      inputMode={inputMode}
      value={ctx.view}
      disabled={ctx.disabled}
      placeholder={placeholder}
      data-slot="currency-input-field"
      onChange={(e) => {
        const sanitized = sanitizeInput(e.target.value, ctx.decimals)
        ctx.setView(sanitized)
        const parsed = parseToNumber(sanitized)
        ctx.setValue(parsed)
      }}
      onFocus={(e) => {
        onFocus?.(e)
        if (ctx.value === null || ctx.value === undefined) return
        const raw =
          ctx.decimals > 0
            ? ctx.value.toFixed(ctx.decimals)
            : String(Math.trunc(ctx.value))
        ctx.setView(raw)
      }}
      onBlur={(e) => {
        onBlur?.(e)
        const parsed = parseToNumber(ctx.view)
        if (parsed === null) {
          ctx.setView("")
          ctx.setValue(null)
          return
        }
        ctx.setView(formatNumber(parsed, ctx.locale, ctx.decimals))
        ctx.setValue(parsed)
      }}
      {...props}
    />
  )
}

export {
  CurrencyInput,
  CurrencyInputPrefix,
  CurrencyInputField,
}
