'use client';

import { useT } from '@/lib/demo-locale';
import { TextReveal } from '@/registry/hirael/bases/base/components/text-reveal';

const TextRevealDemo = () => {
  const t = useT();

  return (
    <div className="grid w-full max-w-xl gap-8">
      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: 'By word', ar: 'كلمة بكلمة' })}
        </p>
        <TextReveal as="h3" className="text-2xl font-semibold tracking-tight text-foreground">
          {t({
            en: 'Words rise into place, one after another',
            ar: 'تتصاعد الكلمات إلى مكانها، واحدة تلو الأخرى',
          })}
        </TextReveal>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: 'By line', ar: 'سطرًا بسطر' })}
        </p>
        <TextReveal by="line" delay={100} stagger={120} className="text-sm leading-relaxed text-muted-foreground">
          {t({
            en: 'Designed for headlines and pull quotes.\nEach line is masked, then slides up.\nRespects reduced-motion preferences.',
            ar: 'مصمّم للعناوين والاقتباسات البارزة.\nكل سطر مُقنّع ثم ينزلق إلى الأعلى.\nيحترم تفضيلات تقليل الحركة.',
          })}
        </TextReveal>
      </div>
    </div>
  );
};

export default TextRevealDemo;
