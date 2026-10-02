'use client';

import * as React from 'react';

import { useT } from '@/lib/demo-locale';
import { formatBytes } from '@/registry/hirael/lib/format-bytes';
import { Input } from '@/registry/hirael/bases/base/ui/input';

const SAMPLES = [1536, 2_621_440, 5_368_709_120];

const FormatBytesDemo = () => {
  const t = useT();
  const [raw, setRaw] = React.useState('1048576');
  const bytes = Number(raw);

  return (
    <div className="grid w-full max-w-md gap-6">
      <div className="grid gap-2">
        <label htmlFor="format-bytes-input" className="text-sm font-medium">
          {t({ en: 'Bytes', ar: 'بايت' })}
        </label>
        <div className="flex items-center gap-3">
          <Input
            id="format-bytes-input"
            inputMode="numeric"
            dir="ltr"
            value={raw}
            onChange={(event) => setRaw(event.target.value.replace(/\D/g, ''))}
          />
          <span className="min-w-20 text-end text-sm font-medium tabular-nums" dir="ltr">
            {formatBytes(bytes)}
          </span>
        </div>
      </div>

      <ul className="grid divide-y divide-border rounded-md border border-border text-sm">
        {SAMPLES.map((sample) => (
          <li key={sample} className="flex items-center justify-between gap-4 px-3 py-2 tabular-nums" dir="ltr">
            <span className="text-muted-foreground">{sample.toLocaleString('en-US')}</span>
            <span className="font-medium whitespace-nowrap">{formatBytes(sample)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FormatBytesDemo;
