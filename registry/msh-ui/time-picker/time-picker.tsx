"use client"

import * as React from "react"
import { Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/msh-ui/ui/popover"

export type TimeValue = {
  hour: number
  minute: number
  second?: number
}

export type TimeFormat = "12h" | "24h"

type TimePickerContextValue = {
  value: TimeValue
  setValue: (v: TimeValue) => void
  format: TimeFormat
  showSeconds: boolean
  minuteStep: number
  secondStep: number
  open: boolean
  setOpen: (open: boolean) => void
  disabled?: boolean
}

const TimePickerContext = React.createContext<TimePickerContextValue | null>(
  null
)

function useTimePicker() {
  const ctx = React.useContext(TimePickerContext)
  if (!ctx) {
    throw new Error(
      "TimePicker compound components must be used inside <TimePicker>"
    )
  }
  return ctx
}

function pad2(n: number) {
  return n.toString().padStart(2, "0")
}

function clampStep(value: number, step: number, max: number) {
  const snapped = Math.round(value / step) * step
  return Math.max(0, Math.min(max, snapped))
}

export type TimePickerProps = {
  value?: TimeValue
  defaultValue?: TimeValue
  onValueChange?: (v: TimeValue) => void
  format?: TimeFormat
  showSeconds?: boolean
  minuteStep?: number
  secondStep?: number
  disabled?: boolean
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
}

function TimePicker({
  value: valueProp,
  defaultValue,
  onValueChange,
  format = "24h",
  showSeconds = false,
  minuteStep = 1,
  secondStep = 1,
  disabled,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  children,
}: TimePickerProps) {
  const [openInternal, setOpenInternal] = React.useState(defaultOpen)
  const open = openProp ?? openInternal
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setOpenInternal(next)
      onOpenChange?.(next)
    },
    [openProp, onOpenChange]
  )

  const [internal, setInternal] = React.useState<TimeValue>(
    defaultValue ?? { hour: 9, minute: 0, second: showSeconds ? 0 : undefined }
  )
  const value = valueProp ?? internal

  const setValue = React.useCallback(
    (next: TimeValue) => {
      if (valueProp === undefined) setInternal(next)
      onValueChange?.(next)
    },
    [valueProp, onValueChange]
  )

  const ctx = React.useMemo<TimePickerContextValue>(
    () => ({
      value,
      setValue,
      format,
      showSeconds,
      minuteStep,
      secondStep,
      open,
      setOpen,
      disabled,
    }),
    [value, setValue, format, showSeconds, minuteStep, secondStep, open, setOpen, disabled]
  )

  return (
    <TimePickerContext.Provider value={ctx}>
      <Popover open={open} onOpenChange={setOpen}>
        {children}
      </Popover>
    </TimePickerContext.Provider>
  )
}

function formatTimeValue(v: TimeValue, format: TimeFormat, showSeconds: boolean) {
  const tail = showSeconds ? `:${pad2(v.second ?? 0)}` : ""
  if (format === "24h") {
    return `${pad2(v.hour)}:${pad2(v.minute)}${tail}`
  }
  const meridiem = v.hour >= 12 ? "PM" : "AM"
  const h12 = ((v.hour + 11) % 12) + 1
  return `${pad2(h12)}:${pad2(v.minute)}${tail} ${meridiem}`
}

function TimePickerTrigger({
  placeholder = "Pick a time",
  className,
  children,
  showIcon = true,
  ...props
}: Omit<React.ComponentProps<"button">, "children"> & {
  placeholder?: string
  children?: React.ReactNode
  showIcon?: boolean
}) {
  const ctx = useTimePicker()
  const label = formatTimeValue(ctx.value, ctx.format, ctx.showSeconds)
  return (
    <PopoverTrigger asChild>
      <button
        type="button"
        disabled={ctx.disabled}
        data-slot="time-picker-trigger"
        data-state={ctx.open ? "open" : "closed"}
        className={cn(
          "inline-flex h-9 w-full items-center justify-between gap-2 rounded-sm border border-input bg-transparent px-3 text-left text-sm font-mono tabular-nums outline-none transition-colors",
          "hover:border-ring/60 focus-visible:border-ring data-[state=open]:border-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children ?? <span>{label || placeholder}</span>}
        {showIcon && (
          <Clock className="size-3.5 shrink-0 text-muted-foreground" />
        )}
      </button>
    </PopoverTrigger>
  )
}

function ScrollColumn({
  values,
  selected,
  onSelect,
  ariaLabel,
}: {
  values: number[]
  selected: number
  onSelect: (n: number) => void
  ariaLabel: string
}) {
  const listRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const el = listRef.current?.querySelector<HTMLButtonElement>(
      `[data-val="${selected}"]`
    )
    if (el) {
      el.scrollIntoView({ block: "center", behavior: "instant" as ScrollBehavior })
    }
  }, [selected])

  return (
    <div
      ref={listRef}
      role="listbox"
      aria-label={ariaLabel}
      className="relative h-40 w-14 overflow-y-auto scroll-smooth rounded-sm border border-input bg-card snap-y snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div className="flex flex-col items-stretch py-16">
        {values.map((n) => {
          const active = n === selected
          return (
            <button
              key={n}
              type="button"
              role="option"
              aria-selected={active}
              data-val={n}
              onClick={() => onSelect(n)}
              className={cn(
                "h-8 snap-center text-center font-mono text-sm tabular-nums outline-none transition-colors",
                "hover:bg-accent",
                "focus-visible:bg-accent",
                active
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground"
              )}
            >
              {pad2(n)}
            </button>
          )
        })}
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 h-8 -translate-y-1/2 border-y border-primary/40 bg-primary/5"
      />
    </div>
  )
}

