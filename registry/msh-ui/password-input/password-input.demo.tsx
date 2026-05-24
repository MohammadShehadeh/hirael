"use client"

import * as React from "react"

import { Label } from "@/registry/msh-ui/ui/label"
import {
  PasswordInput,
  PasswordInputField,
  PasswordInputStrength,
} from "@/registry/msh-ui/ui/password-input"

export default function PasswordInputDemo() {
  const [basic, setBasic] = React.useState("")
  const [composed, setComposed] = React.useState("hunter2")

  return (
    <div className="grid w-full max-w-md gap-8">
      <div className="grid gap-2">
        <Label htmlFor="pw-basic">Password · with strength meter</Label>
        <PasswordInput id="pw-basic" value={basic} onValueChange={setBasic}>
          <PasswordInputField placeholder="Pick a strong one" />
          <PasswordInputStrength />
        </PasswordInput>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="pw-composed">Password · custom strength hint</Label>
        <PasswordInput
          id="pw-composed"
          value={composed}
          onValueChange={setComposed}
        >
          <PasswordInputField placeholder="Type to see strength" />
          <PasswordInputStrength
            renderMeta={(s) => (
              <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
                score {s.score} / 4 · {s.label}
              </p>
            )}
          />
        </PasswordInput>
      </div>
    </div>
  )
}
