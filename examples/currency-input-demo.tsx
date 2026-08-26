"use client";

import * as React from "react";

import { useT } from "@/lib/demo-locale";
import { Field, FieldGroup, FieldLabel } from "@/registry/hirael/ui/field";
import {
  CurrencyInput,
  CurrencyInputField,
  CurrencyInputPrefix,
} from "@/registry/hirael/components/currency-input";

const CurrencyInputDemo = () => {
  const t = useT();

  const [basic, setBasic] = React.useState<number | null>(1499.5);
  const [composed, setComposed] = React.useState<number | null>(12480);

  return (
    <FieldGroup className="max-w-md gap-8">
      <Field className="gap-2">
        <FieldLabel htmlFor="cur-basic">USD</FieldLabel>
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
          {t({ en: "parsed:", ar: "المُحلَّل:" })}{" "}
          {basic === null ? "null" : basic}
        </p>
      </Field>

      <Field className="gap-2">
        <FieldLabel htmlFor="cur-composed">EUR (de-DE)</FieldLabel>
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
          {t({ en: "parsed:", ar: "المُحلَّل:" })}{" "}
          {composed === null ? "null" : composed}
        </p>
      </Field>
    </FieldGroup>
  );
};

export default CurrencyInputDemo;
