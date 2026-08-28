'use client';

import * as React from 'react';

import { useT } from '@/lib/demo-locale';
import {
  CronEditor,
  CronEditorExpression,
  CronEditorFields,
  CronEditorNextRuns,
  CronEditorPresets,
  CronEditorPreview,
} from '@/registry/hirael/bases/base/components/cron-editor';

const CronEditorDemo = () => {
  const t = useT();
  const [schedule, setSchedule] = React.useState('0 9 * * 1,5');
  const [backup, setBackup] = React.useState('*/15 * * * *');

  const presets = t({
    en: [
      { label: 'Every minute', value: '* * * * *' },
      { label: 'Hourly', value: '0 * * * *' },
      { label: 'Daily', value: '0 0 * * *' },
      { label: 'Weekly', value: '0 0 * * 1' },
      { label: 'Monthly', value: '0 0 1 * *' },
    ],
    ar: [
      { label: 'كل دقيقة', value: '* * * * *' },
      { label: 'كل ساعة', value: '0 * * * *' },
      { label: 'يوميًا', value: '0 0 * * *' },
      { label: 'أسبوعيًا', value: '0 0 * * 1' },
      { label: 'شهريًا', value: '0 0 1 * *' },
    ],
  });

  return (
    <div className="grid w-full max-w-3xl gap-8">
      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({
            en: 'Full editor · presets, fields, expression, preview',
            ar: 'المحرر الكامل · إعدادات مسبقة، حقول، تعبير، معاينة',
          })}
        </p>
        <CronEditor value={schedule} onValueChange={setSchedule}>
          <CronEditorPresets presets={presets} />
          <CronEditorFields
            labels={t({
              en: {
                minute: 'Minute',
                hour: 'Hour',
                dayOfMonth: 'Day of month',
                month: 'Month',
                dayOfWeek: 'Day of week',
              },
              ar: {
                minute: 'الدقيقة',
                hour: 'الساعة',
                dayOfMonth: 'يوم الشهر',
                month: 'الشهر',
                dayOfWeek: 'يوم الأسبوع',
              },
            })}
            modeLabels={t({
              en: { every: 'Every', specific: 'Specific', step: 'Every N' },
              ar: { every: 'الكل', specific: 'محدد', step: 'كل N' },
            })}
          />
          <div className="grid gap-4 rounded-md border border-border bg-card p-4 sm:grid-cols-[1fr_auto]">
            <div className="grid gap-3">
              <CronEditorExpression label={t({ en: 'Expression', ar: 'التعبير' })} />
              <CronEditorPreview />
            </div>
            <div className="grid content-start gap-1.5">
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                {t({ en: 'Next runs', ar: 'التشغيلات القادمة' })}
              </p>
              <CronEditorNextRuns
                emptyLabel={t({
                  en: 'No upcoming runs.',
                  ar: 'لا تشغيلات قادمة.',
                })}
              />
            </div>
          </div>
        </CronEditor>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({
            en: 'Compact · presets and expression only',
            ar: 'مضغوط · إعدادات مسبقة وتعبير فقط',
          })}
        </p>
        <CronEditor
          value={backup}
          onValueChange={setBackup}
          className="max-w-md gap-3 rounded-md border border-border bg-card p-4"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-foreground">
              {t({ en: 'Backup schedule', ar: 'جدول النسخ الاحتياطي' })}
            </p>
            <CronEditorPreview className="text-xs text-muted-foreground" />
          </div>
          <CronEditorPresets presets={presets} />
          <CronEditorExpression label={t({ en: 'Cron', ar: 'Cron' })} showError={false} />
        </CronEditor>
      </div>
    </div>
  );
};

export default CronEditorDemo;
