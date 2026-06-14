/**
 * Server-side syntax highlighting via shiki.
 *
 * The highlighter is created once per server process (cached as a module-level
 * promise) and reused across requests. Output uses dual themes — CSS variables
 * carry both the light and dark token colors, and a small block in
 * globals.css picks the right one based on the `.light` mode class.
 */

import type { BundledLanguage, Highlighter } from "shiki";

const DARK_THEME = "vesper";
const LIGHT_THEME = "vitesse-light";

const SUPPORTED_LANGS: BundledLanguage[] = [
  "tsx",
  "ts",
  "jsx",
  "js",
  "bash",
  "shell",
  "css",
  "json",
  "html",
  "md",
];

let highlighterPromise: Promise<Highlighter> | undefined;

async function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    const { createHighlighter } = await import("shiki");
    highlighterPromise = createHighlighter({
      themes: [DARK_THEME, LIGHT_THEME],
      langs: SUPPORTED_LANGS,
    });
  }
  return highlighterPromise;
}

export type HighlightLang = BundledLanguage | "plaintext";

export async function highlightCode(
  code: string,
  lang: HighlightLang,
): Promise<string> {
  const safeLang = SUPPORTED_LANGS.includes(lang as BundledLanguage)
    ? (lang as BundledLanguage)
    : "tsx";
  const hl = await getHighlighter();
  return hl.codeToHtml(code, {
    lang: safeLang,
    themes: { light: LIGHT_THEME, dark: DARK_THEME },
    defaultColor: "dark",
  });
}

/** Infer a shiki lang from a filename. */
export function langFromPath(filePath: string): HighlightLang {
  const ext = filePath.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "tsx":
    case "jsx":
      return "tsx";
    case "ts":
      return "ts";
    case "js":
    case "mjs":
    case "cjs":
      return "js";
    case "css":
      return "css";
    case "json":
      return "json";
    case "html":
      return "html";
    case "md":
    case "mdx":
      return "md";
    case "sh":
    case "bash":
      return "bash";
    default:
      return "tsx";
  }
}
