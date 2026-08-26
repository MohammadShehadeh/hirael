"use client";

import { ChevronRight } from "lucide-react";

import { PillButton, RivrMark } from "./primitives";

const NAV_ITEMS: { label: string; hasDropdown?: boolean }[] = [
  { label: "Ecosystem" },
  { label: "Economics", hasDropdown: true },
  { label: "Developers" },
  { label: "Governance" },
];

export const Navbar = () => {
  return (
    <nav
      data-slot="rivr-nav"
      className="relative z-20 flex w-full items-center justify-between gap-4 px-5 py-5 md:px-8"
    >
      <a
        href="#home"
        className="flex items-center gap-2 text-foreground"
        aria-label="RIVR home"
      >
        <RivrMark className="size-6" />
        <span className="text-lg font-semibold tracking-tight">RIVR</span>
      </a>

      <ul className="hidden items-center gap-8 text-sm text-foreground/80 lg:flex">
        {NAV_ITEMS.map((item) => (
          <li
            key={item.label}
            className="group flex cursor-pointer items-center gap-1 transition-colors hover:text-foreground"
          >
            {item.label}
            {item.hasDropdown && (
              <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
            )}
          </li>
        ))}
      </ul>

      <PillButton label="Book Demo" />
    </nav>
  );
};
