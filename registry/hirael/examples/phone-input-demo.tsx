"use client";

import * as React from "react";

import { useT } from "@/lib/demo-locale";
import { Label } from "@/registry/hirael/ui/label";
import {
  PhoneInput,
  PhoneInputCountrySelect,
  PhoneInputField,
} from "@/registry/hirael/ui/phone-input";

export default function PhoneInputDemo() {
  const t = useT();

  const [basic, setBasic] = React.useState("");
  const [composed, setComposed] = React.useState("+442071838750");

  return (
    <div className="grid w-full max-w-md gap-8">
      <div className="grid gap-2">
        <Label htmlFor="ph-basic">
          {t({
            en: "Phone · default US",
            ar: "الهاتف · الولايات المتحدة افتراضيًا",
          })}
        </Label>
        <PhoneInput
          id="ph-basic"
          value={basic}
          onValueChange={setBasic}
          defaultCountry="US"
        >
          <PhoneInputCountrySelect />
          <PhoneInputField
            placeholder={t({ en: "Phone number", ar: "رقم الهاتف" })}
          />
        </PhoneInput>
        <p className="font-mono text-[11px] text-muted-foreground">
          E.164: {basic || "-"}
        </p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="ph-composed">
          {t({
            en: "Phone · pre-filled UK number",
            ar: "الهاتف · رقم بريطاني مُعبّأ مسبقًا",
          })}
        </Label>
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
          E.164: {composed || "-"}
        </p>
      </div>
    </div>
  );
}
