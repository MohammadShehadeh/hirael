"use client"

import * as React from "react"

import { Label } from "@/registry/sabk/ui/label"
import {
  PhoneInput,
  PhoneInputCountrySelect,
  PhoneInputField,
} from "@/registry/sabk/phone-input/phone-input"

export default function PhoneInputDemo() {
  const [basic, setBasic] = React.useState("")
  const [composed, setComposed] = React.useState("+442071838750")

  return (
    <div className="grid w-full max-w-md gap-8">
      {/* Basic */}
      <div className="grid gap-2">
        <Label htmlFor="ph-basic">Phone · default US</Label>
        <PhoneInput
          id="ph-basic"
          value={basic}
          onValueChange={setBasic}
          defaultCountry="US"
        >
          <PhoneInputCountrySelect />
          <PhoneInputField />
        </PhoneInput>
        <p className="font-mono text-[11px] text-muted-foreground">
          E.164: {basic || "—"}
        </p>
      </div>

      {/* Composed */}
      <div className="grid gap-2">
        <Label htmlFor="ph-composed">Phone · pre-filled UK number</Label>
        <PhoneInput
          id="ph-composed"
          value={composed}
          onValueChange={setComposed}
          defaultCountry="GB"
        >
          <PhoneInputCountrySelect />
          <PhoneInputField placeholder="20 7183 8750" />
        </PhoneInput>
        <p className="font-mono text-[11px] text-muted-foreground">
          E.164: {composed || "—"}
        </p>
      </div>
    </div>
  )
}
