'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { composeRefs } from '@/registry/hirael/bases/base/components/compose-refs';

export type ResizableOrientation = 'horizontal' | 'vertical';

/** @deprecated Use `ResizableOrientation`. */
export type ResizableDirection = ResizableOrientation;

interface ResizableContextValue {
  orientation: ResizableOrientation;
  resizeEpoch: number;
  notifyResize: () => void;
}

const ResizableContext = React.createContext<ResizableContextValue | null>(null);

const useResizable = () => {
  const ctx = React.useContext(ResizableContext);
  if (!ctx) {
    throw new Error('ResizableHandle must be used within <ResizablePanelGroup>');
  }

  return ctx;
};

export interface ResizablePanelGroupProps extends React.ComponentProps<'div'> {
  orientation?: ResizableOrientation;
  /** @deprecated Use `orientation`. */
  direction?: ResizableOrientation;
}

const ResizablePanelGroup = ({
  orientation: orientationProp,
  direction,
  className,
  ...props
}: ResizablePanelGroupProps) => {
  const orientation = orientationProp ?? direction ?? 'horizontal';
  const [resizeEpoch, setResizeEpoch] = React.useState(0);
  const notifyResize = React.useCallback(() => setResizeEpoch((epoch) => epoch + 1), []);
  const value = React.useMemo<ResizableContextValue>(
    () => ({ orientation, resizeEpoch, notifyResize }),
    [orientation, resizeEpoch, notifyResize],
  );

  return (
    <ResizableContext.Provider value={value}>
      <div
        data-slot="resizable-panel-group"
        data-orientation={orientation}
        data-direction={orientation}
        className={cn('flex min-h-0 min-w-0', orientation === 'vertical' ? 'flex-col' : 'flex-row', className)}
        {...props}
      />
    </ResizableContext.Provider>
  );
};

export interface ResizablePanelProps extends React.ComponentProps<'div'> {
  /** Initial size as a proportion shared across sibling panels. */
  defaultSize?: number;
  /** Minimum size as a percentage of the group. */
  minSize?: number;
}

const ResizablePanel = ({ defaultSize = 50, minSize = 10, className, style, ...props }: ResizablePanelProps) => {
  return (
    <div
      data-slot="resizable-panel"
      data-min-size={minSize}
      className={cn('min-h-0 min-w-0 overflow-auto', className)}
      style={{ flexGrow: defaultSize, flexShrink: 1, flexBasis: 0, ...style }}
      {...props}
    />
  );
};

export type ResizableHandleProps = React.ComponentProps<'div'>;

const DEFAULT_RANGE = { now: 50, min: 0, max: 100 };

