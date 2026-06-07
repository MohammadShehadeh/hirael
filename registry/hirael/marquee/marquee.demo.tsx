"use client"

import { Marquee } from "@/registry/hirael/ui/marquee"

const brands = [
  "Vercel",
  "Linear",
  "Stripe",
  "Supabase",
  "Raycast",
  "Framer",
  "Resend",
  "Clerk",
]

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground">
      {children}
    </span>
  )
}

export default function MarqueeDemo() {
  return (
    <div className="grid w-full min-w-0 max-w-2xl gap-8">
      <div className="grid min-w-0 gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Pause on hover · edge fade
        </p>
        <div className="relative w-full min-w-0 overflow-hidden">
          <Marquee pauseOnHover duration={28} className="py-1">
            {brands.map((b) => (
              <Chip key={b}>{b}</Chip>
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent" />
        </div>
      </div>

      <div className="grid min-w-0 gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Reverse direction
        </p>
        <div className="relative w-full min-w-0 overflow-hidden">
          <Marquee reverse pauseOnHover duration={28} className="py-1">
            {brands.map((b) => (
              <Chip key={b}>{b}</Chip>
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent" />
        </div>
      </div>
    </div>
  )
}
