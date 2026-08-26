import type { Theme } from "@/lib/theme";

/**
 * Curated theme presets, shadcn's `registry/themes.ts` analog. Each only
 * overrides the primary hue + ring, so the rest of the neutral palette stays
 * consistent with the default Hirael look. Unlike shadcn's installable
 * `registry:theme` items (declared in registry-meta.ts, e.g. `theme-emerald`),
 * these drive the live theme editor's preset picker — see `theme-sheet.tsx`.
 */
export interface ThemePreset {
  id: string;
  label: string;
  swatch: string;
  overrides: Partial<Theme>;}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "hirael",
    label: "Hirael",
    swatch: "oklch(0.910 0.008 85)",
    overrides: {
      dark: {
        primary: "oklch(0.910 0.008 85)",
        "primary-foreground": "oklch(0.155 0.013 250)",
        ring: "oklch(0.710 0.013 80)",
      },
      light: {
        primary: "oklch(0.225 0.018 254)",
        "primary-foreground": "oklch(0.910 0.008 85)",
        ring: "oklch(0.430 0.015 260)",
      },
    },
  },
  {
    id: "emerald",
    label: "Emerald",
    swatch: "oklch(0.72 0.16 155)",
    overrides: {
      dark: {
        primary: "oklch(0.72 0.16 155)",
        "primary-foreground": "oklch(0.14 0.02 155)",
        ring: "oklch(0.68 0.16 155)",
      },
      light: {
        primary: "oklch(0.52 0.14 155)",
        "primary-foreground": "oklch(0.98 0.01 155)",
        ring: "oklch(0.58 0.14 155)",
      },
    },
  },
  {
    id: "indigo",
    label: "Indigo",
    swatch: "oklch(0.68 0.18 270)",
    overrides: {
      dark: {
        primary: "oklch(0.68 0.18 270)",
        "primary-foreground": "oklch(0.14 0.02 270)",
        ring: "oklch(0.64 0.18 270)",
      },
      light: {
        primary: "oklch(0.52 0.18 270)",
        "primary-foreground": "oklch(0.98 0.01 270)",
        ring: "oklch(0.58 0.18 270)",
      },
    },
  },
  {
    id: "rose",
    label: "Rose",
    swatch: "oklch(0.7 0.18 15)",
    overrides: {
      dark: {
        primary: "oklch(0.7 0.18 15)",
        "primary-foreground": "oklch(0.14 0.02 15)",
        ring: "oklch(0.66 0.18 15)",
      },
      light: {
        primary: "oklch(0.56 0.18 15)",
        "primary-foreground": "oklch(0.98 0.01 15)",
        ring: "oklch(0.6 0.18 15)",
      },
    },
  },
];
