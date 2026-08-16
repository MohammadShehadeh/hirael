import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

import { EASE, HiraelMark, OrangeButton } from "./primitives";

const LINK_COLUMNS = [
  {
    heading: "Studio",
    links: ["About", "Team", "Careers", "Journal"],
  },
  {
    heading: "Work",
    links: ["Projects", "Case studies", "Services", "Process"],
  },
  {
    heading: "Connect",
    links: ["Start a project", "Book a call", "Instagram", "LinkedIn"],
  },
];

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="flex flex-col gap-8 border-b border-white/10 pb-12 sm:pb-16 lg:flex-row lg:items-end lg:justify-between lg:pb-20">
          <div className="max-w-2xl">
            <div className="mb-5 flex items-center gap-3 sm:mb-8">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-gray-900 sm:h-7 sm:w-7">
                <HiraelMark className="h-3.5 w-3 sm:h-4 sm:w-3.5" />
              </span>
              <span className="rounded-full border border-white/15 px-3 py-1 text-[12px] font-medium text-white sm:px-4 sm:py-1.5 sm:text-[13px]">
                Work with us
              </span>
            </div>
            <h2 className="text-[clamp(1.75rem,7vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.03em] sm:text-[clamp(2.5rem,5vw,4.2rem)]">
              Ready to dominate
              <br className="hidden sm:block" />
              your category?
            </h2>
          </div>

          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center lg:flex-col lg:items-end">
            <OrangeButton label="Start a project" />
            <a
              href="mailto:hello@hirael.studio"
              className="text-[14px] text-gray-400 transition-colors duration-300 hover:text-white"
            >
              hello@hirael.studio
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-12 sm:py-16 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:py-20">
          <div className="col-span-2 flex flex-col gap-5 lg:col-span-1">
            <a
              href="#"
              aria-label="Hirael home"
              className="flex items-center gap-2"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-900 sm:h-10 sm:w-10">
                <HiraelMark className="h-5 w-4 sm:h-6 sm:w-5" />
              </span>
              <span className="text-[15px] font-semibold tracking-tight sm:text-[16px]">
                Hirael
              </span>
            </a>
            <p className="max-w-xs text-[14px] leading-[1.6] text-gray-400">
              A strategy-led studio crafting digital experiences for growing
              brands.
            </p>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-[13px] text-gray-300">
              <span className="flex h-2 w-2 rounded-full bg-[#F26522]" />
              Taking on projects for Q1 2026
            </span>
          </div>

          {LINK_COLUMNS.map((col) => (
            <nav key={col.heading} className="flex flex-col gap-3.5">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                {col.heading}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="group inline-flex items-center gap-1 text-[14px] text-gray-400 transition-colors duration-300 hover:text-white"
                    >
                      {link}
                      <ArrowUpRight
                        size={13}
                        className={cn(
                          "opacity-0 transition-opacity duration-300 group-hover:opacity-100 rtl:-scale-x-100",
                          EASE,
                        )}
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div
          aria-hidden
          className="pointer-events-none select-none overflow-hidden border-t border-white/10 pt-10 sm:pt-12"
        >
          <span className="block text-[18vw] font-medium leading-[0.8] tracking-[-0.05em] text-white/[0.06]">
            Hirael
          </span>
        </div>

        <div className="flex flex-col gap-4 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-gray-500">
            © 2026 Hirael Studio. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a
              href="#"
              className="text-[13px] text-gray-500 transition-colors duration-300 hover:text-white"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-[13px] text-gray-500 transition-colors duration-300 hover:text-white"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
