'use client';

import { useT } from '@/lib/demo-locale';
import {
  Sparkline,
  SparklineArea,
  SparklineDot,
  SparklineLine,
  SparklineReference,
  SparklineTooltip,
} from '@/registry/hirael/bases/radix/components/sparkline';

const VISITS = [42, 48, 45, 61, 58, 72, 69, 84, 91, 87, 96, 104];
const LATENCY = [212, 198, 205, 231, 187, 176, 190, 182, 171, 168, 174, 160];
const SIGNUPS = [5, 9, 7, 12, 8, 14, 11, 17, 13, 19, 22, 18];
const ERRORS = [0.4, 0.3, 0.5, 0.9, 1.4, 1.1, 0.8, 0.6, 0.5, 0.7, 0.4, 0.3];
const REVENUE = [4200, 4380, 4100, 4650, 4720, 4390, 5010, 5240, 4980, 5320, 5410, 5670];

const SparklineDemo = () => {
  const t = useT();

  const tiles = [
    {
      label: t({ en: 'Visits', ar: 'الزيارات' }),
      value: '104k',
      delta: '+8.3%',
      chart: <Sparkline data={VISITS} curve className="h-8 w-28" />,
    },
    {
      label: t({ en: 'p95 latency', ar: 'زمن الاستجابة p95' }),
      value: '160 ms',
      delta: '-5.1%',
      chart: <Sparkline data={LATENCY} variant="area" tone="success" curve className="h-8 w-28" />,
    },
    {
      label: t({ en: 'Signups', ar: 'التسجيلات' }),
      value: '18',
      delta: '+2',
      chart: <Sparkline data={SIGNUPS} variant="bar" tone="muted" className="h-8 w-28" />,
    },
  ];

  return (
    <div className="grid w-full max-w-3xl gap-8">
      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: 'Stat tiles', ar: 'بطاقات الإحصاءات' })}
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {tiles.map((tile) => (
            <div
              key={tile.label}
              className="flex items-end justify-between gap-3 rounded-md border border-border bg-card p-4 text-card-foreground"
            >
              <div className="grid gap-1">
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{tile.label}</p>
                <p className="text-2xl font-semibold tracking-[-0.03em]">{tile.value}</p>
                <p className="font-mono text-[11px] text-muted-foreground">{tile.delta}</p>
              </div>
              {tile.chart}
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: 'Hover for values', ar: 'مرّر للاطلاع على القيم' })}
        </p>
        <div className="flex flex-wrap items-center gap-6 rounded-md border border-border bg-card p-4">
          <div className="grid gap-1">
            <p className="text-xs text-muted-foreground">
              {t({
                en: 'Error rate, last 12 h',
                ar: 'معدل الأخطاء، آخر 12 ساعة',
              })}
            </p>
            <Sparkline data={ERRORS} tone="destructive" curve className="h-10 w-48">
              <SparklineArea />
              <SparklineLine />
              <SparklineDot />
              <SparklineTooltip format={(v) => `${v.toFixed(1)}%`} />
            </Sparkline>
          </div>
          <div className="grid gap-1">
            <p className="text-xs text-muted-foreground">
              {t({ en: 'Requests per minute', ar: 'الطلبات في الدقيقة' })}
            </p>
            <Sparkline data={VISITS} variant="bar" className="h-10 w-48">
              <SparklineTooltip>
                {(v, i) =>
                  t({
                    en: `${v} req · minute ${i + 1}`,
                    ar: `${v} طلب · الدقيقة ${i + 1}`,
                  })
                }
              </SparklineTooltip>
            </Sparkline>
          </div>
        </div>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: 'Custom compose', ar: 'تركيب مخصّص' })}
        </p>
        <div className="flex items-center justify-between gap-4 rounded-md border border-border bg-card p-4 text-card-foreground">
          <div className="grid gap-1">
            <p className="text-sm font-medium">{t({ en: 'Daily revenue', ar: 'الإيراد اليومي' })}</p>
            <p className="text-xs text-muted-foreground">
              {t({
                en: 'Dashed line is the $5,000 target',
                ar: 'الخط المتقطع هو هدف 5,000$',
              })}
            </p>
          </div>
          <Sparkline
            data={REVENUE}
            min={3500}
            max={6000}
            inset={4}
            className="h-12 w-56 text-warm"
            label={t({
              en: 'Daily revenue for the last 12 days',
              ar: 'الإيراد اليومي لآخر 12 يومًا',
            })}
          >
            <SparklineReference value={5000} />
            <SparklineArea fillOpacity={0.1} />
            <SparklineLine strokeWidth={2} />
            <SparklineDot r={3} />
            <SparklineTooltip format={(v) => `$${v.toLocaleString()}`} />
          </Sparkline>
        </div>
      </div>
    </div>
  );
};

export default SparklineDemo;
