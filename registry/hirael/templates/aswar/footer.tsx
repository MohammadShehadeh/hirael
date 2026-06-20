import type { Lang } from "./primitives";

const COPY = {
  en: {
    brandName: "Aswar Dar Al-Iraq",
    tagline: "Home solar with a $0-bill guarantee, built in Iraq.",
    columns: [
      {
        heading: "Company",
        links: ["About us", "Our cases", "Careers", "Customers"],
      },
      { heading: "Resources", links: ["Guides", "FAQ", "Warranty", "Support"] },
      {
        heading: "Contact",
        links: ["Get a quote", "WhatsApp", "Email us", "Baghdad office"],
      },
    ],
    rights: "All rights reserved.",
    note: "Solar energy · Iraq",
  },
  ar: {
    brandName: "اسوار دار العراق",
    tagline: "طاقة شمسية منزلية بضمان فاتورة صفر، صُنعت في العراق.",
    columns: [
      { heading: "الشركة", links: ["من نحن", "حالاتنا", "الوظائف", "العملاء"] },
      {
        heading: "المصادر",
        links: ["الأدلّة", "الأسئلة الشائعة", "الضمان", "الدعم"],
      },
      {
        heading: "تواصل",
        links: ["اطلب عرضاً", "واتساب", "راسلنا", "مكتب بغداد"],
      },
    ],
    rights: "جميع الحقوق محفوظة.",
    note: "طاقة شمسية · العراق",
  },
} satisfies Record<Lang, unknown>;

export function Footer({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background px-5 transition-colors duration-500 sm:px-8 md:px-12">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid gap-x-12 gap-y-10 py-16 lg:grid-cols-[14rem_1fr] lg:gap-x-16">
          <div>
            <span className="text-base font-medium tracking-tight text-foreground">
              {c.brandName}
            </span>
            <p className="mt-3 max-w-[14rem] text-sm leading-relaxed text-muted-foreground">
              {c.tagline}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
            {c.columns.map((column) => (
              <div key={column.heading}>
                <h3 className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  {column.heading}
                </h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-foreground/70 transition-colors hover:text-foreground"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-2 border-t border-border py-7 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>
            © {year} {c.brandName}. {c.rights}
          </p>
          <p>{c.note}</p>
        </div>
      </div>
    </footer>
  );
}
