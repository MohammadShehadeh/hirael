'use client';

import * as React from 'react';

import { useT } from '@/lib/demo-locale';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/registry/hirael/bases/radix/ui/field';
import { MASK_PRESETS, MaskedInput, type MaskedValue } from '@/registry/hirael/bases/radix/components/masked-input';

const MaskedInputDemo = () => {
  const t = useT();
  const [iban, setIban] = React.useState<MaskedValue>({ masked: '', raw: '', complete: false });

  return (
    <FieldGroup className="w-full max-w-sm">
      <Field>
        <FieldLabel htmlFor="masked-iban">IBAN</FieldLabel>
        <MaskedInput id="masked-iban" {...MASK_PRESETS.iban} onValueChange={setIban} />
        <FieldDescription>
          {iban.raw
            ? t({
                en: `${iban.raw.length} characters typed${iban.complete ? ', complete' : ''}`,
                ar: `${iban.raw.length} حرفًا مكتوبًا${iban.complete ? '، مكتمل' : ''}`,
              })
            : t({ en: 'Letters turn uppercase as you type.', ar: 'تتحول الأحرف إلى كبيرة أثناء الكتابة.' })}
        </FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="masked-zip">{t({ en: 'ZIP code', ar: 'الرمز البريدي' })}</FieldLabel>
        <MaskedInput id="masked-zip" {...MASK_PRESETS.usZip} />
      </Field>
      <Field>
        <FieldLabel htmlFor="masked-date">{t({ en: 'Date of birth', ar: 'تاريخ الميلاد' })}</FieldLabel>
        <MaskedInput id="masked-date" {...MASK_PRESETS.date} showMask />
        <FieldDescription>
          {t({ en: 'The full mask shows once you start.', ar: 'يظهر القناع كاملًا عند البدء.' })}
        </FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="masked-order">{t({ en: 'Order number', ar: 'رقم الطلب' })}</FieldLabel>
        <MaskedInput id="masked-order" mask="ORD-____-__" replacement={{ _: /\d/ }} placeholder="ORD-2048-07" />
      </Field>
    </FieldGroup>
  );
};

export default MaskedInputDemo;
