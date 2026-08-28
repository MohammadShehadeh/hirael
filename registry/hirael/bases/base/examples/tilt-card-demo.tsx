'use client';

import { useT } from '@/lib/demo-locale';
import { TiltCard } from '@/registry/hirael/bases/base/components/tilt-card';

const TiltCardDemo = () => {
  const t = useT();

  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-4">
      <TiltCard glare className="w-64">
        <div className="flex flex-col gap-6 p-5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              {t({ en: 'Virtual', ar: 'افتراضية' })}
            </span>
            <span className="size-6 rounded-full bg-foreground/10" />
          </div>
          <div className="font-mono text-lg tracking-[0.12em] text-foreground">•••• 8021</div>
          <div className="flex items-end justify-between">
            <span className="text-sm font-medium text-foreground">{t({ en: 'A. Khoury', ar: 'أ. خوري' })}</span>
            <span className="font-mono text-xs text-muted-foreground">09 / 28</span>
          </div>
        </div>
      </TiltCard>
      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
        {t({
          en: 'Point at the card to tilt',
          ar: 'وجّه المؤشر نحو البطاقة للإمالة',
        })}
      </p>
    </div>
  );
};

export default TiltCardDemo;
