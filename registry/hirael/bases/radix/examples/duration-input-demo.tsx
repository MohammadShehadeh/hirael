'use client';

import * as React from 'react';

import { useT } from '@/lib/demo-locale';
import {
  DurationInput,
  DurationInputClear,
  DurationInputContainer,
  DurationInputSegments,
} from '@/registry/hirael/bases/radix/components/duration-input';
import { Field, FieldLabel } from '@/registry/hirael/bases/radix/ui/field';

const DurationInputDemo = () => {
  const t = useT();

  const [sessionTimeout, setSessionTimeout] = React.useState<number | null>(45 * 60);
  const [retention, setRetention] = React.useState<number | null>(7 * 86400 + 12 * 3600);

  return (
    <div className="flex w-full max-w-md flex-col gap-5">
      <Field className="gap-2">
        <FieldLabel id="session-timeout-label">{t({ en: 'Session timeout', ar: 'مهلة الجلسة' })}</FieldLabel>
        <DurationInput
          aria-labelledby="session-timeout-label"
          value={sessionTimeout}
          onValueChange={setSessionTimeout}
          max={24 * 3600}
        >
          <DurationInputContainer>
            <DurationInputSegments />
            <DurationInputClear />
          </DurationInputContainer>
        </DurationInput>
        <p className="text-xs text-muted-foreground">
          {t({
            en: 'Type digits, or hold Shift with the arrow keys to step by ten.',
            ar: 'اكتب الأرقام، أو اضغط Shift مع الأسهم للتغيير بمقدار عشرة.',
          })}
        </p>
      </Field>

      <Field className="gap-2">
        <FieldLabel id="log-retention-label">{t({ en: 'Keep logs for', ar: 'مدة حفظ السجلات' })}</FieldLabel>
        <DurationInput
          aria-labelledby="log-retention-label"
          units={['d', 'h', 'm']}
          value={retention}
          onValueChange={setRetention}
          max={90 * 86400}
        >
          <DurationInputContainer>
            <DurationInputSegments />
            <DurationInputClear />
          </DurationInputContainer>
        </DurationInput>
      </Field>

      <dl className="flex flex-col gap-1 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
        <div className="flex gap-2">
          <dt>{t({ en: 'Timeout', ar: 'المهلة' })}</dt>
          <dd className="tabular-nums">
            {t({ en: `${sessionTimeout ?? 0} seconds`, ar: `${sessionTimeout ?? 0} ثانية` })}
          </dd>
        </div>
        <div className="flex gap-2">
          <dt>{t({ en: 'Retention', ar: 'مدة الحفظ' })}</dt>
          <dd className="tabular-nums">{t({ en: `${retention ?? 0} seconds`, ar: `${retention ?? 0} ثانية` })}</dd>
        </div>
      </dl>
    </div>
  );
};

export default DurationInputDemo;
