'use client';

import { useT } from '@/lib/demo-locale';
import { CursorGlow } from '@/registry/hirael/bases/radix/components/cursor-glow';

const CursorGlowDemo = () => {
  const t = useT();

  return (
    <CursorGlow className="w-full max-w-xl rounded-xl border border-border bg-card">
      <div className="flex flex-col items-start gap-3 p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          {t({ en: 'Hover anywhere', ar: 'مرّر في أي مكان' })}
        </p>
        <h3 className="text-xl font-semibold tracking-tight text-foreground">
          {t({
            en: 'A glow that tracks the cursor',
            ar: 'توهّج يتتبّع المؤشر',
          })}
        </h3>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          {t({
            en: 'Drop it behind a hero, a pricing grid, or a feature panel. The light follows the pointer and fades out when it leaves.',
            ar: 'ضعه خلف واجهة رئيسية أو شبكة أسعار أو لوحة ميزات. يتبع الضوء المؤشر ويتلاشى عند خروجه.',
          })}
        </p>
      </div>
    </CursorGlow>
  );
};

export default CursorGlowDemo;
