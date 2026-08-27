"use client";

import { motion } from "motion/react";

import { ArrowUpRight, onAnchorClick, SectionHeader } from "./primitives";

const ENTRIES = [
  {
    title: "Designing for motion and meaning",
    image:
      "/media/templates/portfolio/journal-motion-and-meaning.jpg",
    readTime: "6 min read",
    date: "May 2026",
  },
  {
    title: "The quiet power of constraints",
    image:
      "/media/templates/portfolio/journal-quiet-constraints.jpg",
    readTime: "4 min read",
    date: "Apr 2026",
  },
  {
    title: "Systems that scale with the team",
    image:
      "/media/templates/portfolio/journal-systems-that-scale.jpg",
    readTime: "8 min read",
    date: "Mar 2026",
  },
  {
    title: "Notes on color and contrast",
    image:
      "/media/templates/portfolio/journal-color-and-contrast.jpg",
    readTime: "5 min read",
    date: "Feb 2026",
  },
];

export const Journal = () => {
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
};
