"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import { About } from "./about";
import { Careers } from "./careers";
import { Cases } from "./cases";
import { Customers } from "./customers";
import { Footer } from "./footer";
import { Hero } from "./hero";
import { HowItWorks } from "./how-it-works";
import { type Lang, useDocumentRtl } from "./primitives";
import { Resources } from "./resources";

export default function Aswar() {
  const [langOverride, setLangOverride] = React.useState<Lang | null>(null);
  const docIsRtl = useDocumentRtl();
  const lang: Lang = langOverride ?? (docIsRtl ? "ar" : "en");

  return (
    <div
      dir={lang === "ar" ? "rtl" : "ltr"}
      lang={lang}
      className={cn(
        "flex flex-col bg-background text-foreground",
        lang === "ar" && "font-arabic",
      )}
    >
      <Hero lang={lang} setLang={setLangOverride} />
      <HowItWorks lang={lang} />
      <Cases lang={lang} />
      <About lang={lang} />
      <Careers lang={lang} />
      <Resources lang={lang} />
      <Customers lang={lang} />
      <Footer lang={lang} />
    </div>
  );
}
