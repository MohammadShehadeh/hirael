'use client';

import * as React from 'react';
import { RotateCcw } from 'lucide-react';

import { useT } from '@/lib/demo-locale';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Markdown } from '@/registry/hirael/bases/base/components/markdown';

const ANSWER = {
  en: `## Adding a filter bar

Install it with the shadcn CLI, then keep the filters in state:

\`\`\`tsx
const [filters, setFilters] = React.useState<Filter[]>([]);
const rows = applyFilters(issues, filters, (row, field) => row[field]);
\`\`\`

A few things to know:

- **Option** fields close after one pick, while **multi-option** fields stay open.
- A filter with no value yet matches every row, so the list never flashes empty.
- Save \`filters\` to the URL to make a view shareable.

| Field type | Operators |
| --- | --- |
| Option | is, is not |
| Number | =, ≠, >, <, between |
| Date | before, after, between |

- [x] Works with the keyboard
- [x] Mirrors in RTL
- [ ] Saved views, coming next

See the [shadcn docs](https://ui.shadcn.com) for the CLI.`,
  ar: `## إضافة شريط تصفية

ثبّته باستخدام shadcn CLI، ثم احفظ عوامل التصفية في الحالة:

\`\`\`tsx
const [filters, setFilters] = React.useState<Filter[]>([]);
const rows = applyFilters(issues, filters, (row, field) => row[field]);
\`\`\`

بعض الأمور المهمة:

- حقول **الخيار الواحد** تُغلق بعد اختيار واحد، بينما تبقى حقول **الخيارات المتعددة** مفتوحة.
- عامل التصفية بلا قيمة يطابق كل الصفوف، فلا تظهر القائمة فارغة.
- احفظ \`filters\` في الرابط لتشارك العرض.

| نوع الحقل | العوامل |
| --- | --- |
| خيار | هو، ليس |
| رقم | =، ≠، >، <، بين |
| تاريخ | قبل، بعد، بين |

- [x] يعمل بلوحة المفاتيح
- [x] ينعكس في RTL
- [ ] العروض المحفوظة، قريبًا

راجع [وثائق shadcn](https://ui.shadcn.com) لأداة CLI.`,
};

const MarkdownDemo = () => {
  const t = useT();
  const text = t(ANSWER);
  const [length, setLength] = React.useState(0);
  const [run, setRun] = React.useState(0);

  // Feeds the answer in small chunks, like tokens from a model.
  React.useEffect(() => {
    let shown = 0;
    const id = window.setInterval(() => {
      shown = Math.min(text.length, shown + 6);
      setLength(shown);
      if (shown >= text.length) window.clearInterval(id);
    }, 30);

    return () => window.clearInterval(id);
  }, [text, run]);

  const streaming = length < text.length;

  return (
    <div className="grid w-full max-w-xl gap-3">
      <div className="min-h-[34rem] rounded-lg border border-border bg-card p-5 text-card-foreground">
        <Markdown
          streaming={streaming}
          codeLabels={{ copy: t({ en: 'Copy', ar: 'نسخ' }), copied: t({ en: 'Copied', ar: 'تم النسخ' }) }}
        >
          {text.slice(0, length)}
        </Markdown>
      </div>
      <div className="flex items-center justify-between gap-3">
        <p aria-live="polite" className="text-xs text-muted-foreground">
          {streaming
            ? t({ en: 'Streaming…', ar: 'جارٍ البث…' })
            : t({
                en: 'Half-written fences, bold and links stay tidy while streaming.',
                ar: 'تبقى الكتل والنص العريض والروابط مرتبة أثناء البث.',
              })}
        </p>
        <Button type="button" variant="outline" size="sm" onClick={() => setRun((n) => n + 1)}>
          <RotateCcw />
          {t({ en: 'Replay', ar: 'إعادة' })}
        </Button>
      </div>
    </div>
  );
};

export default MarkdownDemo;
