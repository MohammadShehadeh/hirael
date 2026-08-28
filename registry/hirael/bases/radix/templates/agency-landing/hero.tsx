'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ArrowRight, Menu, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/radix/ui/badge';
import { Button } from '@/registry/hirael/bases/radix/ui/button';

import { EASE, HiraelMark, OrangeButton, PartnerIcon, RollText } from './primitives';

// WebGL hero stack — client only, so it stays out of any server render.
const ShaderBackground = dynamic(() => import('./shader-background').then((m) => m.ShaderBackground), { ssr: false });

const NAV_LINKS = ['Projects', 'Studio', 'Journal', 'Connect'];

export const Hero = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Lock body scroll behind the mobile sheet.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <section className="relative flex h-dvh flex-col overflow-hidden bg-[#EFEFEF]">
        <div className="pointer-events-none absolute inset-0 z-10">
          <ShaderBackground />
        </div>

        <header className="relative z-20 mx-auto w-full max-w-[1440px] p-2 sm:p-3">
          <nav className="flex items-center justify-between rounded-full bg-white p-[5px]">
            <div className="flex items-center gap-6">
              <a href="#" aria-label="Hirael home" className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-white sm:h-10 sm:w-10">
                  <HiraelMark className="h-5 w-4 sm:h-6 sm:w-5" />
                </span>
                <span className="text-[15px] font-semibold tracking-tight text-gray-900 sm:text-[16px]">Hirael</span>
              </a>
              <div className="hidden items-center gap-6 md:flex">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="text-[14px] text-gray-900 transition-colors duration-300 hover:text-gray-500"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>

            <div className="hidden items-center gap-4 md:flex">
              <span className="hidden text-[13px] text-gray-600 lg:block">Taking on projects for Q1 2026</span>
              <Button
                type="button"
                className="group h-auto rounded-full bg-gray-900 py-2 ps-5 pe-2 text-[13px] text-white hover:bg-gray-900"
              >
                <RollText>Book a strategy call</RollText>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
                  <ArrowRight
                    className={cn(
                      'size-3.5 text-gray-900 transition-transform duration-500 group-hover:-rotate-45',
                      EASE,
                    )}
                  />
                </span>
              </Button>
            </div>

            <Button
              type="button"
              size="icon-lg"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className="rounded-full bg-gray-900 text-white hover:bg-gray-900 md:hidden"
            >
              {menuOpen ? <X className="size-[18px]" /> : <Menu className="size-[18px]" />}
            </Button>
          </nav>
        </header>

        {/* Hero content, pinned to the bottom of the viewport */}
        <div className="relative z-20 flex flex-1 flex-col justify-end">
          <div className="mx-auto w-full max-w-[1440px] px-5 pb-14 sm:px-8 sm:pb-16 lg:px-12 lg:pb-20">
            <span className="mb-5 block text-[13px] tracking-wide text-gray-900 sm:mb-8 sm:text-[14px]">
              Hirael Studio
            </span>
            <h1 className="text-[clamp(1.75rem,7vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 sm:text-[clamp(2.5rem,5vw,4.2rem)]">
              We craft digital experiences
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              for brands ready to dominate
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              their category online.
            </h1>

            <div className="mt-8 flex flex-col items-start gap-4 sm:mt-12 sm:flex-row sm:items-center sm:gap-5">
              <OrangeButton label="Start a project" />
              <div className="flex items-center gap-2 rounded-[4px] bg-white px-2.5 py-2 shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
                <PartnerIcon className="h-5 w-5 fill-current text-[#E8704E] sm:h-6 sm:w-6" />
                <span className="text-[13px] font-medium text-gray-900 sm:text-[14px]">Certified Partner</span>
                <Badge className="rounded bg-gray-900 px-1.5 text-[10px] font-normal text-white sm:px-2 sm:text-[11px]">
                  Featured
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div
        className={cn(
          'fixed inset-0 z-50 transition-opacity duration-500 md:hidden',
          menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        <div className="absolute inset-0 bg-black/60" onClick={() => setMenuOpen(false)} />
        <div
          className={cn(
            'absolute inset-x-0 bottom-0 mx-3 mb-3 rounded-2xl bg-white p-6 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]',
            menuOpen ? 'translate-y-0' : 'translate-y-full',
          )}
        >
          <div className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href="#"
                onClick={() => setMenuOpen(false)}
                className="text-[28px] font-medium leading-[32px] text-gray-900"
              >
                {link}
              </a>
            ))}
          </div>
          <OrangeButton label="Start a project" className="mt-6 w-full justify-between" />
        </div>
      </div>
    </>
  );
};
