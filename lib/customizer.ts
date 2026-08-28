/**
 * Customizer model: the choices the sheet offers, how they resolve to CSS
 * tokens, and how those tokens reach the page.
 *
 * Config (base, icon library) describes the consumer's project and only feeds
 * the setup snippet; Hirael ships one Radix-based tree with lucide icons, so
 * neither changes what renders. Styles (base color, theme, chart color, font,
 * radius) re-skin the site live: they resolve to `.light` / `.dark` token
 * blocks injected as a <style> element, mirroring how a consumer's
 * globals.css would carry the same values. "Preview only" scopes those blocks
 * to `[data-customizer-scope]` surfaces (demo cards, component previews) and
 * the framed `/embed/*` documents, leaving the site chrome alone.
 */

import {
  BASE_COLOR_NAMES,
  getThemesForBaseColor,
  type BaseColorName,
} from "@/registry/base-colors";
import { THEME_BY_NAME, type ThemeTokens } from "@/registry/themes";
import { FONTS, FONT_BY_NAME } from "@/lib/fonts";

export type ThemeMode = "light" | "dark";

export const MODE_STORAGE_KEY = "hirael.theme.mode.v1";
export const CONFIG_STORAGE_KEY = "hirael.customizer.v1";
export const CSS_STORAGE_KEY = "hirael.customizer.css.v1";
export const STYLE_ELEMENT_ID = "hirael-customizer";
export const SCOPE_ATTR = "data-customizer-scope";
const SCOPE_SELECTOR = `[${SCOPE_ATTR}]`;

export const BASES = [
  { name: "radix", title: "Radix UI" },
  { name: "base", title: "Base UI" },
] as const;
export type BaseName = (typeof BASES)[number]["name"];

export const ICON_LIBRARIES = [
  { name: "lucide", title: "Lucide", pkg: "lucide-react" },
  { name: "tabler", title: "Tabler Icons", pkg: "@tabler/icons-react" },
  { name: "hugeicons", title: "HugeIcons", pkg: "@hugeicons/react" },
  { name: "phosphor", title: "Phosphor Icons", pkg: "@phosphor-icons/react" },
  { name: "remixicon", title: "Remix Icon", pkg: "@remixicon/react" },
] as const;
export type IconLibraryName = (typeof ICON_LIBRARIES)[number]["name"];

export const RADII = [
  { name: "default", title: "Default", value: "" },
  { name: "none", title: "None", value: "0" },
  { name: "small", title: "Small", value: "0.45rem" },
  { name: "medium", title: "Medium", value: "0.625rem" },
  { name: "large", title: "Large", value: "0.875rem" },
] as const;
export type RadiusName = (typeof RADII)[number]["name"];

export interface CustomizerConfig {
  base: BaseName;
  iconLibrary: IconLibraryName;
  previewOnly: boolean;
  baseColor: BaseColorName;
  theme: string;
  chartColor: string;
  font: string;
  radius: RadiusName;
}

export const DEFAULT_CONFIG: CustomizerConfig = {
  base: "radix",
  iconLibrary: "lucide",
  previewOnly: false,
  baseColor: "hirael",
  theme: "hirael",
  chartColor: "hirael",
  font: "inter",
  radius: "default",
};

const pick = <T extends string>(
  value: unknown,
  allowed: readonly T[],
  fallback: T,
): T =>
  typeof value === "string" && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : fallback;

/**
 * Coerce anything (persisted JSON, a partial patch) into a valid config. A
 * theme or chart color that belongs to another base color falls back the way
 * shadcn's customizer does: theme to the base color's own neutral, chart color
 * to the theme.
 */
export const normalizeConfig = (
  raw: Partial<CustomizerConfig> | null | undefined,
): CustomizerConfig => {
  const baseColor = pick(raw?.baseColor, BASE_COLOR_NAMES, DEFAULT_CONFIG.baseColor);
  const themeNames = getThemesForBaseColor(baseColor).map((t) => t.name);
  const theme = pick(raw?.theme, themeNames, baseColor);
  const chartColor = pick(raw?.chartColor, themeNames, theme);
  return {
    base: pick(
      raw?.base,
      BASES.map((b) => b.name),
      DEFAULT_CONFIG.base,
    ),
    iconLibrary: pick(
      raw?.iconLibrary,
      ICON_LIBRARIES.map((i) => i.name),
      DEFAULT_CONFIG.iconLibrary,
    ),
    previewOnly: raw?.previewOnly === true,
    baseColor,
    theme,
    chartColor,
    font: pick(
      raw?.font,
      FONTS.map((f) => f.name),
      DEFAULT_CONFIG.font,
    ),
    radius: pick(
      raw?.radius,
      RADII.map((r) => r.name),
      DEFAULT_CONFIG.radius,
    ),
  };
};

