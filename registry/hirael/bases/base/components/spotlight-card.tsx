import { cn } from '@/lib/utils';
import { CursorGlow, type CursorGlowProps } from '@/registry/hirael/bases/base/components/cursor-glow';

export type SpotlightCardProps = CursorGlowProps;

/** A card surface with a crisp cursor spotlight: Cursor Glow with card styling and no blur. */
const SpotlightCard = ({
  className,
  size = 350,
  color = 'color-mix(in oklch, var(--foreground) 10%, transparent)',
  blur = false,
  ...props
}: SpotlightCardProps) => {
  return (
    <CursorGlow
      data-slot="spotlight-card"
      size={size}
      color={color}
      blur={blur}
      className={cn('rounded-lg border border-border bg-card text-card-foreground', className)}
      {...props}
    />
  );
};

export { SpotlightCard };
