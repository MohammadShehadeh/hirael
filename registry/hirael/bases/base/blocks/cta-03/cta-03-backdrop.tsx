'use client';

import * as React from 'react';
import { Dither, Shader, Swirl } from 'shaders/react';

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
  base: resolveColor('var(--background)'),
  ink: resolveColor('color-mix(in oklab, var(--foreground) 65%, var(--background))'),
  halftone: resolveColor('color-mix(in oklab, var(--foreground) 50%, var(--background))'),
});

type Palette = ReturnType<typeof readPalette>;

/** Theme tokens, re-read whenever the theme class on <html> changes. */
const usePalette = () => {
  const [palette, setPalette] = React.useState<Palette | null>(() =>
    typeof document === 'undefined' ? null : readPalette(),
  );

  React.useEffect(() => {
    const observer = new MutationObserver(() => setPalette(readPalette()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  return palette;
};

const Cta03Backdrop = ({ active = false }: { active?: boolean }) => {
  const palette = usePalette();
  if (!palette) return null;

  return (
    <Shader style={{ width: '100%', height: '100%' }}>
      <Swirl colorA={palette.base} colorB={palette.ink} speed={active ? 0.6 : 0.2} detail={1.6} />
      <Dither colorMode="custom" colorA="transparent" colorB={palette.halftone} pattern="bayer4" pixelSize={3} />
    </Shader>
  );
};

export default Cta03Backdrop;
