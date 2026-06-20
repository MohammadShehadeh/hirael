import { Accent, Band, Lead, Reveal, type Lang } from "./primitives";

const COPY = {
  en: {
    label: "Customers",
    note: "What owners say after a season.",
    title: "Trusted across",
    accent: "Iraqi homes.",
    quote:
      "Our generator hasn't run since spring. The app shows zero every month — I stopped checking.",
    author: "Um Yousif",
    location: "Baghdad",
    proof: [
      { value: "4.9/5", label: "Owner rating" },
      { value: "98%", label: "Would recommend" },
      { value: "24/7", label: "Monitoring" },
      { value: "5 yr", label: "Workmanship" },
    ],
  },
  ar: {
    label: "العملاء",
    note: "ما يقوله المالكون بعد فصل كامل.",
    title: "موثوقون في",
    accent: "البيوت العراقية.",
    quote:
      "لم يعمل مولّدنا منذ الربيع. التطبيق يُظهر صفراً كل شهر — توقّفت عن المتابعة.",
    author: "أم يوسف",
    location: "بغداد",
    proof: [
      { value: "٤٫٩/٥", label: "تقييم المالكين" },
      { value: "٩٨٪", label: "يوصون بنا" },
      { value: "٢٤/٧", label: "مراقبة" },
      { value: "٥ سنوات", label: "ضمان التركيب" },
    ],
  },
} satisfies Record<Lang, unknown>;

export function Customers({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  return (
    <Band id="customers" index="06" label={c.label} note={c.note} lang={lang}>
      <Reveal>
        <Lead lang={lang}>
          {c.title} <Accent>{c.accent}</Accent>
        </Lead>
      </Reveal>

      <Reveal delay={0.06}>
        <figure className="mt-12 border-t border-border pt-10">
          <blockquote>
            <p className="max-w-xl text-balance text-2xl font-medium leading-snug text-foreground sm:text-3xl">
              {c.quote}
            </p>
          </blockquote>
          <figcaption className="mt-6 text-sm text-muted-foreground">
            <span className="text-foreground">{c.author}</span>
            {" · "}
            {c.location}
          </figcaption>
        </figure>
      </Reveal>

      <Reveal delay={0.1}>
        <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden border border-border bg-border sm:grid-cols-4">
          {c.proof.map((item) => (
            <div key={item.label} className="bg-background p-5">
              <dt className="text-xl font-medium tracking-tight text-foreground sm:text-2xl">
                {item.value}
              </dt>
              <dd className="mt-1 text-xs text-muted-foreground">
                {item.label}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </Band>
  );
}
