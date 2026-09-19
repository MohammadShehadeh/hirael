import { Button } from '@/registry/hirael/bases/radix/ui/button';

import { Footer } from './footer';
import { GlassButton, Heading, VideoBackdrop } from './primitives';

const CTA_VIDEO = '/media/templates/prism/cta.mp4';

export const Cta = () => {
  return (
    <section data-slot="cta" className="relative overflow-hidden px-6 pb-8 pt-32 md:px-16 lg:px-24">
      <VideoBackdrop src={CTA_VIDEO} fadeTop />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="rise flex flex-col items-center text-center">
          <Heading className="max-w-3xl md:text-6xl lg:text-7xl">Your next website starts here.</Heading>
          <p className="mt-6 max-w-md text-sm font-light leading-relaxed text-foreground/60 md:text-base">
            Book a free strategy call. See what AI-powered design can do.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <GlassButton>Book a Call</GlassButton>
            <Button type="button" className="h-auto rounded-full px-5 py-2.5 text-sm font-medium">
              View Pricing
            </Button>
          </div>
        </div>

        <Footer />
      </div>
    </section>
  );
};
