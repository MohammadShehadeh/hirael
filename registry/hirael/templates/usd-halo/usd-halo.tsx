"use client"

import { cn } from "@/lib/utils"

import { Backers } from "./backers"
import { Footer } from "./footer"
import { haloSans } from "./fonts"
import { Hero } from "./hero"
import { Info } from "./info"
import { Navbar } from "./navbar"
import { UseCases } from "./use-cases"

const SCOPED_CSS = `
@font-face {
  font-family: "TT Norms Pro";
  src: url("/fonts/tt-norms-pro-regular.woff2") format("woff2");
  font-weight: 400; font-style: normal; font-display: swap;
}
@font-face {
  font-family: "TT Norms Pro";
  src: url("/fonts/tt-norms-pro-semibold.woff2") format("woff2");
  font-weight: 600; font-style: normal; font-display: swap;
}
.halo-page * { font-family: inherit; }
.halo-page .font-medium { font-weight: 600; }
@keyframes halo-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@keyframes halo-backers-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.halo-page .marquee-track {
  display: flex; width: max-content;
  animation: halo-marquee 22s linear infinite;
}
.halo-page .backers-track {
  display: flex; width: max-content;
  animation: halo-backers-marquee 30s linear infinite;
}
@media (prefers-reduced-motion: reduce) {
  .halo-page .marquee-track, .halo-page .backers-track { animation: none; }
}
`

export default function UsdHalo() {
  return (
    <div
      className={cn(
        haloSans.variable,
        "halo-page flex flex-col bg-[#F5F5F5] text-black antialiased"
      )}
      style={{
        fontFamily:
          '"TT Norms Pro", var(--font-halo-sans), ui-sans-serif, system-ui, sans-serif',
      }}
    >
      <style>{SCOPED_CSS}</style>

      <div className="relative flex h-screen flex-col overflow-hidden">
        <Navbar />
        <Hero />
      </div>
      <Info />
      <Backers />
      <UseCases />
      <Footer />
    </div>
  )
}
