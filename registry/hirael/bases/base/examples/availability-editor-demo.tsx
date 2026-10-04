'use client';

import * as React from 'react';

import { useDemoLocale, useT } from '@/lib/demo-locale';
import {
  AvailabilityEditor,
  type WeeklyAvailability,
} from '@/registry/hirael/bases/base/components/availability-editor';

const AvailabilityEditorDemo = () => {
  const t = useT();
  const arabic = useDemoLocale() === 'ar';
  const [hours, setHours] = React.useState<WeeklyAvailability>({
    1: [
      { start: '09:00', end: '12:00' },
      { start: '13:00', end: '17:00' },
    ],
    2: [{ start: '09:00', end: '17:00' }],
    3: [{ start: '09:00', end: '17:00' }],
    4: [{ start: '10:00', end: '16:00' }],
    5: [{ start: '09:00', end: '13:00' }],
  });

  return (
    <div className="w-full max-w-2xl rounded-lg border border-border bg-card px-5 py-2 text-card-foreground">
      <AvailabilityEditor
        value={hours}
        onValueChange={setHours}
        locale={arabic ? 'ar' : 'en-US'}
        weekStartsOn={arabic ? 6 : 1}
        labels={{
          unavailable: t({ en: 'Unavailable', ar: 'غير متاح' }),
          add: t({ en: 'Add hours', ar: 'أضف ساعات' }),
          remove: t({ en: 'Remove hours', ar: 'أزل الساعات' }),
          copyToAll: t({ en: 'Copy to all days', ar: 'انسخ لكل الأيام' }),
          to: t({ en: 'to', ar: 'إلى' }),
          overlap: t({ en: 'These hours overlap.', ar: 'هذه الساعات متداخلة.' }),
          order: t({ en: 'End time must be after the start.', ar: 'يجب أن يكون وقت الانتهاء بعد البداية.' }),
        }}
      />
    </div>
  );
};

export default AvailabilityEditorDemo;
