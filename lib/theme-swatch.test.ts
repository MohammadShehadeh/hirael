import * as fs from 'node:fs';
import * as path from 'node:path';
import { describe, expect, it } from 'vitest';

import { themeSwatch, type SwatchKind } from '@/lib/theme-swatch';
import { BASE_COLORS } from '@/registry/base-colors';
import { HIRAEL_SWATCH_TOKENS, HIRAEL_THEME, THEMES } from '@/registry/themes';

const GLOBALS_CSS = fs.readFileSync(path.join(process.cwd(), 'app/globals.css'), 'utf8');

const cssBlock = (selector: string) => {
  const start = GLOBALS_CSS.indexOf(`\n${selector} {`);

  return GLOBALS_CSS.slice(start, GLOBALS_CSS.indexOf('\n}', start));
};

const cssVar = (block: string, name: string) => block.match(new RegExp(`--${name}: ([^;]+);`))?.[1];

const MODES = ['light', 'dark'] as const;
const KINDS: SwatchKind[] = ['base', 'theme', 'chart'];

describe('themeSwatch', () => {
  it.each(MODES)('should copy Hirael %s swatch colors from app/globals.css', (mode) => {
    const block = cssBlock(mode === 'light' ? ':root' : '.dark');
    for (const [name, value] of Object.entries(HIRAEL_SWATCH_TOKENS[mode])) {
      expect({ name, value: cssVar(block, name) }).toEqual({ name, value });
    }
  });

  it.each(MODES)('should give every theme a concrete %s color for each picker', (mode) => {
    for (const kind of KINDS) {
      for (const theme of kind === 'base' ? BASE_COLORS : THEMES) {
        const swatch = themeSwatch(theme, kind, mode);
        expect(swatch).toMatch(/oklch\(/);
        expect(swatch).not.toMatch(/undefined|var\(/);
      }
    }
  });

  it('should follow the mode, so a gray theme is dark in light mode and light in dark mode', () => {
    const neutral = THEMES.find((theme) => theme.name === 'neutral')!;
    expect(themeSwatch(neutral, 'theme', 'light')).toBe(neutral.cssVars.light.primary);
    expect(themeSwatch(neutral, 'theme', 'dark')).toBe(neutral.cssVars.dark.primary);
  });

  it('should show the whole chart ramp rather than its palest step', () => {
    const swatch = themeSwatch(HIRAEL_THEME, 'chart', 'dark');
    for (const step of [1, 2, 3, 4, 5]) expect(swatch).toContain(HIRAEL_SWATCH_TOKENS.dark[`chart-${step}`]);
  });
});
