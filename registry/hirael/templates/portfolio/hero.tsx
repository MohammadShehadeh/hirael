"use client";

import * as React from "react";
import gsap from "gsap";

import { cn } from "@/lib/utils";

import { BACKGROUND_VIDEO, BackgroundVideo } from "./background-video";
import { ArrowUpRight, onAnchorClick, RingLink } from "./primitives";

const NAV_LINKS = [
  { label: "Home", href: "#home", id: "home" },
  { label: "Work", href: "#work", id: "work" },
  { label: "Resume", href: "#stats", id: "stats" },
];
const ROLES = ["Creative", "Developer", "Founder", "Scholar"];
const ROLE_INTERVAL = 2000;

const Logo = () => {
  return (
    <a
      href="#home"
      aria-label="Home"
      onClick={(e) => onAnchorClick(e, "#home")}
      className="group relative flex size-9 shrink-0 items-center justify-center rounded-full transition-transform duration-300 hover:scale-110"
    >
      <span className="accent-gradient absolute inset-0 rounded-full" />
      <span
        className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          backgroundImage: "linear-gradient(270deg, #89AACC 0%, #4E85BF 100%)",
        }}
      />
      <span className="absolute inset-[1.5px] rounded-full bg-[hsl(var(--bg))]" />
      <span className="relative font-display text-[13px] italic leading-none">
        JD
      </span>
    </a>
  );
};

const Navbar = () => {
  const [scrolled, setScrolled] = React.useState(false);
  const [active, setActive] = React.useState("home");

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    for (const link of NAV_LINKS) {
      const el = document.getElementById(link.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 md:pt-6">
      <div
        className={cn(
          "inline-flex items-center rounded-full border border-white/10 bg-[hsl(var(--surface))] px-2 py-2 backdrop-blur-md transition-shadow duration-300",
          scrolled && "shadow-md shadow-black/10",
        )}
      >
        <Logo />
        <span className="mx-1 hidden h-5 w-px bg-[hsl(var(--stroke))] sm:block" />
        <div className="flex items-center gap-0.5">
          {NAV_LINKS.map((link) => {
            const isActive = active === link.id;
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => onAnchorClick(e, link.href)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs transition-colors duration-200 sm:px-4 sm:py-2 sm:text-sm",
                  isActive
                    ? "bg-[hsl(var(--stroke))]/50 text-[hsl(var(--text))]"
                    : "text-[hsl(var(--muted))] hover:bg-[hsl(var(--stroke))]/50 hover:text-[hsl(var(--text))]",
                )}
              >
                {link.label}
              </a>
            );
          })}
        </div>
        <span className="mx-1 hidden h-5 w-px bg-[hsl(var(--stroke))] sm:block" />
        <RingLink
          href="#contact"
          innerClassName="bg-[hsl(var(--surface))] px-3 py-1.5 text-xs text-[hsl(var(--text))] backdrop-blur-md sm:px-4 sm:py-2 sm:text-sm"
        >
          Say hi
          <ArrowUpRight className="size-3 rtl:-scale-x-100" />
        </RingLink>
      </div>
    </nav>
  );
};

export const Hero = ({ start = true }: { start?: boolean }) => {
  const rootRef = React.useRef<HTMLElement>(null);
  const [roleIndex, setRoleIndex] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(
      () => setRoleIndex((i) => (i + 1) % ROLES.length),
      ROLE_INTERVAL,
    );
    return () => clearInterval(id);
  }, []);

  React.useEffect(() => {
    if (!start) return;
    const ctx = gsap.context(() => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduce) {
        gsap.set([".name-reveal", ".blur-in"], {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
        });
        return;
      }
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        ".name-reveal",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, delay: 0.1 },
      ).fromTo(
        ".blur-in",
        { opacity: 0, y: 20, filter: "blur(10px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1,
          stagger: 0.1,
        },
        0.3,
      );
    }, rootRef);
    return () => ctx.revert();
  }, [start]);

  return (
    <section
      ref={rootRef}
      id="home"
      className="relative flex h-dvh w-full flex-col items-center justify-center overflow-hidden"
    >
      <Navbar />

      <div className="absolute inset-0 -z-10">
        <BackgroundVideo
          src={BACKGROUND_VIDEO}
          className="absolute left-1/2 top-1/2 size-full min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[hsl(var(--bg))] to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <span className="blur-in mb-8 text-xs uppercase tracking-[0.3em] text-[hsl(var(--muted))] opacity-0">
          Collection &rsquo;26
        </span>
        <h1 className="name-reveal mb-6 font-display text-6xl italic leading-[0.9] tracking-tight opacity-0 md:text-8xl lg:text-9xl">
          John Doe
        </h1>
        <p className="blur-in mb-3 text-lg text-[hsl(var(--text))] opacity-0 sm:text-xl">
          A{" "}
          <span
            key={roleIndex}
            className="animate-role-fade-in inline-block font-display italic text-[hsl(var(--text))]"
          >
            {ROLES[roleIndex]}
          </span>{" "}
          lives in Chicago.
        </p>
        <p className="blur-in mb-12 max-w-md text-sm text-[hsl(var(--muted))] opacity-0 md:text-base">
          Designing seamless digital interactions by focusing on the unique
          nuances which bring systems to life.
        </p>
        <div className="blur-in inline-flex flex-wrap items-center justify-center gap-4 opacity-0">
          <RingLink
            href="#work"
            outerClassName="transition-transform duration-300 hover:scale-105"
            innerClassName="bg-[hsl(var(--text))] px-7 py-3.5 text-sm text-[hsl(var(--bg))] group-hover:bg-[hsl(var(--bg))] group-hover:text-[hsl(var(--text))]"
          >
            See Works
          </RingLink>
          <RingLink
            href="#contact"
            outerClassName="transition-transform duration-300 hover:scale-105"
            innerClassName="border-2 border-[hsl(var(--stroke))] bg-[hsl(var(--bg))] px-7 py-3.5 text-sm text-[hsl(var(--text))] group-hover:border-transparent"
          >
            Reach out
          </RingLink>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3">
        <span className="text-xs uppercase tracking-[0.2em] text-[hsl(var(--muted))]">
          Scroll
        </span>
        <span className="relative block h-10 w-px overflow-hidden bg-[hsl(var(--stroke))]">
          <span className="accent-gradient animate-scroll-down absolute inset-x-0 top-0 block h-1/2 w-full" />
        </span>
      </div>
    </section>
  );
};
