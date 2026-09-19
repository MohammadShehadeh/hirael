import { ArrowUpRight } from 'lucide-react';

import { GlassButton, GlassPill, Heading, VideoBackdrop } from './primitives';

const PROCESS_VIDEO = '/media/templates/prism/process.mp4';

export const Process = () => {
  return (
    <section
      id="process"
      data-slot="process"
      className="relative flex min-h-[700px] items-center overflow-hidden px-6 py-32 md:px-16 lg:px-24"
    >
      <VideoBackdrop src={PROCESS_VIDEO} fadeTop />

      <div className="rise relative z-10 mx-auto flex min-h-[500px] w-full max-w-3xl flex-col items-center justify-center text-center">
        <GlassPill className="mb-4">How It Works</GlassPill>
        <Heading>You dream it. We ship it.</Heading>
        <p className="mt-6 max-w-xl text-sm font-light leading-relaxed text-foreground/60 md:text-base">
          Share your vision. Our AI handles the rest: wireframes, design, code, launch. All in days, not quarters.
        </p>
        <GlassButton className="mt-8">
          Get Started
          <ArrowUpRight className="size-5 rtl:-scale-x-100" />
        </GlassButton>
      </div>
    </section>
  );
};
