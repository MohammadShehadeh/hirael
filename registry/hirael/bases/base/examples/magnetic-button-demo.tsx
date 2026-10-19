'use client';

import { ArrowRight } from 'lucide-react';

import { useT } from '@/lib/demo-locale';
import { MagneticButton } from '@/registry/hirael/bases/base/components/magnetic-button';

const MagneticButtonDemo = () => {
  const t = useT();

  return (
    <div className="flex w-full max-w-xl flex-wrap items-center gap-6">
      <MagneticButton>{t({ en: 'Get started', ar: 'ابدأ الآن' })}</MagneticButton>

      <MagneticButton strength={0.6}>
        {t({ en: 'Stronger pull', ar: 'جذب أقوى' })}
        <ArrowRight className="size-4 rtl:rotate-180" />
      </MagneticButton>

      <MagneticButton variant="outline" render={<a href="#" onClick={(e) => e.preventDefault()} />}>
        {t({ en: 'As a link', ar: 'كرابط' })}
        <ArrowRight className="size-4 rtl:rotate-180" />
      </MagneticButton>
    </div>
  );
};

export default MagneticButtonDemo;
