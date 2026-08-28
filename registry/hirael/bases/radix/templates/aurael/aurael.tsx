'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

import { About } from './about';
import { Careers } from './careers';
import { Cases } from './cases';
import { Customers } from './customers';
import { cairo, inter, manrope } from './fonts';
import { Footer } from './footer';
import { Hero } from './hero';
import { HowItWorks } from './how-it-works';
import { useDocumentRtl, type Lang, type Scene } from './primitives';
import { Resources } from './resources';
import { AuraelStyles } from './styles';

const Aurael = () => {
  // The page opens in whatever direction the surrounding document reads, then
  // follows the in-page switcher. Language and scene both stay on this root —
  // nothing is written to `<html>`, so the template is safe to drop into a
  // page that already owns the document's theme and direction.
  const [langOverride, setLangOverride] = React.useState<Lang | null>(null);
  const [scene, setScene] = React.useState<Scene>('night');
  const docIsRtl = useDocumentRtl();
  const lang: Lang = langOverride ?? (docIsRtl ? 'ar' : 'en');

  return (
    <div
      className={cn(
        'aurael',
        inter.variable,
        manrope.variable,
        cairo.variable,
        'flex flex-col bg-background text-foreground antialiased',
      )}
      data-scene={scene}
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      lang={lang}
    >
      <AuraelStyles />
      <Hero lang={lang} setLang={setLangOverride} scene={scene} setScene={setScene} />
      <HowItWorks lang={lang} />
      <Cases lang={lang} />
      <About lang={lang} />
      <Careers lang={lang} />
      <Resources lang={lang} />
      <Customers lang={lang} />
      <Footer lang={lang} />
    </div>
  );
};

export default Aurael;
