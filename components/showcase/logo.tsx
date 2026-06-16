import * as React from "react";

import { cn } from "@/lib/utils";

const CORMORANT_WORDMARK_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-cormorant), ui-serif, serif",
  fontWeight: 500,
  letterSpacing: "0.18em",
};

/**
 * Arch-and-star mark — slim doorway with a 4-point star inside and three
 * reflection lines below the base. The reflection is feathered: brightest at
 * the centre and dissolving at both ends, so it reads as light shimmering on
 * water (matching the brand mark). Drawn with stroke=currentColor so it tracks
 * the surrounding text color; reads at favicon size.
 */
function ArchMarkSvg({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 80 100"
      role="img"
      aria-hidden
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <title>Hirael</title>
      <defs>
        <linearGradient
          id="hirael-refl-mark"
          gradientUnits="userSpaceOnUse"
          x1="12"
          y1="0"
          x2="68"
          y2="0"
        >
          <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Archway: vertical sides + semicircular top, open at the base. */}
      <path d="M16 78 V40 a24 24 0 0 1 48 0 V78" />
      {/* 4-point star, centered inside the arch. */}
      <path d="M40 44 L43.2 52 L51 55 L43.2 58 L40 66 L36.8 58 L29 55 L36.8 52 Z" />
      {/* Three reflection lines on the water: centre-bright, feathered ends,
          fading and narrowing as they fall away from the base. */}
      <g stroke="url(#hirael-refl-mark)">
        <path d="M18 84 H62" opacity="0.9" />
        <path d="M24 89 H56" opacity="0.6" />
        <path d="M30 94 H50" opacity="0.32" />
      </g>
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
      <defs>
        <linearGradient
          id="hirael-refl-word"
          gradientUnits="userSpaceOnUse"
          x1="6"
          y1="0"
          x2="46"
          y2="0"
        >
          <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 48 V22 a16 16 0 0 1 32 0 V48" />
        <path d="M26 26 L28.4 32 L34 34 L28.4 36 L26 42 L23.6 36 L18 34 L23.6 32 Z" />
      </g>
      <g
        fill="none"
        stroke="url(#hirael-refl-word)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 52.5 H40" opacity="0.9" />
        <path d="M16 55.5 H36" opacity="0.6" />
        <path d="M20 58.5 H32" opacity="0.32" />
      </g>
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

export function Logo({
  className,
  title = "Hirael",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <span
      role="img"
      aria-label={title}
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

export function LogoMarkM({ className }: { className?: string }) {
  return <LogoMark className={className} />;
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
      <ArchMarkSvg className={cn("relative size-8", markClassName)} />
    </span>
  );
}

export function BrandLockup({
  className,
  logoClassName,
}: {
  className?: string;
  logoClassName?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block whitespace-nowrap text-foreground",
        className,
      )}
    >
      <Logo className={cn("inline-block h-6 align-middle", logoClassName)} />
    </span>
  );
}
