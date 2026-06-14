import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"

/* The black pill with a trailing white arrow circle, reused by the hero
 * ("Join us") and the info section ("Discover it"). Pass the text size via
 * `textClassName` — the hero is base/lg, the info button is base. */
export function ArrowPillButton({
  label,
  textClassName,
  className,
}: {
  label: string
  textClassName?: string
  className?: string
}) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-3 rounded-full bg-black py-2 pl-8 pr-2 font-medium text-white transition-colors duration-200 hover:bg-gray-800",
        textClassName,
        className
      )}
    >
      {label}
      <span className="rounded-full bg-white p-2">
        <ArrowRight className="h-5 w-5 text-black" />
      </span>
    </button>
  )
}
