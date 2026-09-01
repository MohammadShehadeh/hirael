'use client';

import * as React from 'react';
import { ChevronsLeftRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { composeRefs } from '@/registry/hirael/bases/base/components/compose-refs';

interface ImageCompareContextValue {
  position: number;
  setPosition: (next: number) => void;
  orientation: 'horizontal' | 'vertical';
  disabled: boolean;
  dragging: boolean;
  setDragging: (dragging: boolean) => void;
  rtl: boolean;
  positionFromPointer: (event: React.PointerEvent) => number | null;
}

const ImageCompareContext = React.createContext<ImageCompareContextValue | null>(null);

const useImageCompare = () => {
  const context = React.useContext(ImageCompareContext);
  if (!context) {
    throw new Error('ImageCompare components must be used within <ImageCompare>');
  }
  return context;
};

const clamp = (value: number) => {
  return Math.min(100, Math.max(0, value));
};

export interface ImageCompareProps extends Omit<React.ComponentProps<'div'>, 'onPointerMove'> {
  /** Controlled position of the boundary, 0–100 from the reading start. */
  position?: number;
  defaultPosition?: number;
  onPositionChange?: (position: number) => void;
  orientation?: 'horizontal' | 'vertical';
  /** Follow the hovering pointer instead of requiring a drag. */
  followPointer?: boolean;
  disabled?: boolean;
}

const ImageCompare = ({
  position: positionProp,
  defaultPosition = 50,
  onPositionChange,
  orientation = 'horizontal',
  followPointer = false,
  disabled = false,
  className,
  children,
  ref,
  ...props
}: ImageCompareProps) => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [rtl, setRtl] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);
  const [uncontrolled, setUncontrolled] = React.useState(() => clamp(defaultPosition));

  const position = clamp(positionProp ?? uncontrolled);

  const setPosition = React.useCallback(
    (next: number) => {
      const value = clamp(next);
      if (positionProp === undefined) setUncontrolled(value);
      onPositionChange?.(value);
    },
    [positionProp, onPositionChange],
  );

  React.useLayoutEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const update = () => {
      setRtl(getComputedStyle(node).direction === 'rtl');
    };
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['dir'],
      subtree: true,
    });
    return () => observer.disconnect();
  }, []);

  const positionFromPointer = React.useCallback(
    (event: React.PointerEvent) => {
      const node = containerRef.current;
      if (!node) return null;
      const rect = node.getBoundingClientRect();
      if (orientation === 'vertical') {
        if (rect.height === 0) return null;
        return clamp(((event.clientY - rect.top) / rect.height) * 100);
      }
      if (rect.width === 0) return null;
      const raw = ((event.clientX - rect.left) / rect.width) * 100;
      return clamp(rtl ? 100 - raw : raw);
    },
    [orientation, rtl],
  );

  const handlePointerMove = (event: React.PointerEvent) => {
    if (!followPointer || disabled || dragging) return;
    const next = positionFromPointer(event);
    if (next !== null) setPosition(next);
  };

  const ctx = React.useMemo<ImageCompareContextValue>(
    () => ({
      position,
      setPosition,
      orientation,
      disabled,
      dragging,
      setDragging,
      rtl,
      positionFromPointer,
    }),
    [position, setPosition, orientation, disabled, dragging, rtl, positionFromPointer],
  );

  const composedRef = React.useMemo(() => composeRefs(containerRef, ref), [ref]);

  return (
    <ImageCompareContext.Provider value={ctx}>
      <div
        ref={composedRef}
        data-slot="image-compare"
        data-orientation={orientation}
        data-dragging={dragging || undefined}
        data-disabled={disabled || undefined}
        onPointerMove={followPointer ? handlePointerMove : undefined}
        className={cn('relative isolate w-full select-none overflow-hidden', className)}
        {...props}
      >
        {children}
      </div>
    </ImageCompareContext.Provider>
  );
};

export type ImageCompareBeforeProps = React.ComponentProps<'div'>;

const ImageCompareBefore = ({ className, children, ...props }: ImageCompareBeforeProps) => {
  return (
    <div data-slot="image-compare-before" className={cn('pointer-events-none absolute inset-0', className)} {...props}>
      {children}
    </div>
  );
};

export type ImageCompareAfterProps = React.ComponentProps<'div'>;

