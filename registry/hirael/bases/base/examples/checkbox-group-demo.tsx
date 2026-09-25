'use client';

import { useT } from '@/lib/demo-locale';
import { Separator } from '@/registry/hirael/bases/base/ui/separator';
import {
  CheckboxGroup,
  CheckboxGroupEmpty,
  CheckboxGroupItem,
  CheckboxGroupLabel,
  CheckboxGroupList,
  CheckboxGroupMessage,
  CheckboxGroupSearch,
  CheckboxGroupSelectAll,
  CheckboxGroupSub,
} from '@/registry/hirael/bases/base/components/checkbox-group';

const CHANNELS = [
  {
    id: 'email',
    label: { en: 'Email', ar: 'البريد الإلكتروني' },
    description: { en: 'Sent to hello@mohammadshehadeh.com', ar: 'تُرسل إلى hello@mohammadshehadeh.com' },
    items: [
      { id: 'comments', label: { en: 'Comments on your posts', ar: 'التعليقات على منشوراتك' } },
      { id: 'mentions', label: { en: 'Mentions', ar: 'الإشارات' } },
      { id: 'digest', label: { en: 'Weekly digest', ar: 'الملخص الأسبوعي' } },
    ],
  },
  {
    id: 'push',
    label: { en: 'Push', ar: 'الإشعارات الفورية' },
    description: { en: 'On devices where you are signed in', ar: 'على الأجهزة التي سجلت الدخول منها' },
    items: [
      { id: 'comments', label: { en: 'Comments on your posts', ar: 'التعليقات على منشوراتك' } },
      { id: 'mentions', label: { en: 'Mentions', ar: 'الإشارات' } },
      { id: 'reminders', label: { en: 'Task reminders', ar: 'تذكيرات المهام' } },
    ],
  },
  {
    id: 'sms',
    label: { en: 'SMS', ar: 'الرسائل النصية' },
    description: { en: 'Sent to the phone ending in 0148', ar: 'تُرسل إلى الهاتف المنتهي بـ 0148' },
    items: [
      { id: 'security', label: { en: 'Security alerts', ar: 'تنبيهات الأمان' } },
      { id: 'outages', label: { en: 'Outage updates', ar: 'تحديثات الأعطال' } },
    ],
  },
];

const NOTIFICATION_COUNT = CHANNELS.reduce((sum, channel) => sum + channel.items.length, 0);

const PERMISSIONS = [
  { id: 'repo.read', label: { en: 'Read repositories', ar: 'قراءة المستودعات' } },
  { id: 'repo.write', label: { en: 'Write repositories', ar: 'الكتابة في المستودعات' } },
  { id: 'repo.delete', label: { en: 'Delete repositories', ar: 'حذف المستودعات' } },
  { id: 'issues', label: { en: 'Manage issues', ar: 'إدارة المشكلات' } },
  { id: 'pulls', label: { en: 'Manage pull requests', ar: 'إدارة طلبات الدمج' } },
  { id: 'deploy.read', label: { en: 'View deployments', ar: 'عرض عمليات النشر' } },
  { id: 'deploy.write', label: { en: 'Trigger deployments', ar: 'تشغيل عمليات النشر' } },
  { id: 'secrets', label: { en: 'Manage secrets', ar: 'إدارة الأسرار' } },
  { id: 'webhooks', label: { en: 'Manage webhooks', ar: 'إدارة خطافات الويب' } },
  { id: 'audit', label: { en: 'Read audit log', ar: 'قراءة سجل التدقيق' } },
  { id: 'members', label: { en: 'Manage members', ar: 'إدارة الأعضاء' } },
  { id: 'billing', label: { en: 'Manage billing', ar: 'إدارة الفوترة' } },
];

const MAX_PERMISSIONS = 5;

const CheckboxGroupDemo = () => {
  const t = useT();

  return (
    <div className="grid w-full max-w-3xl gap-12 md:grid-cols-2">
      <CheckboxGroup
        name="notifications"
        defaultValue={['email.comments', 'email.mentions', 'push.mentions', 'sms.security']}
      >
        <CheckboxGroupLabel>{t({ en: 'Notifications', ar: 'الإشعارات' })}</CheckboxGroupLabel>
        <CheckboxGroupSelectAll>{t({ en: 'All notifications', ar: 'كل الإشعارات' })}</CheckboxGroupSelectAll>
        <Separator />
        {CHANNELS.map((channel) => (
          <CheckboxGroupSub key={channel.id} label={t(channel.label)} description={t(channel.description)}>
            {channel.items.map((item) => (
              <CheckboxGroupItem key={item.id} value={`${channel.id}.${item.id}`}>
                {t(item.label)}
              </CheckboxGroupItem>
            ))}
          </CheckboxGroupSub>
        ))}
        <CheckboxGroupMessage>
          {({ count }) =>
            t({
              en: `${count} of ${NOTIFICATION_COUNT} notifications on.`,
              ar: `${count} من ${NOTIFICATION_COUNT} إشعارات مفعّلة.`,
            })
          }
        </CheckboxGroupMessage>
      </CheckboxGroup>

      <CheckboxGroup name="permissions" max={MAX_PERMISSIONS} defaultValue={['repo.read', 'deploy.read']}>
        <CheckboxGroupLabel>{t({ en: 'Token permissions', ar: 'صلاحيات الرمز' })}</CheckboxGroupLabel>
        <CheckboxGroupSearch placeholder={t({ en: 'Filter permissions', ar: 'تصفية الصلاحيات' })} />
        <CheckboxGroupSelectAll>{t({ en: 'Select all shown', ar: 'تحديد كل المعروض' })}</CheckboxGroupSelectAll>
        <Separator />
        <CheckboxGroupList>
          {PERMISSIONS.map((permission) => (
            <CheckboxGroupItem key={permission.id} value={permission.id}>
              {t(permission.label)}
            </CheckboxGroupItem>
          ))}
        </CheckboxGroupList>
        <CheckboxGroupEmpty>{t({ en: 'No permissions match.', ar: 'لا توجد صلاحيات مطابقة.' })}</CheckboxGroupEmpty>
        <CheckboxGroupMessage>
          {({ count, atMax }) =>
            atMax
              ? t({
                  en: `You picked ${MAX_PERMISSIONS}, the limit. Uncheck one to choose another.`,
                  ar: `اخترت ${MAX_PERMISSIONS}، وهو الحد الأقصى. ألغِ واحدة لاختيار غيرها.`,
                })
              : t({
                  en: `${count} of ${MAX_PERMISSIONS} picked.`,
                  ar: `اخترت ${count} من ${MAX_PERMISSIONS}.`,
                })
          }
        </CheckboxGroupMessage>
      </CheckboxGroup>
    </div>
  );
};

export default CheckboxGroupDemo;
