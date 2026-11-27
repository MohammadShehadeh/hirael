'use client';

import * as React from 'react';

import { useT } from '@/lib/demo-locale';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/registry/hirael/bases/base/ui/field';
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectTrigger,
} from '@/registry/hirael/bases/base/components/multi-select';

const MultiSelectDisabled = () => {
  const t = useT();

  const ROLES = [
    { value: 'viewer', label: t({ en: 'Viewer', ar: 'مشاهد' }), disabled: true },
    { value: 'editor', label: t({ en: 'Editor', ar: 'محرر' }) },
    { value: 'billing', label: t({ en: 'Billing', ar: 'الفوترة' }) },
    { value: 'support', label: t({ en: 'Support', ar: 'الدعم' }) },
    { value: 'owner', label: t({ en: 'Owner', ar: 'مالك' }), disabled: true },
  ];

  const [roles, setRoles] = React.useState<string[]>(['viewer', 'editor']);

  return (
    <FieldGroup className="max-w-md gap-8">
      <Field className="gap-2">
        <FieldLabel htmlFor="ms-locked">{t({ en: 'Locked options', ar: 'خيارات مقفلة' })}</FieldLabel>
        <MultiSelect options={ROLES} value={roles} onValueChange={setRoles}>
          <MultiSelectTrigger id="ms-locked" placeholder={t({ en: 'Pick roles', ar: 'اختر الأدوار' })} />
          <MultiSelectContent />
        </MultiSelect>
        <FieldDescription>
          {t({
            en: 'Every member is a viewer, and only an owner can grant owner. Clear keeps viewer.',
            ar: 'كل عضو مشاهد، ووحده المالك يمنح صلاحية المالك. المسح يُبقي على المشاهد.',
          })}
        </FieldDescription>
      </Field>

      <Field className="gap-2" data-disabled="true">
        <FieldLabel htmlFor="ms-disabled">{t({ en: 'Disabled field', ar: 'حقل معطّل' })}</FieldLabel>
        <MultiSelect options={ROLES} defaultValue={['viewer', 'billing']} disabled>
          <MultiSelectTrigger id="ms-disabled" placeholder={t({ en: 'Pick roles', ar: 'اختر الأدوار' })} />
          <MultiSelectContent />
        </MultiSelect>
        <FieldDescription>
          {t({
            en: 'Your plan does not allow role changes.',
            ar: 'خطتك لا تسمح بتغيير الأدوار.',
          })}
        </FieldDescription>
      </Field>
    </FieldGroup>
  );
};

export default MultiSelectDisabled;