const ImageCompareAfter = ({ className, style, children, ...props }: ImageCompareAfterProps) => {
  const { position, orientation, dragging, rtl } = useImageCompare();

  const clipPath =
    orientation === 'vertical'
      ? `inset(${position}% 0 0 0)`
      : rtl
        ? `inset(0 ${position}% 0 0)`
        : `inset(0 0 0 ${position}%)`;

  return (
    <div
      data-slot="image-compare-after"
      style={{
        ...style,
        clipPath,
        transition: dragging ? 'none' : 'clip-path 200ms ease-out',
      }}
      className={cn('pointer-events-none absolute inset-0 z-10', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export interface ImageCompareHandleProps extends React.ComponentProps<'div'> {
  'aria-label'?: string;
}

const ImageCompareHandle = ({ className, style, children, ...props }: ImageCompareHandleProps) => {
  const { position, setPosition, orientation, disabled, dragging, setDragging, rtl, positionFromPointer } =
    useImageCompare();

  const vertical = orientation === 'vertical';

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.focus();
    setDragging(true);
    const next = positionFromPointer(event);
    if (next !== null) setPosition(next);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging || disabled) return;
    const next = positionFromPointer(event);
    if (next !== null) setPosition(next);
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDragging(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const step = event.shiftKey ? 10 : 1;
    let next: number | null = null;
    switch (event.key) {
      case 'ArrowRight':
        next = position + (rtl ? -step : step);
        break;
      case 'ArrowLeft':
        next = position + (rtl ? step : -step);
        break;
      case 'ArrowDown':
        next = position + step;
        break;
      case 'ArrowUp':
        next = position - step;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = 100;
        break;
    }
    if (next === null) return;
    event.preventDefault();
    setPosition(next);
  };

  return (
    <div
      data-slot="image-compare-handle"
      role="slider"
      aria-label={props['aria-label'] ?? 'Comparison slider'}
      aria-orientation={orientation}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(position)}
      aria-disabled={disabled || undefined}
      data-orientation={orientation}
      data-dragging={dragging || undefined}
      tabIndex={disabled ? -1 : 0}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={handleKeyDown}
      style={{
        ...style,
        ...(vertical ? { top: `${position}%` } : { insetInlineStart: `${position}%` }),
        transition: dragging ? 'none' : vertical ? 'top 200ms ease-out' : 'inset-inline-start 200ms ease-out',
      }}
      className={cn(
        'group absolute z-20 flex touch-none items-center justify-center outline-none',
        vertical
          ? 'inset-x-0 h-8 -translate-y-1/2 cursor-row-resize flex-col'
          : cn('inset-y-0 w-8 cursor-col-resize', rtl ? 'translate-x-1/2' : '-translate-x-1/2'),
        disabled && 'cursor-default',
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        data-slot="image-compare-handle-line"
        className={cn(
          'absolute bg-white/90 shadow-[0_0_4px_rgba(0,0,0,0.4)]',
          vertical ? 'inset-x-0 h-px' : 'inset-y-0 w-px',
        )}
      />
      {children ?? (
        <span
          data-slot="image-compare-handle-grip"
          className={cn(
            'relative z-10 flex size-8 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition-transform',
            'group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2',
            dragging && 'scale-110',
          )}
        >
          <ChevronsLeftRight aria-hidden className={cn('size-4', vertical && 'rotate-90')} />
        </span>
      )}
    </div>
  );
};

export interface ImageCompareLabelProps extends React.ComponentProps<'span'> {
  side: 'before' | 'after';
}

const ImageCompareLabel = ({ side, className, children, ...props }: ImageCompareLabelProps) => {
  const { orientation, dragging } = useImageCompare();

  return (
    <span
      data-slot="image-compare-label"
      data-side={side}
      className={cn(
        'pointer-events-none absolute z-30 rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm transition-opacity duration-200',
        orientation === 'vertical'
          ? side === 'before'
            ? 'start-3 top-3'
            : 'bottom-3 start-3'
          : side === 'before'
            ? 'start-3 top-3'
            : 'end-3 top-3',
        dragging && 'opacity-0',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export { ImageCompare, ImageCompareBefore, ImageCompareAfter, ImageCompareHandle, ImageCompareLabel };
