"use client"

import * as React from "react"

import { Label } from "@/registry/sabk/ui/label"
import { NumberRange } from "@/registry/sabk/number-range/number-range"

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n)
const parseNum = (s: string) => Number(s.replace(/[^\d.-]/g, "")) || 0

export default function NumberRangeDemo() {
  const [price, setPrice] = React.useState<[number, number]>([200, 1400])
  const [age, setAge] = React.useState<[number, number]>([18, 65])

  return (
    <div className="grid w-full max-w-md gap-8">
      <div className="grid gap-3">
        <div className="flex items-baseline justify-between">
          <Label>Price (USD)</Label>
          <span className="font-mono text-[10px] tabular-nums uppercase tracking-[0.08em] text-muted-foreground">
            ${usd(price[0])} – ${usd(price[1])}
          </span>
        </div>
        <NumberRange
          min={0}
          max={5000}
          step={50}
          value={price}
          onChange={setPrice}
          prefix="$"
          format={usd}
          parse={parseNum}
        />
      </div>

      <div className="grid gap-3">
        <div className="flex items-baseline justify-between">
          <Label>Age (compound)</Label>
          <span className="font-mono text-[10px] tabular-nums uppercase tracking-[0.08em] text-muted-foreground">
            {age[0]}–{age[1]} yrs
          </span>
        </div>
        <NumberRange.Root
          min={0}
          max={100}
          step={1}
          value={age}
          onValueChange={setAge}
          suffix="yrs"
        >
          <NumberRange.Slider />
          <NumberRange.Inputs separator="→" />
        </NumberRange.Root>
      </div>
    </div>
  )
}
