'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from 'next-themes';

import {
  CONFIG_STORAGE_KEY,
  CSS_STORAGE_KEY,
  DEFAULT_CONFIG,
  MODE_STORAGE_KEY,
  STYLE_ELEMENT_ID,
  buildCustomizerCss,
  isDefaultConfig,
  isEmbedPath,
  normalizeConfig,
  resolveTokens,
  type CustomizerConfig,
  type ResolvedTokens,
  type ThemeMode,
} from '@/lib/customizer';
import { useMounted } from '@/hooks/use-mounted';
import type { RegistryBase } from '@/registry/hirael/registry-meta';

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  config: CustomizerConfig;
  /** Hydration-safe base: the default until mounted, then `config.base`. */
  base: RegistryBase;
  tokens: ResolvedTokens;
  isDefault: boolean;
  setConfig: (patch: Partial<CustomizerConfig>) => void;
  reset: () => void;
}

const readPersistedConfig = (): CustomizerConfig => {
  if (typeof window === 'undefined') return DEFAULT_CONFIG;
  try {
    const raw = localStorage.getItem(CONFIG_STORAGE_KEY);
    return normalizeConfig(raw ? JSON.parse(raw) : null);
  } catch {
    return DEFAULT_CONFIG;
  }
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

const TokenProvider = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme, theme: activeMode, setTheme } = useNextTheme();
  const mode: ThemeMode = (resolvedTheme ?? activeMode) === 'light' ? 'light' : 'dark';

  const pathname = usePathname();
  const isEmbed = isEmbedPath(pathname ?? '');

  const [config, setConfigState] = React.useState<CustomizerConfig>(readPersistedConfig);

  const mounted = useMounted();

  React.useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== CONFIG_STORAGE_KEY) return;
      const next = readPersistedConfig();
      setConfigState((prev) => (JSON.stringify(next) === JSON.stringify(prev) ? prev : next));
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const tokens = resolveTokens(config);
  const mainCss = buildCustomizerCss(tokens, config.previewOnly);
  const embedCss = buildCustomizerCss(tokens, false);

  React.useLayoutEffect(() => {
    const css = isEmbed ? embedCss : mainCss;
    let el = document.getElementById(STYLE_ELEMENT_ID) as HTMLStyleElement | null;
    if (!css) {
      el?.remove();
      return;
    }
    if (!el) {
      el = document.createElement('style');
      el.id = STYLE_ELEMENT_ID;
      document.head.appendChild(el);
    }
    if (el.textContent !== css) el.textContent = css;
  }, [isEmbed, mainCss, embedCss]);

  React.useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
        localStorage.setItem(CSS_STORAGE_KEY, JSON.stringify({ main: mainCss, embed: embedCss }));
      } catch {
      }
    }, 200);
    return () => window.clearTimeout(id);
  }, [config, mainCss, embedCss]);

  const setMode = (m: ThemeMode) => setTheme(m);

  const setConfig = (patch: Partial<CustomizerConfig>) => {
    setConfigState((prev) => {
      const next: Partial<CustomizerConfig> = { ...prev, ...patch };
      if ('theme' in patch && !('chartColor' in patch)) {
        next.chartColor = patch.theme;
      }
      return normalizeConfig(next);
    });
  };

  const reset = () => setConfigState(DEFAULT_CONFIG);

  const value: ThemeContextValue = {
    mode,
    setMode,
    config,
    base: mounted ? config.base : DEFAULT_CONFIG.base,
    tokens,
    isDefault: isDefaultConfig(config),
    setConfig,
    reset,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      themes={['light', 'dark']}
      enableSystem={false}
      storageKey={MODE_STORAGE_KEY}
      disableTransitionOnChange
    >
      <TokenProvider>{children}</TokenProvider>
    </NextThemesProvider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
};

/** The registry tree the showcase previews, shows and installs from. */
export const useRegistryBase = (): RegistryBase => useTheme().base;
