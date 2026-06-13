"use client"

import { type ReactNode, useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { ArrowRight, Clock, Menu, X } from "lucide-react"

import { cn } from "@/lib/utils"

import "./axion.css"

// WebGL hero stack — client only, so it stays out of the static prerender.
const ShaderBackground = dynamic(
  () => import("./shader-background").then((m) => m.ShaderBackground),
  { ssr: false }
)

const NAV_LINKS = ["Projects", "Studio", "Journal", "Connect"]

// House easing for the text-roll / arrow-rotate hover motion.
const EASE = "ease-[cubic-bezier(0.25,0.1,0.25,1)]"

const SMALL_IMAGE =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260516_090123_74be96d4-9c1b-40cf-932a-96f4f4babed3.png&w=1280&q=85"
const LARGE_IMAGE =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260516_090133_c157d30b-a99a-4477-bec1-a446149ec3f2.png&w=1280&q=85"
const NARRATIV_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260516_122702_390f5305-8719-41d5-ae80-d23ab3796c28.mp4"
const LUMINAR_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260516_123323_f909c2b8-ff6c-4edf-882b-8ebcdbe389b5.mp4"

/**
 * Hover text-roll: two stacked copies inside a 20px window that slide up by
 * exactly one line on group-hover.
 */
function RollText({ children }: { children: ReactNode }) {
  return (
    <span className="block h-[20px] overflow-hidden">
      <span
        className={cn(
          "flex flex-col transition-transform duration-500 group-hover:-translate-y-1/2",
          EASE
        )}
      >
        <span className="block h-[20px] leading-[20px]">{children}</span>
        <span className="block h-[20px] leading-[20px]" aria-hidden="true">
          {children}
        </span>
      </span>
    </span>
  )
}

/** Orange pill CTA with the shared text-roll + arrow-rotate hover. */
function OrangeButton({
  label,
  className,
}: {
  label: string
  className?: string
}) {
  return (
    <button
      type="button"
      className={cn(
        "group inline-flex items-center gap-2 rounded-full bg-[#F26522] py-2 pl-5 pr-2 text-[13px] font-medium text-white transition-colors hover:bg-[#e05a1a] sm:pl-6 sm:text-[14px]",
        className
      )}
    >
      <RollText>{label}</RollText>
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white sm:h-8 sm:w-8">
        <ArrowRight
          size={16}
          className={cn(
            "text-[#F26522] transition-transform duration-500 group-hover:-rotate-45",
            EASE
          )}
        />
      </span>
    </button>
  )
}

/** lucide "link" icon, inlined as two arc paths. */
function LinkIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

/** Certified-partner starburst mark. */
function PartnerIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
    >
      <path d="m19.6 66.5 19.7-11 .3-1-.3-.5h-1l-3.3-.2-11.2-.3L14 53l-9.5-.5-2.4-.5L0 49l.2-1.5 2-1.3 2.9.2 6.3.5 9.5.6 6.9.4L38 49.1h1.6l.2-.7-.5-.4-.4-.4L29 41l-10.6-7-5.6-4.1-3-2-1.5-2-.6-4.2 2.7-3 3.7.3.9.2 3.7 2.9 8 6.1L37 36l1.5 1.2.6-.4.1-.3-.7-1.1L33 25l-6-10.4-2.7-4.3-.7-2.6c-.3-1-.4-2-.4-3l3-4.2L28 0l4.2.6L33.8 2l2.6 6 4.1 9.3L47 29.9l2 3.8 1 3.4.3 1h.7v-.5l.5-7.2 1-8.7 1-11.2.3-3.2 1.6-3.8 3-2L61 2.6l2 2.9-.3 1.8-1.1 7.7L59 27.1l-1.5 8.2h.9l1-1.1 4.1-5.4 6.9-8.6 3-3.5L77 13l2.3-1.8h4.3l3.1 4.7-1.4 4.9-4.4 5.6-3.7 4.7-5.3 7.1-3.2 5.7.3.4h.7l12-2.6 6.4-1.1 7.6-1.3 3.5 1.6.4 1.6-1.4 3.4-8.2 2-9.6 2-14.3 3.3-.2.1.2.3 6.4.6 2.8.2h6.8l12.6 1 3.3 2 1.9 2.7-.3 2-5.1 2.6-6.8-1.6-16-3.8-5.4-1.3h-.8v.4l4.6 4.5 8.3 7.5L89 80.1l.5 2.4-1.3 2-1.4-.2-9.2-7-3.6-3-8-6.8h-.5v.7l1.8 2.7 9.8 14.7.5 4.5-.7 1.4-2.6 1-2.7-.6-5.8-8-6-9-4.7-8.2-.5.4-2.9 30.2-1.3 1.5-3 1.2-2.5-2-1.4-3 1.4-6.2 1.6-8 1.3-6.4 1.2-7.9.7-2.6v-.2H49L43 72l-9 12.3-7.2 7.6-1.7.7-3-1.5.3-2.8L24 86l10-12.8 6-7.9 4-4.6-.1-.5h-.3L17.2 77.4l-4.7.6-2-2 .2-3 1-1 8-5.5Z" />
    </svg>
  )
}

