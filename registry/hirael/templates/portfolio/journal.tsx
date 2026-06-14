"use client";

import { motion } from "framer-motion";

import { ArrowUpRight, onAnchorClick, SectionHeader } from "./primitives";

const ENTRIES = [
  {
    title: "Designing for motion and meaning",
    image:
      "https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=400&q=80",
    readTime: "6 min read",
    date: "May 2026",
  },
  {
    title: "The quiet power of constraints",
    image:
      "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=400&q=80",
    readTime: "4 min read",
    date: "Apr 2026",
  },
  {
    title: "Systems that scale with the team",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    readTime: "8 min read",
    date: "Mar 2026",
  },
  {
    title: "Notes on color and contrast",
    image:
      "https://images.unsplash.com/photo-1502691876148-a84978e59af8?auto=format&fit=crop&w=400&q=80",
    readTime: "5 min read",
    date: "Feb 2026",
  },
];

export function Journal() {
  return (
    <section id="journal" className="bg-[hsl(var(--bg))] py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <SectionHeader
          eyebrow="Journal"
          lead="Recent"
          accent="thoughts"
          subtext="Essays and notes on craft, process, and the work behind the work."
          viewAll={{ label: "View all", href: "#journal" }}
          className="mb-10 md:mb-14"
        />

        <div className="flex flex-col gap-4">
          {ENTRIES.map((entry, i) => (
            <motion.a
              key={entry.title}
              href="#journal"
              onClick={(e) => onAnchorClick(e, "#journal")}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.08,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="group flex items-center gap-4 rounded-[40px] border border-[hsl(var(--stroke))] bg-[hsl(var(--surface))]/30 p-4 transition-colors duration-300 hover:bg-[hsl(var(--surface))] sm:gap-6 sm:rounded-full"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={entry.image}
                alt=""
                loading="lazy"
                className="size-16 shrink-0 rounded-full object-cover sm:size-20"
              />
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-base font-medium sm:text-lg">
                  {entry.title}
                </h3>
                <p className="mt-1 text-xs text-[hsl(var(--muted))] sm:text-sm">
                  {entry.readTime} · {entry.date}
                </p>
              </div>
              <span className="me-2 flex size-9 shrink-0 items-center justify-center rounded-full border border-[hsl(var(--stroke))] text-[hsl(var(--muted))] transition-colors duration-300 group-hover:text-[hsl(var(--text))]">
                <ArrowUpRight className="size-4 rtl:-scale-x-100" />
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
