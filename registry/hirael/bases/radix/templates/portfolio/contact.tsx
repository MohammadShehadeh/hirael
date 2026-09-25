'use client';

import * as React from 'react';
import gsap from 'gsap';

import { cn } from '@/lib/utils';

import { BACKGROUND_VIDEO, BackgroundVideo } from './background-video';
import { ArrowUpRight, RingLink } from './primitives';

const EMAIL = 'hello@mohammadshehadeh.com';

const SOCIALS = [
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/mohammadshhadeh',
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
  {
    label: 'X',
    href: 'https://x.com/_mshehadeh',
    path: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/mohammadshehadeh',
    path: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
  },
];

const Marquee = () => {
  const trackRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const ctx = gsap.context(() => {
      gsap.to(trackRef.current, {
        xPercent: -50,
        duration: 40,
        ease: 'none',
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
                className="font-display px-6 text-4xl tracking-tight whitespace-nowrap text-[hsl(var(--text))]/90 uppercase italic md:text-6xl"
              >
                Building the future
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
    <footer id="contact" className="relative overflow-hidden bg-[hsl(var(--bg))] pt-16 pb-8 md:pt-20 md:pb-12">
      <div className="absolute inset-0 -z-10">
        <BackgroundVideo
          src={BACKGROUND_VIDEO}
          className="absolute top-1/2 left-1/2 size-full min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 -scale-y-100 object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[hsl(var(--bg))] to-transparent" />
      </div>

      <Marquee />

      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <div className="flex flex-col items-center py-16 text-center md:py-24">
          <span className="mb-6 text-xs tracking-[0.3em] text-[hsl(var(--muted))] uppercase">
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
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success/70" />
              <span className="relative inline-flex size-2.5 rounded-full bg-success" />
            </span>
            <span className="text-sm text-[hsl(var(--muted))]">Available for projects</span>
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
                  'flex size-9 items-center justify-center rounded-full border border-[hsl(var(--stroke))] text-[hsl(var(--muted))] transition-colors duration-300',
                  'hover:border-white/15 hover:bg-[hsl(var(--surface))] hover:text-[hsl(var(--text))]',
                )}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-4">
                  <path d={social.path} />
                </svg>
              </a>
            ))}
          </div>

          <span className="text-xs text-[hsl(var(--muted))]">&copy; 2026 Mohammad Shehadeh</span>
        </div>
      </div>
    </footer>
  );
};
