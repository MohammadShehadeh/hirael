'use client';

import { useT } from '@/lib/demo-locale';
import { ScrollReveal } from '@/registry/hirael/bases/base/components/scroll-reveal';

const ScrollRevealDemo = () => {
  const t = useT();

  const items = [
    { dir: 'up' as const, label: t({ en: 'Up', ar: 'أعلى' }) },
    { dir: 'right' as const, label: t({ en: 'Right', ar: 'يمين' }) },
    { dir: 'left' as const, label: t({ en: 'Left', ar: 'يسار' }) },
    { dir: 'down' as const, label: t({ en: 'Down', ar: 'أسفل' }) },
  ];

  return (
    <div className="grid w-full max-w-xl gap-6">
      <ScrollReveal>
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          {t({ en: 'Reveal on scroll', ar: 'ظهور عند التمرير' })}
        </p>
      </ScrollReveal>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item, i) => (
          <ScrollReveal key={item.dir} direction={item.dir} delay={i * 100}>
            <div className="flex h-24 flex-col justify-between rounded-md border border-border bg-card p-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                {t({
                  en: `from ${item.label.toLowerCase()}`,
                  ar: `من ${item.label}`,
                })}
              </span>
              <span className="text-sm font-medium text-foreground">{item.label}</span>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
};

export default ScrollRevealDemo;
