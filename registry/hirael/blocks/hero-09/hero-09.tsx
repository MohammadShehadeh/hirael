"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowRight, Languages, Moon, Sun, Zap } from "lucide-react";
import { motion, useAnimationControls, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import { Button } from "@/registry/hirael/ui/button";

type Lang = "en" | "ar";
type Scene = "morning" | "night";

const IMG: Record<Scene, string> = {
  morning:
    "https://res.cloudinary.com/dsdhxhhqh/image/upload/v1778837456/hf_20260515_092045_b654224c-4741-458f-8596-fa5bfeffabbc_1_oyfhme.jpg",
  night:
    "https://res.cloudinary.com/dsdhxhhqh/image/upload/v1778837447/hf_20260515_092102_24e30358-d694-4b70-8a56-a4f0887cf8ae_1_ry5dvs.jpg",
};

const COPY = {
  en: {
    dir: "ltr",
    toLang: "العربية",
    brandName: "Aswar Dar Al-Iraq",
    brandTag: "Solar Energy",
    nav: ["How it works", "Cases", "Pricing", "About"],
    navCta: "Get started",
    eyebrow: "Home solar",
    titleLead: "$0 electricity bills",
    titleAccent: "for the next seven years",
    body: "Forget the energy market, the weather, and the seasons. Our smart controller keeps your bill at zero for seven years.",
    primary: "Get an instant quote",
    secondary: "Talk to us",
    scene: {
      morning: { label: "Morning", note: "Runs on sunlight" },
      night: { label: "Night", note: "Runs on your battery" },
    },
    alt: {
      morning: "A home powered by solar in the morning light",
      night: "The same home powered by solar at night",
    },
  },
  ar: {
    dir: "rtl",
    toLang: "English",
    brandName: "اسوار دار العراق",
    brandTag: "للطاقة الشمسية",
    nav: ["كيف يعمل", "الحالات", "الأسعار", "من نحن"],
    navCta: "ابدأ الآن",
    eyebrow: "طاقة شمسية منزلية",
    titleLead: "صفر فواتير كهرباء",
    titleAccent: "طوال سبع سنوات",
    body: "انسَ سوق الطاقة والطقس وتقلّبات الفصول. وحدة التحكّم الذكية تُبقي فاتورتك عند الصفر لسبع سنوات.",
    primary: "احصل على عرض فوري",
    secondary: "تحدّث إلينا",
    scene: {
      morning: { label: "الصباح", note: "تعمل بالشمس" },
      night: { label: "الليل", note: "تعمل بالبطارية" },
    },
    alt: {
      morning: "منزل يعمل بالطاقة الشمسية في ضوء الصباح",
      night: "المنزل نفسه يعمل بالطاقة الشمسية ليلاً",
    },
  },
} satisfies Record<Lang, unknown>;

const SCENES = [
  { key: "morning", Icon: Sun },
  { key: "night", Icon: Moon },
] as const;

function useDocumentRtl() {
  const subscribe = React.useCallback(() => () => {}, []);
  return React.useSyncExternalStore(
    subscribe,
    () => document.documentElement.getAttribute("dir") === "rtl",
    () => false,
  );
}

export default function Hero09() {
  const [scene, setScene] = React.useState<Scene>("night");
  const [selected, setSelected] = React.useState<Scene>("night");
  const [langOverride, setLangOverride] = React.useState<Lang | null>(null);
  const reduced = useReducedMotion();
  const controls = useAnimationControls();
  const animatingRef = React.useRef(false);

  const docIsRtl = useDocumentRtl();
  const lang: Lang = langOverride ?? (docIsRtl ? "ar" : "en");
  const c = COPY[lang];
  const other: Scene = scene === "night" ? "morning" : "night";

  const goToScene = (next: Scene) => {
    if (next === selected || animatingRef.current) return;
    setSelected(next);
    if (reduced) {
      setScene(next);
      return;
    }
    animatingRef.current = true;
    controls
      .start({
        y: "16%",
        scale: 1.12,
        opacity: 0.85,
        transition: { duration: 0.3, ease: [0.32, 0, 0.67, 0] },
      })
      .then(() => {
        setScene(next);
        controls.set({ y: "16%", scale: 1.12, opacity: 1 });
        return controls.start({
          y: "0%",
          scale: 1.05,
          opacity: 1,
          transition: { type: "spring", stiffness: 200, damping: 18 },
        });
      })
      .then(() => {
        animatingRef.current = false;
      });
  };

  return (
    <section
      data-slot="hero"
      dir={c.dir}
      lang={lang}
      className="relative isolate flex min-h-[680px] w-full flex-col overflow-hidden bg-background text-foreground md:min-h-[780px]"
    >
      <div
        data-slot="hero-backdrop"
        className="absolute inset-0 -z-10 overflow-hidden"
      >
        <div aria-hidden className="absolute inset-0 scale-[1.2] blur-2xl">
          <Image
            src={IMG[other]}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <motion.div
          className="absolute inset-0"
          initial={{ y: "0%", scale: 1.05, opacity: 1 }}
          animate={controls}
          style={{ willChange: "transform, opacity" }}
        >
          <Image
            src={IMG[scene]}
            alt={c.alt[scene]}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-background from-5% via-background/75 via-55% to-background/10"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background/70 to-transparent"
        />
      </div>

      <header data-slot="hero-nav" className="relative z-10 px-4 py-4 md:px-6">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full border border-border bg-card/70 py-2 pe-2 ps-5 backdrop-blur-md">
          <span className="flex min-w-0 items-center gap-2.5 text-foreground">
            <Zap className="size-5 shrink-0 text-primary" />
            <span className="flex min-w-0 flex-col leading-none">
              <span className="truncate text-sm font-semibold tracking-tight">
                {c.brandName}
              </span>
              <span
                className={cn(
                  "mt-1 truncate text-[10px] text-muted-foreground",
                  lang === "en" && "font-medium uppercase tracking-[0.12em]",
                )}
              >
                {c.brandTag}
              </span>
            </span>
          </span>

          <div className="hidden items-center gap-7 text-sm text-muted-foreground lg:flex">
            {c.nav.map((link) => (
              <a
                key={link}
                href="#"
                className="transition-colors hover:text-foreground"
              >
                {link}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setLangOverride(lang === "en" ? "ar" : "en")}
              className="rounded-full text-muted-foreground hover:text-foreground"
            >
              <Languages className="size-4" />
              <span className="hidden text-xs font-medium sm:inline">
                {c.toLang}
              </span>
            </Button>
            <Button asChild size="sm" className="rounded-full">
              <a href="#">{c.navCta}</a>
            </Button>
          </div>
        </nav>
      </header>

      <div className="relative z-10 flex flex-1 items-end justify-center px-6 pb-12 md:px-10 md:pb-16">
        <div className="flex w-full max-w-3xl flex-col items-center text-center">
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3.5 py-1.5 text-[11px] text-muted-foreground backdrop-blur-sm",
              lang === "en"
                ? "font-mono uppercase tracking-[0.16em]"
                : "font-medium",
            )}
          >
            {c.eyebrow}
          </span>

          <h1
            className={cn(
              "mt-6 max-w-2xl text-balance font-serif text-5xl font-medium leading-[1.02] text-foreground sm:text-6xl md:text-7xl",
              lang === "en" ? "tracking-tight" : "tracking-normal",
            )}
          >
            {c.titleLead}{" "}
            <span className="text-foreground/55">{c.titleAccent}</span>
          </h1>

          <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            {c.body}
          </p>

          <div
            data-slot="hero-scene-toggle"
            role="group"
            aria-label={c.eyebrow}
            className="mt-9 inline-flex items-center gap-1 rounded-full border border-border bg-card/60 p-1 backdrop-blur-md"
          >
            {SCENES.map(({ key, Icon }) => {
              const active = selected === key;
              const s = c.scene[key];
              return (
                <button
                  key={key}
                  type="button"
                  data-slot="hero-scene-option"
                  aria-pressed={active}
                  onClick={() => goToScene(key)}
                  className={cn(
                    "relative flex items-center gap-2.5 rounded-full px-5 py-2.5 transition-colors",
                    active
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="hero-09-scene"
                      aria-hidden
                      className="absolute inset-0 rounded-full bg-primary shadow-sm"
                      transition={
                        reduced
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 380, damping: 32 }
                      }
                    />
                  )}
                  <Icon className="relative z-10 size-4 shrink-0" />
                  <span className="relative z-10 flex flex-col text-start leading-tight">
                    <span className="text-sm font-medium">{s.label}</span>
                    <span
                      className={cn(
                        "text-[11px]",
                        active
                          ? "text-primary-foreground/75"
                          : "text-muted-foreground/75",
                      )}
                    >
                      {s.note}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <Button
              asChild
              size="lg"
              className="group h-12 rounded-full px-7 text-base"
            >
              <a href="#">
                {c.primary}
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="h-12 rounded-full px-7 text-base"
            >
              <a href="#">{c.secondary}</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
