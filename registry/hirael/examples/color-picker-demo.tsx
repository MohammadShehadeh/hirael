"use client";

import * as React from "react";

import { useT } from "@/lib/demo-locale";
import { Label } from "@/registry/hirael/ui/label";
import {
  ColorPicker,
  ColorPickerContent,
  ColorPickerTrigger,
} from "@/registry/hirael/ui/color-picker";

export default function ColorPickerDemo() {
  const t = useT();
  const [accent, setAccent] = React.useState<string>("#0ea5e9");
  const [brand, setBrand] = React.useState<string>("#a855f7");

  return (
    <div className="grid w-full max-w-md grid-cols-1 gap-8 sm:grid-cols-2">
      <div className="grid gap-2">
        <Label>{t({ en: "Accent color", ar: "لون التمييز" })}</Label>
        <ColorPicker value={accent} onValueChange={setAccent}>
          <ColorPickerTrigger />
          <ColorPickerContent />
        </ColorPicker>
        <p className="font-mono text-[10px] tracking-[0.08em] text-muted-foreground uppercase">
          {accent}
        </p>
      </div>

      <div className="grid gap-2">
        <Label>
          {t({
            en: "Brand color · custom swatches",
            ar: "لون العلامة · عيّنات مخصصة",
          })}
        </Label>
        <ColorPicker
          value={brand}
          onValueChange={setBrand}
          swatches={[
            "#a855f7",
            "#6366f1",
            "#0ea5e9",
            "#10b981",
            "#facc15",
            "#f97316",
            "#ef4444",
            "#1f2937",
          ]}
        >
          <ColorPickerTrigger />
          <ColorPickerContent />
        </ColorPicker>
        <p className="font-mono text-[10px] tracking-[0.08em] text-muted-foreground uppercase">
          {brand}
        </p>
      </div>
    </div>
  );
}
