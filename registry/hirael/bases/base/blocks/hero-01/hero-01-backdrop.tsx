'use client';

import * as React from 'react';
import { Beam, Shader, Swirl } from 'shaders/react';

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
  beam: resolveColor('var(--warm)'),
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

const Hero01Backdrop = ({ active = false }: { active?: boolean }) => {
  const palette = usePalette();
  const reduced = useReducedMotion();
  if (!palette) return null;

  return (
    <Shader style={{ width: '100%', height: '100%' }}>
      <Swirl speed={reduced ? 0 : active ? 0.5 : 0.16} detail={1.5} />
      <Beam
        startPosition={{ x: 0.32, y: -0.1 }}
        endPosition={{ x: 0.46, y: 1.1 }}
        startThickness={0.01}
        endThickness={0.42}
        startSoftness={5}
        endSoftness={1}
        insideColor={palette.beam}
        outsideColor="transparent"
      />
      <Beam
        startPosition={{ x: 0.7, y: -0.1 }}
        endPosition={{ x: 0.58, y: 1.1 }}
        startThickness={0.01}
        endThickness={0.28}
        startSoftness={1}
        endSoftness={1}
        insideColor={palette.beam}
        outsideColor="transparent"
      />
    </Shader>
  );
};

export default Hero01Backdrop;
