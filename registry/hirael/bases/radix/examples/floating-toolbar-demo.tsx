'use client';

import { Bold, Italic, Link2, Strikethrough, Underline } from 'lucide-react';

import { useT } from '@/lib/demo-locale';
import {
  FloatingToolbar,
  FloatingToolbarButton,
  FloatingToolbarLabel,
  FloatingToolbarSeparator,
} from '@/registry/hirael/bases/radix/components/floating-toolbar';

const FloatingToolbarDemo = () => {
  const t = useT();

  return (
    <div className="flex w-full max-w-xl justify-center py-6">
      <FloatingToolbar>
        <FloatingToolbarLabel>Aa</FloatingToolbarLabel>
        <FloatingToolbarSeparator />
        <FloatingToolbarButton active aria-label={t({ en: 'Bold', ar: 'عريض' })}>
          <Bold />
        </FloatingToolbarButton>
        <FloatingToolbarButton aria-label={t({ en: 'Italic', ar: 'مائل' })}>
          <Italic />
        </FloatingToolbarButton>
        <FloatingToolbarButton aria-label={t({ en: 'Underline', ar: 'تسطير' })}>
          <Underline />
        </FloatingToolbarButton>
        <FloatingToolbarButton aria-label={t({ en: 'Strikethrough', ar: 'يتوسطه خط' })}>
          <Strikethrough />
        </FloatingToolbarButton>
        <FloatingToolbarSeparator />
        <FloatingToolbarButton aria-label={t({ en: 'Add link', ar: 'إضافة رابط' })}>
          <Link2 />
          {t({ en: 'Link', ar: 'رابط' })}
        </FloatingToolbarButton>
      </FloatingToolbar>
    </div>
  );
};

export default FloatingToolbarDemo;
