import { HIRAEL_LOCKUP_VIEWBOX, HIRAEL_MARK_PATH, HIRAEL_MARK_VIEWBOX, HIRAEL_WORDMARK_PATH } from '@/lib/logo-paths';
import { cn } from '@/lib/utils';

interface MarkSvgProps {
  className?: string;
}

const MarkSvg = ({ className }: MarkSvgProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={HIRAEL_MARK_VIEWBOX}
      fill="currentColor"
      role="img"
      aria-hidden
      className={className}
    >
      <title>Hirael</title>
      <path d={HIRAEL_MARK_PATH} />
    </svg>
  );
};

interface LockupSvgProps {
  className?: string;
}

const LockupSvg = ({ className }: LockupSvgProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={HIRAEL_LOCKUP_VIEWBOX}
      fill="currentColor"
      role="img"
      aria-hidden
      className={className}
    >
      <title>Hirael</title>
      <path d={HIRAEL_MARK_PATH} />
      <path d={HIRAEL_WORDMARK_PATH} />
    </svg>
  );
};

export interface LogoProps {
  className?: string;
}

export const Logo = ({ className }: LogoProps) => {
  return (
    <span role="img" aria-label="Hirael" className={cn('inline-flex shrink-0 items-center text-foreground', className)}>
      <LockupSvg className="h-full w-auto" />
    </span>
  );
};

export interface LogoMarkProps {
  className?: string;
}

export const LogoMark = ({ className }: LogoMarkProps) => {
  return (
    <span
      role="img"
      aria-label="Hirael"
      className={cn('inline-flex size-6 shrink-0 items-center justify-center text-foreground', className)}
    >
      <MarkSvg className="h-full w-auto" />
    </span>
  );
};

export interface LogoTileProps {
  className?: string;
  markClassName?: string;
}

export const LogoTile = ({ className, markClassName }: LogoTileProps) => {
  return (
    <span
      role="img"
      aria-label="Hirael"
      className={cn(
        'relative inline-flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-sm text-foreground select-none',
        'border border-input bg-linear-to-b from-card to-card/80',
        'shadow-[0_1px_0_1px_oklch(0%_0_0/0.1),0_2px_4px_-1px_oklch(0%_0_0/0.1),0_4px_6px_-2px_oklch(0%_0_0/0.05)]',
        'dark:shadow-[0_1px_0_1px_oklch(0%_0_0/0.4),0_2px_4px_-1px_oklch(0%_0_0/0.3),0_4px_6px_-2px_oklch(0%_0_0/0.2)]',
        className,
      )}
    >
      <MarkSvg className={cn('relative h-5 w-auto', markClassName)} />
    </span>
  );
};
