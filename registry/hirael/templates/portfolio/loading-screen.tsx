"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";

const WORDS = ["Design", "Create", "Inspire"];
const DURATION = 2700;
const WORD_INTERVAL = 900;
const EXIT_DELAY = 400;

export const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [count, setCount] = React.useState(0);
  const [wordIndex, setWordIndex] = React.useState(0);
  const [exiting, setExiting] = React.useState(false);

  const onCompleteRef = React.useRef(onComplete);
  React.useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  React.useEffect(() => {
    let raf = 0;
    let exitTimer: ReturnType<typeof setTimeout> | undefined;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / DURATION, 1);
      setCount(Math.round(progress * 100));
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
        return;
      }
      setExiting(true);
      exitTimer = setTimeout(() => onCompleteRef.current(), EXIT_DELAY);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      if (exitTimer) clearTimeout(exitTimer);
    };
  }, []);

  React.useEffect(() => {
    const id = setInterval(
      () => setWordIndex((i) => (i + 1) % WORDS.length),
      WORD_INTERVAL,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 1 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: EXIT_DELAY / 1000, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] overflow-hidden bg-[hsl(var(--bg))] text-[hsl(var(--text))]"
    >
      <motion.span
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute start-6 top-6 text-xs uppercase tracking-[0.3em] text-[hsl(var(--muted))] sm:start-10 sm:top-10"
      >
        Portfolio
      </motion.span>

      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={wordIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="font-display text-4xl italic text-[hsl(var(--text))]/80 md:text-6xl lg:text-7xl"
          >
            {WORDS[wordIndex]}
          </motion.span>
        </AnimatePresence>
      </div>

      <span className="absolute bottom-6 end-6 font-display text-6xl tabular-nums md:bottom-10 md:end-10 md:text-8xl lg:text-9xl">
        {String(count).padStart(3, "0")}
      </span>

      <div className="absolute inset-x-0 bottom-0 h-[3px] bg-[hsl(var(--stroke))]/50">
        <div
          className="accent-gradient h-full"
          style={{
            width: `${count}%`,
            boxShadow: "0 0 8px rgba(137, 170, 204, 0.35)",
          }}
        />
      </div>
    </motion.div>
  );
};
