"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";

import { cn } from "@/lib/utils";

export type LightboxItem = {
  src: string;
  alt?: string;
  caption?: string;
  thumbnail?: string;
};

type LightboxContextValue = {
  items: LightboxItem[];
  index: number;
  loop: boolean;
  zoomed: boolean;
  setZoomed: (zoomed: boolean) => void;
  goTo: (index: number) => void;
  next: () => void;
  prev: () => void;
  canPrev: boolean;
  canNext: boolean;
};

const LightboxContext = React.createContext<LightboxContextValue | null>(null);

function useLightbox() {
  const ctx = React.useContext(LightboxContext);
  if (!ctx) {
    throw new Error(
      "Lightbox compound components must be used inside <Lightbox>",
    );
  }
  return ctx;
}

export type LightboxProps = {
  items: LightboxItem[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  loop?: boolean;
  children?: React.ReactNode;
};

function Lightbox({
  items,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  index: indexProp,
  defaultIndex = 0,
  onIndexChange,
  loop = true,
  children,
}: LightboxProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = openProp ?? internalOpen;
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );

  const [internalIndex, setInternalIndex] = React.useState(defaultIndex);
  const index = indexProp ?? internalIndex;
  const setIndex = React.useCallback(
    (next: number) => {
      if (indexProp === undefined) setInternalIndex(next);
      onIndexChange?.(next);
    },
    [indexProp, onIndexChange],
  );

  const [zoomed, setZoomed] = React.useState(false);

  const count = items.length;

  const goTo = React.useCallback(
    (i: number) => {
      if (count === 0) return;
      const next = loop
        ? ((i % count) + count) % count
        : Math.min(Math.max(i, 0), count - 1);
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
      loop,
      zoomed,
      setZoomed,
      goTo,
      next,
      prev,
      canPrev,
      canNext,
    }),
    [items, index, loop, zoomed, goTo, next, prev, canPrev, canNext],
  );

  return (
    <LightboxContext.Provider value={value}>
      <DialogPrimitive.Root
        data-slot="lightbox"
        open={open}
        onOpenChange={setOpen}
      >
        {children}
      </DialogPrimitive.Root>
    </LightboxContext.Provider>
  );
}

type LightboxTriggerProps = React.ComponentProps<
  typeof DialogPrimitive.Trigger
> & {
  index?: number;
};

function LightboxTrigger({
  index = 0,
  onClick,
  ...props
}: LightboxTriggerProps) {
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
}

function LightboxClose(
  props: React.ComponentProps<typeof DialogPrimitive.Close>,
) {
  return <DialogPrimitive.Close data-slot="lightbox-close" {...props} />;
}

function LightboxPortal(
  props: React.ComponentProps<typeof DialogPrimitive.Portal>,
) {
  return <DialogPrimitive.Portal data-slot="lightbox-portal" {...props} />;
}

function LightboxOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="lightbox-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/90 backdrop-blur-sm",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "duration-200 ease-out motion-reduce:animate-none",
        className,
      )}
      {...props}
    />
  );
}

const chromeButtonClass =
  "inline-flex items-center justify-center rounded-md bg-black/50 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none";

