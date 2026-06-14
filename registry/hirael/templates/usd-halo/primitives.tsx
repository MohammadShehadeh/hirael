import type { CSSProperties } from "react"
import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"

// Stylized "halo" mark: two interlocking rounded squares, tracking the
// current text color so it works on any surface.
const LOGO_PATH =
  "M 128.005 191.173 C 128.448 156.208 156.93 128 192 128 L 192 64 L 128 64 C 128 99.346 99.346 128 64 128 L 64 192 L 128 192 Z M 192 256 L 64 256 C 28.654 256 0 227.346 0 192 L 0 64 L 64 64 L 64 0 L 192 0 C 227.346 0 256 28.654 256 64 L 256 192 L 192 192 Z"

export function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 256 256"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d={LOGO_PATH} />
    </svg>
  )
}

interface PillButtonProps {
  label: string
  /** Bumps the label to text-lg on md+ (used by the hero "Join us"). */
  large?: boolean
}

/** Black pill with a trailing white arrow circle. */
export function PillButton({ label, large = false }: PillButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-3 rounded-full bg-black py-2 ps-8 pe-2 font-medium text-white transition-colors duration-200 hover:bg-gray-800",
        large ? "text-base md:text-lg" : "text-base"
      )}
    >
      <span>{label}</span>
      <span className="rounded-full bg-white p-2">
        <ArrowRight className="h-5 w-5 text-black rtl:rotate-180" />
      </span>
    </button>
  )
}

export interface MarqueeBrand {
  name: string
  style: CSSProperties
}

interface MarqueeProps {
  brands: MarqueeBrand[]
  trackClass: string
  keyframesName: string
  durationSeconds: number
  itemClass: string
}

/**
 * Infinite horizontal marquee. The list renders twice and the track shifts
 * 0 -> -50%, so the loop is seamless. The keyframes ship inline, scoped by a
 * caller-supplied name, so two marquees can run at different speeds.
 */
export function Marquee({
  brands,
  trackClass,
  keyframesName,
  durationSeconds,
  itemClass,
}: MarqueeProps) {
  return (
    <>
      <style>{`
        @keyframes ${keyframesName} {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .${trackClass} {
          display: flex;
          width: max-content;
          animation: ${keyframesName} ${durationSeconds}s linear infinite;
        }
        [dir="rtl"] .${trackClass} {
          animation-direction: reverse;
        }
      `}</style>
      <div className={trackClass}>
        {[...brands, ...brands].map((brand, index) => (
          <span
            key={`${brand.name}-${index}`}
            className={itemClass}
            style={brand.style}
          >
            {brand.name}
          </span>
        ))}
      </div>
    </>
  )
}
