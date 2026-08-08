import * as React from "react";

import { cn } from "@/lib/utils";

const CORMORANT_WORDMARK_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-cormorant), ui-serif, serif",
  fontWeight: 500,
  letterSpacing: "0.18em",
};

/**
 * Arch-and-star mark — a squared doorway with a 4-point star inside and three
 * stacked reflection lenses below the base, reading as light on water (the
 * brand mark). The arch is stroked and the star and reflections are filled,
 * all in currentColor so the mark tracks the surrounding text color. The
 * viewBox is cropped to the artwork so it stays legible at favicon size.
 */
function ArchMarkPaths() {
  return (
    <>
      <path
        d="M160 340V235C160 171 203 128 256 128C309 128 352 171 352 235V340"
        fill="none"
        stroke="currentColor"
        strokeWidth="18"
        strokeLinecap="square"
      />
      <path
        d="M256 220C262 242 274 254 296 260C274 266 262 278 256 300C250 278 238 266 216 260C238 254 250 242 256 220Z"
        fill="currentColor"
      />
      <path
        d="M95 372C160 364 352 364 417 372C352 380 160 380 95 372Z"
        fill="currentColor"
      />
      <path
        d="M135 405C185 399 327 399 377 405C327 411 185 411 135 405Z"
        fill="currentColor"
      />
      <path
        d="M190 438C220 434 292 434 322 438C292 442 220 442 190 438Z"
        fill="currentColor"
      />
    </>
  );
}

function ArchMarkSvg({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="80 104 352 352"
      role="img"
      aria-hidden
      className={className}
    >
      <title>Hirael</title>
      <ArchMarkPaths />
    </svg>
  );
}

/**
 * Wordmark — "HIRAEL" set in Cormorant with wide tracking, paired with
 * the arch mark on its left. ViewBox is tightened so the type fills the
 * vertical room; callers can size with a single h-* utility.
 */
function HiraelWordmarkSvg({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 280 60"
      role="img"
      aria-hidden
      className={className}
    >
      <title>Hirael</title>
      <svg x="6" y="6" width="46" height="46" viewBox="80 104 352 352">
        <ArchMarkPaths />
      </svg>
      <text
        x="56"
        y="44"
        fill="currentColor"
        fontSize="42"
        style={CORMORANT_WORDMARK_STYLE}
      >
        HIRAEL
      </text>
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="Hirael"
      className={cn("inline-flex shrink-0 text-foreground", className)}
    >
      <HiraelWordmarkSvg className="h-full w-auto" />
    </span>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="Hirael"
      className={cn("inline-flex size-6 shrink-0 text-foreground", className)}
    >
      <ArchMarkSvg className="size-full" />
    </span>
  );
}

/**
 * Icon/mark on a raised "keycap" tile — the arch mark sitting on a rounded
 * surface with a top-lit gradient, a hairline edge, a layered drop shadow, and
 * a glossy top bevel (the same physical-key treatment as the Kbd component, so
 * the brand mark reads like a pressable key). Matches the board's ICON / MARK
 * panel. Size with a single `size-*` utility on `className`.
 */
export function LogoTile({
  className,
  markClassName,
}: {
  className?: string;
  markClassName?: string;
}) {
  return (
    <span
      role="img"
      aria-label="Hirael"
      className={cn(
        "relative inline-flex size-9 shrink-0 select-none items-center justify-center overflow-hidden rounded-sm text-foreground",
        "border border-input bg-linear-to-b from-card to-card/80",
        "shadow-[0_1px_0_1px_oklch(0%_0_0/0.1),0_2px_4px_-1px_oklch(0%_0_0/0.1),0_4px_6px_-2px_oklch(0%_0_0/0.05)]",
        "dark:shadow-[0_1px_0_1px_oklch(0%_0_0/0.4),0_2px_4px_-1px_oklch(0%_0_0/0.3),0_4px_6px_-2px_oklch(0%_0_0/0.2)]",
        className,
      )}
    >
      <ArchMarkSvg className={cn("relative size-7.5", markClassName)} />
    </span>
  );
}
