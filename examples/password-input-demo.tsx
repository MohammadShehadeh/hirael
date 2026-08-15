"use client";

import * as React from "react";

import { useT } from "@/lib/demo-locale";
import { Label } from "@/registry/hirael/ui/label";
import {
  PasswordInput,
  PasswordInputField,
  PasswordInputStrength,
} from "@/registry/hirael/components/password-input";

export default function PasswordInputDemo() {
  const t = useT();

  const [basic, setBasic] = React.useState("");
  const [composed, setComposed] = React.useState("hunter2");

  return (
    <div className="grid w-full max-w-md gap-8">
      <div className="grid gap-2">
        <Label htmlFor="pw-basic">
          {t({
            en: "Password · with strength meter",
            ar: "كلمة المرور · مع مقياس القوة",
          })}
        </Label>
        <PasswordInput id="pw-basic" value={basic} onValueChange={setBasic}>
          <PasswordInputField
            placeholder={t({ en: "Pick a strong one", ar: "اختر كلمة قوية" })}
          />
          <PasswordInputStrength />
        </PasswordInput>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="pw-composed">
          {t({
            en: "Password · custom strength hint",
            ar: "كلمة المرور · تلميح قوة مخصص",
          })}
        </Label>
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
      </div>
    </div>
  );
}
