'use client';

import * as React from 'react';
import { Aurora, FilmGrain, Shader } from 'shaders/react';

/**
 * Resolves a CSS color expression (a token, a color-mix) to the absolute color
 * the current theme gives it. The shader parses colors itself and cannot read
 * `var()`, so the tokens are read from the DOM instead of hard-coded.
 */
const resolveColor = (value: string) => {
  const probe = document.createElement('span');
  probe.style.color = value;
  document.body.append(probe);
  const resolved = getComputedStyle(probe).color;
  probe.remove();
  return resolved;
};

// Three curtain tones ramping from the canvas toward the ink, tinted with the
// brand taupe so the aurora sits on-palette in either theme.
const readPalette = () => ({
  low: resolveColor('color-mix(in oklab, var(--warm) 45%, var(--background))'),
  mid: resolveColor('var(--warm)'),
  high: resolveColor('color-mix(in oklab, var(--warm) 40%, var(--foreground))'),
});

type Palette = ReturnType<typeof readPalette>;

/** Theme tokens, re-read whenever the theme class on <html> changes. */
const usePalette = () => {
  const [palette, setPalette] = React.useState<Palette | null>(() =>
    typeof document === 'undefined' ? null : readPalette(),
  );

  React.useEffect(() => {
    const observer = new MutationObserver(() => setPalette(readPalette()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return palette;
};

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

const subscribeReducedMotion = (onChange: () => void) => {
  const media = window.matchMedia(REDUCED_MOTION);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
};

const useReducedMotion = () =>
  React.useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );

const Hero05Backdrop = ({ active = false }: { active?: boolean }) => {
  const palette = usePalette();
  const reduced = useReducedMotion();
  if (!palette) return null;

  return (
    <Shader style={{ width: '100%', height: '100%' }}>
      <Aurora
        colorA={palette.low}
        colorB={palette.mid}
        colorC={palette.high}
        balance={0.5}
        intensity={1.1}
        curtainCount={4}
        speed={reduced ? 0 : active ? 0.7 : 0.3}
        waviness={0.7}
        height={0.9}
      />
      <FilmGrain strength={0.05} animated={!reduced} />
    </Shader>
  );
};

export default Hero05Backdrop;
