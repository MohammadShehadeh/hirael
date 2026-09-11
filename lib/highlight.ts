import type { BundledLanguage, Highlighter } from 'shiki';

const DARK_THEME = 'dark-plus';
const LIGHT_THEME = 'light-plus';

const SUPPORTED_LANGS: BundledLanguage[] = ['tsx', 'ts', 'jsx', 'js', 'bash', 'shell', 'css', 'json', 'html', 'md'];

let highlighterPromise: Promise<Highlighter> | undefined;

const getHighlighter = async (): Promise<Highlighter> => {
  if (!highlighterPromise) {
    const { createHighlighter } = await import('shiki');
    highlighterPromise = createHighlighter({
      themes: [DARK_THEME, LIGHT_THEME],
      langs: SUPPORTED_LANGS,
    });
  }
  return highlighterPromise;
};

export type HighlightLang = BundledLanguage | 'plaintext';

export const highlightCode = async (code: string, lang: HighlightLang): Promise<string> => {
  const safeLang = SUPPORTED_LANGS.includes(lang as BundledLanguage) ? (lang as BundledLanguage) : 'tsx';
  const highlighter = await getHighlighter();
  return highlighter.codeToHtml(code, {
    lang: safeLang,
    themes: { light: LIGHT_THEME, dark: DARK_THEME },
    defaultColor: 'dark',
  });
};

export const highlightInline = async (code: string, lang: HighlightLang = 'ts'): Promise<string> => {
  const safeLang = SUPPORTED_LANGS.includes(lang as BundledLanguage) ? (lang as BundledLanguage) : 'ts';
  const highlighter = await getHighlighter();
  return highlighter.codeToHtml(code, {
    lang: safeLang,
    themes: { light: LIGHT_THEME, dark: DARK_THEME },
    defaultColor: 'dark',
    structure: 'inline',
  });
};

export const langFromPath = (filePath: string): HighlightLang => {
  const ext = filePath.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'tsx':
    case 'jsx':
      return 'tsx';
    case 'ts':
      return 'ts';
    case 'js':
    case 'mjs':
    case 'cjs':
      return 'js';
    case 'css':
      return 'css';
    case 'json':
      return 'json';
    case 'html':
      return 'html';
    case 'md':
    case 'mdx':
      return 'md';
    case 'sh':
    case 'bash':
      return 'bash';
    default:
      return 'tsx';
  }
};
