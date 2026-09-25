'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { composeRefs } from '@/registry/hirael/bases/radix/components/compose-refs';

const INDICATOR_DURATION = 250;
const INDICATOR_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
const ITEM_SELECTOR = '[data-slot="segmented-control-item"]';
const INDICATOR_SELECTOR = '[data-slot="segmented-control-indicator"]';
const SLIDE_SELECTOR = '[data-slot="segmented-control-slide"]';
const SLIDE_FILL_SELECTOR = '[data-slot="segmented-control-slide-fill"]';
const SLIDE_EDGE_SELECTOR = '[data-slot="segmented-control-slide-edge"]';
// Room past the thumb's edges so its shadow isn't clipped away mid-slide.
const SHADOW_BLEED = 8;
const THUMB_FILL = 'bg-background dark:bg-input/30';
const THUMB_EDGE = 'rounded-md border border-transparent shadow-xs dark:border-input';

type SegmentedControlSize = 'sm' | 'default';

interface SegmentedControlContextValue {
  value: string | null;
  select: (next: string) => void;
  size: SegmentedControlSize;
  fullWidth: boolean;
  disabled?: boolean;
}

const SegmentedControlContext = React.createContext<SegmentedControlContextValue | null>(null);

const useSegmentedControl = () => {
  const ctx = React.useContext(SegmentedControlContext);
  if (!ctx) {
    throw new Error('SegmentedControlItem must be used inside <SegmentedControl>');
  }

  return ctx;
};

const findItem = (root: HTMLElement, value: string | null) =>
  Array.from(root.querySelectorAll<HTMLButtonElement>(ITEM_SELECTOR)).find((item) => item.dataset.value === value);

interface ThumbRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface Slide {
  from: ThumbRect;
  to: ThumbRect;
  animations: Animation[];
}

const toThumbRect = ({ left, top, width, height }: DOMRect): ThumbRect => ({ left, top, width, height });

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Where the thumb is on screen mid-slide, so a new change starts from there instead of jumping.
const currentSlideRect = (slide: Slide): ThumbRect | null => {
  const progress = slide.animations[0]?.effect?.getComputedTiming().progress;
  if (progress == null) return null;

  return {
    left: lerp(slide.from.left, slide.to.left, progress),
    top: lerp(slide.from.top, slide.to.top, progress),
    width: lerp(slide.from.width, slide.to.width, progress),
    height: lerp(slide.from.height, slide.to.height, progress),
  };
};

export interface SegmentedControlProps extends Omit<React.ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
  /** The selected option's value. */
  value?: string | null;
  /** Starting option when uncontrolled. */
  defaultValue?: string | null;
  /** Fires when the user picks an option, by click or arrow key. */
  onValueChange?: (value: string) => void;
  /** `sm` for toolbars and dense rows. */
  size?: SegmentedControlSize;
  /** Stretch to the container and split it evenly between options. */
  fullWidth?: boolean;
  /** Disables every option. */
  disabled?: boolean;
  /** Announces the group as required. */
  required?: boolean;
  /** Submits the selected value under this name. */
  name?: string;
}

