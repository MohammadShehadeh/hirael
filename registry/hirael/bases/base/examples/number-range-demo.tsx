'use client';

import * as React from 'react';

import { useT } from '@/lib/demo-locale';
import { Field, FieldGroup, FieldLabel } from '@/registry/hirael/bases/base/ui/field';
import {
  NumberRange,
  NumberRangeInputs,
  NumberRangeSlider,
} from '@/registry/hirael/bases/base/components/number-range';

const usd = (n: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n);
const parseNum = (s: string) => Number(s.replace(/[^\d.-]/g, '')) || 0;

const NumberRangeDemo = () => {
  const t = useT();

  const [price, setPrice] = React.useState<[number, number]>([200, 1400]);
  const [age, setAge] = React.useState<[number, number]>([18, 65]);

  return (
    <FieldGroup className="max-w-md gap-8">
      <Field>
        <div className="flex items-baseline justify-between">
          <FieldLabel>{t({ en: 'Price (USD)', ar: 'السعر (دولار)' })}</FieldLabel>
          <span className="font-mono text-[10px] tabular-nums uppercase tracking-[0.08em] text-muted-foreground">
            ${usd(price[0])} – ${usd(price[1])}
          </span>
        </div>
        <NumberRange
          min={0}
          max={5000}
          step={50}
          value={price}
          onValueChange={setPrice}
          prefix="$"
          format={usd}
          parse={parseNum}
        >
          <NumberRangeSlider />
          <NumberRangeInputs />
        </NumberRange>
      </Field>

      <Field>
        <div className="flex items-baseline justify-between">
          <FieldLabel>{t({ en: 'Age', ar: 'العمر' })}</FieldLabel>
          <span className="font-mono text-[10px] tabular-nums uppercase tracking-[0.08em] text-muted-foreground">
            {age[0]}–{age[1]} {t({ en: 'yrs', ar: 'سنة' })}
          </span>
        </div>
        <NumberRange min={0} max={100} step={1} value={age} onValueChange={setAge} suffix={t({ en: 'yrs', ar: 'سنة' })}>
          <NumberRangeSlider />
          <NumberRangeInputs separator="→" />
        </NumberRange>
      </Field>
    </FieldGroup>
  );
};

export default NumberRangeDemo;
