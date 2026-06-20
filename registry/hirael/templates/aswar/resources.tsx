import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

import { Accent, Band, Lead, Reveal, type Lang } from "./primitives";

const COPY = {
  en: {
    label: "Resources",
    note: "Plain guides, before you commit.",
    title: "Know the system before",
    accent: "you switch.",
    items: [
      {
        tag: "Guide",
        title: "How solar performs in Iraq's heat",
        meta: "6 min",
      },
      {
        tag: "Guide",
        title: "Sizing a battery for nightly use",
        meta: "4 min",
      },
      { tag: "FAQ", title: "What the 7-year guarantee covers", meta: "3 min" },
    ],
  },
  ar: {
    label: "المصادر",
    note: "أدلّة واضحة قبل أن تقرّر.",
    title: "افهم النظام قبل",
    accent: "أن تنتقل.",
    items: [
      {
        tag: "دليل",
        title: "كيف تؤدّي الطاقة الشمسية في حرّ العراق",
        meta: "٦ دقائق",
      },
      {
        tag: "دليل",
        title: "اختيار حجم البطارية للاستخدام الليلي",
        meta: "٤ دقائق",
      },
      {
        tag: "شائع",
        title: "ما الذي يغطّيه ضمان السبع سنوات",
        meta: "٣ دقائق",
      },
    ],
  },
} satisfies Record<Lang, unknown>;

export function Resources({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  return (
    <Band id="resources" index="05" label={c.label} note={c.note} lang={lang}>
      <Reveal>
        <Lead lang={lang}>
          {c.title} <Accent>{c.accent}</Accent>
        </Lead>
      </Reveal>

      <ul className="mt-12">
        {c.items.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.04}>
            <li>
              <a
                href="#"
                className="group grid grid-cols-[3.5rem_1fr_auto] items-baseline gap-4 border-t border-border py-5"
              >
                <span
                  className={cn(
                    "text-xs text-muted-foreground",
                    lang === "en" && "font-mono uppercase tracking-wider",
                  )}
                >
                  {item.tag}
                </span>
                <span className="text-base font-medium text-foreground sm:text-lg">
                  {item.title}
                </span>
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  {item.meta}
                  <ArrowUpRight className="size-4 transition-colors group-hover:text-foreground rtl:-scale-x-100" />
                </span>
              </a>
            </li>
          </Reveal>
        ))}
      </ul>
    </Band>
  );
}
