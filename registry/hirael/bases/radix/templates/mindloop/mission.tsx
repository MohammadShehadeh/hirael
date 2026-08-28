'use client';

import * as React from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';

import { cn } from '@/lib/utils';

const MISSION_VIDEO = '/media/templates/mindloop/mission.mp4';

const PARAGRAPH_1 =
  "We're building a space where curiosity meets clarity, where readers find depth, writers find reach, and every newsletter becomes a conversation worth having.";
const PARAGRAPH_1_HIGHLIGHTS = ['curiosity', 'meets', 'clarity'];

const PARAGRAPH_2 =
  'A platform where content, community, and insight flow together, with less noise, less friction, and more meaning for everyone involved.';

interface Token {
  text: string;
  highlight: boolean;
}

const tokenize = (text: string, highlights: string[]): Token[] => {
  return text.split(' ').map((word) => ({
    text: word,
    highlight: highlights.includes(word.replace(/[^a-zA-Z]/g, '')),
  }));
};

const Word = ({
  token,
  index,
  total,
  progress,
  reduce,
}: {
  token: Token;
  index: number;
  total: number;
  progress: MotionValue<number>;
  reduce: boolean;
}) => {
  const start = index / total;
  const end = (index + 0.9) / total;
  const opacity = useTransform(progress, [start, end], [0.15, 1]);
  return (
    <motion.span className={cn(token.highlight && 'text-foreground')} style={reduce ? undefined : { opacity }}>
      {token.text}{' '}
    </motion.span>
  );
};

export const Mission = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end 0.4'],
  });

  const tokens1 = tokenize(PARAGRAPH_1, PARAGRAPH_1_HIGHLIGHTS);
  const tokens2 = tokenize(PARAGRAPH_2, []);
  const total = tokens1.length + tokens2.length;

  return (
    <section id="philosophy" className="px-8 pb-32 pt-0 md:px-28 md:pb-44">
      <div className="mx-auto flex max-w-4xl flex-col items-center">
        <video
          className="w-full max-w-[800px] rounded-2xl object-cover"
          src={MISSION_VIDEO}
          autoPlay
          loop
          muted
          playsInline
          aria-hidden
        />

        <div ref={ref} className="mt-16 w-full text-center md:mt-20">
          <p
            className="text-2xl font-medium tracking-[-1px] md:text-4xl lg:text-5xl"
            style={{ color: 'hsl(var(--hero-subtitle))' }}
          >
            {tokens1.map((token, i) => (
              <Word key={i} token={token} index={i} total={total} progress={scrollYProgress} reduce={reduce} />
            ))}
          </p>
          <p
            className="mt-10 text-xl font-medium md:text-2xl lg:text-3xl"
            style={{ color: 'hsl(var(--hero-subtitle))' }}
          >
            {tokens2.map((token, i) => (
              <Word
                key={i}
                token={token}
                index={tokens1.length + i}
                total={total}
                progress={scrollYProgress}
                reduce={reduce}
              />
            ))}
          </p>
        </div>
      </div>
    </section>
  );
};
