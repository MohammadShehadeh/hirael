"use client"

import * as React from "react"

/**
 * Renders a block in an iframe sized to a fixed simulated viewport,
 * then scale-transforms it to fit the parent card. A ResizeObserver
 * keeps the scale in sync with the container so the preview reads as
 * a faithful, in-card miniature of the desktop layout.
 *
 * Scale is measured in a layout effect (before paint) and the iframe
 * stays hidden until it's known, so the preview never flashes at the
 * wrong size before the first measurement lands.
 */
export function BlockPreview({
  name,
  title,
  /** Simulated viewport the iframe should render at. */
  simWidth = 1280,
  /** Iframe height — chosen with simWidth to fix the preview aspect ratio. */
  simHeight = 720,
}: {
  name: string
  title: string
  simWidth?: number
  simHeight?: number
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [scale, setScale] = React.useState<number | null>(null)

  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      const w = el.clientWidth
      if (w > 0) setScale(w / simWidth)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [simWidth])

  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden border-b border-border bg-card/30"
      style={{ aspectRatio: `${simWidth} / ${simHeight}` }}
    >
      <iframe
        src={`/embed/blocks/${name}`}
        title={`${title} preview`}
        loading="lazy"
        tabIndex={-1}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 origin-top-left border-0"
        style={{
          width: `${simWidth}px`,
          height: `${simHeight}px`,
          transform: scale === null ? undefined : `scale(${scale})`,
          visibility: scale === null ? "hidden" : "visible",
        }}
      />
    </div>
  )
}
