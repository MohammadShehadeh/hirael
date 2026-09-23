import { Button } from '@/registry/hirael/bases/base/ui/button';

import { Footer } from './footer';
import { GlassButton, Heading, VideoBackdrop } from './primitives';

const CTA_VIDEO = '/media/templates/prism/cta.mp4';

export const Cta = () => {
  return (
    <section data-slot="cta" className="relative overflow-hidden px-6 pt-32 pb-8 md:px-16 lg:px-24">
      <VideoBackdrop src={CTA_VIDEO} fadeTop />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="rise flex flex-col items-center text-center">
          <Heading className="max-w-3xl md:text-6xl lg:text-7xl">Your next website starts here.</Heading>
          <p className="mt-6 max-w-md text-sm leading-relaxed font-light text-foreground/60 md:text-base">
            Book a free strategy call. See what AI-powered design can do.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <GlassButton>Book a Call</GlassButton>
            <Button type="button">View Pricing</Button>
          </div>
        </div>

        <Footer />
      </div>
    </section>
  );
};
