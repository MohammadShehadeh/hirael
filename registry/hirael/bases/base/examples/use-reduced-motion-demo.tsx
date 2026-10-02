'use client';

import { useT } from '@/lib/demo-locale';
import { useReducedMotion } from '@/registry/hirael/hooks/use-reduced-motion';
import { Badge } from '@/registry/hirael/bases/base/ui/badge';

const UseReducedMotionDemo = () => {
  const t = useT();
  const reduced = useReducedMotion();

  return (
    <div className="grid w-full max-w-md gap-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium">{t({ en: 'Reduce motion', ar: 'تقليل الحركة' })}</p>
        <Badge variant={reduced ? 'default' : 'secondary'}>
          {reduced ? t({ en: 'On', ar: 'مفعّل' }) : t({ en: 'Off', ar: 'معطّل' })}
        </Badge>
      </div>

      <div className="relative h-2 overflow-hidden rounded-full bg-muted">
        <span
          aria-hidden
          className={
            reduced
              ? 'absolute inset-y-0 start-0 w-1/3 rounded-full bg-primary'
              : 'absolute inset-y-0 start-0 w-1/3 animate-[slide_1.6s_ease-in-out_infinite_alternate] rounded-full bg-primary rtl:animate-[slide-rtl_1.6s_ease-in-out_infinite_alternate]'
          }
        />
      </div>

      <p className="text-sm text-muted-foreground">
        {reduced
          ? t({
              en: 'Motion is reduced, so the bar stays still.',
              ar: 'الحركة مقلّلة، لذا يبقى الشريط ثابتًا.',
            })
          : t({
              en: 'Turn on reduce motion in your system settings and the bar stops, without a reload.',
              ar: 'فعّل تقليل الحركة في إعدادات النظام وسيتوقف الشريط، دون إعادة تحميل.',
            })}
      </p>
      <style>{`@keyframes slide{to{transform:translateX(200%)}}@keyframes slide-rtl{to{transform:translateX(-200%)}}`}</style>
    </div>
  );
};

export default UseReducedMotionDemo;
