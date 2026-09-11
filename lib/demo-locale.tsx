'use client';

import * as React from 'react';

export type DemoLocale = 'en' | 'ar';

const DemoLocaleContext = React.createContext<DemoLocale>('en');

export interface DemoLocaleProviderProps {
  locale: DemoLocale;
  children: React.ReactNode;
}

export const DemoLocaleProvider = ({ locale, children }: DemoLocaleProviderProps) => {
  return <DemoLocaleContext.Provider value={locale}>{children}</DemoLocaleContext.Provider>;
};

export const useDemoLocale = (): DemoLocale => {
  return React.useContext(DemoLocaleContext);
};

export const useT = () => {
  const locale = useDemoLocale();
  return function t<T>(pair: { en: T; ar: T }): T {
    return pair[locale];
  };
};
