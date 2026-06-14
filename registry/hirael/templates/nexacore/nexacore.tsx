import { cn } from "@/lib/utils"

import { jakarta } from "./fonts"
import { Freedom } from "./freedom"
import { Hero } from "./hero"
import { Navbar } from "./navbar"
import { NexacoreStyles } from "./styles"
import { Precision } from "./precision"
import { Trusted } from "./trusted"

export default function Nexacore() {
  return (
    <div
      className={cn(
        "nexacore",
        jakarta.variable,
        "relative min-h-svh bg-background text-foreground antialiased"
      )}
      style={{ fontFamily: "var(--font-nexacore-sans), ui-sans-serif, system-ui, sans-serif" }}
    >
      <NexacoreStyles />
      <main>
        <Navbar />
        <Hero />
        <Trusted />
        <Freedom />
        <Precision />
      </main>
    </div>
  )
}
