"use client"

import * as React from "react"
import { Menu, Search, X } from "lucide-react"

import { cn } from "@/lib/utils"

import { ContactButton, Logo, useScrolled } from "./primitives"

const NAV_LINKS = [
  { label: "What We Build", href: "#build" },
  { label: "Our Method", href: "#method" },
  { label: "Who We Are", href: "#about" },
  { label: "Thinking", href: "#thinking" },
]

export function Navbar() {
  const scrolled = useScrolled(20)
  const [open, setOpen] = React.useState(false)

  return (
    <header
      data-slot="navbar"
      className="fixed inset-x-0 top-4 z-50 flex justify-center ps-4 pe-1.5"
    >
      <nav
        className={cn(
          "w-full rounded-2xl bg-white shadow-lg transition-all duration-500 ease-in-out",
          scrolled ? "max-w-3xl" : "max-w-6xl"
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between gap-6 py-1.5 transition-all duration-500 ease-in-out",
            scrolled ? "ps-4 pe-2" : "ps-5 pe-2"
          )}
        >
          <a href="#home" className="flex items-center gap-2">
            <Logo />
            <span
              className="font-medium text-[var(--nexa-navy)]"
              style={{ fontSize: 22, letterSpacing: "-0.02em" }}
            >
              NexaCore
            </span>
          </a>

          <div
            className={cn(
              "hidden items-center md:flex",
              scrolled ? "gap-0" : "gap-1"
            )}
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={cn(
                  "rounded-xl text-sm text-[var(--nexa-navy)] transition-all duration-500 hover:bg-foreground/5",
                  scrolled ? "px-2 py-1.5" : "px-4 py-2"
                )}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Search"
              className="flex h-10 w-10 items-center justify-center rounded-xl text-[var(--nexa-navy)] transition-colors hover:bg-foreground/5"
            >
              <Search size={20} />
            </button>
            <div className="hidden md:block">
              <ContactButton />
            </div>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-[var(--nexa-navy)] transition-colors hover:bg-foreground/5 md:hidden"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {open ? (
          <div className="flex flex-col items-center gap-1 border-t border-border px-4 pb-3 pt-2 md:hidden">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="w-full rounded-xl py-2 text-center text-sm text-[var(--nexa-navy)] transition-colors hover:bg-foreground/5"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-1 flex w-full items-center gap-2">
              <button
                type="button"
                aria-label="Search"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[var(--nexa-navy)] transition-colors hover:bg-foreground/5"
              >
                <Search size={20} />
              </button>
              <ContactButton className="flex-1" />
            </div>
          </div>
        ) : null}
      </nav>
    </header>
  )
}
