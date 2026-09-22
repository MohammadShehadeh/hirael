import { THEMES, type ThemeItem } from '@/registry/themes';

export const BASE_COLOR_NAMES = ['hirael', 'neutral', 'stone', 'zinc', 'mauve', 'olive', 'mist', 'taupe'] as const;

export type BaseColorName = (typeof BASE_COLOR_NAMES)[number];

const BASE_COLOR_SET: ReadonlySet<string> = new Set(BASE_COLOR_NAMES);

export const isBaseColor = (name: string): name is BaseColorName => BASE_COLOR_SET.has(name);

export const BASE_COLORS: ThemeItem[] = BASE_COLOR_NAMES.map((name) => {
  const theme = THEMES.find((t) => t.name === name);
  if (!theme) throw new Error(`Base color "${name}" is missing from THEMES`);
  return theme;
});

export const getThemesForBaseColor = (baseColor: string): ThemeItem[] =>
  THEMES.filter((t) => t.name === baseColor || !isBaseColor(t.name));
