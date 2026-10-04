'use client';

import * as React from 'react';

import { useT } from '@/lib/demo-locale';
import { useDebouncedCallback, useDebouncedValue } from '@/registry/hirael/hooks/use-debounce';
import { Input } from '@/registry/hirael/bases/base/ui/input';
import { Textarea } from '@/registry/hirael/bases/base/ui/textarea';

const FRUITS = ['Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry', 'Grape', 'Lemon', 'Mango', 'Orange', 'Peach'];

const UseDebounceDemo = () => {
  const t = useT();
  const [query, setQuery] = React.useState('');
  const debouncedQuery = useDebouncedValue(query, 400);
  const [saves, setSaves] = React.useState(0);
  const save = useDebouncedCallback(() => setSaves((n) => n + 1), 800);

  const results = FRUITS.filter((fruit) => fruit.toLowerCase().includes(debouncedQuery.trim().toLowerCase()));

  return (
    <div className="grid w-full max-w-md gap-8">
      <div className="grid gap-2">
        <p className="text-xs text-muted-foreground uppercase">{t({ en: 'Debounced value', ar: 'قيمة مؤجلة' })}</p>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t({ en: 'Search fruit', ar: 'ابحث عن فاكهة' })}
          aria-label={t({ en: 'Search fruit', ar: 'ابحث عن فاكهة' })}
        />
        <p className="text-xs text-muted-foreground">
          {t({ en: 'Searching for', ar: 'البحث عن' })}{' '}
          <span className="font-medium text-foreground">“{debouncedQuery}”</span>
          {query !== debouncedQuery && ` ${t({ en: '(waiting)', ar: '(بانتظار التوقف)' })}`}
        </p>
        <p className="text-sm">{results.length > 0 ? results.join(', ') : t({ en: 'No fruit', ar: 'لا نتائج' })}</p>
      </div>

      <div className="grid gap-2">
        <p className="text-xs text-muted-foreground uppercase">{t({ en: 'Debounced callback', ar: 'دالة مؤجلة' })}</p>
        <Textarea
          onChange={() => save()}
          onBlur={() => save.flush()}
          rows={3}
          placeholder={t({ en: 'Type a note, it saves when you pause', ar: 'اكتب ملاحظة، تُحفظ عند التوقف' })}
          aria-label={t({ en: 'Note', ar: 'ملاحظة' })}
        />
        <p className="text-xs text-muted-foreground tabular-nums">
          {t({ en: `Saved ${saves} times`, ar: `حُفظت ${saves} مرات` })}
        </p>
      </div>
    </div>
  );
};

export default UseDebounceDemo;
