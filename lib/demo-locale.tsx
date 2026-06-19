"use client";

import * as React from "react";

export type DemoLocale = "en" | "ar";

const DemoLocaleContext = React.createContext<DemoLocale>("en");

/**
 * Sets the language for the demos rendered inside a component preview. The
 * showcase ties it to the RTL toggle (see `ExampleBlock`): right-to-left
 * previews render in Arabic so the catalog shows real RTL text, not just
 * mirrored English. Demos read it through `useT`/`useDemoLocale`.
 */
export function DemoLocaleProvider({
  locale,
  children,
}: {
  locale: DemoLocale;
  children: React.ReactNode;
}) {
  return (
    <DemoLocaleContext.Provider value={locale}>
      {children}
    </DemoLocaleContext.Provider>
  );
}

export function useDemoLocale(): DemoLocale {
  return React.useContext(DemoLocaleContext);
}

/**
 * Pick the value for the active demo locale. Works for any value — strings,
 * option arrays, nodes:
 *
 *   const t = useT();
 *   <Label>{t({ en: "Basic", ar: "أساسي" })}</Label>
 */
export function useT() {
  const locale = useDemoLocale();
  return function t<T>(pair: { en: T; ar: T }): T {
    return pair[locale];
  };
}
