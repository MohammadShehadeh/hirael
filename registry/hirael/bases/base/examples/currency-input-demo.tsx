'use client';

import * as React from 'react';

import { useT } from '@/lib/demo-locale';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/registry/hirael/bases/base/ui/field';
import {
  CurrencyInput,
  CurrencyInputField,
  CurrencyInputPrefix,
} from '@/registry/hirael/bases/base/components/currency-input';

const CurrencyInputDemo = () => {
  const t = useT();

  const [basic, setBasic] = React.useState<number | null>(1499.5);
  const [composed, setComposed] = React.useState<number | null>(12480);

  return (
    <FieldGroup className="max-w-md gap-8">
      <Field className="gap-2">
        <FieldLabel htmlFor="cur-basic">{t({ en: 'Invoice amount', ar: 'مبلغ الفاتورة' })}</FieldLabel>
        <CurrencyInput id="cur-basic" value={basic} onValueChange={setBasic} currency="USD" locale="en-US" decimals={2}>
          <CurrencyInputPrefix />
          <CurrencyInputField />
        </CurrencyInput>
        <FieldDescription>
          {t({ en: 'US dollars, before tax.', ar: 'بالدولار الأمريكي، قبل الضريبة.' })}
        </FieldDescription>
      </Field>

      <Field className="gap-2">
        <FieldLabel htmlFor="cur-composed">{t({ en: 'Monthly budget', ar: 'الميزانية الشهرية' })}</FieldLabel>
        <CurrencyInput
          id="cur-composed"
          value={composed}
          onValueChange={setComposed}
          currency="EUR"
          locale="de-DE"
          decimals={2}
        >
          <CurrencyInputPrefix />
          <CurrencyInputField placeholder="0,00" />
        </CurrencyInput>
        <FieldDescription>
          {t({
            en: 'Euros in German format. Saved as a plain number.',
            ar: 'باليورو بالتنسيق الألماني. يُحفظ كرقم عادي.',
          })}
        </FieldDescription>
      </Field>
    </FieldGroup>
  );
};

export default CurrencyInputDemo;
