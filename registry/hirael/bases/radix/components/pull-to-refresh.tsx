'use client';

import * as React from 'react';
import { ArrowDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Spinner } from '@/registry/hirael/bases/radix/ui/spinner';

export interface PullToRefreshLabels {
  pull: string;
  release: string;
  refreshing: string;
}

const DEFAULT_LABELS: PullToRefreshLabels = {
  pull: 'Pull to refresh',
  release: 'Release to refresh',
  refreshing: 'Refreshing',
};

export interface PullToRefreshProps extends React.ComponentProps<'div'> {
  /** Runs when the reader pulls past the threshold. The spinner shows until it settles. */
  onRefresh: () => Promise<unknown> | void;
  /** Pixels to pull before letting go refreshes. */
  threshold?: number;
  /** Also respond to mouse drags, which helps on desktop and in demos. */
  mouse?: boolean;
  disabled?: boolean;
  labels?: Partial<PullToRefreshLabels>;
}

/**
 * A scroll area that refreshes when pulled down from the top, like a mobile feed.
 * It is the scroll container itself, so give it a height.
 */
const PullToRefresh = ({
  onRefresh,
  threshold = 72,
  mouse = false,
  disabled = false,
  labels,
  className,
  children,
  ...props
}: PullToRefreshProps) => {
  const text = { ...DEFAULT_LABELS, ...labels };
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [pull, setPull] = React.useState(0);
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefreshRef = React.useRef(onRefresh);

  React.useLayoutEffect(() => {
    onRefreshRef.current = onRefresh;
  });

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el || disabled || refreshing) return;
    let startY: number | null = null;
    let current = 0;

    // Rubber-band: the further the pull, the less each pixel moves the content.
    const resist = (dy: number) => Math.min(threshold * 1.6, dy * 0.5);

    const begin = (y: number) => {
      startY = el.scrollTop <= 0 ? y : null;
      current = 0;
    };
    const move = (y: number, event: Event) => {
      if (startY === null) return;
      const dy = y - startY;
      if (dy <= 0) {
        current = 0;
        setPull(0);

        return;
      }
      // While pulling, the page must not scroll or bounce underneath.
      if (event.cancelable) event.preventDefault();
      current = resist(dy);
      setPull(current);
    };
    const end = () => {
      if (startY === null) return;
      startY = null;
      if (current < threshold) {
        setPull(0);

        return;
      }
      setPull(threshold * 0.75);
      setRefreshing(true);
      void Promise.resolve(onRefreshRef.current()).finally(() => {
        setRefreshing(false);
        setPull(0);
      });
    };

    const onTouchStart = (event: TouchEvent) => begin(event.touches[0].clientY);
    const onTouchMove = (event: TouchEvent) => move(event.touches[0].clientY, event);
    const onMouseDown = (event: MouseEvent) => {
      if (event.button !== 0) return;
      begin(event.clientY);
      const onMouseMove = (moveEvent: MouseEvent) => move(moveEvent.clientY, moveEvent);
      const onMouseUp = () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        end();
      };
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    // Not passive, so a pull can stop the native scroll.
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', end);
    el.addEventListener('touchcancel', end);
    if (mouse) el.addEventListener('mousedown', onMouseDown);

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', end);
      el.removeEventListener('touchcancel', end);
      el.removeEventListener('mousedown', onMouseDown);
    };
  }, [disabled, refreshing, threshold, mouse]);

  const progress = Math.min(1, pull / threshold);
  const ready = progress >= 1;
  const settling = pull === 0 || refreshing;

  return (
    <div
      ref={scrollRef}
      data-slot="pull-to-refresh"
      data-refreshing={refreshing || undefined}
      aria-busy={refreshing || undefined}
      className={cn('relative overflow-y-auto overscroll-y-contain', mouse && 'select-none', className)}
      {...props}
    >
      <div
        aria-hidden={!refreshing}
        data-slot="pull-to-refresh-indicator"
        className="pointer-events-none absolute inset-x-0 top-0 flex items-end justify-center overflow-hidden text-xs text-muted-foreground"
        style={{ height: pull }}
      >
        <span className="flex items-center gap-2 pb-3" style={{ opacity: refreshing ? 1 : progress }}>
          {refreshing ? (
            <Spinner />
          ) : (
            <ArrowDown aria-hidden className={cn('size-4 transition-transform duration-200', ready && 'rotate-180')} />
          )}
          <span role={refreshing ? 'status' : undefined}>
            {refreshing ? text.refreshing : ready ? text.release : text.pull}
          </span>
        </span>
      </div>
      <div
        data-slot="pull-to-refresh-content"
        className={cn(settling && 'transition-transform duration-300 ease-out motion-reduce:transition-none')}
        style={{ transform: `translateY(${pull}px)` }}
      >
        {children}
      </div>
    </div>
  );
};

export { PullToRefresh };
