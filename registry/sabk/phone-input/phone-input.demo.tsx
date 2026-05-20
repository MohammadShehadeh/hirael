"use client"

import * as React from "react"

import { Label } from "@/registry/sabk/ui/label"
import {
  PhoneInput,
  PhoneInputCountrySelect,
  PhoneInputField,
  PhoneInputGroup,
  PhoneInputRoot,
} from "@/registry/sabk/phone-input/phone-input"

export default function PhoneInputDemo() {
  const [single, setSingle] = React.useState("")
  const [compound, setCompound] = React.useState("+442071838750")

  return (
    <div className="grid w-full max-w-md gap-8">
      <div className="grid gap-2">
        <Label htmlFor="ph-single">Single-prop API · default US</Label>
        <PhoneInput
          id="ph-single"
          value={single}
          onValueChange={setSingle}
          defaultCountry="US"
        />
        <p className="font-mono text-[11px] text-muted-foreground">
          E.164: {single || "—"}
        </p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="ph-compound">Compound API · pre-filled UK number</Label>
        <PhoneInputRoot
          id="ph-compound"
          value={compound}
          onValueChange={setCompound}
          defaultCountry="GB"
        >
          <PhoneInputGroup>
            <PhoneInputCountrySelect />
            <PhoneInputField />
          </PhoneInputGroup>
        </PhoneInputRoot>
        <p className="font-mono text-[11px] text-muted-foreground">
          E.164: {compound || "—"}
        </p>
      </div>
    </div>
  )
}
