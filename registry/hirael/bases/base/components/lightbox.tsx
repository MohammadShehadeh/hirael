'use client';

import * as React from 'react';
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface LightboxItem {
  src: string;
  alt?: string;
  caption?: string;
  thumbnail?: string;
}

interface LightboxContextValue {
  items: LightboxItem[];
  index: number;
  zoomed: boolean;
  setZoomed: (zoomed: boolean) => void;
  goTo: (index: number) => void;
  next: () => void;
  prev: () => void;
  canPrev: boolean;
  canNext: boolean;
}

const LightboxContext = React.createContext<LightboxContextValue | null>(null);

const useLightbox = () => {
  const ctx = React.useContext(LightboxContext);
  if (!ctx) {
    throw new Error('Lightbox compound components must be used inside <Lightbox>');
  }

  return ctx;
};

export interface LightboxProps {
  items: LightboxItem[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  loop?: boolean;
  children?: React.ReactNode;
}

const Lightbox = ({
  items,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  index: indexProp,
  defaultIndex = 0,
  onIndexChange,
  loop = true,
  children,
}: LightboxProps) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = openProp ?? internalOpen;
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );

  const count = items.length;
  const [internalIndex, setInternalIndex] = React.useState(defaultIndex);
  const index = Math.min(Math.max(indexProp ?? internalIndex, 0), Math.max(count - 1, 0));
  const setIndex = React.useCallback(
    (next: number) => {
      if (indexProp === undefined) setInternalIndex(next);
      onIndexChange?.(next);
    },
    [indexProp, onIndexChange],
  );

  const [zoomed, setZoomed] = React.useState(false);

  const goTo = React.useCallback(
    (i: number) => {
      if (count === 0) return;
      const next = loop ? ((i % count) + count) % count : Math.min(Math.max(i, 0), count - 1);
      setIndex(next);
      setZoomed(false);
    },
    [count, loop, setIndex],
  );

  const next = React.useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = React.useCallback(() => goTo(index - 1), [goTo, index]);

  const canPrev = loop ? count > 1 : index > 0;
  const canNext = loop ? count > 1 : index < count - 1;

  React.useEffect(() => {
    if (!open || count === 0) return;
    for (const i of [index - 1, index + 1]) {
      const item = items[loop ? ((i % count) + count) % count : i];
      if (item) {
        const img = new window.Image();
        img.src = item.src;
      }
    }
  }, [open, index, items, count, loop]);

  const value = React.useMemo<LightboxContextValue>(
    () => ({
      items,
      index,
      zoomed,
      setZoomed,
      goTo,
      next,
      prev,
      canPrev,
      canNext,
    }),
    [items, index, zoomed, goTo, next, prev, canPrev, canNext],
  );

  return (
    <LightboxContext.Provider value={value}>
      <DialogPrimitive.Root data-slot="lightbox" open={open} onOpenChange={setOpen}>
        {children}
      </DialogPrimitive.Root>
    </LightboxContext.Provider>
  );
};

interface LightboxTriggerProps extends DialogPrimitive.Trigger.Props {
  index?: number;
}

const LightboxTrigger = ({ index = 0, onClick, ...props }: LightboxTriggerProps) => {
  const { goTo } = useLightbox();

  return (
    <DialogPrimitive.Trigger
      data-slot="lightbox-trigger"
      onClick={(event) => {
        goTo(index);
        onClick?.(event);
      }}
      {...props}
    />
  );
};

const LightboxClose = (props: DialogPrimitive.Close.Props) => {
  return <DialogPrimitive.Close data-slot="lightbox-close" {...props} />;
};

const LightboxPortalContext = React.createContext(false);

/** Wrap `LightboxContent` in this to compose your own overlay; the content then skips its built-in portal and overlay. */
const LightboxPortal = (props: DialogPrimitive.Portal.Props) => {
  return (
    <LightboxPortalContext.Provider value>
      <DialogPrimitive.Portal data-slot="lightbox-portal" {...props} />
    </LightboxPortalContext.Provider>
  );
};

const LightboxOverlay = ({ className, ...props }: DialogPrimitive.Backdrop.Props) => {
  return (
    <DialogPrimitive.Backdrop
      data-slot="lightbox-overlay"
      className={cn(
        'fixed inset-0 z-50 bg-black/90 backdrop-blur-sm',
        'transition-opacity duration-200 ease-out data-ending-style:opacity-0 data-starting-style:opacity-0',
        'motion-reduce:transition-none',
        className,
      )}
      {...props}
    />
  );
};

const chromeButtonClass =
  'inline-flex items-center justify-center rounded-md bg-background/60 p-2 text-foreground backdrop-blur-sm transition-colors hover:bg-background/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none';

