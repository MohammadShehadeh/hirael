import { ArrowUpRight } from "lucide-react";

import { Accent, Band, Lead, Reveal, type Lang } from "./primitives";

const COPY = {
  en: {
    label: "Careers",
    note: "We're hiring across the country.",
    title: "Help us put the sun",
    accent: "on every roof.",
    roles: [
      { title: "Solar Installer", meta: "Baghdad · Full-time" },
      { title: "Field Engineer", meta: "Basra · Full-time" },
      { title: "Sales Consultant", meta: "Erbil · Full-time" },
      { title: "Customer Support", meta: "Remote · Full-time" },
    ],
  },
  ar: {
    label: "الوظائف",
    note: "نوظّف في عموم البلاد.",
    title: "ساعدنا في وضع الشمس",
    accent: "على كل سطح.",
    roles: [
      { title: "فنّي تركيب شمسي", meta: "بغداد · دوام كامل" },
      { title: "مهندس ميداني", meta: "البصرة · دوام كامل" },
      { title: "مستشار مبيعات", meta: "أربيل · دوام كامل" },
      { title: "دعم العملاء", meta: "عن بُعد · دوام كامل" },
    ],
  },
} satisfies Record<Lang, unknown>;

export function Careers({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  return (
    <Band id="careers" index="04" label={c.label} note={c.note} lang={lang}>
      <Reveal>
        <Lead lang={lang}>
          {c.title} <Accent>{c.accent}</Accent>
        </Lead>
      </Reveal>

      <ul className="mt-12">
        {c.roles.map((role, i) => (
          <Reveal key={role.title} delay={i * 0.04}>
            <li>
              <a
                href="#"
                className="group flex items-center justify-between gap-4 border-t border-border py-5"
              >
                <div className="min-w-0">
                  <h3 className="text-base font-medium text-foreground transition-colors sm:text-lg">
                    {role.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                    {role.meta}
                  </p>
                </div>
                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground rtl:-scale-x-100" />
              </a>
            </li>
          </Reveal>
        ))}
      </ul>
    </Band>
  );
}
