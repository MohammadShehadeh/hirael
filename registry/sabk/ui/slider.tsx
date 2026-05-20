"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo<number[]>(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max]
  )

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none select-none items-center data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="relative h-1 w-full grow overflow-hidden rounded-sm bg-secondary"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="absolute h-full bg-forge"
        />
      </SliderPrimitive.Track>
      {_values.map((_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          data-slot="slider-thumb"
          className="block size-4 rounded-[2px] border-2 border-forge bg-background shadow-[0_0_0_1px_var(--background)] outline-none transition-[transform,box-shadow] duration-100 hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none"
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
