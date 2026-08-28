'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

type SplitOrientation = 'horizontal' | 'vertical';

interface SplitViewContextValue {
  orientation: SplitOrientation;
  size: number;
  dragging: boolean;
  onResizerPointerDown: (event: React.PointerEvent) => void;
  onResizerKeyDown: (event: React.KeyboardEvent) => void;
}

const SplitViewContext = React.createContext<SplitViewContextValue | null>(null);

const useSplitView = () => {
  const ctx = React.useContext(SplitViewContext);
  if (!ctx) {
    throw new Error('SplitView parts must be used within <SplitView>');
  }
  return ctx;
};

const isRtl = (el: HTMLElement | null) => {
  return el ? getComputedStyle(el).direction === 'rtl' : false;
};

interface SplitViewProps extends React.ComponentProps<'div'> {
  orientation?: SplitOrientation;
  /** Size of the first panel, as a percentage. */
  defaultSize?: number;
  /** Minimum size of the first panel, as a percentage. */
  minSize?: number;
  /** Maximum size of the first panel, as a percentage. */
  maxSize?: number;
}

const SplitView = ({
  orientation = 'horizontal',
  defaultSize = 50,
  minSize = 15,
  maxSize = 85,
  className,
  style,
  children,
  ...props
}: SplitViewProps) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [size, setSize] = React.useState(defaultSize);
  const [dragging, setDragging] = React.useState(false);

  const clamp = React.useCallback((value: number) => Math.min(maxSize, Math.max(minSize, value)), [minSize, maxSize]);

  const resizeToPointer = React.useCallback(
    (clientX: number, clientY: number) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      let pct =
        orientation === 'horizontal'
          ? ((clientX - rect.left) / rect.width) * 100
          : ((clientY - rect.top) / rect.height) * 100;
      if (orientation === 'horizontal' && isRtl(el)) pct = 100 - pct;
      setSize(clamp(pct));
    },
    [orientation, clamp],
  );

  const onResizerPointerDown = React.useCallback(
    (event: React.PointerEvent) => {
      event.preventDefault();
      const handle = event.currentTarget as HTMLElement;
      handle.setPointerCapture(event.pointerId);
      setDragging(true);
      const onMove = (ev: PointerEvent) => resizeToPointer(ev.clientX, ev.clientY);
      const onUp = (ev: PointerEvent) => {
        if (handle.hasPointerCapture(ev.pointerId)) {
          handle.releasePointerCapture(ev.pointerId);
        }
        handle.removeEventListener('pointermove', onMove);
        handle.removeEventListener('pointerup', onUp);
        setDragging(false);
      };
      handle.addEventListener('pointermove', onMove);
      handle.addEventListener('pointerup', onUp);
    },
    [resizeToPointer],
  );

  const onResizerKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      const step = event.shiftKey ? 10 : 2;
      let delta = 0;
      if (orientation === 'horizontal') {
        if (event.key === 'ArrowLeft') delta = -step;
        else if (event.key === 'ArrowRight') delta = step;
        if (isRtl(ref.current)) delta = -delta;
      } else {
        if (event.key === 'ArrowUp') delta = -step;
        else if (event.key === 'ArrowDown') delta = step;
      }
      if (delta !== 0) {
        event.preventDefault();
        setSize((value) => clamp(value + delta));
      }
    },
    [orientation, clamp],
  );

  const value = React.useMemo<SplitViewContextValue>(
    () => ({
      orientation,
      size,
      dragging,
      onResizerPointerDown,
      onResizerKeyDown,
    }),
    [orientation, size, dragging, onResizerPointerDown, onResizerKeyDown],
  );

  return (
    <SplitViewContext.Provider value={value}>
      <div
        ref={ref}
        data-slot="split-view"
        data-orientation={orientation}
        className={cn(
          'flex min-h-0 min-w-0 overflow-hidden rounded-lg border border-border bg-card',
          orientation === 'vertical' ? 'flex-col' : 'flex-row',
          dragging && 'select-none',
          '[&>[data-slot=split-view-panel]:first-child]:shrink-0 [&>[data-slot=split-view-panel]:first-child]:grow-0 [&>[data-slot=split-view-panel]:first-child]:basis-[var(--split-pos)]',
          '[&>[data-slot=split-view-panel]:last-child]:flex-1',
          className,
        )}
        style={{ ['--split-pos' as string]: `${size}%`, ...style }}
        {...props}
      >
        {children}
      </div>
    </SplitViewContext.Provider>
  );
};

type SplitViewPanelProps = React.ComponentProps<'div'>;

const SplitViewPanel = ({ className, ...props }: SplitViewPanelProps) => {
  return <div data-slot="split-view-panel" className={cn('min-h-0 min-w-0 overflow-auto', className)} {...props} />;
};

type SplitViewResizerProps = React.ComponentProps<'div'>;

const SplitViewResizer = ({ className, ...props }: SplitViewResizerProps) => {
  const { orientation, size, dragging, onResizerPointerDown, onResizerKeyDown } = useSplitView();
  return (
    <div
      role="separator"
      tabIndex={0}
      aria-orientation={orientation === 'horizontal' ? 'vertical' : 'horizontal'}
      aria-valuenow={Math.round(size)}
      aria-valuemin={0}
      aria-valuemax={100}
      data-slot="split-view-resizer"
      data-dragging={dragging ? '' : undefined}
      onPointerDown={onResizerPointerDown}
      onKeyDown={onResizerKeyDown}
      className={cn(
        'relative shrink-0 bg-border transition-colors hover:bg-ring focus-visible:outline-none focus-visible:bg-ring data-[dragging]:bg-ring',
        orientation === 'horizontal'
          ? 'w-px cursor-col-resize before:absolute before:inset-y-0 before:-inset-x-1'
          : 'h-px cursor-row-resize before:absolute before:inset-x-0 before:-inset-y-1',
        className,
      )}
      {...props}
    />
  );
};

export { SplitView, SplitViewPanel, SplitViewResizer };
