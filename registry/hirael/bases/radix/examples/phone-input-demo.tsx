'use client';

import * as React from 'react';

import { useT } from '@/lib/demo-locale';
import { Field, FieldGroup, FieldLabel } from '@/registry/hirael/bases/radix/ui/field';
import {
  PhoneInput,
  PhoneInputCountrySelect,
  PhoneInputField,
} from '@/registry/hirael/bases/radix/components/phone-input';

const PhoneInputDemo = () => {
  const t = useT();

  const [basic, setBasic] = React.useState('');
  const [composed, setComposed] = React.useState('+442071838750');

  return (
    <FieldGroup className="max-w-md gap-8">
      <Field className="gap-2">
        <FieldLabel htmlFor="ph-basic">
          {t({
            en: 'Phone · default US',
            ar: 'الهاتف · الولايات المتحدة افتراضيًا',
          })}
        </FieldLabel>
        <PhoneInput id="ph-basic" value={basic} onValueChange={setBasic} defaultCountry="US">
          <PhoneInputCountrySelect />
          <PhoneInputField placeholder={t({ en: 'Phone number', ar: 'رقم الهاتف' })} />
        </PhoneInput>
        <p className="font-mono text-[11px] text-muted-foreground">E.164: {basic || '-'}</p>
      </Field>

      <Field className="gap-2">
        <FieldLabel htmlFor="ph-composed">
          {t({
            en: 'Phone · pre-filled UK number',
            ar: 'الهاتف · رقم بريطاني مُعبّأ مسبقًا',
          })}
        </FieldLabel>
        <PhoneInput id="ph-composed" value={composed} onValueChange={setComposed} defaultCountry="GB">
          <PhoneInputCountrySelect />
          <PhoneInputField placeholder="20 7183 8750" />
        </PhoneInput>
        <p className="font-mono text-[11px] text-muted-foreground">E.164: {composed || '-'}</p>
      </Field>
    </FieldGroup>
  );
};

export default PhoneInputDemo;
