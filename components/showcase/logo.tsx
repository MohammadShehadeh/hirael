import * as React from "react";

import { cn } from "@/lib/utils";

const CORMORANT_WORDMARK_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-cormorant), ui-serif, serif",
  fontWeight: 500,
  letterSpacing: "0.18em",
};

/**
 * Arch-and-star mark — slim doorway with a 4-point star inside and three
 * reflection strokes below the base. Drawn with stroke=currentColor so it
 * tracks the surrounding text color. The mark reads at favicon size.
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
      {/* Archway: vertical sides + semicircular top, open at the base. */}
      <path d="M16 78 V40 a24 24 0 0 1 48 0 V78" />
      {/* 4-point star, centered inside the arch. */}
      <path d="M40 44 L43.2 52 L51 55 L43.2 58 L40 66 L36.8 58 L29 55 L36.8 52 Z" />
      {/* Three short reflection strokes below the arch base. */}
      <path d="M22 86 H58" opacity="0.7" />
      <path d="M28 92 H52" opacity="0.45" />
      <path d="M34 96 H46" opacity="0.25" />
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
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 48 V22 a16 16 0 0 1 32 0 V48" />
        <path d="M26 26 L28.4 32 L34 34 L28.4 36 L26 42 L23.6 36 L18 34 L23.6 32 Z" />
        <path d="M14 53 H38" opacity="0.7" />
        <path d="M18 56.5 H34" opacity="0.45" />
        <path d="M22 59 H30" opacity="0.25" />
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
