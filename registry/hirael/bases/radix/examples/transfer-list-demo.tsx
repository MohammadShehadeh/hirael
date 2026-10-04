'use client';

import * as React from 'react';

import { useT } from '@/lib/demo-locale';
import {
  TransferList,
  TransferListActions,
  TransferListPanel,
  type TransferListItem,
} from '@/registry/hirael/bases/radix/components/transfer-list';

const TransferListDemo = () => {
  const t = useT();
  const [granted, setGranted] = React.useState<string[]>(['projects.read', 'billing.read']);

  const permissions: TransferListItem[] = [
    { value: 'projects.read', label: t({ en: 'View projects', ar: 'عرض المشاريع' }), description: 'projects.read' },
    { value: 'projects.write', label: t({ en: 'Edit projects', ar: 'تعديل المشاريع' }), description: 'projects.write' },
    {
      value: 'deploys.create',
      label: t({ en: 'Create deploys', ar: 'إنشاء عمليات النشر' }),
      description: 'deploys.create',
    },
    {
      value: 'deploys.rollback',
      label: t({ en: 'Roll back deploys', ar: 'التراجع عن النشر' }),
      description: 'deploys.rollback',
    },
    { value: 'billing.read', label: t({ en: 'View billing', ar: 'عرض الفوترة' }), description: 'billing.read' },
    { value: 'billing.write', label: t({ en: 'Manage billing', ar: 'إدارة الفوترة' }), description: 'billing.write' },
    { value: 'members.invite', label: t({ en: 'Invite members', ar: 'دعوة الأعضاء' }), description: 'members.invite' },
    { value: 'members.remove', label: t({ en: 'Remove members', ar: 'إزالة الأعضاء' }), description: 'members.remove' },
    {
      value: 'org.delete',
      label: t({ en: 'Delete organization', ar: 'حذف المؤسسة' }),
      description: t({ en: 'Owners only', ar: 'للمالكين فقط' }),
      disabled: true,
    },
  ];
  const search = t({ en: 'Filter permissions', ar: 'تصفية الصلاحيات' });
  const selectAll = t({ en: 'Select all', ar: 'تحديد الكل' });

  return (
    <div className="grid w-full max-w-3xl gap-3">
      <TransferList items={permissions} value={granted} onValueChange={setGranted}>
        <TransferListPanel
          side="source"
          title={t({ en: 'Available', ar: 'المتاحة' })}
          searchPlaceholder={search}
          selectAllLabel={selectAll}
          emptyMessage={t({ en: 'Nothing left to grant', ar: 'لا شيء متبقٍ للمنح' })}
        />
        <TransferListActions
          labels={{
            moveAll: t({ en: 'Grant all', ar: 'منح الكل' }),
            moveChecked: t({ en: 'Grant checked', ar: 'منح المحدد' }),
            returnChecked: t({ en: 'Revoke checked', ar: 'سحب المحدد' }),
            returnAll: t({ en: 'Revoke all', ar: 'سحب الكل' }),
          }}
        />
        <TransferListPanel
          side="target"
          title={t({ en: 'Granted to Editors', ar: 'ممنوحة للمحررين' })}
          searchPlaceholder={search}
          selectAllLabel={selectAll}
          emptyMessage={t({ en: 'No permissions yet', ar: 'لا صلاحيات بعد' })}
        />
      </TransferList>
      <p className="text-xs text-muted-foreground tabular-nums">
        {t({
          en: `${granted.length} of ${permissions.length} granted`,
          ar: `${granted.length} من ${permissions.length} ممنوحة`,
        })}
      </p>
    </div>
  );
};

export default TransferListDemo;
