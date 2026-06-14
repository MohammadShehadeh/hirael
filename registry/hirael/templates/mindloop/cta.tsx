"use client";

import * as React from "react";
import { motion } from "framer-motion";

import { Logo, Serif, useFadeUp } from "./primitives";

const CTA_HLS =
  "https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8";

function HlsBackgroundVideo({
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

    import("hls.js").then(({ default: Hls }) => {
      if (cancelled) return;
      const el = ref.current;
      if (!el) return;
      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(el);
      } else if (el.canPlayType("application/vnd.apple.mpegurl")) {
        el.src = src;
      }
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
    />
  );
}

export function Cta() {
  const fade = useFadeUp();

  return (
    <section className="relative overflow-hidden border-t border-border/30 px-8 py-32 md:px-28 md:py-44">
      <HlsBackgroundVideo
        src={CTA_HLS}
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />
      <div aria-hidden className="absolute inset-0 z-[1] bg-background/45" />

      <motion.div
        {...fade(0)}
        className="relative z-10 mx-auto flex max-w-2xl flex-col items-center text-center"
      >
        <Logo size="lg" />

        <h2 className="mt-8 w-full text-4xl tracking-[-1px] md:text-6xl">
          Start Your <Serif>Journey</Serif>
        </h2>

        <p className="mt-6 w-full max-w-lg text-lg text-muted-foreground">
          Read what matters, write what lasts, and find the people who care
          about the same things you do.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <motion.a
            href="#"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-lg bg-foreground px-8 py-3.5 text-sm font-semibold text-background"
          >
            Subscribe Now
          </motion.a>
          <motion.a
            href="#"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="liquid-glass rounded-lg px-8 py-3.5 text-sm font-semibold text-foreground"
          >
            Start Writing
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
}
