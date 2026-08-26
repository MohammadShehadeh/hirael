/**
 * Server-side syntax highlighting via shiki.
 *
 * The highlighter is created once per server process (cached as a module-level
 * promise) and reused across requests. Output uses dual themes — CSS variables
 * carry both the light and dark token colors, and a small block in
 * globals.css picks the right one based on the `.light` mode class.
 */

import type { BundledLanguage, Highlighter } from "shiki";

// VSCode's own default themes — the familiar editor colors (blue keywords,
// orange strings, teal types, yellow functions, green numbers/comments).
const DARK_THEME = "dark-plus";
const LIGHT_THEME = "light-plus";

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

const getHighlighter = async (): Promise<Highlighter> => {
  if (!highlighterPromise) {
    const { createHighlighter } = await import("shiki");
    highlighterPromise = createHighlighter({
      themes: [DARK_THEME, LIGHT_THEME],
      langs: SUPPORTED_LANGS,
    });
  }
  return highlighterPromise;
};

export type HighlightLang = BundledLanguage | "plaintext";

export const highlightCode = async (code: string,
  lang: HighlightLang,): Promise<string> => {
  const safeLang = SUPPORTED_LANGS.includes(lang as BundledLanguage)
    ? (lang as BundledLanguage)
    : "tsx";
  const hl = await getHighlighter();
  return hl.codeToHtml(code, {
    lang: safeLang,
    themes: { light: LIGHT_THEME, dark: DARK_THEME },
    defaultColor: "dark",
  });
};

/**
 * Inline highlight — token `<span>`s only, no `<pre>`/`<code>` wrapper or
 * surface — for syntax-coloring short type signatures inside the API table.
 * Defaults to `ts` so prop types and defaults read like editor code.
 */
export const highlightInline = async (code: string,
  lang: HighlightLang = "ts",): Promise<string> => {
  const safeLang = SUPPORTED_LANGS.includes(lang as BundledLanguage)
    ? (lang as BundledLanguage)
    : "ts";
  const hl = await getHighlighter();
  return hl.codeToHtml(code, {
    lang: safeLang,
    themes: { light: LIGHT_THEME, dark: DARK_THEME },
    defaultColor: "dark",
    structure: "inline",
  });
};

/** Infer a shiki lang from a filename. */
export const langFromPath = (filePath: string): HighlightLang => {
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
};
