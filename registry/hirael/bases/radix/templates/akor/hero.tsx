'use client';

import * as React from 'react';

import { CtaButton, TextLink } from './primitives';

const HERO_VIDEO = '/media/templates/akor/hero.mp4';

interface HeroProps {
  videoSrc?: string;
  posterSrc?: string;
}

export const Hero = ({ videoSrc = HERO_VIDEO, posterSrc }: HeroProps) => {
  const [hasVideoFailed, setHasVideoFailed] = React.useState(false);

  return (
    <section
      id="home"
      data-slot="hero"
      className="relative flex min-h-svh flex-col justify-end overflow-hidden bg-[var(--akor-hero)]"
    >
      {hasVideoFailed ? (
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-muted via-[var(--akor-hero)] to-background bg-cover bg-center"
          style={posterSrc ? { backgroundImage: `url(${posterSrc})` } : undefined}
        />
      ) : (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={videoSrc}
          poster={posterSrc}
          autoPlay
          loop
          muted
          playsInline
          aria-hidden
          tabIndex={-1}
          onError={() => setHasVideoFailed(true)}
        />
      )}

      <div className="relative z-10 px-8 pt-32 pb-20 lg:px-16 lg:pb-28">
        <h1 className="rise text-5xl leading-[0.95] font-light tracking-tight text-foreground [animation-delay:0.2s] sm:text-6xl lg:text-[5.5rem]">
          Intelligent
          <br />
          Security Systems
        </h1>

        <p className="rise mt-6 mb-10 max-w-xl text-base text-muted-foreground [animation-delay:0.45s] lg:text-lg">
          Innovative security, automation, and AI solutions for businesses and smart cities
        </p>

        <div className="fade-up flex flex-wrap items-center gap-8 [animation-delay:0.65s]">
          <CtaButton>Get Consultation</CtaButton>
          <TextLink href="#about">Learn More</TextLink>
        </div>
      </div>
    </section>
  );
};
