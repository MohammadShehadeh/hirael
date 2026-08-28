'use client';

import { ArrowRight, Sparkles } from 'lucide-react';

import { useT } from '@/lib/demo-locale';
import {
  AnnouncementBar,
  AnnouncementBarBadge,
  AnnouncementBarLink,
} from '@/registry/hirael/bases/radix/components/announcement-bar';

const AnnouncementBarDemo = () => {
  const t = useT();

  return (
    <div className="grid w-full max-w-3xl gap-6">
      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: 'Default · dismissible', ar: 'افتراضي · قابل للإغلاق' })}
        </p>
        <AnnouncementBar dismissible className="rounded-md border">
          <AnnouncementBarBadge>{t({ en: 'new', ar: 'جديد' })}</AnnouncementBarBadge>
          <span className="text-foreground">
            {t({
              en: 'v1.4 ships with a new combobox primitive.',
              ar: 'يأتي الإصدار v1.4 مع عنصر combobox جديد.',
            })}
          </span>
          <AnnouncementBarLink href="#">
            {t({ en: 'Read the post', ar: 'اقرأ المقال' })}
            <ArrowRight className="size-3" />
          </AnnouncementBarLink>
        </AnnouncementBar>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: 'Primary', ar: 'أساسي' })}
        </p>
        <AnnouncementBar tone="primary" className="rounded-md border">
          <Sparkles className="size-3.5" />
          <span>
            {t({
              en: 'Early-access pricing ends Friday.',
              ar: 'ينتهي سعر الوصول المبكر يوم الجمعة.',
            })}
          </span>
          <AnnouncementBarLink href="#">
            {t({ en: 'Claim 50% off', ar: 'احصل على خصم 50%' })}
            <ArrowRight className="size-3" />
          </AnnouncementBarLink>
        </AnnouncementBar>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: 'Muted · simple', ar: 'هادئ · بسيط' })}
        </p>
        <AnnouncementBar tone="muted" className="rounded-md">
          <span className="text-muted-foreground">
            {t({
              en: 'Scheduled maintenance on May 28, 02:00 UTC · ~15 min downtime.',
              ar: 'صيانة مجدولة في 28 مايو، 02:00 بتوقيت UTC · توقف لنحو 15 دقيقة.',
            })}
          </span>
        </AnnouncementBar>
      </div>
    </div>
  );
};

export default AnnouncementBarDemo;
