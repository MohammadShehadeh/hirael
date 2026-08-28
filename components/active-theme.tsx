"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  ThemeProvider as NextThemesProvider,
  useTheme as useNextTheme,
} from "next-themes";

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
} from "@/lib/customizer";

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  config: CustomizerConfig;
  tokens: ResolvedTokens;
  isDefault: boolean;
  setConfig: (patch: Partial<CustomizerConfig>) => void;
  reset: () => void;
}

// Read the persisted config synchronously so the first render, the injected
// stylesheet and the pre-paint script agree. Mounting empty and writing the
// defaults back would wipe a saved config, and the framed `/embed/*` previews
// (which re-run the same pre-paint script) would open against the default
// palette instead of the active one.
const readPersistedConfig = (): CustomizerConfig => {
  if (typeof window === "undefined") return DEFAULT_CONFIG;
  try {
    const raw = localStorage.getItem(CONFIG_STORAGE_KEY);
    return normalizeConfig(raw ? JSON.parse(raw) : null);
  } catch {
    return DEFAULT_CONFIG;
  }
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

// Owns the Customizer config and bridges next-themes' light/dark mode into the
// context shape the showcase consumes. next-themes handles the `.light` /
// `.dark` class on <html>, its persistence and pre-paint script; this layer
// resolves the config to tokens and keeps one <style> element in sync.
const TokenProvider = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme, theme: activeMode, setTheme } = useNextTheme();
  // Falls back to dark to match the SSR default before next-themes mounts.
  const mode: ThemeMode =
    (resolvedTheme ?? activeMode) === "light" ? "light" : "dark";

  const pathname = usePathname();
  const isEmbed = isEmbedPath(pathname ?? "");

  const [config, setConfigState] =
    React.useState<CustomizerConfig>(readPersistedConfig);

  // Keep already-mounted documents in sync when another same-origin document
  // changes the config: the sheet lives in the site header, so a visitor can
  // re-skin while a block's `/embed/*` iframe is on screen. `storage` only
  // fires in *other* documents, so the writer never hears its own change.
  React.useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== CONFIG_STORAGE_KEY) return;
      const next = readPersistedConfig();
      setConfigState((prev) =>
        JSON.stringify(next) === JSON.stringify(prev) ? prev : next,
      );
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const tokens = resolveTokens(config);
  const mainCss = buildCustomizerCss(tokens, config.previewOnly);
  const embedCss = buildCustomizerCss(tokens, false);

  // Swap the stylesheet synchronously on every change so a pick in the sheet
  // repaints the page in the same frame. Reuses the element the pre-paint
  // script created when there is one.
  React.useLayoutEffect(() => {
    const css = isEmbed ? embedCss : mainCss;
    let el = document.getElementById(STYLE_ELEMENT_ID) as HTMLStyleElement | null;
    if (!css) {
      el?.remove();
      return;
    }
    if (!el) {
      el = document.createElement("style");
      el.id = STYLE_ELEMENT_ID;
      document.head.appendChild(el);
    }
    if (el.textContent !== css) el.textContent = css;
  }, [isEmbed, mainCss, embedCss]);

  // Persist the config for the sheet and both stylesheet flavours for the
  // pre-paint script, debounced so rapid picks don't thrash localStorage.
  React.useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
        localStorage.setItem(
          CSS_STORAGE_KEY,
          JSON.stringify({ main: mainCss, embed: embedCss }),
        );
      } catch {
        // ignore
      }
    }, 200);
    return () => window.clearTimeout(id);
  }, [config, mainCss, embedCss]);

  const setMode = (m: ThemeMode) => setTheme(m);

  // Chart color follows the theme unless picked on its own, and a theme that
  // belongs to another base color snaps back through normalizeConfig.
  const setConfig = (patch: Partial<CustomizerConfig>) => {
    setConfigState((prev) => {
      const next: Partial<CustomizerConfig> = { ...prev, ...patch };
      if ("theme" in patch && !("chartColor" in patch)) {
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
    tokens,
    isDefault: isDefaultConfig(config),
    setConfig,
    reset,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // `.dark` mirrors the standard shadcn convention so registry components
  // authored with `dark:` variants resolve here exactly as in a consumer app;
  // `.light` carries this site's token overrides. enableSystem is off — the
  // showcase defaults to dark and the toggle is explicit.
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      themes={["light", "dark"]}
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
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
};
