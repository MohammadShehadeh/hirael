'use client';

import * as React from 'react';

import { useT } from '@/lib/demo-locale';
import { Sortable, SortableHandle, SortableItem } from '@/registry/hirael/bases/base/components/sortable';

const tags = ['react', 'tailwind', 'radix', 'cmdk', 'lucide'];

const SortableDemo = () => {
  const t = useT();

  const tasks = {
    'design-review': t({
      en: 'Design review with the product team',
      ar: 'مراجعة التصميم مع فريق المنتج',
    }),
    'fix-onboarding': t({
      en: 'Fix onboarding empty state',
      ar: 'إصلاح الحالة الفارغة في الإعداد',
    }),
    'ship-registry': t({
      en: 'Ship the registry build pipeline',
      ar: 'إطلاق مسار بناء السجل',
    }),
    'write-changelog': t({
      en: 'Write the release changelog',
      ar: 'كتابة سجل تغييرات الإصدار',
    }),
  };

  const [taskOrder, setTaskOrder] = React.useState(Object.keys(tasks));
  const [tagOrder, setTagOrder] = React.useState(tags);

  return (
    <div className="grid w-full max-w-2xl gap-8">
      <div className="grid gap-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: 'Tasks · drag handle', ar: 'المهام · مقبض السحب' })}
        </p>
        <Sortable value={taskOrder} onValueChange={setTaskOrder}>
          {Object.entries(tasks).map(([id, title]) => (
            <SortableItem key={id} value={id} className="p-3">
              <SortableHandle />
              <span className="flex-1 truncate">{title}</span>
              <span className="font-mono text-[10px] text-muted-foreground">{id}</span>
            </SortableItem>
          ))}
        </Sortable>
        <p className="font-mono text-[10px] text-muted-foreground">order: [{taskOrder.join(', ')}]</p>
      </div>

      <div className="grid gap-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({
            en: 'Tags · horizontal, whole item drags',
            ar: 'الوسوم · أفقي، يُسحب العنصر بالكامل',
          })}
        </p>
        <Sortable orientation="horizontal" value={tagOrder} onValueChange={setTagOrder}>
          {tags.map((tag) => (
            <SortableItem key={tag} value={tag} className="rounded-full px-3 py-1 font-medium">
              {tag}
            </SortableItem>
          ))}
        </Sortable>
        <p className="font-mono text-[10px] text-muted-foreground">order: [{tagOrder.join(', ')}]</p>
      </div>

      <div className="grid gap-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({
            en: 'Disabled item · skipped while sorting',
            ar: 'عنصر معطّل · يُتخطّى أثناء الترتيب',
          })}
        </p>
        <Sortable defaultValue={['draft', 'locked', 'review', 'published']} className="max-w-sm">
          <SortableItem value="draft" className="p-3">
            <SortableHandle />
            {t({ en: 'Draft', ar: 'مسودة' })}
          </SortableItem>
          <SortableItem value="locked" disabled className="p-3">
            <SortableHandle />
            {t({ en: 'Locked (disabled)', ar: 'مقفل (معطّل)' })}
          </SortableItem>
          <SortableItem value="review" className="p-3">
            <SortableHandle />
            {t({ en: 'In review', ar: 'قيد المراجعة' })}
          </SortableItem>
          <SortableItem value="published" className="p-3">
            <SortableHandle />
            {t({ en: 'Published', ar: 'منشور' })}
          </SortableItem>
        </Sortable>
      </div>
    </div>
  );
};

export default SortableDemo;
