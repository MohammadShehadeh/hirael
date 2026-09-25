'use client';

import * as React from 'react';
import { SearchIcon } from 'lucide-react';

import { useT } from '@/lib/demo-locale';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/registry/hirael/bases/radix/ui/field';
import { InputGroupAddon } from '@/registry/hirael/bases/radix/ui/input-group';
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteInput,
  type AutocompleteOption,
} from '@/registry/hirael/bases/radix/components/autocomplete';

type Region = 'europe' | 'middleEast' | 'asia' | 'americas' | 'africa';

const REGIONS: Record<Region, { en: string; ar: string }> = {
  europe: { en: 'Europe', ar: 'أوروبا' },
  middleEast: { en: 'Middle East', ar: 'الشرق الأوسط' },
  asia: { en: 'Asia', ar: 'آسيا' },
  americas: { en: 'Americas', ar: 'الأمريكتان' },
  africa: { en: 'Africa', ar: 'أفريقيا' },
};

const CITIES: { en: string; ar: string; country: { en: string; ar: string }; region: Region }[] = [
  { en: 'Paris', ar: 'باريس', country: { en: 'France', ar: 'فرنسا' }, region: 'europe' },
  { en: 'Porto', ar: 'بورتو', country: { en: 'Portugal', ar: 'البرتغال' }, region: 'europe' },
  { en: 'Prague', ar: 'براغ', country: { en: 'Czechia', ar: 'التشيك' }, region: 'europe' },
  { en: 'Lisbon', ar: 'لشبونة', country: { en: 'Portugal', ar: 'البرتغال' }, region: 'europe' },
  { en: 'Berlin', ar: 'برلين', country: { en: 'Germany', ar: 'ألمانيا' }, region: 'europe' },
  { en: 'Barcelona', ar: 'برشلونة', country: { en: 'Spain', ar: 'إسبانيا' }, region: 'europe' },
  { en: 'Madrid', ar: 'مدريد', country: { en: 'Spain', ar: 'إسبانيا' }, region: 'europe' },
  { en: 'Milan', ar: 'ميلانو', country: { en: 'Italy', ar: 'إيطاليا' }, region: 'europe' },
  { en: 'Amsterdam', ar: 'أمستردام', country: { en: 'Netherlands', ar: 'هولندا' }, region: 'europe' },
  { en: 'Vienna', ar: 'فيينا', country: { en: 'Austria', ar: 'النمسا' }, region: 'europe' },
  { en: 'Amman', ar: 'عمان', country: { en: 'Jordan', ar: 'الأردن' }, region: 'middleEast' },
  { en: 'Dubai', ar: 'دبي', country: { en: 'United Arab Emirates', ar: 'الإمارات' }, region: 'middleEast' },
  { en: 'Doha', ar: 'الدوحة', country: { en: 'Qatar', ar: 'قطر' }, region: 'middleEast' },
  { en: 'Beirut', ar: 'بيروت', country: { en: 'Lebanon', ar: 'لبنان' }, region: 'middleEast' },
  { en: 'Riyadh', ar: 'الرياض', country: { en: 'Saudi Arabia', ar: 'السعودية' }, region: 'middleEast' },
  { en: 'Muscat', ar: 'مسقط', country: { en: 'Oman', ar: 'عُمان' }, region: 'middleEast' },
  { en: 'Tokyo', ar: 'طوكيو', country: { en: 'Japan', ar: 'اليابان' }, region: 'asia' },
  { en: 'Osaka', ar: 'أوساكا', country: { en: 'Japan', ar: 'اليابان' }, region: 'asia' },
  { en: 'Seoul', ar: 'سيول', country: { en: 'South Korea', ar: 'كوريا الجنوبية' }, region: 'asia' },
  { en: 'Singapore', ar: 'سنغافورة', country: { en: 'Singapore', ar: 'سنغافورة' }, region: 'asia' },
  { en: 'Bangkok', ar: 'بانكوك', country: { en: 'Thailand', ar: 'تايلاند' }, region: 'asia' },
  { en: 'Mumbai', ar: 'مومباي', country: { en: 'India', ar: 'الهند' }, region: 'asia' },
  { en: 'Toronto', ar: 'تورنتو', country: { en: 'Canada', ar: 'كندا' }, region: 'americas' },
  { en: 'Boston', ar: 'بوسطن', country: { en: 'United States', ar: 'الولايات المتحدة' }, region: 'americas' },
  { en: 'Bogotá', ar: 'بوغوتا', country: { en: 'Colombia', ar: 'كولومبيا' }, region: 'americas' },
  { en: 'Buenos Aires', ar: 'بوينس آيرس', country: { en: 'Argentina', ar: 'الأرجنتين' }, region: 'americas' },
  { en: 'Mexico City', ar: 'مكسيكو سيتي', country: { en: 'Mexico', ar: 'المكسيك' }, region: 'americas' },
  {
    en: 'San Francisco',
    ar: 'سان فرانسيسكو',
    country: { en: 'United States', ar: 'الولايات المتحدة' },
    region: 'americas',
  },
  { en: 'Cairo', ar: 'القاهرة', country: { en: 'Egypt', ar: 'مصر' }, region: 'africa' },
  { en: 'Casablanca', ar: 'الدار البيضاء', country: { en: 'Morocco', ar: 'المغرب' }, region: 'africa' },
  { en: 'Nairobi', ar: 'نيروبي', country: { en: 'Kenya', ar: 'كينيا' }, region: 'africa' },
  { en: 'Lagos', ar: 'لاغوس', country: { en: 'Nigeria', ar: 'نيجيريا' }, region: 'africa' },
  { en: 'Cape Town', ar: 'كيب تاون', country: { en: 'South Africa', ar: 'جنوب أفريقيا' }, region: 'africa' },
];