export const isDefaultConfig = (config: CustomizerConfig) =>
  (Object.keys(DEFAULT_CONFIG) as (keyof CustomizerConfig)[]).every(
    (key) => config[key] === DEFAULT_CONFIG[key],
  );

export interface ResolvedTokens {
  light: ThemeTokens;
  dark: ThemeTokens;
  /** next/font family string for the chosen font, null for the site default. */
  fontFamily: string | null;
}

const CHART_KEYS = ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"];

/** Base color, then the accent theme on top, then chart and radius knobs. */
export const resolveTokens = (config: CustomizerConfig): ResolvedTokens => {
  const light: ThemeTokens = {};
  const dark: ThemeTokens = {};
  const overlay = (name: string, keys?: readonly string[]) => {
    const theme = THEME_BY_NAME[name];
    if (!theme) return;
    for (const [k, v] of Object.entries(theme.cssVars.light)) {
      if (!keys || keys.includes(k)) light[k] = v;
    }
    for (const [k, v] of Object.entries(theme.cssVars.dark)) {
      if (!keys || keys.includes(k)) dark[k] = v;
    }
  };

  overlay(config.baseColor);
  if (config.theme !== config.baseColor) overlay(config.theme);
  if (config.chartColor !== config.theme) {
    for (const k of CHART_KEYS) {
      delete light[k];
      delete dark[k];
    }
    overlay(config.chartColor, CHART_KEYS);
  }

  const radius = RADII.find((r) => r.name === config.radius);
  if (radius?.value) {
    light.radius = radius.value;
    dark.radius = radius.value;
  }

  const fontFamily =
    config.font === DEFAULT_CONFIG.font
      ? null
      : (FONT_BY_NAME[config.font]?.family ?? null);

  return { light, dark, fontFamily };
};

const declarations = (vars: ThemeTokens) =>
  Object.entries(vars)
    .map(([k, v]) => `--${k}:${v};`)
    .join("");

const rule = (selector: string, body: string) =>
  body ? `${selector}{${body}}` : "";

/**
 * The stylesheet that applies resolved tokens. Mode blocks target `.light` /
 * `.dark` so the same text is right whichever class next-themes sets, and so
 * an always-dark region nested in a light page keeps its dark values. Scoped
 * output confines everything to `[data-customizer-scope]` surfaces; the font
 * is re-applied there since `body` set it from the site default.
 */
export const buildCustomizerCss = (
  tokens: ResolvedTokens,
  scoped: boolean,
): string => {
  const scope = scoped ? ` ${SCOPE_SELECTOR}` : "";
  const font = tokens.fontFamily
    ? `--font-sans-active:${tokens.fontFamily};`
    : "";
  return [
    rule(`.light${scope}`, declarations(tokens.light)),
    rule(`.dark${scope}`, declarations(tokens.dark)),
    scoped
      ? rule(
          SCOPE_SELECTOR,
          font ? `${font}font-family:var(--font-sans-active);` : "",
        )
      : rule(":root", font),
  ]
    .filter(Boolean)
    .join("\n");
};

/** Copy-out form: shadcn's `:root` (light) + `.dark` convention. */
export const formatThemeCss = (tokens: ResolvedTokens): string => {
  const block = (selector: string, vars: ThemeTokens) => {
    const keys = Object.keys(vars);
    if (!keys.length) return "";
    return `${selector} {\n${keys.map((k) => `  --${k}: ${vars[k]};`).join("\n")}\n}`;
  };
  return [block(":root", tokens.light), block(".dark", tokens.dark)]
    .filter(Boolean)
    .join("\n\n");
};

export const isEmbedPath = (pathname: string) => pathname.startsWith("/embed/");

/**
 * Inline script (stringified) that runs before hydration and injects the
 * stylesheet the provider last persisted, so a re-skinned page paints right on
 * frame one. Framed `/embed/*` documents always get the unscoped sheet: they
 * are previews in their entirety, whatever "preview only" says.
 */
export const customizerPrehydrationScript = (): string => {
  return `(()=>{try{
    var raw=localStorage.getItem(${JSON.stringify(CSS_STORAGE_KEY)});
    if(!raw)return;
    var s=JSON.parse(raw);
    var css=location.pathname.indexOf('/embed/')===0?s.embed:s.main;
    if(!css)return;
    var el=document.createElement('style');
    el.id=${JSON.stringify(STYLE_ELEMENT_ID)};
    el.textContent=css;
    document.head.appendChild(el);
  }catch(e){}})();`;
};
