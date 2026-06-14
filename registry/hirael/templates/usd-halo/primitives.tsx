import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"

export function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 256 256"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d="M 128.005 191.173 C 128.448 156.208 156.93 128 192 128 L 192 64 L 128 64 C 128 99.346 99.346 128 64 128 L 64 192 L 128 192 Z M 192 256 L 64 256 C 28.654 256 0 227.346 0 192 L 0 64 L 64 64 L 64 0 L 192 0 C 227.346 0 256 28.654 256 64 L 256 192 L 192 192 Z" />
    </svg>
  )
}

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
