'use client';

import { Boxes, Database, Layers, Server } from 'lucide-react';

import { useT } from '@/lib/demo-locale';
import { IconStack, IconStackContent } from '@/registry/hirael/bases/base/components/icon-stack';

const IconStackDemo = () => {
  const t = useT();

  return (
    <div className="grid w-full max-w-2xl gap-10">
      <div className="grid gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: 'Default stack', ar: 'الكومة الافتراضية' })}
        </p>
        <div className="flex flex-wrap items-end gap-8">
          {[Database, Server, Boxes].map((Icon, index) => (
            <IconStack key={index}>
              <IconStackContent>
                <Icon className="size-6" strokeWidth={1.5} />
              </IconStackContent>
            </IconStack>
          ))}
        </div>
      </div>

      <div className="grid gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: 'One to four layers', ar: 'من طبقة إلى أربع طبقات' })}
        </p>
        <div className="flex flex-wrap items-end gap-8">
          {[1, 2, 3, 4].map((layers) => (
            <IconStack key={layers} layers={layers} className="w-24">
              <IconStackContent>
                <Layers className="size-6" strokeWidth={1.5} />
              </IconStackContent>
            </IconStack>
          ))}
        </div>
      </div>

      <div className="grid gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: 'Tinted, above a caption', ar: 'ملوّنة، فوق تعليق' })}
        </p>
        <div className="flex flex-wrap gap-8">
          <div className="grid max-w-45 justify-items-center gap-2 text-center">
            <IconStack className="text-primary **:data-[slot=icon-stack-layer]:fill-primary/10">
              <IconStackContent className="text-primary">
                <Database className="size-6" strokeWidth={1.5} />
              </IconStackContent>
            </IconStack>
            <p className="text-sm font-medium text-foreground">
              {t({ en: 'Managed databases', ar: 'قواعد بيانات مُدارة' })}
            </p>
            <p className="text-sm text-muted-foreground">
              {t({
                en: 'Every engine on the same control plane.',
                ar: 'كل محرك على لوحة التحكم نفسها.',
              })}
            </p>
          </div>

          <div className="grid max-w-45 justify-items-center gap-2 text-center">
            <IconStack className="text-accent-cool **:data-[slot=icon-stack-layer]:fill-accent-cool/10">
              <IconStackContent className="text-accent-cool">
                <Server className="size-6" strokeWidth={1.5} />
              </IconStackContent>
            </IconStack>
            <p className="text-sm font-medium text-foreground">
              {t({ en: 'Live regions', ar: 'مناطق نشطة' })}
            </p>
            <p className="text-sm text-muted-foreground">
              {t({
                en: 'Deploy close to the people using it.',
                ar: 'انشر قرب من يستخدمها.',
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconStackDemo;
