import { THEMES, type ThemeItem } from '@/registry/themes';

/**
 * Base color options, shadcn's `registry/base-colors.ts` analog: the neutral
 * palettes that swap the whole canvas. "hirael" is the default cool-slate
 * canvas from `app/globals.css`; the rest are shadcn's neutrals. Accent
 * themes (red, emerald, ...) layer on top of whichever base is active.
 */
export const BASE_COLOR_NAMES = ['hirael', 'neutral', 'stone', 'zinc', 'mauve', 'olive', 'mist', 'taupe'] as const;

export type BaseColorName = (typeof BASE_COLOR_NAMES)[number];

const BASE_COLOR_SET: ReadonlySet<string> = new Set(BASE_COLOR_NAMES);

export const isBaseColor = (name: string): name is BaseColorName => BASE_COLOR_SET.has(name);

export const BASE_COLORS: ThemeItem[] = BASE_COLOR_NAMES.map((name) => {
  const theme = THEMES.find((t) => t.name === name);
  if (!theme) throw new Error(`Base color "${name}" is missing from THEMES`);
  return theme;
});

/**
 * Themes selectable for a given base color: the base color itself (its
 * neutral primary) plus every accent. Other base colors are excluded, the
 * same rule shadcn's customizer applies.
 */
export const getThemesForBaseColor = (baseColor: string): ThemeItem[] =>
  THEMES.filter((t) => t.name === baseColor || !isBaseColor(t.name));