const SegmentedControl = ({
  value: valueProp,
  defaultValue = null,
  onValueChange,
  size = 'default',
  fullWidth = false,
  disabled,
  required,
  name,
  className,
  onKeyDown,
  ref,
  children,
  ...props
}: SegmentedControlProps) => {
  const [internalValue, setInternalValue] = React.useState<string | null>(defaultValue);
  const value = valueProp !== undefined ? valueProp : internalValue;

  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const composedRef = React.useMemo(() => composeRefs(rootRef, ref), [ref]);
  const fromRectRef = React.useRef<ThumbRect | null>(null);
  const prevValueRef = React.useRef(value);
  const slideRef = React.useRef<Slide | null>(null);

  const select = React.useCallback(
    (next: string) => {
      if (disabled || next === value) return;
      const indicator = rootRef.current?.querySelector(INDICATOR_SELECTOR);
      fromRectRef.current =
        (slideRef.current && currentSlideRect(slideRef.current)) ??
        (indicator ? toThumbRect(indicator.getBoundingClientRect()) : null);
      if (valueProp === undefined) setInternalValue(next);
      onValueChange?.(next);
    },
    [disabled, value, valueProp, onValueChange],
  );

  // Scaling the thumb between options of different widths would stretch its corners, so the slide uses
  // full-width layers that only translate and clip. The fill is one layer: two translucent halves would seam.
  React.useLayoutEffect(() => {
    const prev = prevValueRef.current;
    const from = fromRectRef.current;
    prevValueRef.current = value;
    fromRectRef.current = null;
    const root = rootRef.current;
    if (prev === value || !root) return;
    const indicator = root.querySelector<HTMLElement>(INDICATOR_SELECTOR);
    const track = root.querySelector<HTMLElement>(SLIDE_SELECTOR);
    const fill = root.querySelector<HTMLElement>(SLIDE_FILL_SELECTOR);
    const [leftEdge, rightEdge] = Array.from(root.querySelectorAll<HTMLElement>(SLIDE_EDGE_SELECTOR));
    if (!indicator || !track || !fill || !leftEdge || !rightEdge || typeof indicator.animate !== 'function') return;
    if (window.matchMedia?.(REDUCED_MOTION).matches) return;
    const prevItem = findItem(root, prev);
    const start = from ?? (prevItem ? toThumbRect(prevItem.getBoundingClientRect()) : null);
    const end = toThumbRect(indicator.getBoundingClientRect());
    const box = track.getBoundingClientRect();
    if (!start?.width || !end.width || !box.width) return;

    const radius = getComputedStyle(indicator).borderTopLeftRadius;

    const fillFrame = (rect: ThumbRect): Keyframe => {
      const top = rect.top - box.top;
      const right = box.right - rect.left - rect.width;
      const bottom = box.bottom - rect.top - rect.height;

      return {
        visibility: 'visible',
        clipPath: `inset(${top}px ${right}px ${bottom}px ${rect.left - box.left}px round ${radius})`,
      };
    };
    const edgeFrame = (rect: ThumbRect, side: 'left' | 'right'): Keyframe => {
      const cut = box.width - rect.width / 2;
      const x = side === 'left' ? rect.left - box.left : rect.left + rect.width - box.right;
      const [right, left] = side === 'left' ? [cut, -SHADOW_BLEED] : [-SHADOW_BLEED, cut];

      return {
        visibility: 'visible',
        transform: `translate(${x}px, ${rect.top - box.top}px)`,
        clipPath: `inset(${-SHADOW_BLEED}px ${right}px ${-SHADOW_BLEED}px ${left}px)`,
      };
    };
    const timing = { duration: INDICATOR_DURATION, easing: INDICATOR_EASING };
    const animations = [
      fill.animate([fillFrame(start), fillFrame(end)], timing),
      leftEdge.animate([edgeFrame(start, 'left'), edgeFrame(end, 'left')], timing),
      rightEdge.animate([edgeFrame(start, 'right'), edgeFrame(end, 'right')], timing),
      indicator.animate([{ opacity: 0 }, { opacity: 0 }], timing),
    ];
    const slide: Slide = { from: start, to: end, animations };
    slideRef.current = slide;

    return () => {
      animations.forEach((animation) => animation.cancel());
      if (slideRef.current === slide) slideRef.current = null;
    };
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || disabled) return;
    const items = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>(ITEM_SELECTOR)).filter(
      (item) => !item.disabled,
    );
    if (!items.length) return;
    const current = items.findIndex((item) => item === document.activeElement);
    const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
    let index: number;
    switch (e.key) {
      case 'ArrowRight':
        index = current + (rtl ? -1 : 1);
        break;
      case 'ArrowLeft':
        index = current + (rtl ? 1 : -1);
        break;
      case 'ArrowDown':
        index = current + 1;
        break;
      case 'ArrowUp':
        index = current - 1;
        break;
      case 'Home':
        index = 0;
        break;
      case 'End':
        index = items.length - 1;
        break;
      default:
        return;
    }
    e.preventDefault();
    const target = items[(index + items.length) % items.length];
    target.focus();
    if (target.dataset.value !== undefined) select(target.dataset.value);
  };

  const ctx = React.useMemo<SegmentedControlContextValue>(
    () => ({ value, select, size, fullWidth, disabled }),
    [value, select, size, fullWidth, disabled],
  );

  return (
    <SegmentedControlContext.Provider value={ctx}>
      <div
        ref={composedRef}
        role="radiogroup"
        aria-disabled={disabled || undefined}
        aria-required={required || undefined}
        data-slot="segmented-control"
        data-size={size}
        data-disabled={disabled || undefined}
        className={cn(
          'relative isolate items-center rounded-lg bg-muted p-[3px] text-muted-foreground',
          size === 'sm' ? 'h-8' : 'h-9',
          fullWidth ? 'flex w-full' : 'inline-flex w-fit',
          className,
        )}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {/* padding: inherit lines the slide box up with the items; overflow-clip stops the halves from
            widening the page while they travel. */}
        <span aria-hidden className="pointer-events-none absolute inset-0 overflow-clip p-[inherit]">
          <span data-slot="segmented-control-slide" className="relative block size-full">
            <span data-slot="segmented-control-slide-fill" className={cn('invisible absolute inset-0', THUMB_FILL)} />
            <span data-slot="segmented-control-slide-edge" className={cn('invisible absolute inset-0', THUMB_EDGE)} />
            <span data-slot="segmented-control-slide-edge" className={cn('invisible absolute inset-0', THUMB_EDGE)} />
          </span>
        </span>
        {children}
        {name && <input type="hidden" name={name} value={value ?? ''} disabled={disabled} />}
      </div>
    </SegmentedControlContext.Provider>
  );
};

