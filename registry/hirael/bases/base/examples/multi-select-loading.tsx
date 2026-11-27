'use client';

import * as React from 'react';

import { useT } from '@/lib/demo-locale';
import { Field, FieldDescription, FieldLabel } from '@/registry/hirael/bases/base/ui/field';
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectTrigger,
  type MultiSelectOption,
} from '@/registry/hirael/bases/base/components/multi-select';

const FETCH_MS = 1200;

const MultiSelectLoading = () => {
  const t = useT();

  const LABELS: MultiSelectOption[] = [
    { value: 'bug', label: t({ en: 'Bug', ar: 'خلل' }) },
    { value: 'feature', label: t({ en: 'Feature', ar: 'ميزة' }) },
    { value: 'docs', label: t({ en: 'Docs', ar: 'توثيق' }) },
    { value: 'question', label: t({ en: 'Question', ar: 'سؤال' }) },
    { value: 'wontfix', label: t({ en: 'Won’t fix', ar: 'لن يُصلح' }) },
  ];

  const [loaded, setLoaded] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [labels, setLabels] = React.useState<string[]>([]);

  // Stands in for a request made the first time the list opens.
  const handleOpenChange = (open: boolean) => {
    if (!open || loading || loaded) return;

    setLoading(true);
    setTimeout(() => {
      setLoaded(true);
      setLoading(false);
    }, FETCH_MS);
  };

  return (
    <Field className="max-w-md gap-2">
      <FieldLabel htmlFor="ms-loading">{t({ en: 'Labels', ar: 'الوسوم' })}</FieldLabel>
      <MultiSelect
        options={loaded ? LABELS : []}
        value={labels}
        onValueChange={setLabels}
        loading={loading}
        onOpenChange={handleOpenChange}
      >
        <MultiSelectTrigger id="ms-loading" placeholder={t({ en: 'Add labels', ar: 'أضف وسومًا' })} />
        <MultiSelectContent loadingMessage={t({ en: 'Loading labels…', ar: 'جارٍ تحميل الوسوم…' })} />
      </MultiSelect>
      <FieldDescription>
        {t({
          en: 'Labels load the first time you open the list.',
          ar: 'تُحمَّل الوسوم أول مرة تفتح فيها القائمة.',
        })}
      </FieldDescription>
    </Field>
  );
};

export default MultiSelectLoading;
