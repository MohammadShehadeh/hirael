'use no memo';
'use client';

import * as React from 'react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import type { ColumnDef } from '@tanstack/react-table';

import { useT } from '@/lib/demo-locale';
import { Badge } from '@/registry/hirael/bases/base/ui/badge';
import { Checkbox } from '@/registry/hirael/bases/base/ui/checkbox';
import { DataTable } from '@/registry/hirael/bases/base/components/data-table/data-table';
import { DataTableColumnHeader } from '@/registry/hirael/bases/base/components/data-table/data-table-column-header';
import type { DataTableFeatures } from '@/registry/hirael/bases/base/components/data-table/data-table-features';
import { DataTableToolbar } from '@/registry/hirael/bases/base/components/data-table/data-table-toolbar';
import { useDataTable } from '@/registry/hirael/bases/base/components/data-table/use-data-table';

interface Account {
  id: string;
  customer: string;
  email: string;
  status: 'active' | 'trial' | 'past_due' | 'canceled';
  plan: 'free' | 'pro' | 'enterprise';
  mrr: number;
  signedUp: number;
}

const DAY = 86_400_000;
const CUSTOMERS = [
  ['Apex Studio', 'billing@apex.studio'],
  ['Nimbus Labs', 'ops@nimbus.dev'],
  ['Vela Goods', 'ar@velagoods.com'],
  ['Orbit Media', 'finance@orbit.media'],
  ['Pine & Co', 'hello@pine.co'],
  ['Harbor Eight', 'accounts@harbor8.io'],
  ['Sable Type', 'team@sabletype.com'],
  ['Mara Health', 'admin@marahealth.org'],
];

const STATUSES: Account['status'][] = ['active', 'trial', 'past_due', 'canceled'];
const PLANS: Account['plan'][] = ['free', 'pro', 'enterprise'];

const DATA: Account[] = Array.from({ length: 37 }, (_, i) => {
  const [customer, email] = CUSTOMERS[i % CUSTOMERS.length] ?? ['Acme', 'a@b.c'];
  return {
    id: `ACC-${(3072 + i).toString()}`,
    customer: customer ?? 'Acme',
    email: email ?? 'a@b.c',
    status: STATUSES[i % STATUSES.length] ?? 'active',
    plan: PLANS[i % PLANS.length] ?? 'free',
    mrr: Math.round(((i * 173) % 1400) + 30),
    signedUp: Date.now() - (i % 30) * DAY,
  };
});

const useColumns = (): ColumnDef<DataTableFeatures, Account>[] => {
  const t = useT();

  return React.useMemo<ColumnDef<DataTableFeatures, Account>[]>(() => {
    const statusLabel: Record<Account['status'], string> = {
      active: t({ en: 'Active', ar: 'نشط' }),
      trial: t({ en: 'Trial', ar: 'تجريبي' }),
      past_due: t({ en: 'Past due', ar: 'متأخر' }),
      canceled: t({ en: 'Canceled', ar: 'ملغى' }),
    };
    const planLabel: Record<Account['plan'], string> = {
      free: t({ en: 'Free', ar: 'مجاني' }),
      pro: t({ en: 'Pro', ar: 'احترافي' }),
      enterprise: t({ en: 'Enterprise', ar: 'مؤسسات' }),
    };

    return [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label={t({ en: 'Select all', ar: 'تحديد الكل' })}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label={t({ en: 'Select row', ar: 'تحديد الصف' })}
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 32,
      },
      {
        accessorKey: 'customer',
        header: ({ column }) => <DataTableColumnHeader column={column} label={t({ en: 'Customer', ar: 'العميل' })} />,
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium">{row.original.customer}</span>
            <span className="text-muted-foreground text-xs">{row.original.email}</span>
          </div>
        ),
        enableColumnFilter: true,
        meta: {
          label: t({ en: 'Customer', ar: 'العميل' }),
          placeholder: t({ en: 'Search customer…', ar: 'ابحث عن عميل…' }),
          variant: 'text',
        },
      },
      {
        accessorKey: 'status',
        header: t({ en: 'Status', ar: 'الحالة' }),
        cell: ({ row }) => {
          const status = row.original.status;
          const tone = status === 'active' ? 'default' : status === 'past_due' ? 'destructive' : 'secondary';
          return <Badge variant={tone}>{statusLabel[status]}</Badge>;
        },
        enableColumnFilter: true,
        meta: {
          label: t({ en: 'Status', ar: 'الحالة' }),
          variant: 'multiSelect',
          options: STATUSES.map((value) => ({
            label: statusLabel[value],
            value,
          })),
        },
      },
      {
        accessorKey: 'plan',
        header: t({ en: 'Plan', ar: 'الخطة' }),
        cell: ({ row }) => planLabel[row.original.plan],
        enableColumnFilter: true,
        meta: {
          label: t({ en: 'Plan', ar: 'الخطة' }),
          variant: 'select',
          options: PLANS.map((value) => ({ label: planLabel[value], value })),
        },
      },
      {
        accessorKey: 'mrr',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label={t({ en: 'MRR', ar: 'الإيراد الشهري' })} />
        ),
        cell: ({ row }) =>
          new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
          }).format(row.original.mrr),
        enableColumnFilter: true,
        meta: {
          label: t({ en: 'MRR', ar: 'الإيراد الشهري' }),
          variant: 'range',
          range: [0, 1500],
          unit: '$',
        },
      },
      {
        accessorKey: 'signedUp',
        header: t({ en: 'Signed up', ar: 'تاريخ الاشتراك' }),
        cell: ({ row }) =>
          new Intl.DateTimeFormat(undefined, {
            month: 'short',
            day: 'numeric',
          }).format(row.original.signedUp),
        enableColumnFilter: true,
        meta: {
          label: t({ en: 'Signed up', ar: 'تاريخ الاشتراك' }),
          variant: 'date',
        },
      },
    ];
  }, [t]);
};

const AccountsTable = () => {
  const columns = useColumns();
  const { table } = useDataTable({
    data: DATA,
    columns,
    getRowId: (row) => row.id,
    initialState: { pagination: { pageIndex: 0, pageSize: 5 } },
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
};

const DataTableDemo = () => {
  // useDataTable keeps page, sort and filters in the URL. In an app the adapter
  // lives at the root; the demo scopes it here.
  return (
    <NuqsAdapter>
      <div className="w-full max-w-4xl">
        <AccountsTable />
      </div>
    </NuqsAdapter>
  );
};

export default DataTableDemo;
