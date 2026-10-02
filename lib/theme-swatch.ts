import type { ThemeMode } from '@/lib/customizer';
import { HIRAEL_SWATCH_TOKENS, HIRAEL_THEME, type ThemeItem } from '@/registry/themes';

export type SwatchKind = 'base' | 'theme' | 'chart';

const CHART_STEPS = [1, 2, 3, 4, 5];

/**
 * The color a picker row shows for a theme, in the mode the site is in. Base colors are near-white
 * backgrounds, so their mid-gray carries the tint; the chart row shows all five steps, since `chart-1`
 * alone is the palest and can be another hue (Amber's is yellow).
 */
export const themeSwatch = (theme: ThemeItem, kind: SwatchKind, mode: ThemeMode): string => {
  const tokens = theme.name === HIRAEL_THEME.name ? HIRAEL_SWATCH_TOKENS[mode] : theme.cssVars[mode];
  if (kind === 'base') return tokens['muted-foreground'] ?? '';
  if (kind === 'theme') return tokens.primary ?? '';
  const stops = CHART_STEPS.map((step, index) => `${tokens[`chart-${step}`]} ${index * 20}% ${step * 20}%`);

  return `linear-gradient(90deg, ${stops.join(', ')})`;
};
