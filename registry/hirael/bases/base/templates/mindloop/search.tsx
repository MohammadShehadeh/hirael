'use client';

import { motion } from 'motion/react';

import { ChatGptIcon, GoogleAiIcon, PerplexityIcon, Serif, useFadeUp } from './primitives';

const PLATFORMS = [
  {
    name: 'ChatGPT',
    Icon: ChatGptIcon,
    description:
      "Millions ask it before they ask anyone else. If your answer isn't in the model, you're not in the conversation.",
  },
  {
    name: 'Perplexity',
    Icon: PerplexityIcon,
    description: 'It cites its sources out loud. Be one of them, or watch a competitor get the citation instead.',
  },
  {
    name: 'Google AI',
    Icon: GoogleAiIcon,
    description: 'The answer now sits above the links. The page that earns the summary earns the reader.',
  },
];

export const Search = () => {
  const fade = useFadeUp();

  return (
    <section id="use-cases" className="px-8 pb-6 pt-52 md:px-28 md:pb-9 md:pt-64">
      <div className="mx-auto max-w-5xl text-center">
        <motion.h2 {...fade(0)} className="text-5xl tracking-[-2px] md:text-7xl lg:text-8xl">
          Search has <Serif>changed.</Serif> Have you?
        </motion.h2>

        <motion.p {...fade(0.1)} className="mx-auto mt-8 mb-24 max-w-2xl text-lg text-muted-foreground">
          People used to type keywords and scroll. Now they ask a question and read one answer. Make sure it sounds like
          you.
        </motion.p>

        <div className="mb-20 grid gap-12 md:grid-cols-3 md:gap-8">
          {PLATFORMS.map((platform, i) => (
            <motion.div key={platform.name} {...fade(0.1 * i)} className="flex flex-col items-center">
              <div className="liquid-glass flex aspect-square w-full max-w-[200px] items-center justify-center rounded-[2rem]">
                <platform.Icon className="h-24 w-24 text-foreground" />
              </div>
              <h3 className="mt-8 text-base font-semibold">{platform.name}</h3>
              <p className="mt-2 max-w-xs text-sm text-muted-foreground">{platform.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.p {...fade(0)} className="text-center text-sm text-muted-foreground">
          If you don&apos;t answer the questions, someone else will.
        </motion.p>
      </div>
    </section>
  );
};
