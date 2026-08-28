'use client';

import { useT } from '@/lib/demo-locale';
import { BlurReveal } from '@/registry/hirael/bases/base/components/blur-reveal';

const BlurRevealDemo = () => {
  const t = useT();

  const steps = [t({ en: 'Plan', ar: 'خطّط' }), t({ en: 'Build', ar: 'ابنِ' }), t({ en: 'Ship', ar: 'أطلق' })];

  return (
    <div className="grid w-full max-w-xl gap-6">
      <BlurReveal>
        <h3 className="text-2xl font-semibold tracking-tight text-foreground">
          {t({ en: 'Clarity, on arrival', ar: 'الوضوح فور الوصول' })}
        </h3>
      </BlurReveal>
      <BlurReveal delay={120}>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {t({
            en: 'Each element starts blurred and lifts into focus as it enters the viewport. Stagger the reveal by giving siblings an increasing delay.',
            ar: 'يبدأ كل عنصر ضبابيًا ثم يتّضح عند دخوله نطاق العرض. وزّع الظهور بمنح العناصر المتجاورة تأخيرًا متزايدًا.',
          })}
        </p>
      </BlurReveal>
      <div className="grid grid-cols-3 gap-3">
        {steps.map((label, i) => (
          <BlurReveal key={label} delay={200 + i * 120}>
            <div className="rounded-md border border-border bg-card p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">0{i + 1}</p>
              <p className="mt-2 text-sm font-medium text-foreground">{label}</p>
            </div>
          </BlurReveal>
        ))}
      </div>
    </div>
  );
};

export default BlurRevealDemo;