export function AxionLanding() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [time, setTime] = useState("")

  // Live London clock — mounted-gated so server and first client render match.
  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/London",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(new Date())
    setTime(format())
    const id = setInterval(() => setTime(format()), 1000)
    return () => clearInterval(id)
  }, [])

  // Lock body scroll behind the mobile sheet.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [menuOpen])

  const clock = `${time || "--:--"} in London`

  return (
    <main className="axion-root min-h-screen bg-white text-gray-900">
      {/* SECTION 1: HERO */}
      <section className="relative flex min-h-screen flex-col overflow-hidden bg-[#EFEFEF]">
        <div className="pointer-events-none absolute inset-0 z-10">
          <ShaderBackground />
        </div>

        {/* Navigation */}
        <header className="relative z-20 mx-auto w-full max-w-[1440px] p-2 sm:p-3">
          <nav className="flex items-center justify-between rounded-full bg-white p-[5px]">
            <div className="flex items-center gap-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 sm:h-10 sm:w-10">
                <span className="text-[10px] font-bold tracking-tight text-white sm:text-[11px]">
                  AX
                </span>
              </div>
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
              <span className="hidden text-[13px] text-gray-600 lg:block">
                Taking on projects for Q1 2026
              </span>
              <span className="flex items-center gap-1.5 text-[13px] text-gray-600">
                <Clock size={14} />
                {clock}
              </span>
              <button
                type="button"
                className="group flex items-center gap-2 rounded-full bg-gray-900 py-2 pl-5 pr-2 text-[13px] font-medium text-white"
              >
                <RollText>Book a strategy call</RollText>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
                  <ArrowRight
                    size={14}
                    className={cn(
                      "text-gray-900 transition-transform duration-500 group-hover:-rotate-45",
                      EASE
                    )}
                  />
                </span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-white md:hidden"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </nav>
        </header>

        {/* Hero content, pinned to the bottom of the viewport */}
        <div className="relative z-20 flex flex-1 flex-col justify-end">
          <div className="mx-auto w-full max-w-[1440px] px-5 pb-14 sm:px-8 sm:pb-16 lg:px-12 lg:pb-20">
            <span className="mb-5 block text-[13px] tracking-wide text-gray-900 sm:mb-8 sm:text-[14px]">
              Axion Studio
            </span>
            <h1 className="text-[clamp(1.75rem,7vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 sm:text-[clamp(2.5rem,5vw,4.2rem)]">
              We craft digital experiences
              <br className="hidden sm:block" />
              <span className="sm:hidden">{" "}</span>
              for brands ready to dominate
              <br className="hidden sm:block" />
              <span className="sm:hidden">{" "}</span>
              their category online.
            </h1>

            <div className="mt-8 flex flex-col items-start gap-4 sm:mt-12 sm:flex-row sm:items-center sm:gap-5">
              <OrangeButton label="Start a project" />
              <div className="flex items-center gap-2 rounded-[4px] bg-white px-2.5 py-2 shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
                <PartnerIcon className="h-5 w-5 fill-current text-[#E8704E] sm:h-6 sm:w-6" />
                <span className="text-[13px] font-medium text-gray-900 sm:text-[14px]">
                  Certified Partner
                </span>
                <span className="rounded bg-gray-900 px-1.5 py-0.5 text-[10px] text-white sm:px-2 sm:text-[11px]">
                  Featured
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile menu overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 transition-opacity duration-500 md:hidden",
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <div
          className="absolute inset-0 bg-black/60"
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 mx-3 mb-3 rounded-2xl bg-white p-6 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
            menuOpen ? "translate-y-0" : "translate-y-full"
          )}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-[13px] text-gray-600">
            <Clock size={14} />
            {clock}
          </span>
          <div className="mt-6 flex flex-col gap-2">
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
          <OrangeButton
            label="Start a project"
            className="mt-6 w-full justify-between"
          />
        </div>
      </div>

      {/* SECTION 2: ABOUT */}
      <section className="overflow-hidden bg-white pb-12 pt-16 sm:pb-16 sm:pt-20 lg:pb-24 lg:pt-32">
        <div className="mx-auto w-full max-w-[1440px]">
          <div className="mb-6 flex items-center gap-3 px-5 sm:mb-8 sm:px-8 lg:px-12">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-[11px] font-semibold text-white sm:h-7 sm:w-7 sm:text-[12px]">
              1
            </span>
            <span className="rounded-full border border-gray-200 px-3 py-1 text-[12px] font-medium text-gray-900 sm:px-4 sm:py-1.5 sm:text-[13px]">
              Introducing Axion
            </span>
          </div>

          <h2 className="mb-12 px-5 text-[clamp(1.5rem,4vw,3.2rem)] font-medium leading-[1.12] tracking-[-0.02em] text-gray-900 sm:mb-16 sm:px-8 lg:mb-28 lg:px-12">
            Strategy-led creatives, delivering
            <br />
            results in digital and beyond.
          </h2>

          <div className="px-5 sm:px-8 lg:px-12">
            {/* Mobile / tablet: stacked copy + images */}
            <div className="lg:hidden">
              <p className="text-[15px] font-medium leading-[1.6] text-gray-900 sm:text-[17px]">
                Through research, creative thinking and iteration we help
                growing brands realize their digital full potential.
              </p>
              <OrangeButton label="About our studio" className="mt-6" />
              <div className="mt-8 flex flex-col gap-4 sm:mt-10 sm:flex-row sm:gap-5">
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
                  className="aspect-[900/600] w-full rounded-[0.75rem] object-cover sm:w-[55%] sm:rounded-2xl"
                />
              </div>
            </div>

            {/* Desktop: three-column editorial grid */}
            <div className="hidden items-end gap-6 lg:grid lg:grid-cols-[26%_1fr_48%] xl:gap-8">
              <div className="self-end">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={SMALL_IMAGE}
                  alt=""
                  className="aspect-[438/346] w-full rounded-2xl object-cover"
                />
              </div>
              <div className="flex justify-end self-start">
                <div>
                  <p className="whitespace-nowrap text-[16px] font-medium leading-[1.65] text-gray-900 xl:text-[18px]">
                    Through research, creative thinking and iteration we help
                    <br />
                    growing brands realize their digital full potential.
                  </p>
                  <OrangeButton label="About our studio" className="mt-6" />
                </div>
              </div>
              <div className="self-end">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={LARGE_IMAGE}
                  alt=""
                  className="aspect-[3/2] w-full rounded-2xl object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: CASE STUDIES */}
      <section className="bg-[#F5F5F5] pb-16 pt-16 sm:pb-20 sm:pt-20 lg:pb-28 lg:pt-28">
        <div className="mx-auto w-full max-w-[1440px]">
          <div className="mb-6 flex items-center gap-3 px-5 sm:mb-8 sm:px-8 lg:px-12">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-[11px] font-semibold text-white sm:h-7 sm:w-7 sm:text-[12px]">
              2
            </span>
            <span className="rounded-full border border-gray-300 px-3 py-1 text-[12px] font-medium text-gray-900 sm:px-4 sm:py-1.5 sm:text-[13px]">
              Featured client work
            </span>
          </div>

          <h2 className="mb-10 px-5 text-[clamp(1.75rem,7vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 sm:mb-14 sm:px-8 sm:text-[clamp(2.5rem,5vw,4.2rem)] lg:mb-16 lg:px-12">
            Our projects
          </h2>

          <div className="grid grid-cols-1 gap-5 px-5 sm:gap-6 sm:px-8 md:grid-cols-2 lg:gap-7 lg:px-12">
            {/* Card 1: Narrativ */}
            <div>
              <div className="group relative aspect-[329/246] cursor-pointer overflow-hidden rounded-2xl bg-[#1a1d2e]">
                <video
                  src={NARRATIV_VIDEO}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover"
                />
                <div className="absolute bottom-4 left-4">
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
                Winner of Site of the Month 2025 - an interactive 3D showcase
                driving record engagement
              </p>
              <h3 className="mt-1 text-[14px] font-semibold text-gray-900 sm:text-[15px]">
                Narrativ
              </h3>
            </div>

            {/* Card 2: Luminar */}
            <div>
              <div className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl bg-[#6b6b6b]">
                <video
                  src={LUMINAR_VIDEO}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover"
                />
                <div className="absolute bottom-4 left-4">
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
                Transforming a dated platform into a conversion-focused brand
                experience
              </p>
              <h3 className="mt-1 text-[14px] font-semibold text-gray-900 sm:text-[15px]">
                Luminar
              </h3>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
