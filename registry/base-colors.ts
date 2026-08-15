import { THEME_PRESETS } from "@/registry/themes";

/**
 * Base color options, shadcn's `registry/base-colors.ts` analog. shadcn filters
 * its themes down to the neutral base palettes; hirael keeps a fixed neutral
 * canvas and instead lets a preset re-tint the primary/ring, so its base-color
 * options are simply the theme presets surfaced in the editor.
 */
export const BASE_COLORS = THEME_PRESETS;

export type BaseColor = (typeof BASE_COLORS)[number];