const ResizableHandle = ({ className, ref, onPointerDown, onKeyDown, ...props }: ResizableHandleProps) => {
  const { orientation, resizeEpoch, notifyResize } = useResizable();
  const isHorizontal = orientation === 'horizontal';
  const localRef = React.useRef<HTMLDivElement | null>(null);
  const [range, setRange] = React.useState(DEFAULT_RANGE);

  const measure = React.useCallback(
    (handle: HTMLElement) => {
      const prev = handle.previousElementSibling as HTMLElement | null;
      const next = handle.nextElementSibling as HTMLElement | null;
      if (!prev || !next) return DEFAULT_RANGE;
      const prevSize = isHorizontal ? prev.clientWidth : prev.clientHeight;
      const nextSize = isHorizontal ? next.clientWidth : next.clientHeight;
      const totalSize = prevSize + nextSize;
      if (totalSize <= 0) return DEFAULT_RANGE;
      const group = handle.parentElement;
      const groupSize = group ? (isHorizontal ? group.clientWidth : group.clientHeight) : totalSize;
      const prevMin = (parseFloat(prev.dataset.minSize || '0') / 100) * groupSize;
      const nextMin = (parseFloat(next.dataset.minSize || '0') / 100) * groupSize;

      return {
        now: Math.round((prevSize / totalSize) * 100),
        min: Math.round((prevMin / totalSize) * 100),
        max: Math.round(((totalSize - nextMin) / totalSize) * 100),
      };
    },
    [isHorizontal],
  );

  React.useEffect(() => {
    if (localRef.current) setRange(measure(localRef.current));
  }, [measure, resizeEpoch]);

  React.useEffect(() => {
    const group = localRef.current?.parentElement;
    if (!group || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => {
      if (localRef.current) setRange(measure(localRef.current));
    });
    observer.observe(group);

    return () => observer.disconnect();
  }, [measure]);

  const resize = (handle: HTMLElement, deltaPx: number) => {
    const prev = handle.previousElementSibling as HTMLElement | null;
    const next = handle.nextElementSibling as HTMLElement | null;
    const group = handle.parentElement;
    if (!prev || !next || !group) return;
    const groupSize = isHorizontal ? group.clientWidth : group.clientHeight;
    const prevSize = isHorizontal ? prev.clientWidth : prev.clientHeight;
    const nextSize = isHorizontal ? next.clientWidth : next.clientHeight;
    const totalSize = prevSize + nextSize;
    if (totalSize <= 0) return;
    const prevGrow = parseFloat(prev.style.flexGrow || '1');
    const nextGrow = parseFloat(next.style.flexGrow || '1');
    const totalGrow = prevGrow + nextGrow;
    const prevMin = (parseFloat(prev.dataset.minSize || '0') / 100) * groupSize;
    const nextMin = (parseFloat(next.dataset.minSize || '0') / 100) * groupSize;
    let newPrev = prevSize + deltaPx;
    newPrev = Math.max(prevMin, Math.min(totalSize - nextMin, newPrev));
    const newPrevGrow = (newPrev / totalSize) * totalGrow;
    prev.style.flexGrow = String(newPrevGrow);
    next.style.flexGrow = String(totalGrow - newPrevGrow);
    // Re-measuring after the style writes would force a synchronous layout per pointermove.
    const nextRange = {
      now: Math.round((newPrev / totalSize) * 100),
      min: Math.round((prevMin / totalSize) * 100),
      max: Math.round(((totalSize - nextMin) / totalSize) * 100),
    };
    setRange((current) =>
      current.now === nextRange.now && current.min === nextRange.min && current.max === nextRange.max
        ? current
        : nextRange,
    );
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    onPointerDown?.(event);
    if (event.defaultPrevented) return;
    event.preventDefault();
    const handle = event.currentTarget;
    handle.setPointerCapture(event.pointerId);
    const rtl = isHorizontal && getComputedStyle(handle).direction === 'rtl';
    let last = isHorizontal ? event.clientX : event.clientY;
    const onMove = (ev: PointerEvent) => {
      const current = isHorizontal ? ev.clientX : ev.clientY;
      let delta = current - last;
      if (rtl) delta = -delta;
      last = current;
      resize(handle, delta);
    };
    const onUp = (ev: PointerEvent) => {
      if (handle.hasPointerCapture(ev.pointerId)) {
        handle.releasePointerCapture(ev.pointerId);
      }
      handle.removeEventListener('pointermove', onMove);
      handle.removeEventListener('pointerup', onUp);
      handle.removeEventListener('pointercancel', onUp);
      // Siblings share the space that moved; they re-measure once, not per pointermove.
      notifyResize();
    };
    handle.addEventListener('pointermove', onMove);
    handle.addEventListener('pointerup', onUp);
    handle.addEventListener('pointercancel', onUp);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const handle = event.currentTarget;
    const group = handle.parentElement;
    if (!group) return;
    const rtl = isHorizontal && getComputedStyle(handle).direction === 'rtl';
    const step = event.shiftKey ? 0.1 : 0.02;
    const groupSize = isHorizontal ? group.clientWidth : group.clientHeight;
    let dir = 0;
    if (isHorizontal) {
      if (event.key === 'ArrowLeft') dir = -1;
      else if (event.key === 'ArrowRight') dir = 1;
      if (rtl) dir = -dir;
    } else {
      if (event.key === 'ArrowUp') dir = -1;
      else if (event.key === 'ArrowDown') dir = 1;
    }
    if (dir !== 0) {
      event.preventDefault();
      resize(handle, dir * step * groupSize);
      notifyResize();
    }
  };

  const composedRef = React.useMemo(() => composeRefs(localRef, ref), [ref]);

  return (
    <div
      ref={composedRef}
      role="separator"
      tabIndex={0}
      aria-orientation={isHorizontal ? 'vertical' : 'horizontal'}
      aria-valuenow={range.now}
      aria-valuemin={range.min}
      aria-valuemax={range.max}
      data-slot="resizable-handle"
      className={cn(
        'relative shrink-0 bg-border transition-colors hover:bg-ring focus-visible:bg-ring focus-visible:outline-none',
        isHorizontal
          ? 'w-px cursor-col-resize before:absolute before:-inset-x-1 before:inset-y-0'
          : 'h-px cursor-row-resize before:absolute before:inset-x-0 before:-inset-y-1',
        className,
      )}
      {...props}
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
    />
  );
};

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
