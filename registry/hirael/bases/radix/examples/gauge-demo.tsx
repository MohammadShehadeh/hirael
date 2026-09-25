'use client';

import * as React from 'react';

import { useT } from '@/lib/demo-locale';
import {
  Gauge,
  GaugeBands,
  GaugeIndicator,
  GaugeLabel,
  GaugeTrack,
  GaugeValue,
} from '@/registry/hirael/bases/radix/components/gauge';

const CPU_READINGS = [42, 58, 71, 64, 83, 93, 77, 55, 38, 47];

const GaugeDemo = () => {
  const t = useT();
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    const id = window.setInterval(() => setTick((n) => n + 1), 2000);

    return () => window.clearInterval(id);
  }, []);

  const cpu = CPU_READINGS[tick % CPU_READINGS.length];

  return (
    <div className="grid w-full max-w-2xl gap-8">
      <div className="grid gap-2">
        <p className="text-xs text-muted-foreground uppercase">
          {t({ en: 'Live, with thresholds', ar: 'مباشر، مع حدود' })}
        </p>
        <div className="flex flex-wrap items-center gap-8 rounded-md border border-border bg-card p-6 text-card-foreground">
          <Gauge
            value={cpu}
            size="lg"
            tone="success"
            thresholds={[
              { value: 0, tone: 'success', label: t({ en: 'Normal', ar: 'طبيعي' }) },
              { value: 70, tone: 'warning', label: t({ en: 'High', ar: 'مرتفع' }) },
              { value: 90, tone: 'destructive', label: t({ en: 'Critical', ar: 'حرج' }) },
            ]}
          >
            <GaugeTrack />
            <GaugeBands />
            <GaugeIndicator />
            <GaugeValue format={(v) => `${v}%`} />
            <GaugeLabel>{t({ en: 'CPU load', ar: 'حمل المعالج' })}</GaugeLabel>
          </Gauge>
          <dl className="grid gap-3 text-sm">
            <div className="grid gap-0.5">
              <dt className="text-xs text-muted-foreground uppercase">{t({ en: 'Host', ar: 'الخادم' })}</dt>
              <dd>api-eu-west-2</dd>
            </div>
            <div className="grid gap-0.5">
              <dt className="text-xs text-muted-foreground uppercase">{t({ en: 'Cores', ar: 'الأنوية' })}</dt>
              <dd className="tabular-nums">16</dd>
            </div>
            <div className="grid gap-0.5">
              <dt className="text-xs text-muted-foreground uppercase">{t({ en: 'Alert at', ar: 'التنبيه عند' })}</dt>
              <dd className="tabular-nums">90%</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="grid gap-2">
        <p className="text-xs text-muted-foreground uppercase">
          {t({ en: 'Half circle, custom scale', ar: 'نصف دائرة، مقياس مخصص' })}
        </p>
        <div className="flex flex-wrap items-end gap-8 rounded-md border border-border bg-card p-6 text-card-foreground">
          <Gauge
            value={742}
            min={300}
            max={850}
            startAngle={-90}
            endAngle={90}
            thickness={8}
            thresholds={[
              { value: 300, tone: 'destructive', label: t({ en: 'Poor', ar: 'ضعيف' }) },
              { value: 580, tone: 'warning', label: t({ en: 'Fair', ar: 'مقبول' }) },
              { value: 670, tone: 'success', label: t({ en: 'Good', ar: 'جيد' }) },
              { value: 800, tone: 'chart-2', label: t({ en: 'Excellent', ar: 'ممتاز' }) },
            ]}
          >
            <GaugeTrack />
            <GaugeBands />
            <GaugeIndicator />
            <GaugeValue />
            <GaugeLabel>{t({ en: 'Credit score', ar: 'التصنيف الائتماني' })}</GaugeLabel>
          </Gauge>
          <div className="grid gap-1 text-sm">
            <p className="font-medium">{t({ en: 'Good', ar: 'جيد' })}</p>
            <p className="text-muted-foreground">
              {t({ en: 'Up 18 points since March', ar: 'ارتفع 18 نقطة منذ مارس' })}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-2">
        <p className="text-xs text-muted-foreground uppercase">{t({ en: 'Sizes', ar: 'الأحجام' })}</p>
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <Gauge value={24} size="sm" aria-label={t({ en: 'Disk', ar: 'القرص' })} />
          <Gauge value={61} aria-label={t({ en: 'Memory', ar: 'الذاكرة' })} />
          <Gauge value={87} size="lg" aria-label={t({ en: 'Swap', ar: 'التبديل' })} />
        </div>
      </div>
    </div>
  );
};

export default GaugeDemo;
