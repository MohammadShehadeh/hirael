import { cn } from '@/lib/utils';

const KbdButton = ({ className, ...props }: React.ComponentProps<'button'>) => {
  return (
    <button
      type="button"
      data-slot="kbd-button"
      className={cn(
        'relative inline-flex touch-manipulation items-center justify-center overflow-hidden select-none',
        'h-8 min-w-8 px-2',
        'font-sans text-sm font-medium text-foreground',
        'rounded-lg border border-input',
        'bg-linear-to-b from-card to-card/80',
        '[-webkit-tap-highlight-color:transparent]',
        'shadow-[0_1px_0_1px_var(--border),0_2px_4px_-1px_color-mix(in_oklch,var(--foreground)_14%,transparent),0_4px_6px_-2px_color-mix(in_oklch,var(--foreground)_8%,transparent)]',
        'before:pointer-events-none before:absolute before:inset-x-[2px] before:top-[2px] before:h-[40%] before:rounded-t-md before:bg-linear-to-b before:from-primary/20 before:to-transparent',
        'transition-all duration-100 ease-out',
        'hover:brightness-105',
        'hover:shadow-[0_1px_0_1px_var(--border),0_3px_6px_-1px_color-mix(in_oklch,var(--foreground)_17%,transparent),0_6px_10px_-2px_color-mix(in_oklch,var(--foreground)_10%,transparent)]',
        'active:translate-y-[2px] active:brightness-95',
        'active:shadow-[0_0_0_1px_var(--border),0_1px_2px_0_color-mix(in_oklch,var(--foreground)_12%,transparent)]',
        'outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
        'disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
};

export { KbdButton };
export { Kbd, KbdGroup } from '@/registry/hirael/bases/base/ui/kbd';
