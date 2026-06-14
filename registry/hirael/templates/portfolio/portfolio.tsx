"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

import { Contact } from "./contact"
import { Explorations } from "./explorations"
import { inter, instrumentSerif } from "./fonts"
import { Hero } from "./hero"
import { Journal } from "./journal"
import { LoadingScreen } from "./loading-screen"
import { SelectedWorks } from "./selected-works"
import { Stats } from "./stats"
import { PORTFOLIO_STYLES } from "./styles"

export default function Portfolio() {
  const [isLoading, setIsLoading] = React.useState(true)

  return (
    <div
      data-slot="portfolio"
      className={cn(
        inter.variable,
        instrumentSerif.variable,
        "min-h-svh bg-[hsl(var(--bg))] text-[hsl(var(--text))] antialiased"
      )}
    >
      <style dangerouslySetInnerHTML={{ __html: PORTFOLIO_STYLES }} />

      {isLoading ? (
        <LoadingScreen onComplete={() => setIsLoading(false)} />
      ) : null}

      <Hero start={!isLoading} />
      <SelectedWorks />
      <Journal />
      <Explorations />
      <Stats />
      <Contact />
    </div>
  )
}
