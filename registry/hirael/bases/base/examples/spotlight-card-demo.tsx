'use client';

import { ArrowUpRight } from 'lucide-react';

import { useT } from '@/lib/demo-locale';
import { SpotlightCard } from '@/registry/hirael/bases/base/components/spotlight-card';

const SpotlightCardDemo = () => {
  const t = useT();

  const cards = [
    {
      title: t({ en: 'Edge network', ar: 'شبكة طرفية' }),
      body: t({
        en: 'Deploy to 300 locations with a single push. Sub-50ms reads, everywhere.',
        ar: 'انشر إلى 300 موقع بدفعة واحدة. قراءات دون 50 مللي ثانية، في كل مكان.',
      }),
    },
    {
      title: t({ en: 'Usage-based billing', ar: 'فوترة حسب الاستخدام' }),
      body: t({
        en: 'Meter any event, set limits, and invoice automatically at the end of the cycle.',
        ar: 'قِس أي حدث، وحدّد السقوف، وأصدر الفواتير تلقائيًا في نهاية الدورة.',
      }),
    },
  ];

  return (
    <div className="grid w-full max-w-2xl gap-3 sm:grid-cols-2">
      {cards.map((card) => (
        <SpotlightCard key={card.title} className="p-5">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-sm font-medium text-foreground">{card.title}</h3>
            <ArrowUpRight className="size-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
        </SpotlightCard>
      ))}
      <p className="col-span-full font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
        {t({
          en: 'Move your cursor across a card',
          ar: 'مرّر المؤشر فوق بطاقة',
        })}
      </p>
    </div>
  );
};

export default SpotlightCardDemo;
