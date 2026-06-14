"use client"

import * as React from "react"
import Hls from "hls.js"

/**
 * Background HLS video. Uses hls.js where MSE is available and falls back to
 * native HLS (Safari) otherwise. Autoplays muted and loops; positioning and
 * sizing come from `className` so the same player serves the hero and the
 * vertically flipped footer.
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
      hls = new Hls({ enableWorker: true, lowLatencyMode: false })
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
      muted
      loop
      playsInline
      aria-hidden="true"
      tabIndex={-1}
      className={className}
    />
  )
}

export const HLS_STREAM =
  "https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8"
