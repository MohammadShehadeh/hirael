"use client";

import * as React from "react";
import gsap from "gsap";

import { cn } from "@/lib/utils";

import { HLS_STREAM, HlsVideo } from "./hls-video";
import { ArrowUpRight, RingLink } from "./primitives";

const EMAIL = "hello@johndoe.com";

const SOCIALS = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com/",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  {
    label: "Dribbble",
    href: "https://dribbble.com/",
    path: "M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12c6.627 0 12-5.373 12-12S18.626 0 12 0zm9.885 11.441c-2.575-.422-4.943-.445-7.103-.073-.244-.563-.497-1.125-.767-1.68 2.31-1 4.165-2.358 5.548-4.082 1.35 1.594 2.197 3.619 2.322 5.835zm-3.842-7.282c-1.205 1.554-2.868 2.783-4.986 3.68-1.016-1.861-2.178-3.676-3.488-5.438.927-.222 1.896-.34 2.892-.34 2.138 0 4.1.733 5.582 1.97v.128zM7.5 1.715c1.331 1.752 2.504 3.564 3.523 5.434-2.93.808-6.205 1.225-9.826 1.25.529-2.872 2.515-5.232 5.296-6.464l1.007-.22zM1.4 9.25h.013c4.094-.014 7.726-.5 10.875-1.453.262.518.515 1.044.752 1.575-3.282 1.005-6.122 3.057-8.51 6.125C2.847 13.917 1.4 11.84 1.4 9.25zm5.252 8.97c2.147-2.781 4.685-4.622 7.601-5.519.94 2.435 1.665 4.992 2.18 7.671-3.41 1.46-7.336 1.034-10.07-1.13l.289-1.022zM18.4 18.9c-.494-2.524-1.171-4.946-2.024-7.26 1.872-.273 3.948-.196 6.246.235-.318 2.86-1.873 5.354-4.222 7.025z",
  },
  {
    label: "Instagram",
    href: "https://instagram.com/",
    path: "M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z",
  },
  {
    label: "GitHub",
    href: "https://github.com/",
    path: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  },
];

const Marquee = () => {
  const trackRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;
    const ctx = gsap.context(() => {
      gsap.to(trackRef.current, {
        xPercent: -50,
        duration: 40,
        ease: "none",
        repeat: -1,
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="flex overflow-hidden" aria-hidden="true">
      <div ref={trackRef} className="flex w-max shrink-0">
        {Array.from({ length: 2 }).map((_, group) => (
          <div key={group} className="flex shrink-0">
            {Array.from({ length: 10 }).map((_, i) => (
              <span
                key={i}
                className="whitespace-nowrap px-6 font-display text-4xl uppercase italic tracking-tight text-[hsl(var(--text))]/90 md:text-6xl"
              >
                Building the future{" "}
                <span className="text-[#89AACC]">&bull;</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const Contact = () => {
  return (
    <footer
      id="contact"
      className="relative overflow-hidden bg-[hsl(var(--bg))] pb-8 pt-16 md:pb-12 md:pt-20"
    >
      <div className="absolute inset-0 -z-10">
        <HlsVideo
          src={HLS_STREAM}
          className="absolute left-1/2 top-1/2 size-full min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 -scale-y-100 object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[hsl(var(--bg))] to-transparent" />
      </div>

      <Marquee />

      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <div className="flex flex-col items-center py-16 text-center md:py-24">
          <span className="mb-6 text-xs uppercase tracking-[0.3em] text-[hsl(var(--muted))]">
            Have a project in mind?
          </span>
          <RingLink
            href={`mailto:${EMAIL}`}
            outerClassName="transition-transform duration-300 hover:scale-105"
            innerClassName="border border-[hsl(var(--stroke))] bg-[hsl(var(--bg))]/70 px-6 py-4 font-display text-2xl italic text-[hsl(var(--text))] backdrop-blur-md group-hover:border-transparent sm:text-3xl md:text-4xl"
          >
            {EMAIL}
            <ArrowUpRight className="size-5 rtl:-scale-x-100" />
          </RingLink>
        </div>

        <div className="flex flex-col gap-6 border-t border-[hsl(var(--stroke))] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-500/70" />
              <span className="relative inline-flex size-2.5 rounded-full bg-green-500" />
            </span>
            <span className="text-sm text-[hsl(var(--muted))]">
              Available for projects
            </span>
          </div>

          <div className="flex items-center gap-2">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className={cn(
                  "flex size-9 items-center justify-center rounded-full border border-[hsl(var(--stroke))] text-[hsl(var(--muted))] transition-colors duration-300",
                  "hover:border-white/15 hover:bg-[hsl(var(--surface))] hover:text-[hsl(var(--text))]",
                )}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  className="size-4"
                >
                  <path d={social.path} />
                </svg>
              </a>
            ))}
          </div>

          <span className="text-xs text-[hsl(var(--muted))]">
            &copy; 2026 John Doe
          </span>
        </div>
      </div>
    </footer>
  );
};
