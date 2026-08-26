import { cn } from "@/lib/utils";

const Kbd = ({ className, ...props }: React.ComponentProps<"button">) => {
  return (
    <button
      data-slot="kbd"
      className={cn(
        "relative inline-flex select-none touch-manipulation items-center justify-center overflow-hidden",
        "h-8 min-w-8 px-2",
        "font-sans text-sm font-medium text-foreground",
        "rounded-lg border border-input",
        "bg-linear-to-b from-card to-card/80",
        "[-webkit-tap-highlight-color:transparent]",
        "shadow-[0_1px_0_1px_var(--border),0_2px_4px_-1px_color-mix(in_oklch,var(--foreground)_14%,transparent),0_4px_6px_-2px_color-mix(in_oklch,var(--foreground)_8%,transparent)]",
        "before:pointer-events-none before:absolute before:inset-x-[2px] before:top-[2px] before:h-[40%] before:rounded-t-md before:bg-linear-to-b before:from-warm/20 before:to-transparent",
        "transition-all duration-100 ease-out",
        "hover:brightness-105",
        "hover:shadow-[0_1px_0_1px_var(--border),0_3px_6px_-1px_color-mix(in_oklch,var(--foreground)_17%,transparent),0_6px_10px_-2px_color-mix(in_oklch,var(--foreground)_10%,transparent)]",
        "active:translate-y-[2px] active:brightness-95",
        "active:shadow-[0_0_0_1px_var(--border),0_1px_2px_0_color-mix(in_oklch,var(--foreground)_12%,transparent)]",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
};

const KbdDisplay = ({ className, ...props }: React.ComponentProps<"kbd">) => {
  return (
    <kbd
      data-slot="kbd-display"
      className={cn(
        "pointer-events-none inline-flex h-5 w-fit min-w-5 select-none items-center justify-center gap-1 rounded-sm bg-muted px-1 font-sans text-xs font-medium text-muted-foreground",
        "[&_svg:not([class*='size-'])]:size-3",
        className,
      )}
      {...props}
    />
  );
};

const KbdGroup = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  );
};

export { Kbd, KbdDisplay, KbdGroup };
