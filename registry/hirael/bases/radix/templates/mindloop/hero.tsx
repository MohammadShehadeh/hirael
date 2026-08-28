'use client';

import * as React from 'react';
import { motion } from 'motion/react';

import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { Field, FieldLabel } from '@/registry/hirael/bases/radix/ui/field';

import { AvatarRow, Serif, useFadeUp } from './primitives';

const HERO_VIDEO = '/media/templates/mindloop/hero.mp4';

export const Hero = () => {
  const fade = useFadeUp();

  return (
    <section id="home" className="relative flex h-dvh w-full flex-col items-center justify-center overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={HERO_VIDEO}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden
      />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background to-transparent" />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center px-6 pt-28 text-center md:pt-32">
        <motion.div {...fade(0)} className="flex flex-col items-center gap-3 sm:flex-row">
          <AvatarRow />
          <span className="text-sm text-muted-foreground">7,000+ people already subscribed</span>
        </motion.div>

        <motion.h1 {...fade(0.1)} className="mt-6 w-full text-5xl font-medium tracking-[-2px] md:text-7xl lg:text-8xl">
          Get <Serif>Inspired</Serif> with Us
        </motion.h1>

        <motion.p
          {...fade(0.2)}
          className="mt-6 w-full max-w-xl text-lg"
          style={{ color: 'hsl(var(--hero-subtitle))' }}
        >
          Join our feed for meaningful updates, news around technology and a shared journey toward depth and direction.
        </motion.p>

        <motion.form
          {...fade(0.3)}
          onSubmit={(e) => e.preventDefault()}
          className="liquid-glass mt-10 w-full max-w-lg rounded-full p-2"
        >
          <Field orientation="horizontal" className="gap-2">
            <FieldLabel htmlFor="mindloop-hero-email" className="sr-only">
              Email address
            </FieldLabel>
            <input
              id="mindloop-hero-email"
              type="email"
              required
              autoComplete="email"
              placeholder="Enter your email"
              className="min-w-0 flex-1 bg-transparent px-5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <Button asChild className="h-auto rounded-full px-8 py-3 font-semibold">
              <motion.button type="submit" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                SUBSCRIBE
              </motion.button>
            </Button>
          </Field>
        </motion.form>
      </div>
    </section>
  );
};
