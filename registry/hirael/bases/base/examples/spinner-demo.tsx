'use client';

import { useT } from '@/lib/demo-locale';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Spinner } from '@/registry/hirael/bases/base/ui/spinner';

const SpinnerDemo = () => {
  const t = useT();

  return (
    <div className="grid w-full max-w-2xl gap-8">
      <div className="grid gap-2">
        <p className="text-xs text-muted-foreground uppercase">{t({ en: 'Sizes', ar: 'الأحجام' })}</p>
        <div className="flex items-center gap-6 text-foreground">
          <Spinner />
          <Spinner className="size-6" />
          <Spinner className="size-8" />
        </div>
      </div>

      <div className="grid gap-2">
        <p className="text-xs text-muted-foreground uppercase">
          {t({ en: 'Inherits text color · in context', ar: 'يرث لون النص · ضمن السياق' })}
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-primary">
            <Spinner />
          </span>
          <span className="text-destructive">
            <Spinner />
          </span>
          <Button type="button" disabled>
            <Spinner />
            {t({ en: 'Saving…', ar: 'جارٍ الحفظ…' })}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SpinnerDemo;
