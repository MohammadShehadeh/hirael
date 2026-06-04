"use client"

import { Spinner } from "@/registry/new-york/ui/spinner"

export default function SpinnerDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-8">
      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Variants
        </p>
        <div className="flex items-center gap-10 text-foreground">
          <div className="flex flex-col items-center gap-2">
            <Spinner variant="circle" size="lg" />
            <span className="font-mono text-[10px] text-muted-foreground">
              circle
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner variant="dots" size="lg" />
            <span className="font-mono text-[10px] text-muted-foreground">
              dots
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner variant="bars" size="lg" />
            <span className="font-mono text-[10px] text-muted-foreground">
              bars
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Sizes
        </p>
        <div className="flex items-center gap-6 text-foreground">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </div>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Inherits text color · in context
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-primary">
            <Spinner />
          </span>
          <span className="text-destructive">
            <Spinner variant="dots" />
          </span>
          <button
            type="button"
            disabled
            className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground opacity-90"
          >
            <Spinner size="sm" />
            Saving…
          </button>
        </div>
      </div>
    </div>
  )
}
