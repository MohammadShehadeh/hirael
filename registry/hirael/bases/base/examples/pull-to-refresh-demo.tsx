'use client';

import * as React from 'react';

import { useT } from '@/lib/demo-locale';
import { PullToRefresh } from '@/registry/hirael/bases/base/components/pull-to-refresh';

const UPDATES = [
  { en: 'Release 7.4 is live', ar: 'الإصدار 7.4 متاح الآن' },
  { en: 'Sara commented on the filter bar', ar: 'علّقت سارة على شريط التصفية' },
  { en: 'Deploy to preview finished', ar: 'اكتمل النشر إلى المعاينة' },
  { en: 'Omar joined the project', ar: 'انضم عمر إلى المشروع' },
  { en: 'Weekly summary is ready', ar: 'الملخص الأسبوعي جاهز' },
  { en: 'New sponsor: 404 skill', ar: 'راعٍ جديد: 404 skill' },
];

const PullToRefreshDemo = () => {
  const t = useT();
  const [items, setItems] = React.useState(() => UPDATES.slice(2).map((text, i) => ({ id: i, text })));
  const next = React.useRef(0);

  return (
    <div className="h-[30rem] w-full max-w-xs overflow-hidden rounded-[2rem] border-8 border-muted bg-background shadow-lg">
      <PullToRefresh
        mouse
        className="h-full"
        labels={{
          pull: t({ en: 'Pull to refresh', ar: 'اسحب للتحديث' }),
          release: t({ en: 'Release to refresh', ar: 'أفلت للتحديث' }),
          refreshing: t({ en: 'Refreshing', ar: 'جارٍ التحديث' }),
        }}
        onRefresh={() =>
          new Promise<void>((resolve) =>
            window.setTimeout(() => {
              const text = UPDATES[next.current % 2];
              next.current += 1;
              setItems((list) => [{ id: Date.now(), text }, ...list]);
              resolve();
            }, 1200),
          )
        }
      >
        <div className="border-b border-border px-4 py-3 text-sm font-semibold">
          {t({ en: 'Activity', ar: 'النشاط' })}
        </div>
        <ul className="divide-y divide-border">
          {items.map((item) => (
            <li key={item.id} className="px-4 py-3 text-sm">
              {t(item.text)}
            </li>
          ))}
        </ul>
        <p className="px-4 py-6 text-center text-xs text-muted-foreground">
          {t({ en: 'Drag down from the top to load new activity.', ar: 'اسحب للأسفل من الأعلى لتحميل نشاط جديد.' })}
        </p>
      </PullToRefresh>
    </div>
  );
};

export default PullToRefreshDemo;
