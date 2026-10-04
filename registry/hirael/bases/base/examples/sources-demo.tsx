'use client';

import { useT } from '@/lib/demo-locale';
import { Citation, Sources, type SourceItem } from '@/registry/hirael/bases/base/components/sources';

const SourcesDemo = () => {
  const t = useT();

  const sources: SourceItem[] = [
    {
      url: 'https://ui.shadcn.com/docs/registry',
      title: t({ en: 'Registry: shadcn/ui', ar: 'السجل: shadcn/ui' }),
      snippet: t({
        en: 'You can use the shadcn CLI to run your own component registry and distribute components to other projects.',
        ar: 'يمكنك استخدام أداة shadcn لتشغيل سجل مكوناتك الخاص وتوزيعها على مشاريع أخرى.',
      }),
    },
    {
      url: 'https://base-ui.com/react/overview/quick-start',
      title: t({ en: 'Quick start: Base UI', ar: 'البدء السريع: Base UI' }),
      snippet: t({
        en: 'Base UI is a library of unstyled UI components for building accessible user interfaces.',
        ar: 'Base UI مكتبة مكونات بلا أنماط لبناء واجهات سهلة الوصول.',
      }),
    },
    {
      url: 'https://www.radix-ui.com/primitives/docs/overview/introduction',
      title: t({ en: 'Introduction: Radix Primitives', ar: 'مقدمة: Radix Primitives' }),
      snippet: t({
        en: 'An open-source UI component library for building high-quality, accessible design systems and web apps.',
        ar: 'مكتبة مكونات مفتوحة المصدر لبناء أنظمة تصميم وتطبيقات ويب عالية الجودة.',
      }),
    },
    {
      url: 'https://hirael.com/components',
      title: t({ en: 'Components: Hirael', ar: 'المكونات: Hirael' }),
    },
  ];

  return (
    <div className="grid w-full max-w-xl gap-4 rounded-lg border border-border bg-card p-5 text-card-foreground">
      <Sources sources={sources} label={(count) => t({ en: `Used ${count} sources`, ar: `استُخدمت ${count} مصادر` })} />
      <p className="text-sm leading-relaxed">
        {t({
          en: 'A shadcn registry hands out source code through the CLI',
          ar: 'يوزّع سجل shadcn الشيفرة المصدرية عبر أداة سطر الأوامر',
        })}
        <Citation index={1} source={sources[0]} />
        {t({
          en: ', and the same component can be built on Base UI',
          ar: '، ويمكن بناء المكوّن نفسه على Base UI',
        })}
        <Citation index={2} source={sources[1]} />
        {t({ en: ' or Radix', ar: ' أو Radix' })}
        <Citation index={3} source={sources[2]} />
        {t({
          en: '. Hirael ships both versions of every item.',
          ar: '. يوفّر Hirael النسختين لكل عنصر.',
        })}
        <Citation index={4} source={sources[3]} />
      </p>
    </div>
  );
};

export default SourcesDemo;