export interface LightboxLabels {
  zoomIn: string;
  zoomOut: string;
  close: string;
  previous: string;
  next: string;
  /** Dialog title for an item without `alt`. */
  image: (index: number, count: number) => string;
}

const defaultLabels: LightboxLabels = {
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  close: 'Close',
  previous: 'Previous image',
  next: 'Next image',
  image: (index, count) => `Image ${index + 1} of ${count}`,
};

const ZOOM_SCALE = 2;

const isEditableTarget = (target: EventTarget) => {
  if (!(target instanceof HTMLElement)) return false;

  return target.isContentEditable || target.closest('input, textarea, select') !== null;
};

type LightboxKeyDownEvent = Parameters<NonNullable<DialogPrimitive.Popup.Props['onKeyDown']>>[0];

export interface LightboxContentProps extends DialogPrimitive.Popup.Props {
  /** Accessible names for the built-in controls. */
  labels?: Partial<LightboxLabels>;
}

const LightboxContent = ({ labels, className, children, onKeyDown, ...props }: LightboxContentProps) => {
  const { items, index, zoomed, setZoomed, goTo, next, prev, canPrev, canNext } = useLightbox();
  const inPortal = React.useContext(LightboxPortalContext);
  const item = items[index];
  const text = React.useMemo(() => ({ ...defaultLabels, ...labels }), [labels]);
  const viewportRef = React.useRef<HTMLDivElement | null>(null);
  const imageRef = React.useRef<HTMLImageElement | null>(null);

  const [pan, setPan] = React.useState({ x: 0, y: 0 });
  const [dragging, setDragging] = React.useState(false);
  const dragRef = React.useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    panX: number;
    panY: number;
    moved: boolean;
  } | null>(null);

  const panKey = `${index}:${zoomed}`;
  const [lastPanKey, setLastPanKey] = React.useState(panKey);
  if (lastPanKey !== panKey) {
    setLastPanKey(panKey);
    setPan({ x: 0, y: 0 });
  }

  function isRtl(el: HTMLElement) {
    return getComputedStyle(el).direction === 'rtl';
  }

  function clampPan(x: number, y: number) {
    const viewport = viewportRef.current;
    const image = imageRef.current;
    if (!viewport || !image) return { x, y };
    const maxX = Math.max(0, (image.offsetWidth * ZOOM_SCALE - viewport.clientWidth) / 2);
    const maxY = Math.max(0, (image.offsetHeight * ZOOM_SCALE - viewport.clientHeight) / 2);

    return { x: Math.min(maxX, Math.max(-maxX, x)), y: Math.min(maxY, Math.max(-maxY, y)) };
  }

  function handleKeyDown(event: LightboxKeyDownEvent) {
    onKeyDown?.(event);
    if (event.defaultPrevented || isEditableTarget(event.target)) return;
    const rtl = isRtl(event.currentTarget);
    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        if (rtl) prev();
        else next();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        if (rtl) next();
        else prev();
        break;
      case 'Home':
        event.preventDefault();
        goTo(0);
        break;
      case 'End':
        event.preventDefault();
        goTo(items.length - 1);
        break;
      case 'z':
      case 'Z':
        event.preventDefault();
        setZoomed(!zoomed);
        break;
    }
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      panX: pan.x,
      panY: pan.y,
      moved: false,
    };
    setDragging(true);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) drag.moved = true;
    if (zoomed) setPan(clampPan(drag.panX + dx, drag.panY + dy));
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setDragging(false);
    const dx = event.clientX - drag.startX;
    if (!zoomed && Math.abs(dx) > 64) {
      const rtl = isRtl(event.currentTarget);
      if (dx < 0) {
        if (rtl) prev();
        else next();
      } else {
        if (rtl) next();
        else prev();
      }

      return;
    }
    const target = event.target as HTMLElement;
    if (!drag.moved && target.closest('[data-slot=lightbox-image]')) {
      setZoomed(!zoomed);
    }
  }

  function handlePointerCancel(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setDragging(false);
    if (zoomed) setPan({ x: drag.panX, y: drag.panY });
  }

  const content = (
    <DialogPrimitive.Popup
      data-slot="lightbox-content"
      onKeyDown={handleKeyDown}
      className={cn(
        'fixed inset-0 z-50 flex flex-col outline-none',
        'transition-[opacity,transform] duration-200 ease-out data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0',
        'motion-reduce:transition-none',
        className,
      )}
      {...props}
    >
      <DialogPrimitive.Title className="sr-only">{item?.alt || text.image(index, items.length)}</DialogPrimitive.Title>
      <div
        ref={viewportRef}
        data-slot="lightbox-viewport"
        className="flex min-h-0 w-full flex-1 touch-none items-center justify-center overflow-hidden px-14 py-14 select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        {item ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            ref={imageRef}
            data-slot="lightbox-image"
            src={item.src}
            alt={item.alt ?? ''}
            draggable={false}
            className={cn(
              'max-h-full max-w-full object-contain transition-transform duration-200 motion-reduce:transition-none',
              zoomed ? 'cursor-grab' : 'cursor-zoom-in',
              dragging && zoomed && 'cursor-grabbing transition-none',
            )}
            style={{
              transform: zoomed ? `translate(${pan.x}px, ${pan.y}px) scale(${ZOOM_SCALE})` : undefined,
            }}
          />
        ) : null}
      </div>
      {item?.caption ? (
        <p
          data-slot="lightbox-caption"
          className="mx-auto mb-3 max-w-prose rounded-md bg-background/60 px-3 py-1.5 text-center text-sm text-foreground backdrop-blur-sm"
        >
          {item.caption}
        </p>
      ) : null}
      {children}
      <span
        data-slot="lightbox-counter"
        className="absolute start-3 top-3 rounded-full bg-background/60 px-2.5 py-1 text-xs text-foreground tabular-nums backdrop-blur-sm"
      >
        {index + 1} / {items.length}
      </span>
      <div className="absolute end-3 top-3 flex items-center gap-2">
        <button
          type="button"
          data-slot="lightbox-zoom"
          aria-label={zoomed ? text.zoomOut : text.zoomIn}
          aria-pressed={zoomed}
          onClick={() => setZoomed(!zoomed)}
          className={chromeButtonClass}
        >
          {zoomed ? <ZoomOut className="size-4" /> : <ZoomIn className="size-4" />}
        </button>
        <DialogPrimitive.Close data-slot="lightbox-close" aria-label={text.close} className={chromeButtonClass}>
          <X className="size-4" />
        </DialogPrimitive.Close>
      </div>
      {canPrev ? (
        <button
          type="button"
          data-slot="lightbox-prev"
          aria-label={text.previous}
          onClick={prev}
          className={cn(chromeButtonClass, 'absolute start-3 top-1/2 -translate-y-1/2')}
        >
          <ChevronLeft className="size-5 rtl:rotate-180" />
        </button>
      ) : null}
      {canNext ? (
        <button
          type="button"
          data-slot="lightbox-next"
          aria-label={text.next}
          onClick={next}
          className={cn(chromeButtonClass, 'absolute end-3 top-1/2 -translate-y-1/2')}
        >
          <ChevronRight className="size-5 rtl:rotate-180" />
        </button>
      ) : null}
    </DialogPrimitive.Popup>
  );

  if (inPortal) return content;

  return (
    <LightboxPortal>
      <LightboxOverlay />
      {content}
    </LightboxPortal>
  );
};

