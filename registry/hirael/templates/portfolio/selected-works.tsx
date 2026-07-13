"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";

import { onAnchorClick, SectionHeader } from "./primitives";

const PROJECTS = [
  {
    title: "Automotive Motion",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    span: "md:col-span-7",
  },
  {
    title: "Urban Architecture",
    image:
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1000&q=80",
    span: "md:col-span-5",
  },
  {
    title: "Human Perspective",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1000&q=80",
    span: "md:col-span-5",
  },
  {
    title: "Brand Identity",
    image:
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1200&q=80",
    span: "md:col-span-7",
  },
];

const HALFTONE = {
  backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
  backgroundSize: "4px 4px",
};

export function SelectedWorks() {
  return (
    <section id="work" className="bg-[hsl(var(--bg))] py-12 md:py-16">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <SectionHeader
          eyebrow="Selected Work"
          lead="Featured"
          accent="projects"
          subtext="A selection of projects I've worked on, from concept to launch."
          viewAll={{ label: "View all work", href: "#work" }}
          className="mb-10 md:mb-14"
        />

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.12 } },
          }}
          className="grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-6"
        >
          {PROJECTS.map((project) => (
            <motion.a
              key={project.title}
              href="#work"
              onClick={(e) => onAnchorClick(e, "#work")}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              className={cn(
                "group relative block h-[320px] overflow-hidden rounded-3xl border border-[hsl(var(--stroke))] bg-[hsl(var(--surface))] md:h-[440px]",
                project.span,
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.image}
                alt={project.title}
                loading="lazy"
                className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 opacity-20 mix-blend-multiply"
                style={HALFTONE}
              />
              <span className="absolute inset-0 flex items-center justify-center bg-[hsl(var(--bg))]/70 opacity-0 backdrop-blur-lg transition-opacity duration-500 group-hover:opacity-100">
                <span className="accent-gradient-animated rounded-full p-px">
                  <span className="flex items-center rounded-full bg-white px-4 py-2 text-sm text-black">
                    View&nbsp;
                    <span className="font-display italic">{project.title}</span>
                  </span>
                </span>
              </span>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
