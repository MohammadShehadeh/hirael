"use client"

import * as React from "react"

import { Label } from "@/registry/sabk/ui/label"
import {
  CurrencyInput,
  CurrencyInputField,
  CurrencyInputGroup,
  CurrencyInputPrefix,
  CurrencyInputRoot,
} from "@/registry/sabk/currency-input/currency-input"

export default function CurrencyInputDemo() {
  const [single, setSingle] = React.useState<number | null>(1499.5)
  const [compound, setCompound] = React.useState<number | null>(12480)

  return (
    <div className="grid w-full max-w-md gap-8">
      <div className="grid gap-2">
        <Label htmlFor="cur-single">Single-prop API · USD</Label>
        <CurrencyInput
          id="cur-single"
          value={single}
          onValueChange={setSingle}
          currency="USD"
          locale="en-US"
          decimals={2}
        />
        <p className="font-mono text-[11px] text-muted-foreground">
          parsed: {single === null ? "null" : single}
        </p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="cur-compound">Compound API · EUR (de-DE)</Label>
        <CurrencyInputRoot
          id="cur-compound"
          value={compound}
          onValueChange={setCompound}
          currency="EUR"
          locale="de-DE"
          decimals={2}
        >
          <CurrencyInputGroup>
            <CurrencyInputPrefix />
            <CurrencyInputField placeholder="0,00" />
          </CurrencyInputGroup>
        </CurrencyInputRoot>
        <p className="font-mono text-[11px] text-muted-foreground">
          parsed: {compound === null ? "null" : compound}
        </p>
      </div>
    </div>
  )
}
