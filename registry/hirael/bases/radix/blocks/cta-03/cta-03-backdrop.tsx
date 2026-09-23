'use client';

import * as React from 'react';
import { Dither, Shader, Swirl } from 'shaders/react';

// The shader can't read `var()`, so tokens are resolved to concrete colors through the DOM.
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

interface Cta03BackdropProps {
  active?: boolean;
}

const Cta03Backdrop = ({ active = false }: Cta03BackdropProps) => {
  const palette = usePalette();
  const reduced = useReducedMotion();
  if (!palette) return null;

  return (
    <Shader style={{ width: '100%', height: '100%' }}>
      <Swirl colorA={palette.base} colorB={palette.ink} speed={reduced ? 0 : active ? 0.6 : 0.2} detail={1.6} />
      <Dither colorMode="custom" colorA="transparent" colorB={palette.halftone} pattern="bayer4" pixelSize={3} />
    </Shader>
  );
};

export default Cta03Backdrop;
