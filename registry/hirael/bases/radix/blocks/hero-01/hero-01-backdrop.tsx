'use client';

import * as React from 'react';
import { Beam, Shader, Swirl } from 'shaders/react';
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
const BEAMS = {
  light: {
    wide: 'oklch(from var(--primary) 0.86 calc(c * 0.7) h)',
    narrow: 'oklch(from var(--primary) 0.88 calc(c * 0.55) calc(h - 20))',
    swirl: 'oklch(from var(--primary) 0.92 calc(c * 0.45) calc(h + 15))',
  },
  dark: {
    wide: 'oklch(from var(--primary) 0.58 calc(c * 0.9) calc(h - 10))',
    narrow: 'oklch(from var(--primary) 0.4 calc(c * 0.7) calc(h - 30))',
    swirl: 'oklch(from var(--primary) 0.5 calc(c * 0.7) calc(h - 20))',
  },
};

const readPalette = () => {
  const beams = document.documentElement.classList.contains('dark') ? BEAMS.dark : BEAMS.light;

  return {
    wide: resolveColor(beams.wide),
    narrow: resolveColor(beams.narrow),
    swirl: resolveColor(beams.swirl),
  };
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

interface Hero01BackdropProps {
  active?: boolean;
}

const Hero01Backdrop = ({ active = false }: Hero01BackdropProps) => {
  const palette = usePalette();
  const reduced = useReducedMotion();
  if (!palette) return null;

  return (
    <Shader style={{ width: '100%', height: '100%' }}>
      <Swirl speed={reduced ? 0 : active ? 0.5 : 0.16} detail={1.5} colorA={palette.swirl} colorB={palette.narrow} />
      <Beam
        startPosition={{ x: 0.32, y: -0.1 }}
        endPosition={{ x: 0.46, y: 1.1 }}
        startThickness={0.01}
        endThickness={0.42}
        startSoftness={5}
        endSoftness={1}
        insideColor={palette.wide}
        outsideColor="transparent"
      />
      <Beam
        startPosition={{ x: 0.7, y: -0.1 }}
        endPosition={{ x: 0.58, y: 1.1 }}
        startThickness={0.01}
        endThickness={0.28}
        startSoftness={1}
        endSoftness={1}
        insideColor={palette.narrow}
        outsideColor="transparent"
      />
    </Shader>
  );
};

export default Hero01Backdrop;
