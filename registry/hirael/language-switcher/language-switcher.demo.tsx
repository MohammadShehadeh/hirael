"use client";

import * as React from "react";

import { Label } from "@/registry/hirael/ui/label";
import {
  LanguageSwitcher,
  LanguageSwitcherContent,
  LanguageSwitcherTrigger,
  type Language,
} from "@/registry/hirael/ui/language-switcher";

const LANGUAGES: Language[] = [
  { value: "en", label: "English", nativeLabel: "English" },
  { value: "fr", label: "French", nativeLabel: "Français" },
  { value: "de", label: "German", nativeLabel: "Deutsch" },
  { value: "es", label: "Spanish", nativeLabel: "Español" },
  { value: "pt", label: "Portuguese", nativeLabel: "Português" },
  { value: "ja", label: "Japanese", nativeLabel: "日本語" },
  { value: "zh", label: "Chinese", nativeLabel: "中文" },
  { value: "ar", label: "Arabic", nativeLabel: "العربية" },
];

export default function LanguageSwitcherDemo() {
  const [locale, setLocale] = React.useState<string | undefined>("en");
  const [compact, setCompact] = React.useState<string | undefined>("fr");

  return (
    <div className="grid w-full max-w-xs gap-8">
      <div className="grid gap-2">
        <Label>Language</Label>
        <LanguageSwitcher
          languages={LANGUAGES}
          value={locale}
          onValueChange={setLocale}
        >
          <LanguageSwitcherTrigger />
          <LanguageSwitcherContent />
        </LanguageSwitcher>
      </div>

      <div className="grid gap-2">
        <Label>Compact (icon only)</Label>
        <LanguageSwitcher
          languages={LANGUAGES}
          value={compact}
          onValueChange={setCompact}
        >
          <LanguageSwitcherTrigger iconOnly />
          <LanguageSwitcherContent align="start" className="min-w-[12rem]" />
        </LanguageSwitcher>
      </div>
    </div>
  );
}
