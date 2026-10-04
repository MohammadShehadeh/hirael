'use client';

import { useT } from '@/lib/demo-locale';
import { useMediaQuery } from '@/registry/hirael/hooks/use-media-query';
import { Badge } from '@/registry/hirael/bases/base/ui/badge';

const UseMediaQueryDemo = () => {
  const t = useT();
  const wide = useMediaQuery('(min-width: 768px)');
  const dark = useMediaQuery('(prefers-color-scheme: dark)');
  const touch = useMediaQuery('(pointer: coarse)');

  const rows = [
    { query: '(min-width: 768px)', label: t({ en: 'Wide screen', ar: 'شاشة عريضة' }), match: wide },
    {
      query: '(prefers-color-scheme: dark)',
      label: t({ en: 'System dark mode', ar: 'الوضع الداكن للنظام' }),
      match: dark,
    },
    { query: '(pointer: coarse)', label: t({ en: 'Touch screen', ar: 'شاشة لمس' }), match: touch },
  ];

  return (
    <div className="grid w-full max-w-md gap-4">
      <ul className="divide-y divide-border rounded-md border border-border bg-card text-card-foreground">
        {rows.map((row) => (
          <li key={row.query} className="flex items-center justify-between gap-4 px-4 py-3">
            <div className="grid gap-0.5">
              <span className="text-sm font-medium">{row.label}</span>
              <span dir="ltr" className="text-start text-xs text-muted-foreground">
                {row.query}
              </span>
            </div>
            <Badge variant={row.match ? 'default' : 'secondary'}>
              {row.match ? t({ en: 'Match', ar: 'مطابق' }) : t({ en: 'No match', ar: 'غير مطابق' })}
            </Badge>
          </li>
        ))}
      </ul>
      <p className="text-sm text-muted-foreground">
        {t({
          en: 'Resize the window or change your system theme and the badges update.',
          ar: 'غيّر حجم النافذة أو سمة النظام وستتحدث الشارات.',
        })}
      </p>
    </div>
  );
};

export default UseMediaQueryDemo;
