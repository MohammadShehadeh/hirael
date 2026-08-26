"use client";

import { ScrollRevealText, WordsPullUpMultiStyle } from "./primitives";

const HEADING_SEGMENTS = [
  { text: "Hirael is a creative studio,", className: "font-normal" },
  {
    text: "born from restless curiosity.",
    className: "italic [font-family:var(--font-instrument-serif)]",
  },
  {
    text: "We shape color, light and story into work that lingers.",
    className: "font-normal",
  },
];

const BODY =
  "Over the last seven years we have partnered with directors, brands and festivals across Berlin, Paris and beyond, crafting cinema and series that have earned acclaim on stages worldwide.";

export const About = () => {
  return (
    <section className="bg-black px-4 py-20 sm:px-6 sm:py-28 md:py-32">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 rounded-[2rem] bg-[#101010] px-6 py-16 text-center sm:px-10 sm:py-20 md:px-16 md:py-24">
        <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#DEDBC8] sm:text-xs">
          Visual arts
        </span>

        <h2
          className="mx-auto max-w-3xl text-3xl leading-[0.95] sm:text-4xl sm:leading-[0.9] md:text-5xl lg:text-6xl xl:text-7xl"
          style={{ color: "#E1E0CC" }}
        >
          <WordsPullUpMultiStyle segments={HEADING_SEGMENTS} />
        </h2>

        <ScrollRevealText
          text={BODY}
          className="mx-auto max-w-2xl text-xs leading-relaxed text-[#DEDBC8] sm:text-sm md:text-base"
        />
      </div>
    </section>
  );
};
