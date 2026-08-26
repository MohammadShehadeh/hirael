"use client";

import * as React from "react";

import { useT } from "@/lib/demo-locale";
import { Field, FieldGroup, FieldLabel } from "@/registry/hirael/ui/field";
import {
  PasswordInput,
  PasswordInputField,
  PasswordInputStrength,
} from "@/registry/hirael/components/password-input";

const PasswordInputDemo = () => {
  const t = useT();

  const [basic, setBasic] = React.useState("");
  const [composed, setComposed] = React.useState("hunter2");

  return (
    <FieldGroup className="max-w-md gap-8">
      <Field className="gap-2">
        <FieldLabel htmlFor="pw-basic">
          {t({
            en: "Password · with strength meter",
            ar: "كلمة المرور · مع مقياس القوة",
          })}
        </FieldLabel>
        <PasswordInput id="pw-basic" value={basic} onValueChange={setBasic}>
          <PasswordInputField
            placeholder={t({ en: "Pick a strong one", ar: "اختر كلمة قوية" })}
          />
          <PasswordInputStrength />
        </PasswordInput>
      </Field>

      <Field className="gap-2">
        <FieldLabel htmlFor="pw-composed">
          {t({
            en: "Password · custom strength hint",
            ar: "كلمة المرور · تلميح قوة مخصص",
          })}
        </FieldLabel>
        <PasswordInput
          id="pw-composed"
          value={composed}
          onValueChange={setComposed}
        >
          <PasswordInputField
            placeholder={t({
              en: "Type to see strength",
              ar: "اكتب لرؤية القوة",
            })}
          />
          <PasswordInputStrength
            renderMeta={(s) => (
              <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
                {t({ en: "score", ar: "النتيجة" })} {s.score} / 4 · {s.label}
              </p>
            )}
          />
        </PasswordInput>
      </Field>
    </FieldGroup>
  );
};

export default PasswordInputDemo;
