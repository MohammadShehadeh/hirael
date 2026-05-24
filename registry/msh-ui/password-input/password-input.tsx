"use client"

import * as React from "react"
import { Eye, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/registry/msh-ui/ui/input-group"

export type PasswordStrength = {
  score: number
  label: string
  hint?: string
}

export type PasswordScorer = (value: string) => PasswordStrength

export const defaultPasswordScorer: PasswordScorer = (value) => {
  if (!value) return { score: 0, label: "empty" }
  let score = 0
  if (value.length >= 8) score++
  if (value.length >= 12) score++
  const classes =
    Number(/[a-z]/.test(value)) +
    Number(/[A-Z]/.test(value)) +
    Number(/\d/.test(value)) +
    Number(/[^A-Za-z0-9]/.test(value))
  if (classes >= 2) score++
  if (classes >= 3) score++
  score = Math.min(score, 4)
  const labels = ["weak", "weak", "fair", "good", "strong"] as const
  const hints = [
    "8+ chars, mix character types",
    "Try a longer passphrase",
    "Add a number or symbol",
    "Nearly there — make it longer",
    "Strong",
  ] as const
  return { score, label: labels[score], hint: hints[score] }
}

type Ctx = {
  id: string
  value: string
  setValue: (v: string) => void
  visible: boolean
  setVisible: (v: boolean) => void
  disabled?: boolean
  scorer: PasswordScorer
  strength: PasswordStrength
}

const PasswordContext = React.createContext<Ctx | null>(null)

function usePasswordContext() {
  const ctx = React.useContext(PasswordContext)
  if (!ctx) {
    throw new Error(
      "PasswordInput compound parts must be used inside <PasswordInput>"
    )
  }
  return ctx
}

export type PasswordInputProps = {
  id?: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  scorer?: PasswordScorer
  children: React.ReactNode
}

function PasswordInput({
  id,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  disabled,
  scorer = defaultPasswordScorer,
  children,
}: PasswordInputProps) {
  const reactId = React.useId()
  const fieldId = id ?? reactId

  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const value = valueProp ?? internalValue
  const setValue = React.useCallback(
    (next: string) => {
      if (valueProp === undefined) setInternalValue(next)
      onValueChange?.(next)
    },
    [valueProp, onValueChange]
  )

  const [visible, setVisible] = React.useState(false)

  const strength = React.useMemo(() => scorer(value), [scorer, value])

  const ctx = React.useMemo<Ctx>(
    () => ({
      id: fieldId,
      value,
      setValue,
      visible,
      setVisible,
      disabled,
      scorer,
      strength,
    }),
    [fieldId, value, setValue, visible, disabled, scorer, strength]
  )

  return (
    <PasswordContext.Provider value={ctx}>{children}</PasswordContext.Provider>
  )
}

type PasswordInputFieldProps = Omit<
  React.ComponentProps<"input">,
  "type" | "value" | "defaultValue" | "onChange" | "id"
> & {
  showToggle?: boolean
  toggleLabel?: { show: string; hide: string }
  className?: string
}

function PasswordInputField({
  showToggle = true,
  toggleLabel = { show: "Show password", hide: "Hide password" },
  className,
  ...props
}: PasswordInputFieldProps) {
  const ctx = usePasswordContext()
  return (
    <InputGroup
      data-slot="password-input-field"
      data-disabled={ctx.disabled || undefined}
      className={cn(ctx.disabled && "opacity-60", className)}
    >
      <InputGroupInput
        id={ctx.id}
        type={ctx.visible ? "text" : "password"}
        value={ctx.value}
        onChange={(e) => ctx.setValue(e.target.value)}
        disabled={ctx.disabled}
        autoComplete="current-password"
        {...props}
      />
      {showToggle && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            type="button"
            size="icon-sm"
            tabIndex={-1}
            aria-label={ctx.visible ? toggleLabel.hide : toggleLabel.show}
            aria-pressed={ctx.visible}
            disabled={ctx.disabled}
            onClick={() => ctx.setVisible(!ctx.visible)}
          >
            {ctx.visible ? <EyeOff /> : <Eye />}
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  )
}

const STRENGTH_COLORS = [
  "bg-destructive",
  "bg-destructive",
  "bg-amber-500",
  "bg-primary",
  "bg-emerald-500",
] as const

type PasswordInputStrengthProps = React.ComponentProps<"div"> & {
  showLabel?: boolean
  renderMeta?: (strength: PasswordStrength) => React.ReactNode
}

function PasswordInputStrength({
  showLabel = true,
  renderMeta,
  className,
  ...props
}: PasswordInputStrengthProps) {
  const ctx = usePasswordContext()
  const s = ctx.strength
  const bar = STRENGTH_COLORS[s.score] ?? STRENGTH_COLORS[0]
  return (
    <div
      data-slot="password-input-strength"
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    >
      <div className="grid grid-cols-4 gap-1">
        {[1, 2, 3, 4].map((tier) => (
          <span
            key={tier}
            className={cn(
              "h-1 rounded-sm bg-border transition-colors duration-200 ease-out",
              s.score >= tier && bar
            )}
          />
        ))}
      </div>
      {showLabel &&
        (renderMeta ? (
          renderMeta(s)
        ) : (
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
              {s.label}
            </span>
            {s.hint && (
              <span className="text-[11px] text-muted-foreground">
                {s.hint}
              </span>
            )}
          </div>
        ))}
    </div>
  )
}

export {
  PasswordInput,
  PasswordInputField,
  PasswordInputStrength,
}
