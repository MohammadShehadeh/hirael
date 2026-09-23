'use client';

import * as React from 'react';
import { ArrowRight, Globe } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { Field, FieldLabel } from '@/registry/hirael/bases/radix/ui/field';

import { Navbar } from './navbar';
import { InstagramIcon, TwitterIcon } from './primitives';

const HERO_VIDEO_URL = '/media/templates/asme/hero.mp4';
const FADE_MS = 500;
const FADE_OUT_LEAD_S = 0.55;
const RESTART_DELAY_MS = 100;

const SOCIAL_LINKS: {
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}[] = [
  { label: 'Instagram', Icon: InstagramIcon },
  { label: 'Twitter', Icon: TwitterIcon },
  { label: 'Website', Icon: Globe },
];

interface HeroProps {
  videoSrc?: string;
  posterSrc?: string;
}

export const Hero = ({ videoSrc = HERO_VIDEO_URL, posterSrc }: HeroProps) => {
  const reduced = useReducedMotion();
  const restartTimerRef = React.useRef<number | null>(null);
  const [isVisible, setIsVisible] = React.useState(false);
  const [videoFailed, setVideoFailed] = React.useState(false);

  const play = (video: HTMLVideoElement) => {
    void video.play()?.catch(() => undefined);
  };

  // A video that buffered before hydration has already fired `canplay`; catch it on attach.
  const attachVideo = React.useCallback((video: HTMLVideoElement | null) => {
    if (video && video.readyState >= 3) setIsVisible(true);
    return () => {
      if (restartTimerRef.current) window.clearTimeout(restartTimerRef.current);
    };
  }, []);

  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden">
      {videoFailed ? (
        <div
          aria-hidden
          className="glow-top absolute inset-0 bg-cover bg-bottom"
          style={posterSrc ? { backgroundImage: `url(${posterSrc})` } : undefined}
        />
      ) : (
        <motion.video
          ref={attachVideo}
          className="absolute inset-0 h-full w-full object-cover object-bottom"
          src={videoSrc}
          poster={posterSrc}
          muted
          autoPlay
          playsInline
          preload="auto"
          aria-hidden
          tabIndex={-1}
          loop={reduced ?? false}
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: reduced ? 0 : FADE_MS / 1000, ease: 'linear' }}
          onCanPlay={(event) => {
            if (isVisible) return;
            play(event.currentTarget);
            setIsVisible(true);
          }}
          onTimeUpdate={(event) => {
            const video = event.currentTarget;
            if (reduced || !isVisible || !Number.isFinite(video.duration)) return;
            if (video.duration - video.currentTime <= FADE_OUT_LEAD_S) setIsVisible(false);
          }}
          onEnded={(event) => {
            const video = event.currentTarget;
            restartTimerRef.current = window.setTimeout(() => {
              video.currentTime = 0;
              play(video);
              setIsVisible(true);
            }, RESTART_DELAY_MS);
          }}
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
          className="liquid-glass w-full max-w-xl rounded-full py-2 pe-2 ps-6"
        >
          <Field orientation="horizontal">
            <FieldLabel htmlFor="asme-hero-email" className="sr-only">
              Email address
            </FieldLabel>
            <input
              id="asme-hero-email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-foreground/40"
            />
            <Button type="submit" size="icon" aria-label="Subscribe" className="size-11">
              <ArrowRight className="size-5 rtl:rotate-180" />
            </Button>
          </Field>
        </form>

        <p className="mt-6 max-w-md px-4 text-sm leading-relaxed text-foreground">
          Stay updated with the latest news and insights. Subscribe to our newsletter today and never miss out on
          exciting updates.
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
            className="liquid-glass inline-flex size-13 items-center justify-center rounded-full text-foreground/80 transition-colors hover:text-foreground"
          >
            <Icon className="size-5" />
          </a>
        ))}
      </footer>
    </section>
  );
};
