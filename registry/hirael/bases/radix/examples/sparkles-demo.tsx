'use client';

import { useT } from '@/lib/demo-locale';
import { Sparkles } from '@/registry/hirael/bases/radix/components/sparkles';

const SparklesDemo = () => {
  const t = useT();

  return (
    <div className="grid w-full max-w-2xl gap-6">
      <div className="relative isolate overflow-hidden rounded-xl border border-border bg-card">
        <Sparkles className="-z-10 [mask-image:radial-gradient(60%_60%_at_50%_50%,black,transparent)]" />
        <div className="flex flex-col items-center gap-2 px-8 py-16 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            {t({ en: 'Default', ar: 'افتراضي' })}
          </p>
          <h3 className="font-serif text-3xl font-medium tracking-tight text-foreground">
            {t({ en: 'A quiet field of light', ar: 'حقل هادئ من الضوء' })}
          </h3>
        </div>
      </div>

      <div className="relative isolate overflow-hidden rounded-xl border border-border bg-card">
        <Sparkles color="var(--warm)" density={5} size={1.8} speed={0.8} className="-z-10" />
        <div className="flex items-center justify-between px-6 py-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            {t({ en: 'Warm · denser · faster', ar: 'دافئ · أكثف · أسرع' })}
          </p>
          <span className="text-sm text-foreground">{t({ en: 'color="var(--warm)"', ar: 'color="var(--warm)"' })}</span>
        </div>
      </div>
    </div>
  );
};

export default SparklesDemo;