export interface LightboxThumbnailsProps extends React.ComponentProps<'div'> {
  /** Accessible name for a thumbnail whose item has no `alt`. */
  getLabel?: (index: number) => string;
}

const defaultThumbnailLabel = (index: number) => `Go to image ${index + 1}`;

const LightboxThumbnails = ({ getLabel = defaultThumbnailLabel, className, ...props }: LightboxThumbnailsProps) => {
  const { items, index, goTo } = useLightbox();
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);

  React.useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    refs.current[index]?.scrollIntoView({
      block: 'nearest',
      inline: 'nearest',
      behavior: reduce ? 'auto' : 'smooth',
    });
  }, [index]);

  return (
    <div
      data-slot="lightbox-thumbnails"
      className={cn('mx-auto mb-3 flex max-w-full gap-2 overflow-x-auto p-1', className)}
      {...props}
    >
      {items.map((item, i) => (
        <button
          key={`${item.src}-${i}`}
          type="button"
          ref={(el) => {
            refs.current[i] = el;
          }}
          data-slot="lightbox-thumbnail"
          data-active={i === index || undefined}
          aria-label={item.alt ?? getLabel(i)}
          aria-current={i === index ? 'true' : undefined}
          onClick={() => goTo(i)}
          className={cn(
            'size-14 shrink-0 overflow-hidden rounded-md opacity-60 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none motion-reduce:transition-none',
            i === index && 'opacity-100 ring-2 ring-ring',
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.thumbnail ?? item.src} alt="" draggable={false} className="size-full object-cover" />
        </button>
      ))}
    </div>
  );
};

export {
  Lightbox,
  LightboxTrigger,
  LightboxClose,
  LightboxPortal,
  LightboxOverlay,
  LightboxContent,
  LightboxThumbnails,
};
