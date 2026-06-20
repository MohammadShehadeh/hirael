import { Accent, Band, Lead, Reveal, type Lang } from "./primitives";

const COPY = {
  en: {
    label: "How it works",
    note: "A survey, an install, and a controller that does the rest.",
    title: "From sunlight to",
    accent: "zero bills.",
    steps: [
      {
        title: "Free home survey",
        body: "We map your roof, sun hours, and usage, then size the system — no cost, no pressure.",
      },
      {
        title: "We install everything",
        body: "Panels, battery, and the smart controller, fitted by our own crew in a day or two.",
      },
      {
        title: "Sun by day, battery by night",
        body: "The controller runs your home on sunlight, stores the rest, and switches to battery after dark.",
      },
      {
        title: "$0 bills for 7 years",
        body: "You pay one fixed monthly plan. Your electricity bill stays at zero, guaranteed.",
      },
    ],
  },
  ar: {
    label: "كيف يعمل",
    note: "مسح، تركيب، ووحدة تحكّم تتولّى الباقي.",
    title: "من ضوء الشمس إلى",
    accent: "صفر فواتير.",
    steps: [
      {
        title: "مسح مجاني للمنزل",
        body: "نقيس سطحك وساعات الشمس واستهلاكك، ثم نحدّد حجم النظام — بلا تكلفة وبلا ضغط.",
      },
      {
        title: "نركّب كل شيء",
        body: "الألواح والبطارية ووحدة التحكّم الذكية، يركّبها فريقنا خلال يوم أو يومين.",
      },
      {
        title: "الشمس نهاراً والبطارية ليلاً",
        body: "تُشغّل الوحدة منزلك بالشمس، وتخزّن الفائض، وتتحوّل إلى البطارية بعد الغروب.",
      },
      {
        title: "صفر فواتير لسبع سنوات",
        body: "تدفع خطة شهرية ثابتة واحدة، وتبقى فاتورة كهربائك عند الصفر، مضمونة.",
      },
    ],
  },
} satisfies Record<Lang, unknown>;

export function HowItWorks({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  return (
    <Band
      id="how-it-works"
      index="01"
      label={c.label}
      note={c.note}
      lang={lang}
    >
      <Reveal>
        <Lead lang={lang}>
          {c.title} <Accent>{c.accent}</Accent>
        </Lead>
      </Reveal>

      <ol className="mt-12">
        {c.steps.map((step, i) => (
          <Reveal key={step.title} delay={i * 0.05}>
            <li className="grid grid-cols-[2.5rem_1fr] gap-5 border-t border-border py-7 sm:grid-cols-[4rem_1fr]">
              <span className="font-mono text-sm text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-lg font-medium text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </div>
            </li>
          </Reveal>
        ))}
      </ol>
    </Band>
  );
}
