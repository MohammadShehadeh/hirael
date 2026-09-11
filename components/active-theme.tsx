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
  /** The default until mounted so the first client render matches the server HTML. */
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

interface TokenProviderProps {
  children: React.ReactNode;
}

const TokenProvider = ({ children }: TokenProviderProps) => {
  const { resolvedTheme, theme: activeMode, setTheme } = useNextTheme();
  const mode: ThemeMode = (resolvedTheme ?? activeMode) === 'light' ? 'light' : 'dark';

  const pathname = usePathname();
  const isEmbed = isEmbedPath(pathname ?? '');

  const [config, setConfigState] = React.useState<CustomizerConfig>(readPersistedConfig);

  const isMounted = useMounted();

  React.useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== CONFIG_STORAGE_KEY) return;
      const next = readPersistedConfig();
      setConfigState((prev) => (JSON.stringify(next) === JSON.stringify(prev) ? prev : next));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const tokens = resolveTokens(config);
  const mainCss = buildCustomizerCss(tokens, config.previewOnly);
  const embedCss = buildCustomizerCss(tokens, false);

  React.useLayoutEffect(() => {
    const css = isEmbed ? embedCss : mainCss;
    let styleElement = document.getElementById(STYLE_ELEMENT_ID) as HTMLStyleElement | null;
    if (!css) {
      styleElement?.remove();
      return;
    }
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = STYLE_ELEMENT_ID;
      document.head.appendChild(styleElement);
    }
    if (styleElement.textContent !== css) styleElement.textContent = css;
  }, [isEmbed, mainCss, embedCss]);

  React.useEffect(() => {
    const timerId = window.setTimeout(() => {
      try {
        localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
        localStorage.setItem(CSS_STORAGE_KEY, JSON.stringify({ main: mainCss, embed: embedCss }));
      } catch {
        // Storage can be unavailable (private mode, quota); the in-memory config still applies.
      }
    }, 200);
    return () => window.clearTimeout(timerId);
  }, [config, mainCss, embedCss]);

  const setMode = (nextMode: ThemeMode) => setTheme(nextMode);

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
    base: isMounted ? config.base : DEFAULT_CONFIG.base,
    tokens,
    isDefault: isDefaultConfig(config),
    setConfig,
    reset,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export interface ThemeProviderProps {
  children: React.ReactNode;
}

const readEmbedForcedTheme = (): ThemeMode | undefined => {
  if (typeof window === 'undefined') return undefined;
  if (!isEmbedPath(window.location.pathname)) return undefined;
  const theme = new URLSearchParams(window.location.search).get('theme');
  return theme === 'light' || theme === 'dark' ? theme : undefined;
};

/** The lock comes from the URL, which never changes without a navigation, so there is nothing to subscribe to. */
const subscribeToForcedTheme = () => () => {};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  // The server render has no URL params, so the server snapshot stays undefined and hydration matches the HTML.
  const forcedTheme = React.useSyncExternalStore(subscribeToForcedTheme, readEmbedForcedTheme, () => undefined);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      themes={['light', 'dark']}
      enableSystem={false}
      storageKey={MODE_STORAGE_KEY}
      disableTransitionOnChange
      forcedTheme={forcedTheme}
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

export const useRegistryBase = (): RegistryBase => useTheme().base;
