'use client';

import * as React from 'react';

import { useT } from '@/lib/demo-locale';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import {
  Meter,
  MeterHeader,
  MeterLabel,
  MeterLegend,
  MeterTrack,
  MeterValue,
} from '@/registry/hirael/bases/base/components/meter';

const MeterDemo = () => {
  const t = useT();
  const [requests, setRequests] = React.useState(8420);

  const storage = [
    { label: t({ en: 'Photos', ar: 'الصور' }), value: 14.6 },
    { label: t({ en: 'Videos', ar: 'الفيديو' }), value: 11.2 },
    { label: t({ en: 'Documents', ar: 'المستندات' }), value: 6.9 },
    { label: t({ en: 'Backups', ar: 'النسخ الاحتياطية' }), value: 5.5 },
  ];
  const used = storage.reduce((sum, s) => sum + s.value, 0).toFixed(1);

  return (
    <div className="grid w-full max-w-xl gap-8">
      <div className="grid gap-2">
        <p className="text-xs text-muted-foreground uppercase">
          {t({ en: 'Segments with legend', ar: 'أجزاء مع مفتاح' })}
        </p>
        <div className="rounded-md border border-border bg-card p-5 text-card-foreground">
          <Meter
            segments={storage}
            max={100}
            size="lg"
            getValueText={() => t({ en: `${used} of 100 GB`, ar: `${used} من 100 غيغابايت` })}
          >
            <MeterHeader>
              <MeterLabel>{t({ en: 'Storage', ar: 'التخزين' })}</MeterLabel>
              <MeterValue>{t({ en: `${used} of 100 GB`, ar: `${used} من 100 غيغابايت` })}</MeterValue>
            </MeterHeader>
            <MeterTrack />
            <MeterLegend format={(v) => t({ en: `${v} GB`, ar: `${v} غيغابايت` })} />
          </Meter>
        </div>
      </div>

      <div className="grid gap-2">
        <p className="text-xs text-muted-foreground uppercase">
          {t({ en: 'Thresholds change the colour', ar: 'الحدود تغيّر اللون' })}
        </p>
        <div className="grid gap-4 rounded-md border border-border bg-card p-5 text-card-foreground">
          <Meter
            value={requests}
            max={10000}
            thresholds={[
              { value: 8000, tone: 'warning', label: t({ en: 'Near limit', ar: 'قريب من الحد' }) },
              { value: 10000, tone: 'destructive', label: t({ en: 'Limit reached', ar: 'تم بلوغ الحد' }) },
            ]}
            getValueText={(v, max) =>
              t({
                en: `${v.toLocaleString('en-US')} of ${max.toLocaleString('en-US')} requests`,
                ar: `${v.toLocaleString('en-US')} من ${max.toLocaleString('en-US')} طلب`,
              })
            }
          >
            <MeterHeader>
              <MeterLabel>{t({ en: 'API requests today', ar: 'طلبات API اليوم' })}</MeterLabel>
              <MeterValue>
                {t({
                  en: `${requests.toLocaleString('en-US')} of 10,000`,
                  ar: `${requests.toLocaleString('en-US')} من 10,000`,
                })}
              </MeterValue>
            </MeterHeader>
            <MeterTrack />
          </Meter>
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              {t({ en: 'Resets at 00:00 UTC', ar: 'يُعاد الضبط عند 00:00 UTC' })}
            </p>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setRequests(4210)}>
                {t({ en: 'Reset', ar: 'إعادة' })}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setRequests((n) => Math.min(10000, n + 650))}
              >
                {t({ en: 'Send 650', ar: 'أرسل 650' })}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeterDemo;
