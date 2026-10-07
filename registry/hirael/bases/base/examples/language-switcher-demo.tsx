'use client';

import * as React from 'react';

import { useT } from '@/lib/demo-locale';
import {
  LanguageSwitcher,
  LanguageSwitcherContent,
  LanguageSwitcherTrigger,
  type Language,
} from '@/registry/hirael/bases/base/components/language-switcher';

const GREETINGS: Record<string, string> = {
  en: 'Welcome back',
  ar: 'مرحبًا بعودتك',
  de: 'Willkommen zurück',
  fr: 'Bon retour',
  ja: 'おかえりなさい',
  'pt-BR': 'Bem-vindo de volta',
};

const LanguageSwitcherDemo = () => {
  const t = useT();
  const [code, setCode] = React.useState('en');
  const [dir, setDir] = React.useState<'ltr' | 'rtl'>('ltr');
  const handleChange = (next: string, language: Language | undefined) => {
    setCode(next);
    setDir(language?.dir ?? 'ltr');
  };

  const languages: Language[] = [
    { code: 'en', nativeName: 'English', name: t({ en: 'English', ar: 'الإنجليزية' }) },
    { code: 'ar', nativeName: 'العربية', name: t({ en: 'Arabic', ar: 'العربية' }), dir: 'rtl' },
    { code: 'de', nativeName: 'Deutsch', name: t({ en: 'German', ar: 'الألمانية' }) },
    { code: 'fr', nativeName: 'Français', name: t({ en: 'French', ar: 'الفرنسية' }) },
    { code: 'ja', nativeName: '日本語', name: t({ en: 'Japanese', ar: 'اليابانية' }) },
    { code: 'pt-BR', nativeName: 'Português (Brasil)', name: t({ en: 'Portuguese', ar: 'البرتغالية' }) },
  ];

  return (
    <div className="grid w-full max-w-md gap-8">
      <div className="grid gap-3">
        <p className="text-xs text-muted-foreground uppercase">{t({ en: 'Native names', ar: 'الأسماء الأصلية' })}</p>
        <div className="flex flex-wrap items-center gap-3">
          <LanguageSwitcher languages={languages} value={code} onValueChange={handleChange}>
            <LanguageSwitcherTrigger label={t({ en: 'Change language', ar: 'تغيير اللغة' })} />
            <LanguageSwitcherContent align="start" heading={t({ en: 'Language', ar: 'اللغة' })} />
          </LanguageSwitcher>
          <LanguageSwitcher languages={languages} value={code} onValueChange={handleChange}>
            <LanguageSwitcherTrigger display="code" label={t({ en: 'Change language', ar: 'تغيير اللغة' })} />
            <LanguageSwitcherContent align="start" />
          </LanguageSwitcher>
          <LanguageSwitcher languages={languages} value={code} onValueChange={handleChange}>
            <LanguageSwitcherTrigger display="icon" label={t({ en: 'Change language', ar: 'تغيير اللغة' })} />
            <LanguageSwitcherContent align="start" />
          </LanguageSwitcher>
        </div>
      </div>
      <div lang={code} dir={dir} className="rounded-md border border-border bg-card p-5 text-card-foreground">
        <p className="text-lg font-medium">{GREETINGS[code]}</p>
        <p className="text-xs text-muted-foreground" dir="ltr">
          lang=&quot;{code}&quot; dir=&quot;{dir}&quot;
        </p>
      </div>
    </div>
  );
};

export default LanguageSwitcherDemo;
