'use client';

import * as React from 'react';

import { useT } from '@/lib/demo-locale';
import { Field, FieldGroup, FieldLabel } from '@/registry/hirael/bases/base/ui/field';
import {
  ColorPicker,
  ColorPickerContent,
  ColorPickerTrigger,
} from '@/registry/hirael/bases/base/components/color-picker';

const ColorPickerDemo = () => {
  const t = useT();
  const [accent, setAccent] = React.useState<string>('#0ea5e9');
  const [brand, setBrand] = React.useState<string>('#a855f7');

  return (
    <FieldGroup className="grid max-w-md grid-cols-1 gap-8 sm:grid-cols-2">
      <Field className="gap-2">
        <FieldLabel htmlFor="color-accent">{t({ en: 'Accent color', ar: 'لون التمييز' })}</FieldLabel>
        <ColorPicker value={accent} onValueChange={setAccent}>
          <ColorPickerTrigger id="color-accent" />
          <ColorPickerContent />
        </ColorPicker>
        <p className="font-mono text-[10px] tracking-[0.08em] text-muted-foreground uppercase">{accent}</p>
      </Field>

      <Field className="gap-2">
        <FieldLabel htmlFor="color-brand">
          {t({
            en: 'Brand color · custom swatches',
            ar: 'لون العلامة · عيّنات مخصصة',
          })}
        </FieldLabel>
        <ColorPicker
          value={brand}
          onValueChange={setBrand}
          swatches={['#a855f7', '#6366f1', '#0ea5e9', '#10b981', '#facc15', '#f97316', '#ef4444', '#1f2937']}
        >
          <ColorPickerTrigger id="color-brand" />
          <ColorPickerContent />
        </ColorPicker>
        <p className="font-mono text-[10px] tracking-[0.08em] text-muted-foreground uppercase">{brand}</p>
      </Field>
    </FieldGroup>
  );
};

export default ColorPickerDemo;
