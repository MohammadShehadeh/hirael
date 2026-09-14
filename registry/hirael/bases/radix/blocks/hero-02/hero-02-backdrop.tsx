'use client';

import * as React from 'react';
import { Shader, Stripes } from 'shaders/react';

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

const readPalette = () => ({
  stripe: resolveColor('var(--muted-foreground)'),
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

const Hero02Backdrop = ({ active = false }: { active?: boolean }) => {
  const palette = usePalette();
  const reduced = useReducedMotion();
  if (!palette) return null;

  return (
    <Shader style={{ width: '100%', height: '100%' }}>
      <Stripes
        colorA="transparent"
        colorB={palette.stripe}
        angle={90}
        density={9}
        balance={0.5}
        softness={1}
        speed={reduced ? 0 : active ? 0.5 : 0.16}
      />
    </Shader>
  );
};

export default Hero02Backdrop;
