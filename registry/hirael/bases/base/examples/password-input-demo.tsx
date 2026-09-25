'use client';

import * as React from 'react';

import { useT } from '@/lib/demo-locale';
import { Field, FieldGroup, FieldLabel } from '@/registry/hirael/bases/base/ui/field';
import {
  PasswordInput,
  PasswordInputField,
  PasswordInputStrength,
  type PasswordScorer,
} from '@/registry/hirael/bases/base/components/password-input';

const PasswordInputDemo = () => {
  const t = useT();

  const [basic, setBasic] = React.useState('');
  const [passphrase, setPassphrase] = React.useState('correct horse');

  const wordScorer: PasswordScorer = (value) => {
    const score = Math.min(value.trim().split(/\s+/).filter(Boolean).length, 4);

    return { score, label: t({ en: `${score} of 4 words`, ar: `${score} من 4 كلمات` }) };
  };

  return (
    <FieldGroup className="max-w-md gap-8">
      <Field className="gap-2">
        <FieldLabel htmlFor="pw-basic">
          {t({
            en: 'Password · with strength meter',
            ar: 'كلمة المرور · مع مقياس القوة',
          })}
        </FieldLabel>
        <PasswordInput id="pw-basic" value={basic} onValueChange={setBasic}>
          <PasswordInputField placeholder={t({ en: 'Pick a strong one', ar: 'اختر كلمة قوية' })} />
          <PasswordInputStrength />
        </PasswordInput>
      </Field>

      <Field className="gap-2">
        <FieldLabel htmlFor="pw-passphrase">
          {t({ en: 'Passphrase · custom scorer', ar: 'عبارة مرور · مقياس مخصص' })}
        </FieldLabel>
        <PasswordInput id="pw-passphrase" value={passphrase} onValueChange={setPassphrase} scorer={wordScorer}>
          <PasswordInputField placeholder={t({ en: 'Four or more words', ar: 'أربع كلمات أو أكثر' })} />
          <PasswordInputStrength />
        </PasswordInput>
      </Field>
    </FieldGroup>
  );
};

export default PasswordInputDemo;
