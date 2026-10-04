'use client';

import { useT } from '@/lib/demo-locale';
import {
  ExpandableText,
  ExpandableTextContent,
  ExpandableTextTrigger,
} from '@/registry/hirael/bases/base/components/expandable-text';

const ExpandableTextDemo = () => {
  const t = useT();
  const more = t({ en: 'Show more', ar: 'عرض المزيد' });
  const less = t({ en: 'Show less', ar: 'عرض أقل' });

  return (
    <div className="grid w-full max-w-md gap-8">
      <div className="grid gap-2">
        <p className="text-xs text-muted-foreground uppercase">
          {t({ en: 'Clamped to 3 lines', ar: 'مقصوص على 3 أسطر' })}
        </p>
        <div className="rounded-md border border-border bg-card p-5 text-card-foreground">
          <p className="mb-2 font-medium">{t({ en: 'About this release', ar: 'عن هذا الإصدار' })}</p>
          <ExpandableText>
            <ExpandableTextContent>
              {t({
                en: 'This release adds an event calendar with month, week and day views, a filter bar for lists and tables, and a date and time picker in one field. Drag an event to move it, or drag its bottom edge to change how long it runs. Filters keep their state in one array you can save to the URL, and every part works with the keyboard and in right-to-left layouts.',
                ar: 'يضيف هذا الإصدار تقويم أحداث بعرض الشهر والأسبوع واليوم، وشريط تصفية للقوائم والجداول، ومنتقي تاريخ ووقت في حقل واحد. اسحب الحدث لنقله، أو اسحب حافته السفلية لتغيير مدته. تحفظ عوامل التصفية حالتها في مصفوفة واحدة يمكنك حفظها في الرابط، وكل جزء يعمل بلوحة المفاتيح وفي التخطيطات من اليمين إلى اليسار.',
              })}
            </ExpandableTextContent>
            <ExpandableTextTrigger moreLabel={more} lessLabel={less} />
          </ExpandableText>
        </div>
      </div>

      <div className="grid gap-2">
        <p className="text-xs text-muted-foreground uppercase">
          {t({ en: 'Short text, no toggle', ar: 'نص قصير، بلا زر' })}
        </p>
        <div className="rounded-md border border-border bg-card p-5 text-card-foreground">
          <ExpandableText lines={2}>
            <ExpandableTextContent>
              {t({ en: 'Fits in two lines, so nothing to expand.', ar: 'يتسع في سطرين، فلا شيء للتوسيع.' })}
            </ExpandableTextContent>
            <ExpandableTextTrigger moreLabel={more} lessLabel={less} />
          </ExpandableText>
        </div>
      </div>
    </div>
  );
};

export default ExpandableTextDemo;
