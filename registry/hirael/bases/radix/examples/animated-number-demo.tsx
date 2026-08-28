'use client';

import * as React from 'react';

import { useT } from '@/lib/demo-locale';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { AnimatedNumber } from '@/registry/hirael/bases/radix/components/animated-number';

const AnimatedNumberDemo = () => {
  const t = useT();
  const [revenue, setRevenue] = React.useState(48250);
  const [users, setUsers] = React.useState(12481);

  const shuffle = () => {
    setRevenue(Math.round(20000 + Math.random() * 80000));
    setUsers(Math.round(2000 + Math.random() * 40000));
  };

  return (
    <div className="grid w-full max-w-2xl gap-8">
      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({
            en: 'Metric cards · live values',
            ar: 'بطاقات المقاييس · قيم حيّة',
          })}
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-md border border-border bg-card p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
              {t({ en: 'Revenue', ar: 'الإيرادات' })}
            </p>
            <AnimatedNumber value={revenue} prefix="$" className="mt-1 block text-2xl font-semibold tracking-tight" />
          </div>
          <div className="rounded-md border border-border bg-card p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
              {t({ en: 'Active users', ar: 'المستخدمون النشطون' })}
            </p>
            <AnimatedNumber value={users} className="mt-1 block text-2xl font-semibold tracking-tight" />
          </div>
          <div className="rounded-md border border-border bg-card p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
              {t({ en: 'Conversion', ar: 'معدل التحويل' })}
            </p>
            <AnimatedNumber
              value={3.2}
              decimals={1}
              suffix="%"
              className="mt-1 block text-2xl font-semibold tracking-tight"
            />
          </div>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={shuffle} className="mt-1 w-fit">
          {t({ en: 'Randomize', ar: 'تغيير عشوائي' })}
        </Button>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: 'Compact notation', ar: 'تنسيق مختصر' })}
        </p>
        <AnimatedNumber
          value={1284000}
          duration={1200}
          format={{ notation: 'compact', maximumFractionDigits: 1 }}
          className="text-3xl font-semibold tracking-tight"
        />
      </div>
    </div>
  );
};

export default AnimatedNumberDemo;
