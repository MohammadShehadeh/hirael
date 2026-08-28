import { Badge } from '@/registry/hirael/bases/radix/ui/badge';

import { OrangeButton } from './primitives';

const SMALL_IMAGE = '/media/templates/agency-landing/about-small.jpg';
const LARGE_IMAGE = '/media/templates/agency-landing/about-large.jpg';

const PARAGRAPH =
  'Through research, creative thinking and iteration we help growing brands realize their digital full potential.';

export const About = () => {
  return (
    <section className="overflow-hidden bg-white pb-12 pt-16 sm:pb-16 sm:pt-20 lg:pb-24 lg:pt-32">
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="mb-6 flex items-center gap-3 px-5 sm:mb-8 sm:px-8 lg:px-12">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-[11px] font-semibold text-white sm:h-7 sm:w-7 sm:text-[12px]">
            1
          </span>
          <Badge
            variant="outline"
            className="border-gray-200 px-3 py-1 text-[12px] text-gray-900 sm:px-4 sm:py-1.5 sm:text-[13px]"
          >
            Introducing Hirael
          </Badge>
        </div>

        <h2 className="mb-12 px-5 text-[clamp(1.5rem,4vw,3.2rem)] font-medium leading-[1.12] tracking-[-0.02em] text-gray-900 sm:mb-16 sm:px-8 lg:mb-28 lg:px-12">
          Strategy-led creatives, delivering
          <br />
          results in digital and beyond.
        </h2>

        <div className="px-5 sm:px-8 lg:px-12">
          {/* Mobile / tablet: copy, button, then images side by side */}
          <div className="lg:hidden">
            <p className="text-[15px] font-medium leading-[1.6] text-gray-900 sm:text-[17px]">{PARAGRAPH}</p>
            <OrangeButton label="About our studio" className="mt-6" />
            <div className="mt-8 flex flex-col gap-4 sm:mt-10 sm:flex-row sm:items-end sm:gap-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={SMALL_IMAGE}
                alt=""
                className="aspect-[438/346] w-full rounded-[0.75rem] object-cover sm:w-[45%] sm:rounded-2xl"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={LARGE_IMAGE}
                alt=""
                className="aspect-[3/2] w-full rounded-[0.75rem] object-cover sm:w-[55%] sm:rounded-2xl"
              />
            </div>
          </div>

          {/* Desktop: copy and both images on one bottom-aligned baseline */}
          <div className="hidden lg:grid lg:grid-cols-[24%_minmax(0,1fr)_44%] lg:items-end lg:gap-6 xl:gap-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={SMALL_IMAGE} alt="" className="aspect-[438/346] w-full rounded-2xl object-cover" />
            <div className="pb-1">
              <p className="text-[16px] font-medium leading-[1.65] text-gray-900 xl:text-[18px]">{PARAGRAPH}</p>
              <OrangeButton label="About our studio" className="mt-6" />
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LARGE_IMAGE} alt="" className="aspect-[3/2] w-full rounded-2xl object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
};
