'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

import { Contact } from './contact';
import { cairo, inter, manrope } from './fonts';
import { Hero } from './hero';
import { Navbar } from './navbar';
import { useDocumentRtl, type Lang } from './primitives';
import { Services } from './services';
import { NovaelStyles } from './styles';
import { Team } from './team';
import { Works } from './works';

const Novael = () => {
  // The page opens in whatever direction the surrounding document reads, then
  // follows the in-page switcher. The choice stays on this root — nothing is
  // written to `<html>`, so the template is safe to drop into a page that
  // already owns the document's direction.
  const [langOverride, setLangOverride] = React.useState<Lang | null>(null);
  const docIsRtl = useDocumentRtl();
  const lang: Lang = langOverride ?? (docIsRtl ? 'ar' : 'en');

  return (
    <div
      className={cn(
        'novael',
        inter.variable,
        manrope.variable,
        cairo.variable,
        'flex min-h-svh flex-col bg-background text-foreground antialiased',
      )}
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      lang={lang}
    >
      <NovaelStyles />
      <Navbar lang={lang} setLang={setLangOverride} />
      <main className="flex-1">
        <Hero lang={lang} />
        <Team lang={lang} />
        <Services lang={lang} />
        <Works lang={lang} />
        <Contact lang={lang} />
      </main>
    </div>
  );
};

export default Novael;
