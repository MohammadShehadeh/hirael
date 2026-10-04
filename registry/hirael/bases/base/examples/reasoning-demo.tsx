'use client';

import * as React from 'react';
import { RotateCcw } from 'lucide-react';

import { useT } from '@/lib/demo-locale';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Reasoning, ReasoningContent, ReasoningTrigger } from '@/registry/hirael/bases/base/components/reasoning';

const THOUGHTS = {
  en: 'The user wants a filter bar for an issues table. Option fields should close after one pick, but labels can have several values, so that field needs a multi-select. Dates need before, after and between. A half-built filter should match everything so the table never flashes empty. I will suggest keeping the filters in the URL so a view can be shared.',
  ar: 'يريد المستخدم شريط تصفية لجدول المهام. يجب أن تُغلق حقول الخيار الواحد بعد اختيار واحد، لكن الوسوم قد تحمل عدة قيم، لذا يحتاج هذا الحقل إلى اختيار متعدد. التواريخ تحتاج إلى قبل وبعد وبين. يجب أن يطابق عامل التصفية غير المكتمل كل شيء حتى لا يظهر الجدول فارغًا. سأقترح حفظ عوامل التصفية في الرابط لمشاركة العرض.',
};

const ReasoningDemo = () => {
  const t = useT();
  const text = t(THOUGHTS);
  const [length, setLength] = React.useState(0);
  const [run, setRun] = React.useState(0);
  const streaming = length < text.length;

  React.useEffect(() => {
    let shown = 0;
    const id = window.setInterval(() => {
      shown = Math.min(text.length, shown + 4);
      setLength(shown);
      if (shown >= text.length) window.clearInterval(id);
    }, 35);

    return () => window.clearInterval(id);
  }, [text, run]);

  return (
    <div className="grid w-full max-w-lg gap-4">
      <div className="grid gap-3 rounded-lg border border-border bg-card p-5 text-card-foreground">
        <Reasoning
          streaming={streaming}
          labels={{
            thinking: t({ en: 'Thinking', ar: 'يفكر' }),
            thought: (s) => t({ en: `Thought for ${s}s`, ar: `فكّر لمدة ${s} ث` }),
          }}
        >
          <ReasoningTrigger />
          <ReasoningContent>{text.slice(0, length)}</ReasoningContent>
        </Reasoning>
        {!streaming && (
          <p className="text-sm leading-relaxed">
            {t({
              en: 'Use the Filter Builder: one array of filters, applyFilters for the rows, and the array saved to the URL.',
              ar: 'استخدم أداة التصفية: مصفوفة واحدة لعوامل التصفية، وapplyFilters للصفوف، وحفظ المصفوفة في الرابط.',
            })}
          </p>
        )}
      </div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {t({
            en: 'Opens while thinking, then folds away once the answer starts.',
            ar: 'يُفتح أثناء التفكير، ثم يُطوى عند بدء الإجابة.',
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

export default ReasoningDemo;
