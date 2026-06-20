import { ArrowUpRight } from "lucide-react";

import { Band, Lead, Reveal, type Lang } from "./primitives";

const COPY = {
  en: {
    label: "About us",
    note: "A solar company built in Iraq, for Iraqi homes.",
    statement: "We build homes that outlast the grid.",
    body: "Aswar Dar Al-Iraq designs, installs, and stands behind every system — so a power cut becomes just weather, not a problem. No generators, no fuel runs, no surprise bills.",
    cta: "Talk to us",
    stats: [
      { value: "400+", label: "Homes powered" },
      { value: "3.2 MWp", label: "Installed" },
      { value: "9", label: "Governorates" },
      { value: "7 yrs", label: "Zero-bill cover" },
    ],
  },
  ar: {
    label: "من نحن",
    note: "شركة طاقة شمسية صُنعت في العراق، للبيوت العراقية.",
    statement: "نبني منازل تتجاوز الشبكة.",
    body: "اسوار دار العراق تصمّم وتنفّذ وتقف خلف كل نظام — لتصبح انقطاعة الكهرباء مجرّد طقس، لا مشكلة. بلا مولّدات، بلا وقود، بلا فواتير مفاجئة.",
    cta: "تحدّث إلينا",
    stats: [
      { value: "+٤٠٠", label: "منزل يعمل بالطاقة" },
      { value: "٣٫٢ ميغاواط", label: "قدرة مركّبة" },
      { value: "٩", label: "محافظات" },
      { value: "٧ سنوات", label: "ضمان صفر فاتورة" },
    ],
  },
} satisfies Record<Lang, unknown>;

export function About({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  return (
    <Band id="about" index="03" label={c.label} note={c.note} lang={lang}>
      <Reveal>
        <Lead lang={lang}>{c.statement}</Lead>
      </Reveal>
      <Reveal delay={0.06}>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
          {c.body}
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <a
          href="#"
          className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground"
        >
          {c.cta}
          <ArrowUpRight className="size-4 text-muted-foreground transition-colors group-hover:text-foreground rtl:-scale-x-100" />
        </a>
      </Reveal>

      <Reveal delay={0.12}>
        <dl className="mt-14 grid grid-cols-2 gap-px overflow-hidden border border-border bg-border sm:grid-cols-4">
          {c.stats.map((stat) => (
            <div key={stat.label} className="bg-background p-5">
              <dt className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
                {stat.value}
              </dt>
              <dd className="mt-1 text-xs text-muted-foreground">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </Band>
  );
}