const PACKAGES: { name: string; description: { en: string; ar: string } }[] = [
  { name: 'react', description: { en: 'Build user interfaces from components', ar: 'بناء الواجهات من المكونات' } },
  { name: 'react-dom', description: { en: 'React renderer for the web', ar: 'عارض React للويب' } },
  { name: 'react-hook-form', description: { en: 'Forms with hooks and validation', ar: 'نماذج مع الخطافات والتحقق' } },
  { name: 'react-router', description: { en: 'Routing for React apps', ar: 'التوجيه لتطبيقات React' } },
  { name: 'react-aria', description: { en: 'Accessible UI primitives', ar: 'عناصر واجهة سهلة الوصول' } },
  { name: 'radix-ui', description: { en: 'Unstyled, accessible components', ar: 'مكونات سهلة الوصول بلا تنسيق' } },
  { name: 'recharts', description: { en: 'Charts built on React and D3', ar: 'رسوم بيانية مبنية على React وD3' } },
  { name: 'redux', description: { en: 'Predictable state container', ar: 'حاوية حالة يمكن توقعها' } },
  { name: 'zod', description: { en: 'Schema validation with static types', ar: 'تحقق من المخططات مع أنواع ثابتة' } },
  { name: 'zustand', description: { en: 'Small state management with hooks', ar: 'إدارة حالة صغيرة بالخطافات' } },
  { name: 'date-fns', description: { en: 'Date utility functions', ar: 'دوال مساعدة للتواريخ' } },
  { name: 'dayjs', description: { en: 'Tiny date library', ar: 'مكتبة تواريخ صغيرة' } },
  { name: 'clsx', description: { en: 'Join class names conditionally', ar: 'دمج أسماء الأصناف بشروط' } },
  {
    name: 'tailwind-merge',
    description: { en: 'Merge Tailwind classes without conflicts', ar: 'دمج أصناف Tailwind دون تعارض' },
  },
  { name: 'tailwindcss', description: { en: 'Utility-first CSS framework', ar: 'إطار CSS قائم على الأدوات' } },
  { name: 'next', description: { en: 'The React framework', ar: 'إطار عمل React' } },
  { name: 'next-themes', description: { en: 'Dark mode for Next.js', ar: 'الوضع الداكن لـ Next.js' } },
  { name: 'motion', description: { en: 'Animation library', ar: 'مكتبة حركة' } },
  { name: 'sonner', description: { en: 'Toast notifications', ar: 'إشعارات منبثقة' } },
  { name: 'vaul', description: { en: 'Drawer component', ar: 'مكون درج' } },
  { name: 'cmdk', description: { en: 'Command menu', ar: 'قائمة أوامر' } },
  { name: 'vite', description: { en: 'Frontend build tool', ar: 'أداة بناء للواجهات' } },
  { name: 'vitest', description: { en: 'Test runner powered by Vite', ar: 'مشغّل اختبارات مبني على Vite' } },
  { name: 'typescript', description: { en: 'JavaScript with types', ar: 'JavaScript مع الأنواع' } },
  { name: 'prettier', description: { en: 'Code formatter', ar: 'منسّق الشيفرة' } },
  { name: 'eslint', description: { en: 'Find problems in JavaScript', ar: 'اكتشاف المشاكل في JavaScript' } },
];

