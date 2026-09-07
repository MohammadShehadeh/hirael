'use client';

import * as React from 'react';

import { useT } from '@/lib/demo-locale';
import {
  AddressInput,
  AddressInputCountry,
  AddressInputFields,
  type AddressValue,
} from '@/registry/hirael/bases/radix/components/address-input';

const START: AddressValue = {
  country: 'US',
  line1: '1600 Amphitheatre Parkway',
  line2: '',
  city: 'Mountain View',
  region: 'CA',
  postalCode: '94043',
};

const AddressInputDemo = () => {
  const t = useT();

  const [address, setAddress] = React.useState<AddressValue>(START);

  return (
    <div className="flex w-full max-w-lg flex-col gap-4">
      <AddressInput
        value={address}
        onValueChange={setAddress}
        labels={t({
          en: {},
          ar: {
            country: 'الدولة',
            line1: 'العنوان',
            line2: 'شقة، وحدة، إلخ',
            city: 'المدينة',
            region: 'المنطقة',
            postalCode: 'الرمز البريدي',
          },
        })}
      >
        <AddressInputCountry priority={['US', 'GB', 'DE', 'JP']} />
        <AddressInputFields />
      </AddressInput>

      <p className="text-xs text-muted-foreground">
        {t({
          en: 'Switch the country. The fields, their order and their labels follow it.',
          ar: 'غيّر الدولة، فتتبعها الحقول وترتيبها وتسمياتها.',
        })}
      </p>
    </div>
  );
};

export default AddressInputDemo;
