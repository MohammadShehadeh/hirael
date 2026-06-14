"use client"

import * as React from "react"
import Hls from "hls.js"

import { cn } from "@/lib/utils"

/**
 * Background HLS video. Uses hls.js where MSE is available and falls back to
 * native HLS (Safari) otherwise. Autoplays muted and loops; defaults to a
 * full-cover backdrop, with positioning overridable via `className`.
 */
export function HlsVideo({
  src,
  className,
}: {
  src: string
  className?: string
}) {
  const ref = React.useRef<HTMLVideoElement>(null)

  React.useEffect(() => {
    const video = ref.current
    if (!video) return

    let hls: Hls | undefined
    if (Hls.isSupported()) {
      hls = new Hls()
      hls.loadSource(src)
      hls.attachMedia(video)
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src
    }

    const play = () => {
      const attempt = video.play()
      if (attempt) attempt.catch(() => {})
    }
    video.addEventListener("loadedmetadata", play)

    return () => {
      video.removeEventListener("loadedmetadata", play)
      hls?.destroy()
    }
  }, [src])

  return (
    <video
      ref={ref}
      autoPlay
      loop
      muted
      playsInline
      aria-hidden="true"
      tabIndex={-1}
      className={cn("absolute inset-0 z-0 h-full w-full object-cover", className)}
    />
  )
}
