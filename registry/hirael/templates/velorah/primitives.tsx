import { cn } from "@/lib/utils";

/**
 * Velorah wordmark with a registered-trademark superscript, set in
 * Instrument Serif. The mark scales with the wrapper font size, so the same
 * component serves the navbar (text-3xl) and the footer (text-xl).
 */
export const Wordmark = ({ className }: { className?: string }) => {
  return (
    <span
      className={cn(
        "tracking-tight text-foreground [font-family:var(--font-velorah-serif)]",
        className,
      )}
    >
      Velorah
      <sup className="text-[0.4em]">&reg;</sup>
    </span>
  );
};
