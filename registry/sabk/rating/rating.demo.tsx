"use client"

import * as React from "react"

import { Rating } from "@/registry/sabk/rating/rating"

export default function RatingDemo() {
  const [value, setValue] = React.useState(3.5)

  return (
    <div className="grid w-full max-w-2xl gap-8">
      {}
      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Interactive · whole stars
        </p>
        <Rating defaultValue={4} aria-label="Overall rating" />
      </div>

      {}
      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Controlled · half steps
        </p>
        <div className="flex items-center gap-3">
          <Rating
            value={value}
            onValueChange={setValue}
            step={0.5}
            aria-label="Half-step rating"
          />
          <span className="font-mono text-sm tabular-nums text-muted-foreground">
            {value.toFixed(1)}
          </span>
        </div>
      </div>

      {}
      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Read-only display
        </p>
        <div className="flex items-center gap-2">
          <Rating value={4.5} step={0.5} readOnly size="sm" />
          <span className="text-xs text-muted-foreground">
            4.5 · 1,284 reviews
          </span>
        </div>
      </div>

      {}
      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Sizes
        </p>
        <div className="flex items-center gap-6">
          <Rating defaultValue={3} size="sm" aria-label="Small" />
          <Rating defaultValue={3} size="md" aria-label="Medium" />
          <Rating defaultValue={3} size="lg" aria-label="Large" />
        </div>
      </div>
    </div>
  )
}
