'use client';

import * as React from 'react';

import { useT } from '@/lib/demo-locale';
import { Field, FieldDescription, FieldLabel } from '@/registry/hirael/bases/base/ui/field';
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectTrigger,
} from '@/registry/hirael/bases/base/components/multi-select';

const MAX = 3;

const MultiSelectLimit = () => {
  const t = useT();

  const TOPICS = [
    { value: 'design', label: t({ en: 'Design', ar: 'التصميم' }) },
    { value: 'frontend', label: t({ en: 'Frontend', ar: 'الواجهات' }) },
    { value: 'backend', label: t({ en: 'Backend', ar: 'الخوادم' }) },
    { value: 'devops', label: 'DevOps' },
    { value: 'security', label: t({ en: 'Security', ar: 'الأمان' }) },
    { value: 'data', label: t({ en: 'Data', ar: 'البيانات' }) },
  ];

  const [topics, setTopics] = React.useState<string[]>(['frontend']);
  const left = MAX - topics.length;

  return (
    <Field className="max-w-md gap-2">
      <FieldLabel htmlFor="ms-limit">{t({ en: 'Topics', ar: 'المواضيع' })}</FieldLabel>
      <MultiSelect options={TOPICS} value={topics} onValueChange={setTopics} maxCount={MAX}>
        <MultiSelectTrigger id="ms-limit" placeholder={t({ en: 'Pick up to 3', ar: 'اختر حتى 3' })} />
        <MultiSelectContent />
      </MultiSelect>
      <FieldDescription>
        {left > 0
          ? t({ en: `${left} more allowed.`, ar: `يمكنك اختيار ${left} بعد.` })
          : t({ en: 'Limit reached. Remove one to pick another.', ar: 'وصلت إلى الحد. احذف واحدًا لتختار غيره.' })}
      </FieldDescription>
    </Field>
  );
};

export default MultiSelectLimit;
