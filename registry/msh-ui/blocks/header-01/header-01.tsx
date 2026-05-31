"use client"

import * as React from "react"
import { Menu, X } from "lucide-react"

import { Button } from "@/registry/msh-ui/ui/button"

const NAV = [
  { label: "Product", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Docs", href: "#" },
  { label: "Changelog", href: "#" },
] as const

function BrandMark({ className }: { className?: string }) {
  const uid = React.useId().replace(/:/g, "")
  const mId = `mshm-${uid}`
  const clipId = `mshc-${uid}`
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-10 25 290 290"
      role="img"
      aria-label="MSH UI"
      className={className}
    >
      <defs>
        <text
          id={mId}
          x="10"
          y="245"
          style={{
            fontFamily: "var(--font-fraunces), ui-serif, serif",
            fontWeight: 700,
            fontSize: "280px",
          }}
        >
          M
        </text>
        <clipPath id={clipId}>
          <use href={`#${mId}`} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <rect x="-10" y="-20" width="380" height="120" fill="#000000" />
        <rect x="-10" y="100" width="380" height="72" fill="#FFFFFF" />
        <rect x="-10" y="172" width="380" height="128" fill="#007A3D" />
        <polygon points="-10,-20 -10,300 170,138" fill="#CE1126" />
      </g>
    </svg>
  )
}

export default function Header01() {
  const [open, setOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
        <div className="flex h-14 items-center justify-between">
          <a
            href="#"
            className="inline-flex items-center font-mono text-sm font-semibold tracking-[-0.02em] text-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span aria-hidden className="mr-1.5">◆</span>
            MSH UI
          </a>

          <nav className="hidden md:block">
            <ul className="flex items-center gap-1">
              {NAV.map((n, i) => (
                <li key={n.label} className="flex items-center gap-1">
                  <a
                    href={n.href}
                    className="rounded-sm px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {n.label}
                  </a>
                  {i < NAV.length - 1 && (
                    <span
                      aria-hidden
                      className="text-muted-foreground/40"
                    >
                      ·
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Button asChild variant="ghost" size="sm">
              <a href="#">Sign in</a>
            </Button>
            <Button asChild variant="default" size="sm">
              <a href="#">Get started</a>
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="inline-flex size-9 items-center justify-center rounded-sm border border-border bg-card text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="mx-auto w-full max-w-7xl px-6 py-4 md:px-10">
            <ul className="flex flex-col gap-1">
              {NAV.map((n) => (
                <li key={n.label}>
                  <a
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-sm px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="w-full justify-center"
              >
                <a href="#" onClick={() => setOpen(false)}>
                  Sign in
                </a>
              </Button>
              <Button
                asChild
                variant="default"
                size="sm"
                className="w-full justify-center"
              >
                <a href="#" onClick={() => setOpen(false)}>
                  Get started
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