function LightboxContent({
  className,
  children,
  onKeyDown,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  const {
    items,
    index,
    zoomed,
    setZoomed,
    goTo,
    next,
    prev,
    canPrev,
    canNext,
  } = useLightbox();
  const item = items[index];

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

  React.useEffect(() => {
    setPan({ x: 0, y: 0 });
  }, [index, zoomed]);

  function isRtl(el: HTMLElement) {
    return getComputedStyle(el).direction === "rtl";
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const rtl = isRtl(event.currentTarget);
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        if (rtl) prev();
        else next();
        break;
      case "ArrowLeft":
        event.preventDefault();
        if (rtl) next();
        else prev();
        break;
      case "Home":
        event.preventDefault();
        goTo(0);
        break;
      case "End":
        event.preventDefault();
        goTo(items.length - 1);
        break;
      case "z":
      case "Z":
        event.preventDefault();
        setZoomed(!zoomed);
        break;
    }
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
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
    if (zoomed) setPan({ x: drag.panX + dx, y: drag.panY + dy });
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
    if (!drag.moved && target.closest("[data-slot=lightbox-image]")) {
      setZoomed(!zoomed);
    }
  }

  return (
    <LightboxPortal>
      <LightboxOverlay />
      <DialogPrimitive.Content
        data-slot="lightbox-content"
        aria-describedby={undefined}
        onKeyDown={handleKeyDown}
        className={cn(
          "fixed inset-0 z-50 flex flex-col outline-none",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95",
          "duration-200 ease-out motion-reduce:animate-none",
          className,
        )}
        {...props}
      >
        <DialogPrimitive.Title className="sr-only">
          {item?.alt || `Image ${index + 1} of ${items.length}`}
        </DialogPrimitive.Title>
        <div
          data-slot="lightbox-viewport"
          className="flex min-h-0 w-full flex-1 touch-none select-none items-center justify-center overflow-hidden px-14 py-14"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {item ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              data-slot="lightbox-image"
              src={item.src}
              alt={item.alt ?? ""}
              draggable={false}
              className={cn(
                "max-h-full max-w-full object-contain transition-transform duration-200 motion-reduce:transition-none",
                zoomed ? "cursor-grab" : "cursor-zoom-in",
                dragging && zoomed && "cursor-grabbing transition-none",
              )}
              style={{
                transform: zoomed
                  ? `translate(${pan.x}px, ${pan.y}px) scale(2)`
                  : undefined,
              }}
            />
          ) : null}
        </div>
        {item?.caption ? (
          <p
            data-slot="lightbox-caption"
            className="mx-auto mb-3 max-w-prose rounded-md bg-black/50 px-3 py-1.5 text-center text-sm text-white backdrop-blur-sm"
          >
            {item.caption}
          </p>
        ) : null}
        {children}
        <span
          data-slot="lightbox-counter"
          className="absolute start-3 top-3 rounded-full bg-black/50 px-2.5 py-1 font-mono text-xs tabular-nums text-white backdrop-blur-sm"
        >
          {index + 1} / {items.length}
        </span>
        <div className="absolute end-3 top-3 flex items-center gap-2">
          <button
            type="button"
            data-slot="lightbox-zoom"
            aria-label={zoomed ? "Zoom out" : "Zoom in"}
            aria-pressed={zoomed}
            onClick={() => setZoomed(!zoomed)}
            className={chromeButtonClass}
          >
            {zoomed ? (
              <ZoomOut className="size-4" />
            ) : (
              <ZoomIn className="size-4" />
            )}
          </button>
          <DialogPrimitive.Close
            data-slot="lightbox-close"
            aria-label="Close"
            className={chromeButtonClass}
          >
            <X className="size-4" />
          </DialogPrimitive.Close>
        </div>
        {canPrev ? (
          <button
            type="button"
            data-slot="lightbox-prev"
            aria-label="Previous image"
            onClick={prev}
            className={cn(
              chromeButtonClass,
              "absolute start-3 top-1/2 -translate-y-1/2",
            )}
          >
            <ChevronLeft className="size-5 rtl:rotate-180" />
          </button>
        ) : null}
        {canNext ? (
          <button
            type="button"
            data-slot="lightbox-next"
            aria-label="Next image"
            onClick={next}
            className={cn(
              chromeButtonClass,
              "absolute end-3 top-1/2 -translate-y-1/2",
            )}
          >
            <ChevronRight className="size-5 rtl:rotate-180" />
          </button>
        ) : null}
      </DialogPrimitive.Content>
    </LightboxPortal>
  );
}

function LightboxThumbnails({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { items, index, goTo } = useLightbox();
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);

  React.useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    refs.current[index]?.scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: reduce ? "auto" : "smooth",
    });
  }, [index]);

  return (
    <div
      data-slot="lightbox-thumbnails"
      className={cn(
        "mx-auto mb-3 flex max-w-full gap-2 overflow-x-auto p-1",
        className,
      )}
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
          aria-label={item.alt ?? `Go to image ${i + 1}`}
          aria-current={i === index ? "true" : undefined}
          onClick={() => goTo(i)}
          className={cn(
            "size-14 shrink-0 overflow-hidden rounded-md opacity-60 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none",
            i === index && "opacity-100 ring-2 ring-ring",
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.thumbnail ?? item.src}
            alt=""
            draggable={false}
            className="size-full object-cover"
          />
        </button>
      ))}
    </div>
  );
}

export {
  Lightbox,
  LightboxTrigger,
  LightboxClose,
  LightboxPortal,
  LightboxOverlay,
  LightboxContent,
  LightboxThumbnails,
};
