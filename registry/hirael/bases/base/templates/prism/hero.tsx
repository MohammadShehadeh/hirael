import { ArrowUpRight, Play } from 'lucide-react';

import { Button } from '@/registry/hirael/bases/base/ui/button';

import { GlassButton, GlassPill, RiseText, VideoBackdrop } from './primitives';

const HERO_VIDEO = '/media/templates/prism/hero.mp4';

const PARTNERS = ['Luminary', 'Arcline', 'Helix', 'Vela', 'Northwind'] as const;

interface HeroProps {
  videoSrc?: string;
  posterSrc?: string;
}

export const Hero = ({ videoSrc = HERO_VIDEO, posterSrc }: HeroProps) => {
  return (
    <section id="home" data-slot="hero" className="relative flex min-h-svh flex-col overflow-hidden">
      <VideoBackdrop src={videoSrc} posterSrc={posterSrc} />
      <div aria-hidden className="absolute inset-0 z-0 bg-background/5" />

      <div className="relative z-10 flex flex-1 flex-col items-center px-6 pt-36 text-center md:pt-44">
        <p className="rise liquid-glass flex items-center gap-2 rounded-full p-1 pe-3 text-sm text-foreground/90">
          <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">New</span>
          Introducing AI-powered web design.
        </p>

        <h1 className="mt-6 max-w-3xl [font-family:var(--font-prism-serif)] text-6xl leading-[0.85] tracking-[-2px] text-foreground italic md:text-7xl lg:text-[5.5rem] lg:tracking-[-4px]">
          <RiseText text="The Website Your Brand Deserves" />
        </h1>

        <p className="rise-still mt-6 max-w-2xl text-sm leading-relaxed font-light text-foreground [animation-delay:0.8s] md:text-base">
          Stunning design. Blazing performance. Built by AI, refined by experts. This is web design, wildly reimagined.
        </p>

        <div className="rise mt-8 flex flex-wrap items-center justify-center gap-6 [animation-delay:1.1s]">
          <GlassButton>
            Get Started
            <ArrowUpRight className="size-5 rtl:-scale-x-100" />
          </GlassButton>
          <Button type="button" variant="ghost">
            Watch the Film
            <Play className="size-4 fill-current" />
          </Button>
        </div>

        <div data-slot="partners" className="rise mt-auto flex flex-col items-center gap-6 pt-16 pb-8">
          <GlassPill>Trusted by the teams behind</GlassPill>
          <ul className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {PARTNERS.map((partner) => (
              <li
                key={partner}
                className="[font-family:var(--font-prism-serif)] text-2xl tracking-tight text-foreground italic md:text-3xl"
              >
                {partner}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
