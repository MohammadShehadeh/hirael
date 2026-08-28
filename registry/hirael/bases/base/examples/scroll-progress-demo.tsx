'use client';

import * as React from 'react';

import { useT } from '@/lib/demo-locale';
import { ScrollProgress } from '@/registry/hirael/bases/base/components/scroll-progress';

const ScrollProgressDemo = () => {
  const t = useT();
  const containerRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className="grid w-full max-w-3xl gap-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
        {t({
          en: 'Scoped to container · pinned to the top of this preview',
          ar: 'محصور في الحاوية · مثبّت أعلى هذه المعاينة',
        })}
      </p>

      <div className="relative h-72 overflow-hidden rounded-md border border-border">
        <ScrollProgress
          target={containerRef}
          className="absolute inset-x-0 top-0 h-[3px] bg-linear-to-r from-foreground/40 via-foreground to-foreground/40"
        />
        <div
          ref={containerRef}
          className="h-full overflow-y-auto px-5 py-4 text-sm leading-relaxed text-muted-foreground"
        >
          {Array.from({ length: 18 }).map((_, i) => (
            <p key={i} className="mb-4">
              {i + 1}.{' '}
              {t({
                en: "The bar above tracks how far you have scrolled through this panel. Keep reading and it fills from the start edge to the end; scroll back up and it retreats. It reads the panel's own scroll position, so it works the same inside a modal, a sidebar or the page itself.",
                ar: 'يتتبّع الشريط في الأعلى مقدار ما قرأته في هذه اللوحة. تابع القراءة فيمتلئ من البداية إلى النهاية، وارجع للأعلى فيتراجع. يقرأ موضع التمرير للوحة نفسها، لذا يعمل بالطريقة ذاتها داخل نافذة منبثقة أو شريط جانبي أو الصفحة كاملة.',
              })}
            </p>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        {t({
          en: (
            <>
              Tip: omit <code className="font-mono">target</code> to track the whole document scroll, useful on long
              blog posts.
            </>
          ),
          ar: (
            <>
              نصيحة: احذف <code className="font-mono">target</code> لتتبّع تمرير المستند بالكامل، وهو مفيد في المقالات
              الطويلة.
            </>
          ),
        })}
      </p>
    </div>
  );
};

export default ScrollProgressDemo;
