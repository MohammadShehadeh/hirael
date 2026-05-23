/**
 * Theme token model + CSS parsing / formatting for the live theme settings sheet.
 *
 * The showcase's globals.css uses `:root` for dark (default) and `.light`
 * for the light variant. The live editor lets users paste CSS that follows
 * either convention — this module reconciles both into a {light, dark}
 * record that the provider applies via inline CSS custom properties.
 */

export type ThemeMode = "light" | "dark"

export type ThemeTokens = Record<string, string>

export type Theme = {
  light: ThemeTokens
  dark: ThemeTokens
}

/** Tokens the editor is aware of. Anything outside this list is ignored on paste. */
export const THEME_TOKEN_KEYS = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "border",
  "input",
  "ring",
  "sidebar",
  "sidebar-foreground",
  "sidebar-border",
  "sidebar-accent",
  "sidebar-accent-foreground",
  "radius",
] as const

export type ThemeTokenKey = (typeof THEME_TOKEN_KEYS)[number]

const TOKEN_SET = new Set<string>(THEME_TOKEN_KEYS)

/**
 * Parse one or more CSS blocks into {light, dark} token maps.
 *
 * Accepts:
 *   - `:root { ... }` + `.dark { ... }`   (shadcn convention — :root is light)
 *   - `:root { ... }` + `.light { ... }`  (this repo's convention — :root is dark)
 *   - A single `:root { ... }` block      (applied to currentMode)
 *   - Bare `--token: value;` lines        (applied to currentMode)
 */
export function parseThemeCss(
  css: string,
  currentMode: ThemeMode = "dark"
): { theme: Partial<Theme>; warnings: string[] } {
  const warnings: string[] = []
  const blocks = extractBlocks(css)

  const result: Partial<Theme> = {}

  if (blocks.length === 0) {
    const bare = extractDeclarations(css)
    if (Object.keys(bare).length) {
      result[currentMode] = bare
    } else {
      warnings.push("No CSS variables found.")
    }
    return { theme: result, warnings }
  }

  const hasDark = blocks.some((b) => b.selector === ".dark")
  const hasLight = blocks.some((b) => b.selector === ".light")

  // Disambiguate :root.
  // shadcn outputs `:root` (light) + `.dark` → :root is LIGHT.
  // This repo writes `:root` (dark) + `.light` → :root is DARK.
  const rootIsLight = hasDark && !hasLight
  const rootIsDark = hasLight && !hasDark
  // Ambiguous (just :root, or all three): default to currentMode.

  for (const block of blocks) {
    const decls = extractDeclarations(block.body)
    if (!Object.keys(decls).length) continue

    if (block.selector === ".light") {
      result.light = { ...(result.light ?? {}), ...decls }
    } else if (block.selector === ".dark") {
      result.dark = { ...(result.dark ?? {}), ...decls }
    } else if (block.selector === ":root") {
      const mode: ThemeMode = rootIsLight
        ? "light"
        : rootIsDark
          ? "dark"
          : currentMode
      result[mode] = { ...(result[mode] ?? {}), ...decls }
    }
  }

  if (!result.light && !result.dark) {
    warnings.push("No matching tokens found in the pasted CSS.")
  }
  return { theme: result, warnings }
}

type CssBlock = { selector: string; body: string }

function extractBlocks(css: string): CssBlock[] {
  // Strip comments first.
  const cleaned = css.replace(/\/\*[\s\S]*?\*\//g, "")
  const blocks: CssBlock[] = []
  const re = /([^{}]+)\{([^{}]*)\}/g
  let m: RegExpExecArray | null
  while ((m = re.exec(cleaned)) !== null) {
    const selector = m[1].trim()
    const body = m[2]
    // Only single selectors we care about.
    if (selector === ":root" || selector === ".light" || selector === ".dark") {
      blocks.push({ selector, body })
    }
  }
  return blocks
}

function extractDeclarations(body: string): ThemeTokens {
  const out: ThemeTokens = {}
  // Match `--token: value;` (value may contain parens / spaces).
  const re = /--([a-z0-9-]+)\s*:\s*([^;]+?)\s*(?:;|$)/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(body)) !== null) {
    const key = m[1]
    if (!TOKEN_SET.has(key)) continue
    out[key] = m[2].trim()
  }
  return out
}

/** Serialize a {light, dark} theme back into a paste-able CSS string. */
export function formatThemeCss(theme: Theme): string {
  const dark = formatBlock(":root", theme.dark)
  const light = formatBlock(".light", theme.light)
  return [dark, light].filter(Boolean).join("\n\n")
}

function formatBlock(selector: string, tokens: ThemeTokens): string {
  const keys = Object.keys(tokens).sort()
  if (!keys.length) return ""
  const lines = keys.map((k) => `  --${k}: ${tokens[k]};`)
  return `${selector} {\n${lines.join("\n")}\n}`
}

/**
 * Curated presets. Each only overrides the primary hue + ring, so the rest of
 * the neutral palette stays consistent with the default zinc look.
 */
export type ThemePreset = {
  id: string
  label: string
  swatch: string
  overrides: Partial<Theme>
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "zinc",
    label: "Zinc",
    swatch: "oklch(0.985 0 0)",
    overrides: {
      dark: {
        primary: "oklch(0.985 0 0)",
        "primary-foreground": "oklch(0.205 0 0)",
        ring: "oklch(0.708 0 0)",
      },
      light: {
        primary: "oklch(0.205 0 0)",
        "primary-foreground": "oklch(0.985 0 0)",
        ring: "oklch(0.708 0 0)",
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
]

export const STORAGE_KEY = "msh-ui.theme.v1"
export const MODE_STORAGE_KEY = "msh-ui.theme.mode.v1"

/**
 * Inline script (stringified) that runs before hydration to apply persisted
 * mode + custom tokens, preventing a flash of default theme.
 */
export function themePrehydrationScript(): string {
  return `(()=>{try{
    var modeKey=${JSON.stringify(MODE_STORAGE_KEY)};
    var themeKey=${JSON.stringify(STORAGE_KEY)};
    var mode=localStorage.getItem(modeKey);
    var html=document.documentElement;
    if(mode==='light'){html.classList.add('light');}
    var raw=localStorage.getItem(themeKey);
    if(!raw)return;
    var t=JSON.parse(raw);
    var active=mode==='light'?t.light:t.dark;
    if(!active)return;
    for(var k in active){html.style.setProperty('--'+k,active[k]);}
  }catch(e){}})();`
}
