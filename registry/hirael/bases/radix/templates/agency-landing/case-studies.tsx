import { ArrowRight } from 'lucide-react';

import { Badge } from '@/registry/hirael/bases/radix/ui/badge';

import { LinkIcon } from './primitives';

const NARRATIV_VIDEO = '/media/templates/agency-landing/case-study-narrativ.mp4';
const LUMINAR_VIDEO = '/media/templates/agency-landing/case-study-luminar.mp4';

export const CaseStudies = () => {
  return (
    <section className="bg-[#F5F5F5] pb-16 pt-16 sm:pb-20 sm:pt-20 lg:pb-28 lg:pt-28">
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="mb-6 flex items-center gap-3 px-5 sm:mb-8 sm:px-8 lg:px-12">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-[11px] font-semibold text-white sm:h-7 sm:w-7 sm:text-[12px]">
            2
          </span>
          <Badge
            variant="outline"
            className="border-gray-300 px-3 py-1 text-[12px] text-gray-900 sm:px-4 sm:py-1.5 sm:text-[13px]"
          >
            Featured client work
          </Badge>
        </div>

        <h2 className="mb-10 px-5 text-[clamp(1.75rem,7vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 sm:mb-14 sm:px-8 sm:text-[clamp(2.5rem,5vw,4.2rem)] lg:mb-16 lg:px-12">
          Our projects
        </h2>

        <div className="grid grid-cols-1 gap-5 px-5 sm:gap-6 sm:px-8 md:grid-cols-2 lg:gap-7 lg:px-12">
          <div>
            <div className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-2xl bg-[#1a1d2e]">
              <video src={NARRATIV_VIDEO} autoPlay muted loop playsInline className="h-full w-full object-cover" />
              <div className="absolute bottom-4 start-4">
                <div className="flex h-9 w-9 items-center overflow-hidden rounded-full bg-white transition-all duration-300 ease-in-out group-hover:w-[148px]">
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center">
                    <LinkIcon className="h-[14px] w-[14px] -rotate-45 text-gray-900 transition-transform duration-300 group-hover:rotate-0" />
                  </span>
                  <span className="whitespace-nowrap text-[13px] font-medium text-gray-900 opacity-0 transition-opacity delay-100 duration-300 group-hover:opacity-100">
                    Learn more
                  </span>
                </div>
              </div>
            </div>
            <p className="mt-4 text-[13px] leading-relaxed text-gray-600 sm:text-[14px]">
              Winner of Site of the Month 2025 - an interactive 3D showcase driving record engagement
            </p>
            <h3 className="mt-1 text-[14px] font-semibold text-gray-900 sm:text-[15px]">Narrativ</h3>
          </div>

          <div>
            <div className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-2xl bg-[#6b6b6b]">
              <video src={LUMINAR_VIDEO} autoPlay muted loop playsInline className="h-full w-full object-cover" />
              <div className="absolute bottom-4 start-4">
                <div className="flex h-9 w-9 items-center overflow-hidden rounded-full bg-gray-900 transition-all duration-300 ease-in-out group-hover:w-[168px]">
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center">
                    <ArrowRight
                      size={14}
                      className="-rotate-45 text-white transition-transform duration-300 group-hover:rotate-0"
                    />
                  </span>
                  <span className="whitespace-nowrap text-[13px] font-medium text-white opacity-0 transition-opacity delay-100 duration-300 group-hover:opacity-100">
                    View case study
                  </span>
                </div>
              </div>
            </div>
            <p className="mt-4 text-[13px] leading-relaxed text-gray-600 sm:text-[14px]">
              Transforming a dated platform into a conversion-focused brand experience
            </p>
            <h3 className="mt-1 text-[14px] font-semibold text-gray-900 sm:text-[15px]">Luminar</h3>
          </div>
        </div>
      </div>
    </section>
  );
};
