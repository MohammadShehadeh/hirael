'use client';

import * as React from 'react';
import { Star } from 'lucide-react';

import { cn } from '@/lib/utils';

interface RatingContextValue {
  value: number;
  display: number;
  max: number;
  step: 0.5 | 1;
  interactive: boolean;
  iconSize: string;
  tabStop: number;
  setHover: (next: number | null) => void;
  commit: (next: number) => void;
}

const RatingContext = React.createContext<RatingContextValue | null>(null);

const useRating = () => {
  const ctx = React.useContext(RatingContext);
  if (!ctx) {
    throw new Error('Rating compound parts must be used inside <Rating>');
  }
  return ctx;
};

export interface RatingProps extends Omit<React.ComponentProps<'div'>, 'onChange' | 'defaultValue'> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  max?: number;
  step?: 0.5 | 1;
  readOnly?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  name?: string;
  'aria-label'?: string;
}

const sizeMap = {
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-6',
} as const;

const Rating = ({
  value: valueProp,
  defaultValue,
  onValueChange,
  max = 5,
  step = 1,
  readOnly,
  disabled,
  size = 'md',
  name,
  className,
  onKeyDown,
  children,
  ...props
}: RatingProps) => {
  const isControlled = valueProp !== undefined;
  const [internal, setInternal] = React.useState(defaultValue ?? 0);
  const [hover, setHover] = React.useState<number | null>(null);

  const value = isControlled ? (valueProp as number) : internal;
  const display = hover ?? value;

  const interactive = !readOnly && !disabled;
  const iconSize = sizeMap[size];

  const commit = React.useCallback(
    (next: number) => {
      if (readOnly || disabled) return;
      if (valueProp === undefined) setInternal(next);
      onValueChange?.(next);
    },
    [readOnly, disabled, valueProp, onValueChange],
  );

  const stepAligned = value > 0 && value <= max && Number.isInteger(value / step);
  const tabStop = stepAligned ? value : step;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || !interactive) return;
    const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
    let next: number;
    switch (e.key) {
      case 'ArrowRight':
        next = value + (rtl ? -step : step);
        break;
      case 'ArrowLeft':
        next = value + (rtl ? step : -step);
        break;
      case 'ArrowUp':
        next = value + step;
        break;
      case 'ArrowDown':
        next = value - step;
        break;
      case 'Home':
        next = step;
        break;
      case 'End':
        next = max;
        break;
      default:
        return;
    }
    e.preventDefault();
    next = Math.min(max, Math.max(step, next));
    commit(next);
    e.currentTarget.querySelector<HTMLButtonElement>(`[data-slot="rating-radio"][data-value="${next}"]`)?.focus();
  };

  const ctx = React.useMemo<RatingContextValue>(
    () => ({
      value,
      display,
      max,
      step,
      interactive,
      iconSize,
      tabStop,
      setHover,
      commit,
    }),
    [value, display, max, step, interactive, iconSize, tabStop, commit],
  );

  return (
    <RatingContext.Provider value={ctx}>
      <div
        data-slot="rating"
        data-readonly={readOnly || undefined}
        data-disabled={disabled || undefined}
        role={interactive ? 'radiogroup' : 'img'}
        aria-label={props['aria-label'] ?? `Rating: ${value} of ${max}`}
        className={cn('inline-flex items-center gap-0.5', disabled && 'pointer-events-none opacity-50', className)}
        onMouseLeave={() => setHover(null)}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children ?? Array.from({ length: max }).map((_, i) => <RatingItem key={i} index={i} />)}

        {name && <input type="hidden" name={name} value={value} />}
      </div>
    </RatingContext.Provider>
  );
};

interface RatingRadioProps {
  value: number;
  className?: string;
}

const RatingRadio = ({ value: radioValue, className }: RatingRadioProps) => {
  const ctx = useRating();
  return (
    <button
      type="button"
      role="radio"
      aria-checked={ctx.value === radioValue}
      aria-label={`${radioValue} of ${ctx.max}`}
      tabIndex={radioValue === ctx.tabStop ? 0 : -1}
      data-slot="rating-radio"
      data-value={radioValue}
      className={cn(
        'cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        className,
      )}
      onMouseEnter={() => ctx.setHover(radioValue)}
      onClick={() => ctx.commit(ctx.value === radioValue ? 0 : radioValue)}
    />
  );
};

export interface RatingItemProps extends Omit<React.ComponentProps<'span'>, 'children'> {
  index: number;
}

const RatingItem = ({ index, className, ...props }: RatingItemProps) => {
  const ctx = useRating();
  const fullValue = index + 1;
  const halfValue = index + 0.5;
  const filled = ctx.display >= fullValue;
  const half = !filled && ctx.display >= halfValue;

  return (
    <span
      data-slot="rating-item"
      className={cn('relative inline-flex', ctx.interactive && 'cursor-pointer', className)}
      {...props}
    >
      <Star
        data-slot="rating-star"
        className={cn(ctx.iconSize, 'text-muted-foreground/40 transition-colors')}
        aria-hidden
      />
      {(filled || half) && (
        <Star
          data-slot="rating-star-fill"
          className={cn(
            ctx.iconSize,
            'absolute inset-0 fill-warning text-warning transition-[clip-path]',
            half && '[clip-path:inset(0_50%_0_0)] rtl:[clip-path:inset(0_0_0_50%)]',
          )}
          aria-hidden
        />
      )}

      {ctx.interactive && ctx.step === 0.5 && (
        <>
          <RatingRadio value={halfValue} className="absolute inset-y-0 start-0 w-1/2" />
          <RatingRadio value={fullValue} className="absolute inset-y-0 end-0 w-1/2" />
        </>
      )}
      {ctx.interactive && ctx.step === 1 && <RatingRadio value={fullValue} className="absolute inset-0" />}
    </span>
  );
};

export { Rating, RatingItem };
