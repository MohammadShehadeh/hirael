"use client";

import * as React from "react";
import { ArrowRight, Globe } from "lucide-react";

import { Navbar } from "./navbar";
import { InstagramIcon, TwitterIcon } from "./primitives";

const HERO_VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4";
const FADE_MS = 500;
const FADE_OUT_LEAD_S = 0.55;
const RESTART_DELAY_MS = 100;

const SOCIAL_LINKS: {
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}[] = [
  { label: "Instagram", Icon: InstagramIcon },
  { label: "Twitter", Icon: TwitterIcon },
  { label: "Website", Icon: Globe },
];

export function Hero({
  videoSrc = HERO_VIDEO_URL,
  posterSrc,
}: {
  videoSrc?: string;
  posterSrc?: string;
}) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const rafRef = React.useRef<number | null>(null);
  const restartTimerRef = React.useRef<number | null>(null);
  const hasStartedRef = React.useRef(false);
  const isFadingOutRef = React.useRef(false);
  const [videoFailed, setVideoFailed] = React.useState(false);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const play = () => {
      const attempt = video.play();
      if (attempt) attempt.catch(() => {});
    };

    // Honor reduced motion: hold the frame visible and loop natively, with no
    // crossfade animation.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.loop = true;
      video.style.opacity = "1";
      play();
      return;
    }

    const animateOpacity = (from: number, to: number, onDone?: () => void) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min((now - start) / FADE_MS, 1);
        video.style.opacity = String(from + (to - from) * t);
        if (t >= 1) {
          rafRef.current = null;
          onDone?.();
        } else {
          rafRef.current = requestAnimationFrame(step);
        }
      };
      rafRef.current = requestAnimationFrame(step);
    };

    const handleCanPlay = () => {
      if (hasStartedRef.current) return;
      hasStartedRef.current = true;
      play();
      animateOpacity(0, 1);
    };

    const handleTimeUpdate = () => {
      if (isFadingOutRef.current) return;
      if (!Number.isFinite(video.duration)) return;
      const remaining = video.duration - video.currentTime;
      if (remaining <= FADE_OUT_LEAD_S) {
        isFadingOutRef.current = true;
        const current = Number.parseFloat(video.style.opacity || "1");
        animateOpacity(current, 0);
      }
    };

    const handleEnded = () => {
      video.style.opacity = "0";
      restartTimerRef.current = window.setTimeout(() => {
        video.currentTime = 0;
        play();
        isFadingOutRef.current = false;
        animateOpacity(0, 1);
      }, RESTART_DELAY_MS);
    };

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);
    // The first `canplay` may have already fired before this effect ran.
    if (video.readyState >= 3) handleCanPlay();

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
    };
  }, []);

  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden">
      {videoFailed ? (
        <div
          aria-hidden
          className="glow-top absolute inset-0 bg-cover bg-bottom"
          style={
            posterSrc ? { backgroundImage: `url(${posterSrc})` } : undefined
          }
        />
      ) : (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover object-bottom"
          src={videoSrc}
          poster={posterSrc}
          muted
          autoPlay
          playsInline
          preload="auto"
          aria-hidden
          tabIndex={-1}
          style={{ opacity: 0 }}
          onError={() => setVideoFailed(true)}
        />
      )}

      <Navbar />

      <div className="relative z-10 flex flex-1 -translate-y-[20%] flex-col items-center justify-center px-6 py-12 text-center">
        <h1 className="mb-10 text-7xl tracking-tight text-foreground [font-family:var(--font-asme-serif)] sm:whitespace-nowrap md:text-8xl lg:text-9xl">
          Know it <em className="italic">all</em>.
        </h1>

        <form
          onSubmit={(event) => event.preventDefault()}
          className="liquid-glass flex w-full max-w-xl items-center gap-3 rounded-full py-2 pe-2 ps-6"
        >
          <input
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            aria-label="Email address"
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-foreground/40"
          />
          <button
            type="submit"
            aria-label="Subscribe"
            className="shrink-0 rounded-full bg-foreground p-3 text-background transition-colors hover:bg-foreground/90"
          >
            <ArrowRight size={20} className="rtl:rotate-180" />
          </button>
        </form>

        <p className="mt-6 max-w-md px-4 text-sm leading-relaxed text-foreground">
          Stay updated with the latest news and insights. Subscribe to our
          newsletter today and never miss out on exciting updates.
        </p>

        <button
          type="button"
          className="liquid-glass mt-8 rounded-full px-8 py-3 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5"
        >
          Manifesto
        </button>
      </div>

      <footer className="relative z-10 flex justify-center gap-4 pb-12">
        {SOCIAL_LINKS.map(({ label, Icon }) => (
          <a
            key={label}
            href="#"
            aria-label={label}
            className="liquid-glass rounded-full p-4 text-foreground/80 transition-all hover:bg-foreground/5 hover:text-foreground"
          >
            <Icon className="h-5 w-5" />
          </a>
        ))}
      </footer>
    </section>
  );
}
