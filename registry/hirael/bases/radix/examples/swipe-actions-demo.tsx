'use client';

import * as React from 'react';
import { Archive, MailOpen, Trash2 } from 'lucide-react';

import { useT } from '@/lib/demo-locale';
import { Avatar, AvatarFallback } from '@/registry/hirael/bases/radix/ui/avatar';
import {
  SwipeAction,
  SwipeActions,
  SwipeActionsContent,
  SwipeActionsGroup,
} from '@/registry/hirael/bases/radix/components/swipe-actions';

const MAIL = [
  { id: 1, from: 'Sara Haddad', subject: { en: 'Filter bar review', ar: 'مراجعة شريط التصفية' } },
  { id: 2, from: 'Omar Khalil', subject: { en: 'Deploy finished', ar: 'اكتمل النشر' } },
  { id: 3, from: 'Hirael', subject: { en: 'Your weekly summary', ar: 'ملخصك الأسبوعي' } },
  { id: 4, from: 'Lina Aziz', subject: { en: 'Lunch on Thursday?', ar: 'غداء يوم الخميس؟' } },
];

const SwipeActionsDemo = () => {
  const t = useT();
  const [mail, setMail] = React.useState(MAIL);
  const [read, setRead] = React.useState<number[]>([]);

  return (
    <div className="grid w-full max-w-sm gap-3">
      <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border">
        {mail.map((item) => (
          <li key={item.id}>
            <SwipeActions>
              <SwipeActionsGroup side="start">
                <SwipeAction
                  tone="primary"
                  icon={<MailOpen />}
                  onClick={() => setRead((list) => (list.includes(item.id) ? list : [...list, item.id]))}
                >
                  {t({ en: 'Read', ar: 'مقروء' })}
                </SwipeAction>
              </SwipeActionsGroup>
              <SwipeActionsContent>
                <div className="flex items-center gap-3 px-4 py-3">
                  <Avatar size="sm">
                    <AvatarFallback>{item.from.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="grid min-w-0 flex-1">
                    <span className={read.includes(item.id) ? 'text-sm' : 'text-sm font-semibold'}>{item.from}</span>
                    <span className="truncate text-xs text-muted-foreground">{t(item.subject)}</span>
                  </div>
                </div>
              </SwipeActionsContent>
              <SwipeActionsGroup side="end">
                <SwipeAction icon={<Archive />} onClick={() => setMail((list) => list.filter((m) => m.id !== item.id))}>
                  {t({ en: 'Archive', ar: 'أرشفة' })}
                </SwipeAction>
                <SwipeAction
                  tone="destructive"
                  icon={<Trash2 />}
                  onClick={() => setMail((list) => list.filter((m) => m.id !== item.id))}
                >
                  {t({ en: 'Delete', ar: 'حذف' })}
                </SwipeAction>
              </SwipeActionsGroup>
            </SwipeActions>
          </li>
        ))}
        {mail.length === 0 && (
          <li className="px-4 py-8 text-center text-sm text-muted-foreground">
            {t({ en: 'Inbox zero.', ar: 'صندوق الوارد فارغ.' })}
          </li>
        )}
      </ul>
      <p className="text-xs text-muted-foreground">
        {t({
          en: 'Drag a row sideways with a finger or the mouse, or tab to its actions.',
          ar: 'اسحب صفًا جانبيًا بإصبعك أو بالفأرة، أو انتقل إلى إجراءاته بزر Tab.',
        })}
      </p>
    </div>
  );
};

export default SwipeActionsDemo;
