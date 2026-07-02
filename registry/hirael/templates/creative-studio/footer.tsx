"use client";

import { ArrowUpRight } from "lucide-react";

import { NoiseOverlay, WordsPullUpMultiStyle } from "./primitives";

const HEADLINE = [
  { text: "Let us make", className: "font-normal" },
  {
    text: "something rare.",
    className: "italic [font-family:var(--font-instrument-serif)]",
  },
];

const LINK_COLUMNS = [
  {
    heading: "Studio",
    links: ["Our story", "Collective", "Workshops", "Programs"],
  },
  {
    heading: "Connect",
    links: ["Inquiries", "Instagram", "Vimeo", "LinkedIn"],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-black pb-8 pt-20 sm:pt-28 md:pt-32">
      <NoiseOverlay variant="bg" className="opacity-[0.12]" />

      <div className="relative container">
        <div className="flex flex-col gap-8 border-b border-white/10 pb-12 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-5">
            <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-(--cs-ink) sm:text-xs">
              Creative studio
            </span>
            <h2 className="max-w-xl text-4xl leading-[0.95] tracking-[-0.02em] text-(--cs-cream) sm:text-5xl sm:leading-[0.9] md:text-6xl">
              <WordsPullUpMultiStyle
                segments={HEADLINE}
                className="justify-start"
              />
            </h2>
          </div>

          <a
            href="#"
            className="group inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-(--cs-ink) py-1.5 pe-1.5 ps-5 text-sm font-medium text-black transition-all duration-300 hover:gap-3 sm:text-base"
          >
            Start a project
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black transition-transform duration-300 group-hover:scale-110 sm:h-10 sm:w-10">
              <ArrowUpRight className="h-4 w-4 text-(--cs-cream) rtl:-scale-x-100" />
            </span>
          </a>
        </div>

        <nav className="grid grid-cols-2 gap-x-6 gap-y-10 py-12 sm:grid-cols-4">
          {LINK_COLUMNS.map((col) => (
            <div key={col.heading} className="flex flex-col gap-3">
              <h3 className="text-[10px] font-medium uppercase tracking-[0.2em] text-(--cs-muted)">
                {col.heading}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-(--cs-cream)/70 transition-colors hover:text-(--cs-cream)"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="col-span-2 flex flex-col gap-3 sm:col-span-2">
            <h3 className="text-[10px] font-medium uppercase tracking-[0.2em] text-(--cs-muted)">
              Visit
            </h3>
            <p className="text-sm leading-relaxed text-(--cs-cream)/70">
              Berlin, Paris and worldwide.
              <br />
              hello@hirael.studio
            </p>
          </div>
        </nav>

        <div
          aria-hidden
          className="pointer-events-none select-none border-t border-white/10 pt-8"
        >
          <p className="text-[22vw] font-medium leading-[0.8] tracking-[-0.06em] text-(--cs-cream)/10">
            Hirael
          </p>
        </div>

        <div className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-(--cs-muted)">
            © 2026 Hirael. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <a
              href="#"
              className="text-xs text-(--cs-muted) transition-colors hover:text-(--cs-cream)"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-xs text-(--cs-muted) transition-colors hover:text-(--cs-cream)"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
