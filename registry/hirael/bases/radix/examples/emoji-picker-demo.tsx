'use client';

import * as React from 'react';
import { SmilePlus } from 'lucide-react';

import { useT } from '@/lib/demo-locale';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/hirael/bases/radix/ui/popover';
import { Textarea } from '@/registry/hirael/bases/radix/ui/textarea';
import {
  EmojiPicker,
  EmojiPickerCategories,
  EmojiPickerFooter,
  EmojiPickerList,
  EmojiPickerSearch,
  EmojiPickerSkinTone,
} from '@/registry/hirael/bases/radix/components/emoji-picker';

const EmojiPickerDemo = () => {
  const t = useT();
  const [message, setMessage] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [reaction, setReaction] = React.useState('👍');
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const insertAtCursor = (emoji: string) => {
    const el = textareaRef.current;
    if (!el) {
      setMessage((prev) => prev + emoji);
      return;
    }
    const start = el.selectionStart ?? message.length;
    const end = el.selectionEnd ?? message.length;
    const next = message.slice(0, start) + emoji + message.slice(end);
    setMessage(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + emoji.length, start + emoji.length);
    });
  };

  const categoryLabels = t({
    en: {
      recent: 'Recent',
      smileys: 'Smileys',
      people: 'People',
      animals: 'Animals & nature',
      food: 'Food & drink',
      activities: 'Activities',
      travel: 'Travel & places',
      objects: 'Objects',
      symbols: 'Symbols',
    },
    ar: {
      recent: 'الأخيرة',
      smileys: 'وجوه',
      people: 'أشخاص',
      animals: 'حيوانات وطبيعة',
      food: 'طعام وشراب',
      activities: 'أنشطة',
      travel: 'سفر وأماكن',
      objects: 'أشياء',
      symbols: 'رموز',
    },
  });

  return (
    <div className="grid w-full max-w-xl gap-8">
      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({
            en: 'Popover · insert into a message',
            ar: 'نافذة منبثقة · إدراج في رسالة',
          })}
        </p>
        <div className="grid gap-2 rounded-md border border-border bg-card p-3">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t({
              en: 'Write a message',
              ar: 'اكتب رسالة',
            })}
            className="min-h-20 resize-none"
          />
          <div className="flex items-center justify-between gap-2">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={t({ en: 'Add emoji', ar: 'أضف رمزًا تعبيريًا' })}
                >
                  <SmilePlus />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-0">
                <EmojiPicker
                  recentKey="hirael-demo-recent-emoji"
                  onEmojiSelect={(emoji) => {
                    insertAtCursor(emoji);
                    setOpen(false);
                  }}
                  className="border-0"
                >
                  <EmojiPickerSearch placeholder={t({ en: 'Search emoji', ar: 'ابحث عن رمز' })} />
                  <EmojiPickerCategories labels={categoryLabels} />
                  <EmojiPickerList />
                  <EmojiPickerFooter
                    placeholder={t({
                      en: 'Pick an emoji',
                      ar: 'اختر رمزًا تعبيريًا',
                    })}
                  >
                    <EmojiPickerSkinTone />
                  </EmojiPickerFooter>
                </EmojiPicker>
              </PopoverContent>
            </Popover>
            <Button type="button" size="sm" disabled={!message.trim()}>
              {t({ en: 'Send', ar: 'إرسال' })}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({
            en: 'Inline · compact reaction picker',
            ar: 'مضمّن · منتقي تفاعل مضغوط',
          })}
        </p>
        <div className="flex flex-wrap items-start gap-4">
          <EmojiPicker columns={6} onEmojiSelect={setReaction} className="w-64">
            <EmojiPickerSearch placeholder={t({ en: 'Search', ar: 'بحث' })} />
            <EmojiPickerList className="h-40" />
            <EmojiPickerCategories labels={categoryLabels} className="border-t border-border pt-2" />
          </EmojiPicker>
          <div className="grid gap-1 text-sm">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              {t({ en: 'Reaction', ar: 'التفاعل' })}
            </span>
            <span className="text-3xl leading-none">{reaction}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmojiPickerDemo;
