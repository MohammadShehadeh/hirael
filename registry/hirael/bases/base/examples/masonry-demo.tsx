'use client';

import { useT } from '@/lib/demo-locale';
import { Masonry, MasonryItem } from '@/registry/hirael/bases/base/components/masonry';

const aspects = ['aspect-square', 'aspect-[3/4]', 'aspect-video', 'aspect-[4/5]', 'aspect-[3/2]', 'aspect-[2/3]'];

const MasonryDemo = () => {
  const t = useT();

  const cards = [
    {
      title: 'Drift',
      body: t({ en: 'A short note.', ar: 'ملاحظة قصيرة.' }),
    },
    {
      title: 'Meridian',
      body: t({
        en: 'Longer-form content stretches this card so the masonry has real height variance to balance across columns.',
        ar: 'محتوى أطول يمدّ هذه البطاقة كي يكون للتخطيط الحجري تفاوت ارتفاع حقيقي يوازن بين الأعمدة.',
      }),
    },
    {
      title: 'Halcyon',
      body: t({
        en: 'Two lines of copy, enough to sit between the extremes.',
        ar: 'سطران من النص، يكفيان ليقعا بين الطرفين.',
      }),
    },
    {
      title: 'Vantage',
      body: t({
        en: 'Columns are filled by measured height, so reading order is preserved far better than CSS columns, which fill top-to-bottom one column at a time.',
        ar: 'تُملأ الأعمدة وفق الارتفاع المقيس، فيُحفظ ترتيب القراءة أفضل بكثير من أعمدة CSS التي تملأ عمودًا تلو الآخر من الأعلى إلى الأسفل.',
      }),
    },
    {
      title: 'Ember',
      body: t({ en: 'Compact.', ar: 'مدمج.' }),
    },
    {
      title: 'Lattice',
      body: t({
        en: 'Items keep their identity across re-balances, so component state inside a card survives a column move.',
        ar: 'تحتفظ العناصر بهويتها عبر إعادة التوازن، فتبقى حالة المكوّن داخل البطاقة سليمة عند نقلها بين الأعمدة.',
      }),
    },
    {
      title: 'Sable',
      body: t({
        en: 'Medium length card body that wraps onto a couple of lines at most widths.',
        ar: 'نصّ بطاقة متوسط الطول يلتفّ على سطرين عند معظم العروض.',
      }),
    },
  ];

  return (
    <div className="grid w-full max-w-2xl gap-8">
      <div className="grid min-w-0 gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: 'Cards · default columns', ar: 'بطاقات · أعمدة افتراضية' })}
        </p>
        <Masonry>
          {cards.map((card) => (
            <MasonryItem key={card.title} className="rounded-lg border border-border bg-card p-4">
              <p className="text-sm font-medium text-foreground">{card.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{card.body}</p>
            </MasonryItem>
          ))}
        </Masonry>
      </div>

      <div className="grid min-w-0 gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({
            en: 'Media · varied aspect ratios',
            ar: 'وسائط · نِسب أبعاد متنوّعة',
          })}
        </p>
        <Masonry columns={{ base: 2, lg: 3 }} gap={8}>
          {aspects.map((aspect, i) => (
            <div key={aspect} className={`${aspect} flex items-end rounded-md bg-muted p-2`}>
              <span className="font-mono text-[10px] text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
            </div>
          ))}
        </Masonry>
      </div>

      <div className="grid min-w-0 gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({
            en: 'Compact · columns 2 / md 4',
            ar: 'مدمج · عمودان / md أربعة',
          })}
        </p>
        <Masonry columns={{ base: 2, md: 4 }} gap={8}>
          {['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta'].map((label, i) => (
            <MasonryItem key={label} className="rounded-md border border-border bg-card px-3 py-2">
              <p className="text-xs font-medium text-foreground">{label}</p>
              {i % 3 === 1 ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  {t({
                    en: 'Extra line for height variance.',
                    ar: 'سطر إضافي لتفاوت الارتفاع.',
                  })}
                </p>
              ) : null}
            </MasonryItem>
          ))}
        </Masonry>
      </div>
    </div>
  );
};

export default MasonryDemo;
