"use client"

import * as React from "react"

import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/registry/new-york/ui/stepper"

const steps = [
  { step: 1, title: "Account", description: "Email & password" },
  { step: 2, title: "Profile", description: "Name & avatar" },
  { step: 3, title: "Billing", description: "Plan & card" },
  { step: 4, title: "Done", description: "Review & submit" },
]

export default function StepperDemo() {
  const [current, setCurrent] = React.useState(2)

  return (
    <div className="grid w-full max-w-2xl gap-10">
      <div className="grid gap-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Horizontal · interactive
        </p>
        <Stepper value={current} onValueChange={setCurrent}>
          {steps.map(({ step, title }) => (
            <StepperItem key={step} step={step}>
              <StepperTrigger>
                <StepperIndicator />
                <StepperTitle>{title}</StepperTitle>
              </StepperTrigger>
              {step < steps.length && <StepperSeparator />}
            </StepperItem>
          ))}
        </Stepper>
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCurrent((s) => Math.max(1, s - 1))}
            disabled={current === 1}
            className="inline-flex h-8 items-center rounded-md border border-border bg-card px-3 text-sm font-medium transition-colors hover:bg-accent disabled:opacity-50"
          >
            Back
          </button>
          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
            Step {current} of {steps.length}
          </span>
          <button
            type="button"
            onClick={() => setCurrent((s) => Math.min(steps.length, s + 1))}
            disabled={current === steps.length}
            className="inline-flex h-8 items-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Vertical · with descriptions
        </p>
        <Stepper value={current} onValueChange={setCurrent} orientation="vertical">
          {steps.map(({ step, title, description }) => (
            <StepperItem key={step} step={step}>
              <StepperTrigger>
                <StepperIndicator />
                <span>
                  <StepperTitle>{title}</StepperTitle>
                  <StepperDescription>{description}</StepperDescription>
                </span>
              </StepperTrigger>
              {step < steps.length && <StepperSeparator />}
            </StepperItem>
          ))}
        </Stepper>
      </div>
    </div>
  )
}
