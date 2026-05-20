"use client"

import * as React from "react"

import { Label } from "@/registry/sabk/ui/label"
import { PasswordInput } from "@/registry/sabk/password-input/password-input"

export default function PasswordInputDemo() {
  const [single, setSingle] = React.useState("")
  const [compound, setCompound] = React.useState("hunter2")

  return (
    <div className="grid w-full max-w-md gap-8">
      <div className="grid gap-2">
        <Label htmlFor="pw-single">Single-prop API · with strength meter</Label>
        <PasswordInput
          id="pw-single"
          value={single}
          onChange={setSingle}
          showStrength
          placeholder="Pick a strong one"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="pw-compound">Compound API · custom strength hint</Label>
        <PasswordInput.Root
          id="pw-compound"
          value={compound}
          onValueChange={setCompound}
        >
          <PasswordInput.Field placeholder="Type to see strength" />
          <PasswordInput.Strength
            renderMeta={(s) => (
              <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
                score {s.score} / 4 · {s.label}
              </p>
            )}
          />
        </PasswordInput.Root>
      </div>
    </div>
  )
}
