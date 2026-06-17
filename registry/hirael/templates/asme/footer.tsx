"use client";

import { Globe } from "lucide-react";

import { InstagramIcon, Serif, TwitterIcon } from "./primitives";

const FOOTER_COLUMNS = [
  {
    heading: "Product",
    links: ["Features", "Pricing", "Manifesto", "Changelog"],
  },
  {
    heading: "Company",
    links: ["About", "Careers", "Contact"],
  },
  {
    heading: "Resources",
    links: ["Newsletter", "Privacy", "Terms"],
  },
];

const SOCIAL_LINKS: {
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}[] = [
  { label: "Instagram", Icon: InstagramIcon },
  { label: "Twitter", Icon: TwitterIcon },
  { label: "Website", Icon: Globe },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-foreground/10 bg-background px-6 pb-12 pt-20 md:pt-28">
      <div aria-hidden className="glow-top absolute inset-0" />

      <div className="relative mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-12 md:flex-row">
          <div className="max-w-sm">
            <a
              href="#"
              aria-label="Asme home"
              className="flex items-center gap-2.5"
            >
              <Globe size={24} className="text-foreground" />
              <span className="text-lg font-semibold text-foreground">
                Asme
              </span>
            </a>
            <p className="mt-5 text-sm leading-relaxed text-foreground/50">
              Know it <Serif className="text-foreground/70">all</Serif>. The
              latest news and insights, delivered to your inbox.
            </p>
            <div className="mt-7 flex gap-3">
              {SOCIAL_LINKS.map(({ label, Icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="liquid-glass rounded-full p-3 text-foreground/80 transition-all hover:bg-foreground/5 hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:gap-16">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.heading}>
                <p className="mb-4 text-xs uppercase tracking-widest text-foreground/40">
                  {column.heading}
                </p>
                <ul className="space-y-3">
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

        <p
          aria-hidden
          className="mt-16 select-none text-center leading-none tracking-tight text-foreground/5 [font-family:var(--font-asme-serif)] text-[20vw] md:mt-20 md:text-[15vw]"
        >
          Asme
        </p>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-foreground/10 pt-8 sm:flex-row">
          <p className="text-xs text-foreground/40">
            &copy; 2026 Asme. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-xs text-foreground/40 transition-colors hover:text-foreground"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-xs text-foreground/40 transition-colors hover:text-foreground"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-xs text-foreground/40 transition-colors hover:text-foreground"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
