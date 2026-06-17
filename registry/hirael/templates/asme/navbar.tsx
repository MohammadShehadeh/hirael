"use client";

import { Globe } from "lucide-react";

const NAV_LINKS = ["Features", "Pricing", "About"];

export function Navbar() {
  return (
    <header className="relative z-20 px-6 py-6">
      <nav className="liquid-glass mx-auto flex max-w-5xl items-center justify-between rounded-full px-6 py-3">
        <div className="flex items-center">
          <a
            href="#"
            aria-label="Asme home"
            className="flex items-center gap-2.5"
          >
            <Globe size={24} className="text-foreground" />
            <span className="text-lg font-semibold text-foreground">Asme</span>
          </a>

          <div className="ms-8 hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
              >
                {link}
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button type="button" className="text-sm font-medium text-foreground">
            Sign Up
          </button>
          <button
            type="button"
            className="liquid-glass rounded-full px-6 py-2 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5"
          >
            Login
          </button>
        </div>
      </nav>
    </header>
  );
}
