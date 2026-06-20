import Image from "next/image";

import { Accent, Band, Lead, Reveal, type Lang } from "./primitives";

const IMG = {
  morning:
    "https://res.cloudinary.com/dsdhxhhqh/image/upload/v1778837456/hf_20260515_092045_b654224c-4741-458f-8596-fa5bfeffabbc_1_oyfhme.jpg",
  night:
    "https://res.cloudinary.com/dsdhxhhqh/image/upload/v1778837447/hf_20260515_092102_24e30358-d694-4b70-8a56-a4f0887cf8ae_1_ry5dvs.jpg",
};

const COPY = {
  en: {
    label: "Our cases",
    note: "Real homes, real systems, bills at zero.",
    title: "Homes already running on",
    accent: "their own roof.",
    cases: [
      {
        image: IMG.morning,
        title: "Family villa, Karrada",
        meta: "Baghdad · 8.5 kWp · 22 kWh",
        alt: "A villa in Baghdad powered by rooftop solar",
      },
      {
        image: IMG.night,
        title: "Two-floor home, Al-Jazair",
        meta: "Basra · 6 kWp · 15 kWh",
        alt: "A two-floor home in Basra running on solar at night",
      },
    ],
    statement: "400+ homes. 9 governorates. One bill: zero.",
  },
  ar: {
    label: "حالاتنا",
    note: "منازل حقيقية، أنظمة حقيقية، فواتير عند الصفر.",
    title: "منازل تعمل بالفعل على",
    accent: "سطحها الخاص.",
    cases: [
      {
        image: IMG.morning,
        title: "فيلا عائلية، الكرّادة",
        meta: "بغداد · ٨٫٥ كيلوواط · ٢٢ ك.و.س",
        alt: "فيلا في بغداد تعمل بالطاقة الشمسية على السطح",
      },
      {
        image: IMG.night,
        title: "منزل من طابقين، الجزائر",
        meta: "البصرة · ٦ كيلوواط · ١٥ ك.و.س",
        alt: "منزل من طابقين في البصرة يعمل بالطاقة الشمسية ليلاً",
      },
    ],
    statement: "+٤٠٠ منزل. ٩ محافظات. فاتورة واحدة: صفر.",
  },
} satisfies Record<Lang, unknown>;

export function Cases({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  return (
    <Band id="cases" index="02" label={c.label} note={c.note} lang={lang}>
      <Reveal>
        <Lead lang={lang}>
          {c.title} <Accent>{c.accent}</Accent>
        </Lead>
      </Reveal>

      <div className="mt-12 space-y-10">
        {c.cases.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.05}>
            <figure>
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1024px) 44rem, 90vw"
                  className="object-cover object-[center_40%]"
                />
              </div>
              <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span className="text-base font-medium text-foreground">
                  {item.title}
                </span>
                <span className="text-sm text-muted-foreground">
                  {item.meta}
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <p className="mt-14 border-t border-border pt-10 text-2xl font-medium leading-snug text-foreground sm:text-3xl">
          {c.statement}
        </p>
      </Reveal>
    </Band>
  );
}
