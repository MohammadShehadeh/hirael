'use client';

import * as React from 'react';

import { useT } from '@/lib/demo-locale';
import {
  Comment,
  CommentBody,
  CommentComposer,
  CommentReactions,
  CommentReplies,
  CommentThread,
  CommentThreadHeader,
  CommentThreadResolve,
  type CommentReaction,
} from '@/registry/hirael/bases/base/components/comment-thread';

interface Reply {
  id: number;
  author: string;
  text: string;
  time: { en: string; ar: string };
}

const toggleReaction = (list: CommentReaction[], emoji: string) => {
  const existing = list.find((r) => r.emoji === emoji);
  if (!existing) return [...list, { emoji, count: 1, reacted: true }];

  return list.map((r) =>
    r.emoji === emoji ? { ...r, reacted: !r.reacted, count: r.count + (r.reacted ? -1 : 1) } : r,
  );
};

const CommentThreadDemo = () => {
  const t = useT();
  const [reactions, setReactions] = React.useState<CommentReaction[]>([
    { emoji: '👍', count: 3, reacted: true },
    { emoji: '👀', count: 1 },
  ]);
  const [replies, setReplies] = React.useState<Reply[]>([
    {
      id: 1,
      author: 'Sara Haddad',
      text: 'Agreed. The chips could also wrap onto a second line on small screens.',
      time: { en: '1h ago', ar: 'قبل ساعة' },
    },
  ]);

  return (
    <div className="w-full max-w-lg">
      <CommentThread>
        <CommentThreadHeader>
          <span className="text-muted-foreground">
            {t({ en: 'On “Filter bar, empty state”', ar: 'على “شريط التصفية، الحالة الفارغة”' })}
          </span>
          <CommentThreadResolve
            resolveLabel={t({ en: 'Resolve', ar: 'حل' })}
            reopenLabel={t({ en: 'Reopen', ar: 'إعادة فتح' })}
          />
        </CommentThreadHeader>
        <Comment author={{ name: 'Mohammad Shehadeh' }} time={t({ en: '3h ago', ar: 'قبل 3 ساعات' })}>
          <CommentBody>
            {t({
              en: 'When every filter is removed we show nothing. Can the list come back with a short "Showing all issues" note instead?',
              ar: 'عند إزالة كل عوامل التصفية لا نعرض شيئًا. هل يمكن أن تعود القائمة مع ملاحظة قصيرة "عرض كل المهام"؟',
            })}
          </CommentBody>
          <CommentReactions
            reactions={reactions}
            onToggle={(emoji) => setReactions((list) => toggleReaction(list, emoji))}
            addLabel={t({ en: 'Add reaction', ar: 'أضف تفاعلًا' })}
          />
        </Comment>
        <CommentReplies>
          {replies.map((reply) => (
            <Comment key={reply.id} author={{ name: reply.author }} time={t(reply.time)}>
              <CommentBody>
                {reply.id === 1
                  ? t({ en: reply.text, ar: 'أوافق. ويمكن أيضًا أن تلتف الشرائح إلى سطر ثانٍ على الشاشات الصغيرة.' })
                  : reply.text}
              </CommentBody>
            </Comment>
          ))}
        </CommentReplies>
        <CommentComposer
          placeholder={t({ en: 'Reply…', ar: 'رد…' })}
          submitLabel={t({ en: 'Reply', ar: 'رد' })}
          hint={t({ en: 'Ctrl + Enter to send', ar: 'Ctrl + Enter للإرسال' })}
          onSubmit={(text) =>
            setReplies((list) => [
              ...list,
              { id: list.length + 1, author: 'Mohammad Shehadeh', text, time: { en: 'now', ar: 'الآن' } },
            ])
          }
        />
      </CommentThread>
    </div>
  );
};

export default CommentThreadDemo;
