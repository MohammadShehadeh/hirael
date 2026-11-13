'use client';

import * as React from 'react';
import { Aurora, FilmGrain, Shader } from 'shaders/react';
import { useReducedMotion } from '@/registry/hirael/hooks/use-reduced-motion';

// The shader wants absolute colors, so CSS color syntax is resolved through the DOM.
const resolveColor = (value: string) => {
  const probe = document.createElement('span');
  probe.style.color = value;
  document.body.append(probe);
  const resolved = getComputedStyle(probe).color;
  probe.remove();

  return resolved;
};

// Shades of the theme's primary. Lightness and chroma are set outright per mode: mixing the raw
// primary into the background instead greys it out, which reads as a brown haze on dark canvases.
const AURORA = {
  light: {
    low: 'oklch(from var(--primary) 0.9 calc(c * 0.5) calc(h - 20))',
    mid: 'oklch(from var(--primary) 0.84 calc(c * 0.75) h)',
    high: 'oklch(from var(--primary) 0.93 calc(c * 0.45) calc(h + 15))',
  },
  dark: {
    low: 'oklch(from var(--primary) 0.3 calc(c * 0.6) calc(h - 30))',
    mid: 'oklch(from var(--primary) 0.55 calc(c * 0.9) calc(h - 10))',
    high: 'oklch(from var(--primary) 0.72 calc(c * 0.8) calc(h - 5))',
  },
};

const readPalette = () => {
  const aurora = document.documentElement.classList.contains('dark') ? AURORA.dark : AURORA.light;

  return { low: resolveColor(aurora.low), mid: resolveColor(aurora.mid), high: resolveColor(aurora.high) };
};

type Palette = ReturnType<typeof readPalette>;

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

interface Hero05BackdropProps {
  active?: boolean;
}

const Hero05Backdrop = ({ active = false }: Hero05BackdropProps) => {
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
