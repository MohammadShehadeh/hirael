'use client';

import * as React from 'react';
import { Sparkles } from 'lucide-react';

import { useT } from '@/lib/demo-locale';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { TextShimmer } from '@/registry/hirael/bases/base/components/text-shimmer';

const TextShimmerDemo = () => {
  const t = useT();
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!saving) return;
    const id = window.setTimeout(() => setSaving(false), 2400);

    return () => window.clearTimeout(id);
  }, [saving]);

  return (
    <div className="grid w-full max-w-md gap-8">
      <div className="grid gap-2">
        <p className="text-xs text-muted-foreground uppercase">{t({ en: 'Assistant status', ar: 'حالة المساعد' })}</p>
        <div className="grid gap-3 rounded-md border border-border bg-card p-4 text-card-foreground">
          <p className="text-sm">
            {t({
              en: 'Summarize last week’s failed deploys.',
              ar: 'لخّص عمليات النشر الفاشلة في الأسبوع الماضي.',
            })}
          </p>
          <div className="flex items-center gap-2 text-sm">
            <Sparkles aria-hidden className="size-4 text-muted-foreground" />
            <TextShimmer>{t({ en: 'Reading 14 deploy logs...', ar: 'جارٍ قراءة 14 سجل نشر...' })}</TextShimmer>
          </div>
        </div>
      </div>

      <div className="grid gap-2">
        <p className="text-xs text-muted-foreground uppercase">{t({ en: 'Button label', ar: 'نص الزر' })}</p>
        <div>
          <Button type="button" variant="outline" onClick={() => setSaving(true)} aria-busy={saving}>
            {saving ? (
              <TextShimmer duration={1.4}>{t({ en: 'Saving changes', ar: 'جارٍ حفظ التغييرات' })}</TextShimmer>
            ) : (
              t({ en: 'Save changes', ar: 'حفظ التغييرات' })
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-2">
        <p className="text-xs text-muted-foreground uppercase">
          {t({ en: 'Large text, wider highlight', ar: 'نص كبير، إبراز أعرض' })}
        </p>
        <p className="text-2xl font-semibold tracking-tight">
          <TextShimmer duration={3} spread={4}>
            {t({ en: 'Thinking', ar: 'يفكّر' })}
          </TextShimmer>
        </p>
      </div>
    </div>
  );
};

export default TextShimmerDemo;
