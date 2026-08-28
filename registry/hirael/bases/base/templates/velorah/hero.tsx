'use client';

import * as React from 'react';

import { Button } from '@/registry/hirael/bases/base/ui/button';

import { Navbar } from './navbar';

const HERO_VIDEO = '/media/templates/velorah/hero.mp4';

export const Hero = ({ videoSrc = HERO_VIDEO, posterSrc }: { videoSrc?: string; posterSrc?: string }) => {
  const [videoFailed, setVideoFailed] = React.useState(false);

  return (
    <section className="relative min-h-screen overflow-hidden">
      {videoFailed ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 bg-gradient-to-b from-muted via-background to-background bg-cover bg-center"
          style={posterSrc ? { backgroundImage: `url(${posterSrc})` } : undefined}
        />
      ) : (
        <video
          className="absolute inset-0 z-0 h-full w-full object-cover"
          src={videoSrc}
          poster={posterSrc}
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          tabIndex={-1}
          onError={() => setVideoFailed(true)}
        />
      )}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 z-[1] h-[40%] bg-gradient-to-t from-black via-black/60 to-transparent"
      />

      <Navbar />

      <div className="relative z-10 flex flex-col items-center justify-center px-6 pb-40 pt-[28px] text-center">
        <h1 className="animate-fade-rise max-w-7xl text-5xl font-normal leading-[0.95] tracking-[-2.46px] text-foreground [font-family:var(--font-velorah-serif)] sm:text-7xl md:text-8xl">
          Where <em className="not-italic text-white">dreams</em> rise{' '}
          <em className="not-italic text-white">through the silence.</em>
        </h1>

        <p className="animate-fade-rise-delay mt-8 max-w-2xl text-base leading-relaxed text-white sm:text-lg">
          We&apos;re designing tools for deep thinkers, bold creators, and quiet rebels. Amid the chaos, we build
          digital spaces for sharp focus and inspired work.
        </p>

        <Button
          type="button"
          variant="ghost"
          className="animate-fade-rise-delay-2 liquid-glass mt-12 h-auto cursor-pointer rounded-full px-14 py-5 text-base font-normal text-foreground transition-transform hover:scale-[1.03]"
        >
          Begin Journey
        </Button>
      </div>
    </section>
  );
};