function TimePickerContent({
  className,
  ...props
}: React.ComponentProps<typeof PopoverContent>) {
  const ctx = useTimePicker()
  const isAM = ctx.value.hour < 12

  const hourValues = React.useMemo(() => {
    if (ctx.format === "24h") {
      return Array.from({ length: 24 }, (_, i) => i)
    }
    return Array.from({ length: 12 }, (_, i) => i + 1)
  }, [ctx.format])

  const minuteValues = React.useMemo(() => {
    const step = Math.max(1, ctx.minuteStep)
    const count = Math.ceil(60 / step)
    return Array.from({ length: count }, (_, i) =>
      clampStep(i * step, step, 59)
    )
  }, [ctx.minuteStep])

  const secondValues = React.useMemo(() => {
    const step = Math.max(1, ctx.secondStep)
    const count = Math.ceil(60 / step)
    return Array.from({ length: count }, (_, i) =>
      clampStep(i * step, step, 59)
    )
  }, [ctx.secondStep])

  const displayHour =
    ctx.format === "24h" ? ctx.value.hour : ((ctx.value.hour + 11) % 12) + 1

  const setHour = (h: number) => {
    let nextHour: number
    if (ctx.format === "24h") {
      nextHour = h
    } else {
      // 12h: keep AM/PM as-is, h is 1-12
      const base = h === 12 ? 0 : h
      nextHour = isAM ? base : base + 12
    }
    ctx.setValue({ ...ctx.value, hour: nextHour })
  }

  const setMinute = (m: number) => {
    ctx.setValue({ ...ctx.value, minute: m })
  }

  const setSecond = (s: number) => {
    ctx.setValue({ ...ctx.value, second: s })
  }

  const setMeridiem = (next: "AM" | "PM") => {
    if ((next === "AM" && isAM) || (next === "PM" && !isAM)) return
    const base = ctx.value.hour % 12
    ctx.setValue({ ...ctx.value, hour: next === "AM" ? base : base + 12 })
  }

  return (
    <PopoverContent
      align="start"
      data-slot="time-picker-content"
      className={cn("w-auto p-3", className)}
      {...props}
    >
      <div className="flex items-stretch gap-2">
        <ScrollColumn
          values={hourValues}
          selected={displayHour}
          onSelect={setHour}
          ariaLabel="Hour"
        />
        <span aria-hidden className="flex items-center font-mono text-sm text-muted-foreground">
          :
        </span>
        <ScrollColumn
          values={minuteValues}
          selected={clampStep(ctx.value.minute, Math.max(1, ctx.minuteStep), 59)}
          onSelect={setMinute}
          ariaLabel="Minute"
        />
        {ctx.showSeconds && (
          <>
            <span aria-hidden className="flex items-center font-mono text-sm text-muted-foreground">
              :
            </span>
            <ScrollColumn
              values={secondValues}
              selected={clampStep(
                ctx.value.second ?? 0,
                Math.max(1, ctx.secondStep),
                59
              )}
              onSelect={setSecond}
              ariaLabel="Second"
            />
          </>
        )}
      </div>
      {ctx.format === "12h" && (
        <div className="mt-3 inline-flex w-full rounded-sm border border-input p-0.5">
          <button
            type="button"
            onClick={() => setMeridiem("AM")}
            aria-pressed={isAM}
            className={cn(
              "flex-1 rounded-[3px] py-1 font-mono text-xs uppercase tracking-[0.1em] transition-colors",
              isAM
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent"
            )}
          >
            AM
          </button>
          <button
            type="button"
            onClick={() => setMeridiem("PM")}
            aria-pressed={!isAM}
            className={cn(
              "flex-1 rounded-[3px] py-1 font-mono text-xs uppercase tracking-[0.1em] transition-colors",
              !isAM
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent"
            )}
          >
            PM
          </button>
        </div>
      )}
    </PopoverContent>
  )
}

export {
  TimePicker,
  TimePickerTrigger,
  TimePickerContent,
}
