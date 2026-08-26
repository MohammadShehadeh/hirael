import type { ComponentProps, CSSProperties } from "react";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/registry/hirael/ui/button";

// Stylized "halo" mark: two interlocking rounded squares, tracking the
// current text color so it works on any surface.
const LOGO_PATH =
  "M 128.005 191.173 C 128.448 156.208 156.93 128 192 128 L 192 64 L 128 64 C 128 99.346 99.346 128 64 128 L 64 192 L 128 192 Z M 192 256 L 64 256 C 28.654 256 0 227.346 0 192 L 0 64 L 64 64 L 64 0 L 192 0 C 227.346 0 256 28.654 256 64 L 256 192 L 192 192 Z";

export const LogoIcon = ({ className }: { className?: string }) => {
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
  );
};

interface PillButtonProps extends Omit<
  ComponentProps<typeof Button>,
  "children"
> {
  label: string;
  /** Bumps the label to text-lg on md+ (used by the hero "Join us"). */
  large?: boolean;
  /** White pill with a dark arrow circle, for the #2B2644 footer card. */
  inverted?: boolean;
}

/** Black pill with a trailing white arrow circle. */
export const PillButton = ({
  label,
  large = false,
  inverted = false,
  className,
  ...props
}: PillButtonProps) => {
  return (
    <Button
      type="button"
      className={cn(
        "h-auto gap-3 rounded-full py-2 ps-8 pe-2 text-base duration-200",
        inverted
          ? "bg-white text-[#2B2644] hover:bg-white/90"
          : "bg-black text-white hover:bg-gray-800",
        large && "md:text-lg",
        className,
      )}
      {...props}
    >
      <span>{label}</span>
      <span
        className={cn(
          "rounded-full p-2",
          inverted ? "bg-[#2B2644]" : "bg-white",
        )}
      >
        <ArrowRight
          className={cn(
            "size-5 rtl:rotate-180",
            inverted ? "text-white" : "text-black",
          )}
        />
      </span>
    </Button>
  );
};

export interface MarqueeBrand {
  name: string;
  style: CSSProperties;
}

interface MarqueeProps {
  brands: MarqueeBrand[];
  trackClass: string;
  keyframesName: string;
  durationSeconds: number;
  itemClass: string;
}

/**
 * Infinite horizontal marquee. The list renders twice and the track shifts
 * 0 -> -50%, so the loop is seamless. The keyframes ship inline, scoped by a
 * caller-supplied name, so two marquees can run at different speeds.
 */
export const Marquee = ({
  brands,
  trackClass,
  keyframesName,
  durationSeconds,
  itemClass,
}: MarqueeProps) => {
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
  );
};