const AutocompleteDemo = () => {
  const t = useT();

  const cities = CITIES.map((city) => ({
    key: city.en,
    value: t(city),
    description: t(city.country),
    group: t(REGIONS[city.region]),
  }));

  const [recentKeys, setRecentKeys] = React.useState(['Lisbon', 'Tokyo']);
  const recent = recentKeys.map((key) => cities.find((city) => city.key === key)?.value ?? key);

  const remember = (value: string) => {
    const key = cities.find((city) => city.value === value)?.key ?? value;
    setRecentKeys((prev) => [key, ...prev.filter((k) => k !== key)].slice(0, 3));
  };

  const [requests, setRequests] = React.useState({ sent: 0, cancelled: 0 });

  const searchPackages = (query: string, signal: AbortSignal) => {
    setRequests((prev) => ({ ...prev, sent: prev.sent + 1 }));

    return new Promise<AutocompleteOption[]>((resolve, reject) => {
      const q = query.toLowerCase();
      let settled = false;
      const timer = setTimeout(() => {
        settled = true;
        const matches = PACKAGES.filter((pkg) => pkg.name.includes(q))
          .sort((a, b) => Number(b.name.startsWith(q)) - Number(a.name.startsWith(q)))
          .slice(0, 6);
        resolve(matches.map((pkg) => ({ value: pkg.name, description: t(pkg.description) })));
      }, 600);
      signal.addEventListener('abort', () => {
        if (settled) return;
        clearTimeout(timer);
        setRequests((prev) => ({ ...prev, cancelled: prev.cancelled + 1 }));
        reject(signal.reason);
      });
    });
  };

  return (
    <FieldGroup className="max-w-md">
      <Field>
        <FieldLabel htmlFor="autocomplete-city">{t({ en: 'City', ar: 'المدينة' })}</FieldLabel>
        <Autocomplete
          items={cities}
          inlineComplete
          recent={recent}
          recentLabel={t({ en: 'Recent', ar: 'الأخيرة' })}
          onValueCommit={remember}
          name="city"
        >
          <AutocompleteInput id="autocomplete-city" placeholder={t({ en: 'Where to?', ar: 'إلى أين؟' })} />
          <AutocompleteContent
            label={t({ en: 'Cities', ar: 'المدن' })}
            emptyMessage={t({
              en: 'No city found. You can still use what you typed.',
              ar: 'لا توجد مدينة. يمكنك استخدام ما كتبته.',
            })}
          />
        </Autocomplete>
        <FieldDescription>
          {t({ en: 'Press Tab to accept the grey suggestion.', ar: 'اضغط Tab لقبول الاقتراح الرمادي.' })}
        </FieldDescription>
      </Field>

      <Field>
        <FieldLabel htmlFor="autocomplete-package">{t({ en: 'Package', ar: 'الحزمة' })}</FieldLabel>
        <Autocomplete onSearch={searchPackages} name="package">
          <AutocompleteInput id="autocomplete-package" placeholder={t({ en: 'Search packages', ar: 'ابحث عن الحزم' })}>
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </AutocompleteInput>
          <AutocompleteContent
            label={t({ en: 'Packages', ar: 'الحزم' })}
            loadingMessage={t({ en: 'Searching the registry…', ar: 'جارٍ البحث في السجل…' })}
            emptyMessage={t({ en: 'No packages found.', ar: 'لا توجد حزم.' })}
          />
        </Autocomplete>
        <FieldDescription>
          <span className="tabular-nums">
            {requests.sent === 0
              ? t({ en: 'Results come from a simulated registry.', ar: 'النتائج من سجل تجريبي.' })
              : t({
                  en: `${requests.sent} requests sent, ${requests.cancelled} cancelled while typing.`,
                  ar: `أُرسل ${requests.sent} طلبًا، وأُلغي ${requests.cancelled} أثناء الكتابة.`,
                })}
          </span>
        </FieldDescription>
      </Field>
    </FieldGroup>
  );
};

export default AutocompleteDemo;
