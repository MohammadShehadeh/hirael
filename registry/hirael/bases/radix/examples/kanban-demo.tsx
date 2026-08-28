'use client';

import * as React from 'react';

import { useT } from '@/lib/demo-locale';
import {
  Kanban,
  KanbanCard,
  KanbanCardHandle,
  KanbanColumn,
  KanbanColumnContent,
  KanbanColumnCount,
  KanbanColumnHeader,
  KanbanColumnTitle,
  KanbanEmpty,
  type KanbanValue,
} from '@/registry/hirael/bases/radix/components/kanban';
import { Avatar, AvatarFallback } from '@/registry/hirael/bases/radix/ui/avatar';
import { Badge } from '@/registry/hirael/bases/radix/ui/badge';

interface Task {
  title: { en: string; ar: string };
  tag: { en: string; ar: string };
  assignee: string;
}

const TASKS: Record<string, Task> = {
  't-1': {
    title: { en: 'Write onboarding email copy', ar: 'كتابة نص بريد الترحيب' },
    tag: { en: 'Marketing', ar: 'تسويق' },
    assignee: 'LM',
  },
  't-2': {
    title: {
      en: 'Fix date picker in Safari',
      ar: 'إصلاح منتقي التاريخ في سفاري',
    },
    tag: { en: 'Bug', ar: 'خلل' },
    assignee: 'RK',
  },
  't-3': {
    title: { en: 'Design empty states', ar: 'تصميم الحالات الفارغة' },
    tag: { en: 'Design', ar: 'تصميم' },
    assignee: 'SA',
  },
  't-4': {
    title: { en: 'Rotate API keys', ar: 'تدوير مفاتيح API' },
    tag: { en: 'Ops', ar: 'تشغيل' },
    assignee: 'JD',
  },
  't-5': {
    title: { en: 'Ship billing page', ar: 'إطلاق صفحة الفوترة' },
    tag: { en: 'Feature', ar: 'ميزة' },
    assignee: 'RK',
  },
  't-6': {
    title: { en: 'Migrate to Tailwind v4', ar: 'الترحيل إلى Tailwind v4' },
    tag: { en: 'Chore', ar: 'مهمة' },
    assignee: 'LM',
  },
  't-7': {
    title: { en: 'Add RTL toggle to docs', ar: 'إضافة زر RTL إلى التوثيق' },
    tag: { en: 'Docs', ar: 'توثيق' },
    assignee: 'SA',
  },
};

const INITIAL: KanbanValue = {
  todo: ['t-1', 't-2', 't-3'],
  progress: ['t-4', 't-5'],
  done: ['t-6', 't-7'],
};

const KanbanDemo = () => {
  const t = useT();
  const [board, setBoard] = React.useState<KanbanValue>(INITIAL);

  const columns = [
    { id: 'todo', title: t({ en: 'Todo', ar: 'للتنفيذ' }) },
    { id: 'progress', title: t({ en: 'In progress', ar: 'قيد التنفيذ' }) },
    { id: 'done', title: t({ en: 'Done', ar: 'منجز' }) },
  ];

  return (
    <div className="grid w-full max-w-4xl gap-8">
      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: 'Three-column board', ar: 'لوحة من ثلاثة أعمدة' })}
        </p>
        <Kanban value={board} onValueChange={setBoard} className="pb-2">
          {columns.map((column) => (
            <KanbanColumn key={column.id} id={column.id}>
              <KanbanColumnHeader>
                <KanbanColumnTitle>{column.title}</KanbanColumnTitle>
                <KanbanColumnCount />
              </KanbanColumnHeader>
              <KanbanColumnContent className="max-h-80">
                {board[column.id].map((cardId) => {
                  const task = TASKS[cardId];
                  return (
                    <KanbanCard key={cardId} id={cardId}>
                      <p className="font-medium leading-snug">{t(task.title)}</p>
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="outline" className="text-[11px]">
                          {t(task.tag)}
                        </Badge>
                        <Avatar size="sm">
                          <AvatarFallback className="text-[10px]">{task.assignee}</AvatarFallback>
                        </Avatar>
                      </div>
                    </KanbanCard>
                  );
                })}
                <KanbanEmpty>{t({ en: 'Drop a card here', ar: 'أفلت بطاقة هنا' })}</KanbanEmpty>
              </KanbanColumnContent>
            </KanbanColumn>
          ))}
        </Kanban>
        <p className="text-[11px] text-muted-foreground">
          {t({
            en: 'Drag with the pointer, or focus a card and press Space, then use the arrow keys.',
            ar: 'اسحب بالمؤشر، أو ركّز على بطاقة واضغط مسافة ثم استخدم الأسهم.',
          })}
        </p>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: 'Compact, handle only', ar: 'مضغوط، بالمقبض فقط' })}
        </p>
        <Kanban
          defaultValue={{
            backlog: ['c-1', 'c-2', 'c-3'],
            review: ['c-4'],
          }}
        >
          <KanbanColumn id="backlog" className="w-56 bg-transparent">
            <KanbanColumnHeader className="pt-2 pb-1">
              <KanbanColumnTitle className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                {t({ en: 'Backlog', ar: 'قائمة الانتظار' })}
              </KanbanColumnTitle>
              <KanbanColumnCount />
            </KanbanColumnHeader>
            <KanbanColumnContent className="gap-1">
              {(ids) =>
                ids.map((id) => (
                  <CompactCard key={id} id={id}>
                    {t(COMPACT[id])}
                  </CompactCard>
                ))
              }
            </KanbanColumnContent>
          </KanbanColumn>
          <KanbanColumn id="review" className="w-56 bg-transparent">
            <KanbanColumnHeader className="pt-2 pb-1">
              <KanbanColumnTitle className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                {t({ en: 'In review', ar: 'قيد المراجعة' })}
              </KanbanColumnTitle>
              <KanbanColumnCount />
            </KanbanColumnHeader>
            <KanbanColumnContent className="gap-1">
              {(ids) => (
                <>
                  {ids.map((id) => (
                    <CompactCard key={id} id={id}>
                      {t(COMPACT[id])}
                    </CompactCard>
                  ))}
                  <KanbanEmpty className="min-h-10">
                    {t({ en: 'Nothing in review', ar: 'لا شيء قيد المراجعة' })}
                  </KanbanEmpty>
                </>
              )}
            </KanbanColumnContent>
          </KanbanColumn>
        </Kanban>
      </div>
    </div>
  );
};

const COMPACT: Record<string, { en: string; ar: string }> = {
  'c-1': { en: 'Dark mode for emails', ar: 'الوضع الداكن للرسائل' },
  'c-2': { en: 'Export to CSV', ar: 'تصدير إلى CSV' },
  'c-3': { en: 'Audit log filters', ar: 'مرشحات سجل التدقيق' },
  'c-4': { en: 'Webhook retries', ar: 'إعادة محاولات Webhook' },
};

const CompactCard = ({ id, children }: { id: string; children: React.ReactNode }) => {
  return (
    <KanbanCard id={id} className="flex-row items-center gap-1.5 p-1.5 pe-2.5">
      <KanbanCardHandle />
      <span className="truncate text-xs">{children}</span>
    </KanbanCard>
  );
};

export default KanbanDemo;
