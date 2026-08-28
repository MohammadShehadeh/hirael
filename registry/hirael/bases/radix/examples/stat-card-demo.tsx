'use client';

import { useT } from '@/lib/demo-locale';
import {
  StatCard,
  StatCardDelta,
  StatCardLabel,
  StatCardValue,
} from '@/registry/hirael/bases/radix/components/stat-card';

const StatCardDemo = () => {
  const t = useT();

  return (
    <div className="grid w-full max-w-3xl gap-8">
      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: '3-up grid', ar: 'شبكة من ثلاثة' })}
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard>
            <StatCardLabel>{t({ en: 'Active users', ar: 'المستخدمون النشطون' })}</StatCardLabel>
            <StatCardValue>12,481</StatCardValue>
            <StatCardDelta trend="up">+12.4%</StatCardDelta>
          </StatCard>
          <StatCard>
            <StatCardLabel>{t({ en: 'Bounce rate', ar: 'معدل الارتداد' })}</StatCardLabel>
            <StatCardValue>38.2%</StatCardValue>
            <StatCardDelta trend="down">-2.1%</StatCardDelta>
          </StatCard>
          <StatCard>
            <StatCardLabel>{t({ en: 'Avg. session', ar: 'متوسط الجلسة' })}</StatCardLabel>
            <StatCardValue>4m 12s</StatCardValue>
            <div className="flex items-center gap-2">
              <StatCardDelta trend="flat">0.0%</StatCardDelta>
              <span className="text-[11px] text-muted-foreground">
                {t({ en: 'vs last 7 days', ar: 'مقارنة بآخر 7 أيام' })}
              </span>
            </div>
          </StatCard>
        </div>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: 'Custom layout', ar: 'تخطيط مخصّص' })}
        </p>
        <StatCard className="max-w-xs">
          <div className="flex items-center justify-between">
            <StatCardLabel>
              {t({
                en: 'Monthly recurring revenue',
                ar: 'الإيرادات الشهرية المتكررة',
              })}
            </StatCardLabel>
            <StatCardDelta trend="up">+8.7%</StatCardDelta>
          </div>
          <StatCardValue>
            <span className="font-mono text-muted-foreground">$</span>
            48,250
          </StatCardValue>
          <p className="text-[11px] text-muted-foreground">
            {t({
              en: 'Target $52,000 · 92.8% to goal',
              ar: 'الهدف 52,000$ · 92.8% نحو الهدف',
            })}
          </p>
        </StatCard>
      </div>
    </div>
  );
};

export default StatCardDemo;
