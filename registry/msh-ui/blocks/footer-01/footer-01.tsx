"use client"

import * as React from "react"
import { Github, Twitter, MessageCircle } from "lucide-react"

type LinkColumn = {
  title: string
  links: readonly { label: string; href: string }[]
}

const COLUMNS: readonly LinkColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Registry", href: "#" },
      { label: "Themes", href: "#" },
      { label: "Playground", href: "#" },
      { label: "Changelog", href: "#" },
      { label: "Roadmap", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Manifesto", href: "#" },
      { label: "Customers", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "Guides", href: "#" },
      { label: "Examples", href: "#" },
      { label: "Support", href: "#" },
      { label: "License", href: "#" },
    ],
  },
]

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

export default function Footer01() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto w-full max-w-7xl px-6 py-16 md:px-10">
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-5 lg:gap-16">
          <div className="col-span-2">
            <div className="flex flex-col gap-4">
              <span className="inline-flex items-center font-mono text-sm font-semibold tracking-[-0.02em] text-foreground">
                <BrandMark className="mr-1.5 size-4" />
                MSH UI
              </span>
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                A registry for the dense product components shadcn/ui
                doesn&apos;t ship. Source-installed via CLI. MIT licensed. No
                runtime dependency.
              </p>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title} className="flex flex-col gap-4">
              <h4 className="font-mono text-[10px] uppercase tracking-[0.12em] text-foreground">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            © 2026 MSH UI Labs · All rights reserved
          </p>
          <div className="flex items-center gap-1">
            <a
              href="#"
              aria-label="GitHub"
              className="inline-flex size-8 items-center justify-center rounded-sm border border-transparent text-muted-foreground transition-colors hover:border-border hover:bg-card hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Github className="size-4" />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="inline-flex size-8 items-center justify-center rounded-sm border border-transparent text-muted-foreground transition-colors hover:border-border hover:bg-card hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Twitter className="size-4" />
            </a>
            <a
              href="#"
              aria-label="Discord"
              className="inline-flex size-8 items-center justify-center rounded-sm border border-transparent text-muted-foreground transition-colors hover:border-border hover:bg-card hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <MessageCircle className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
