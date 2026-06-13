"use client"

import { TextReveal } from "@/registry/hirael/ui/text-reveal"

export default function TextRevealDemo() {
  return (
    <div className="grid w-full max-w-xl gap-8">
      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          By word
        </p>
        <TextReveal
          as="h3"
          className="text-2xl font-semibold tracking-tight text-foreground"
        >
          Words rise into place, one after another
        </TextReveal>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          By line
        </p>
        <TextReveal
          by="line"
          delay={100}
          stagger={120}
          className="text-sm leading-relaxed text-muted-foreground"
        >
          {"Designed for headlines and pull quotes.\nEach line is masked, then slides up.\nRespects reduced-motion preferences."}
        </TextReveal>
      </div>
    </div>
  )
}
