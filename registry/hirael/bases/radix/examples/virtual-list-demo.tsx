'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { useT } from '@/lib/demo-locale';
import { Spinner } from '@/registry/hirael/bases/radix/ui/spinner';
import { VirtualList } from '@/registry/hirael/bases/radix/components/virtual-list';

interface LogLine {
  id: number;
  level: 'info' | 'warn' | 'error';
  message: { en: string; ar: string };
}

const MESSAGES: LogLine['message'][] = [
  { en: 'Request served from cache', ar: 'تم تقديم الطلب من الذاكرة المؤقتة' },
  { en: 'Deploy finished for preview branch', ar: 'اكتمل النشر لفرع المعاينة' },
  {
    en: 'Slow query on the orders table took 1.8s. The planner skipped the index on created_at because the filter matched most of the rows.',
    ar: 'استغرق استعلام بطيء على جدول الطلبات 1.8 ثانية. تجاهل المخطط الفهرس على created_at لأن التصفية طابقت معظم الصفوف.',
  },
  { en: 'Webhook delivered', ar: 'تم تسليم الإشعار' },
  { en: 'Retrying upload, attempt 2 of 3', ar: 'إعادة محاولة الرفع، المحاولة 2 من 3' },
];

const PAGE = 100;
const TOTAL = 1000;

const makePage = (start: number): LogLine[] =>
  Array.from({ length: PAGE }, (_, i) => {
    const id = start + i;

    return {
      id,
      level: id % 13 === 0 ? 'error' : id % 7 === 0 ? 'warn' : 'info',
      message: MESSAGES[(id * 3) % MESSAGES.length],
    };
  });

const LEVEL_CLASS = {
  info: 'bg-muted text-muted-foreground',
  warn: 'bg-warning/15 text-warning',
  error: 'bg-destructive/15 text-destructive',
};

const VirtualListDemo = () => {
  const t = useT();
  const [lines, setLines] = React.useState<LogLine[]>(() => makePage(0));
  const [loading, setLoading] = React.useState(false);

  const loadMore = () => {
    setLoading(true);
    window.setTimeout(() => {
      setLines((list) => [...list, ...makePage(list.length)]);
      setLoading(false);
    }, 700);
  };

  return (
    <div className="grid w-full max-w-lg gap-3">
      <div className="overflow-hidden rounded-lg border border-border bg-card text-card-foreground">
        <VirtualList
          items={lines}
          getItemKey={(line) => line.id}
          estimateSize={44}
          hasMore={lines.length < TOTAL}
          loading={loading}
          onEndReached={loadMore}
          loader={
            <div className="flex items-center justify-center gap-2 py-3 text-xs text-muted-foreground">
              <Spinner />
              {t({ en: 'Loading more', ar: 'تحميل المزيد' })}
            </div>
          }
          className="h-96"
        >
          {(line) => (
            <div className="flex items-start gap-3 border-b border-border px-4 py-2.5 text-sm">
              <span className="w-10 shrink-0 pt-0.5 text-xs text-muted-foreground tabular-nums">#{line.id + 1}</span>
              <span
                className={cn(
                  'shrink-0 rounded-sm px-1.5 py-0.5 text-[10px] font-medium uppercase',
                  LEVEL_CLASS[line.level],
                )}
              >
                {line.level}
              </span>
              <span className="min-w-0 leading-relaxed">{t(line.message)}</span>
            </div>
          )}
        </VirtualList>
      </div>
      <p className="text-xs text-muted-foreground tabular-nums">
        {t({
          en: `${lines.length} of ${TOTAL} lines loaded, only the visible ones are in the page.`,
          ar: `تم تحميل ${lines.length} من ${TOTAL} سطر، والظاهرة فقط موجودة في الصفحة.`,
        })}
      </p>
    </div>
  );
};

export default VirtualListDemo;
