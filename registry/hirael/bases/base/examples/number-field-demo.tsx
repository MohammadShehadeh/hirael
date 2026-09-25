'use client';

import * as React from 'react';

import { useT } from '@/lib/demo-locale';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/registry/hirael/bases/base/ui/field';
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldStepper,
} from '@/registry/hirael/bases/base/components/number-field';

interface Submitted {
  quantity: string;
  price: string;
  discount: string;
}

const NumberFieldDemo = () => {
  const t = useT();
  const [submitted, setSubmitted] = React.useState<Submitted | null>(null);

  return (
    <form
      className="w-full max-w-xs"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        setSubmitted({
          quantity: String(data.get('quantity') ?? ''),
          price: String(data.get('price') ?? ''),
          discount: String(data.get('discount') ?? ''),
        });
      }}
    >
      <FieldGroup className="gap-6">
        <Field className="gap-2">
          <FieldLabel htmlFor="nf-quantity">{t({ en: 'Quantity', ar: 'الكمية' })}</FieldLabel>
          <NumberField id="nf-quantity" name="quantity" defaultValue={2} min={1} max={20} precision={0}>
            <NumberFieldGroup>
              <NumberFieldDecrement />
              <NumberFieldInput />
              <NumberFieldIncrement />
            </NumberFieldGroup>
          </NumberField>
        </Field>

        <Field className="gap-2">
          <FieldLabel htmlFor="nf-price">{t({ en: 'Price', ar: 'السعر' })}</FieldLabel>
          <NumberField
            id="nf-price"
            name="price"
            defaultValue={24.5}
            min={0}
            step={0.5}
            largeStep={10}
            formatOptions={{ style: 'currency', currency: 'USD' }}
          >
            <NumberFieldGroup>
              <NumberFieldInput />
              <NumberFieldStepper />
            </NumberFieldGroup>
          </NumberField>
          <FieldDescription>
            {t({ en: 'Page Up and Page Down change it by 10.', ar: 'مفتاحا Page Up وPage Down يغيّرانه بمقدار 10.' })}
          </FieldDescription>
        </Field>

        <Field className="gap-2">
          <FieldLabel htmlFor="nf-discount">{t({ en: 'Discount', ar: 'الخصم' })}</FieldLabel>
          <NumberField
            id="nf-discount"
            name="discount"
            defaultValue={12.5}
            min={0}
            max={50}
            step={0.5}
            largeStep={5}
            formatOptions={{ style: 'unit', unit: 'percent', maximumFractionDigits: 1 }}
          >
            <NumberFieldGroup>
              <NumberFieldDecrement />
              <NumberFieldInput />
              <NumberFieldIncrement />
            </NumberFieldGroup>
          </NumberField>
          <FieldDescription>{t({ en: 'Up to 50%.', ar: 'حتى 50%.' })}</FieldDescription>
        </Field>

        <div className="flex flex-col gap-3">
          <Button type="submit" className="w-fit">
            {t({ en: 'Save', ar: 'حفظ' })}
          </Button>
          {submitted && (
            <p className="text-sm text-muted-foreground tabular-nums">
              {t({
                en: `Sent quantity ${submitted.quantity}, price ${submitted.price}, discount ${submitted.discount}`,
                ar: `أُرسلت الكمية ${submitted.quantity}، السعر ${submitted.price}، الخصم ${submitted.discount}`,
              })}
            </p>
          )}
        </div>
      </FieldGroup>
    </form>
  );
};

export default NumberFieldDemo;