export interface SegmentedControlItemProps extends Omit<React.ComponentProps<'button'>, 'value' | 'type'> {
  /** Identifies the option; reported through `onValueChange`. */
  value: string;
}

const SegmentedControlItem = ({
  value,
  disabled: disabledProp,
  className,
  children,
  onClick,
  ...props
}: SegmentedControlItemProps) => {
  const ctx = useSegmentedControl();
  const checked = ctx.value === value;
  const disabled = ctx.disabled || disabledProp;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      tabIndex={checked || ctx.value === null ? 0 : -1}
      disabled={disabled}
      data-slot="segmented-control-item"
      data-state={checked ? 'checked' : 'unchecked'}
      data-disabled={disabled || undefined}
      data-value={value}
      className={cn(
        'relative inline-flex h-full min-w-0 items-center justify-center rounded-md font-medium whitespace-nowrap text-foreground/60 transition-colors outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none data-[state=checked]:text-foreground dark:text-muted-foreground dark:hover:text-foreground dark:data-[state=checked]:text-foreground',
        '[&_svg]:pointer-events-none [&_svg]:shrink-0',
        ctx.size === 'sm'
          ? "px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3.5"
          : "px-3 text-sm [&_svg:not([class*='size-'])]:size-4",
        ctx.fullWidth && 'flex-1',
        className,
      )}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) ctx.select(value);
      }}
      {...props}
    >
      {checked && (
        <span
          aria-hidden
          data-slot="segmented-control-indicator"
          className={cn('absolute inset-0', THUMB_FILL, THUMB_EDGE)}
        />
      )}
      <span
        data-slot="segmented-control-label"
        className={cn(
          'relative z-10 inline-flex min-w-0 items-center',
          ctx.size === 'sm' ? 'gap-1' : 'gap-1.5',
          disabled && 'opacity-50',
        )}
      >
        {children}
      </span>
    </button>
  );
};

export { SegmentedControl, SegmentedControlItem };
