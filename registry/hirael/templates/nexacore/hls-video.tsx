"use client";

import * as React from "react";

/**
 * Plays an HLS stream cropped into the circular frame. Loads hls.js lazily
 * so it never weighs on the initial bundle, pins the top rendition once the
 * manifest parses, and falls back to native HLS on Safari.
 */
export function HlsVideo({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  const ref = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    const video = ref.current;
    if (!video) return;
    let hls: InstanceType<(typeof import("hls.js"))["default"]> | undefined;
    let cancelled = false;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      void video.play().catch(() => {});
      return;
    }

    import("hls.js").then(({ default: Hls }) => {
      if (cancelled) return;
      const el = ref.current;
      if (!el || !Hls.isSupported()) return;
      hls = new Hls({
        startLevel: -1,
        capLevelToPlayerSize: false,
        maxMaxBufferLength: 60,
        enableWorker: true,
      });
      hls.loadSource(src);
      hls.attachMedia(el);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (!hls) return;
        hls.currentLevel = hls.levels.length - 1;
        void el.play().catch(() => {});
      });
    });

    return () => {
      cancelled = true;
      hls?.destroy();
    };
  }, [src]);

  return (
    <video
      ref={ref}
      className={className}
      autoPlay
      loop
      muted
      playsInline
      aria-hidden
      style={{
        width: "160%",
        height: "160%",
        objectFit: "cover",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    />
  );
}
