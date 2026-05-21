"use client"

import * as React from "react"
import { Star } from "lucide-react"

import { cn } from "@/lib/utils"

export type RatingProps = Omit<
  React.ComponentProps<"div">,
  "onChange" | "defaultValue"
> & {
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  max?: number
  step?: 0.5 | 1
  readOnly?: boolean
  disabled?: boolean
  size?: "sm" | "md" | "lg"
  name?: string
  "aria-label"?: string
}

const sizeMap = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
} as const

function Rating({
  value: valueProp,
  defaultValue,
  onValueChange,
  max = 5,
  step = 1,
  readOnly,
  disabled,
  size = "md",
  name,
  className,
  ...props
}: RatingProps) {
  const isControlled = valueProp !== undefined
  const [internal, setInternal] = React.useState(defaultValue ?? 0)
  const [hover, setHover] = React.useState<number | null>(null)

  const value = isControlled ? (valueProp as number) : internal
  const display = hover ?? value

  const interactive = !readOnly && !disabled
  const iconSize = sizeMap[size]

  const commit = (next: number) => {
    if (!interactive) return
    if (!isControlled) setInternal(next)
    onValueChange?.(next)
  }

  return (
    <div
      data-slot="rating"
      data-readonly={readOnly || undefined}
      data-disabled={disabled || undefined}
      role={interactive ? "radiogroup" : "img"}
      aria-label={props["aria-label"] ?? `Rating: ${value} of ${max}`}
      className={cn(
        "inline-flex items-center gap-0.5",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      onMouseLeave={() => setHover(null)}
      {...props}
    >
      {Array.from({ length: max }).map((_, i) => {
        const fullValue = i + 1
        const halfValue = i + 0.5
        const filled = display >= fullValue
        const half = !filled && display >= halfValue

        return (
          <span
            key={i}
            className={cn(
              "relative inline-flex",
              interactive && "cursor-pointer"
            )}
          >
            {}
            <Star
              className={cn(
                iconSize,
                "text-muted-foreground/40 transition-colors"
              )}
              aria-hidden
            />
            {}
            {(filled || half) && (
              <Star
                className={cn(
                  iconSize,
                  "absolute inset-0 fill-yellow-400 text-yellow-400 transition-[clip-path]"
                )}
                style={half ? { clipPath: "inset(0 50% 0 0)" } : undefined}
                aria-hidden
              />
            )}

            {}
            {interactive && step === 0.5 && (
              <>
                <button
                  type="button"
                  role="radio"
                  aria-checked={value === halfValue}
                  aria-label={`${halfValue} of ${max}`}
                  className="absolute inset-y-0 left-0 w-1/2 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  onMouseEnter={() => setHover(halfValue)}
                  onClick={() => commit(value === halfValue ? 0 : halfValue)}
                />
                <button
                  type="button"
                  role="radio"
                  aria-checked={value === fullValue}
                  aria-label={`${fullValue} of ${max}`}
                  className="absolute inset-y-0 right-0 w-1/2 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  onMouseEnter={() => setHover(fullValue)}
                  onClick={() => commit(value === fullValue ? 0 : fullValue)}
                />
              </>
            )}
            {interactive && step === 1 && (
              <button
                type="button"
                role="radio"
                aria-checked={value === fullValue}
                aria-label={`${fullValue} of ${max}`}
                className="absolute inset-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                onMouseEnter={() => setHover(fullValue)}
                onClick={() => commit(value === fullValue ? 0 : fullValue)}
              />
            )}
          </span>
        )
      })}

      {name && <input type="hidden" name={name} value={value} />}
    </div>
  )
}

export { Rating }
