"use client"

import * as React from "react"

import { Label } from "@/registry/msh-ui/ui/label"
import {
  CurrencyInput,
  CurrencyInputField,
  CurrencyInputPrefix,
} from "@/registry/msh-ui/ui/currency-input"

export default function CurrencyInputDemo() {
  const [basic, setBasic] = React.useState<number | null>(1499.5)
  const [composed, setComposed] = React.useState<number | null>(12480)

  return (
    <div className="grid w-full max-w-md gap-8">
      <div className="grid gap-2">
        <Label htmlFor="cur-basic">USD</Label>
        <CurrencyInput
          id="cur-basic"
          value={basic}
          onValueChange={setBasic}
          currency="USD"
          locale="en-US"
          decimals={2}
        >
          <CurrencyInputPrefix />
          <CurrencyInputField />
        </CurrencyInput>
        <p className="font-mono text-[11px] text-muted-foreground">
          parsed: {basic === null ? "null" : basic}
        </p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="cur-composed">EUR (de-DE)</Label>
        <CurrencyInput
          id="cur-composed"
          value={composed}
          onValueChange={setComposed}
          currency="EUR"
          locale="de-DE"
          decimals={2}
        >
          <CurrencyInputPrefix />
          <CurrencyInputField placeholder="0,00" />
        </CurrencyInput>
        <p className="font-mono text-[11px] text-muted-foreground">
          parsed: {composed === null ? "null" : composed}
        </p>
      </div>
    </div>
  )
}
