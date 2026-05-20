"use client"

import * as React from "react"

/**
 * Renders a block in an iframe sized to a fixed simulated viewport,
 * then scale-transforms it to fit the parent card. A ResizeObserver
 * keeps the scale in sync with the container so the preview reads as
 * a faithful, in-card miniature of the desktop layout.
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
  const [scale, setScale] = React.useState(0.5)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0
      if (w > 0) setScale(w / simWidth)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [simWidth])

  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden border-b-2 border-border bg-card/30"
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
          transform: `scale(${scale})`,
        }}
      />
    </div>
  )
}
