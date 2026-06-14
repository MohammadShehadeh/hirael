"use client"

import * as React from "react"
import { motion } from "framer-motion"

const STATS = [
  { value: 20, suffix: "+", label: "Years Experience" },
  { value: 95, suffix: "+", label: "Projects Done" },
  { value: 200, suffix: "%", label: "Satisfied Clients" },
]

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [value, setValue] = React.useState(0)

  React.useEffect(() => {
    if (!active) return
    let raf = 0
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches
    if (reduce) {
      raf = requestAnimationFrame(() => setValue(target))
      return () => cancelAnimationFrame(raf)
    }
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(Math.round(eased * target))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, target, duration])

  return value
}

function Stat({
  value,
  suffix,
  label,
  active,
}: {
  value: number
  suffix: string
  label: string
  active: boolean
}) {
  const count = useCountUp(value, active)
  return (
    <div className="flex flex-col items-center border-t border-[hsl(var(--stroke))] pt-8 text-center sm:items-start sm:text-start">
      <span className="font-display text-5xl tabular-nums leading-none md:text-7xl">
        {count}
        {suffix}
      </span>
      <span className="mt-4 text-xs uppercase tracking-[0.2em] text-[hsl(var(--muted))]">
        {label}
      </span>
    </div>
  )
}

export function Stats() {
  const [active, setActive] = React.useState(false)
  return (
    <section id="stats" className="bg-[hsl(var(--bg))] py-16 md:py-24">
      <motion.div
        onViewportEnter={() => setActive(true)}
        viewport={{ once: true, margin: "-80px" }}
        className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 px-6 sm:grid-cols-3 md:px-10 lg:px-16"
      >
        {STATS.map((stat) => (
          <Stat key={stat.label} active={active} {...stat} />
        ))}
      </motion.div>
    </section>
  )
}
