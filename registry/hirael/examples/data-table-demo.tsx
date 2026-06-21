"use no memo";
"use client";

import * as React from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
  useQueryStates,
} from "nuqs";

import { useT } from "@/lib/demo-locale";
import { Badge } from "@/registry/hirael/ui/badge";
import { Checkbox } from "@/registry/hirael/ui/checkbox";
import { DataTable } from "@/registry/hirael/ui/data-table";
import { DataTableColumnHeader } from "@/registry/hirael/ui/data-table-column-header";
import { DataTableToolbar } from "@/registry/hirael/ui/data-table-toolbar";
import { getSortingStateParser } from "@/registry/hirael/ui/data-table-parsers";
import { useDataTable } from "@/registry/hirael/ui/use-data-table";
import type { ColumnDef } from "@tanstack/react-table";

type Account = {
  id: string;
  customer: string;
  status: "active" | "trial" | "past_due" | "canceled";
  amount: number;
  date: number;
};

const DAY = 86_400_000;
const NAMES = [
  "Apex Studio",
  "Nimbus Labs",
  "Vela Goods",
  "Orbit Media",
  "Pine & Co",
  "Harbor Eight",
  "Sable Type",
  "Mara Health",
];

const DATA: Account[] = Array.from({ length: 53 }, (_, i) => {
  const statuses: Account["status"][] = [
    "active",
    "trial",
    "past_due",
    "canceled",
  ];
  return {
    id: `ACC-${(2048 + i).toString()}`,
    customer: NAMES[i % NAMES.length] ?? "Acme",
    status: statuses[i % statuses.length] ?? "active",
    amount: Math.round(((i * 211) % 1200) + 40),
    date: Date.now() - (i % 40) * DAY,
  };
});

const COLUMN_IDS = ["id", "customer", "status", "amount", "date"];

type ServerQuery = {
  page: number;
  perPage: number;
  sort: { id: string; desc: boolean }[];
  status: string[] | null;
};

function queryAccounts(all: Account[], q: ServerQuery) {
  let rows = [...all];

  if (q.status?.length) {
    rows = rows.filter((row) => q.status?.includes(row.status));
  }

  const sort = q.sort[0];
  if (sort) {
    rows.sort((a, b) => {
      const av = a[sort.id as keyof Account];
      const bv = b[sort.id as keyof Account];
      const cmp =
        typeof av === "number" && typeof bv === "number"
          ? av - bv
          : String(av).localeCompare(String(bv));
      return sort.desc ? -cmp : cmp;
    });
  }

  const pageCount = Math.max(1, Math.ceil(rows.length / q.perPage));
  const start = (q.page - 1) * q.perPage;
  return { rows: rows.slice(start, start + q.perPage), pageCount };
}

function useColumns(): ColumnDef<Account>[] {
  const t = useT();

  return React.useMemo<ColumnDef<Account>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label={t({ en: "Select all", ar: "تحديد الكل" })}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label={t({ en: "Select row", ar: "تحديد الصف" })}
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 32,
      },
      {
        accessorKey: "id",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            label={t({ en: "Account", ar: "الحساب" })}
          />
        ),
        cell: ({ row }) => (
          <span className="font-mono text-xs">{row.original.id}</span>
        ),
      },
      {
        accessorKey: "customer",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            label={t({ en: "Customer", ar: "العميل" })}
          />
        ),
      },
      {
        accessorKey: "status",
        header: t({ en: "Status", ar: "الحالة" }),
        cell: ({ row }) => {
          const status = row.original.status;
          const label = {
            active: t({ en: "Active", ar: "نشط" }),
            trial: t({ en: "Trial", ar: "تجريبي" }),
            past_due: t({ en: "Past due", ar: "متأخر" }),
            canceled: t({ en: "Canceled", ar: "ملغى" }),
          }[status];
          const tone =
            status === "active"
              ? "default"
              : status === "past_due"
                ? "destructive"
                : "secondary";
          return <Badge variant={tone}>{label}</Badge>;
        },
        enableColumnFilter: true,
        meta: {
          label: t({ en: "Status", ar: "الحالة" }),
          variant: "multiSelect",
          options: [
            { label: t({ en: "Active", ar: "نشط" }), value: "active" },
            { label: t({ en: "Trial", ar: "تجريبي" }), value: "trial" },
            { label: t({ en: "Past due", ar: "متأخر" }), value: "past_due" },
            { label: t({ en: "Canceled", ar: "ملغى" }), value: "canceled" },
          ],
        },
      },
      {
        accessorKey: "amount",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            label={t({ en: "MRR", ar: "الإيراد الشهري" })}
          />
        ),
        cell: ({ row }) =>
          new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          }).format(row.original.amount),
      },
      {
        accessorKey: "date",
        header: t({ en: "Signed up", ar: "تاريخ الاشتراك" }),
        cell: ({ row }) =>
          new Intl.DateTimeFormat(undefined, {
            month: "short",
            day: "numeric",
          }).format(row.original.date),
      },
    ],
    [t],
  );
}

function ServerTable() {
  const columns = useColumns();

  const [{ page, perPage, status }] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(5),
    status: parseAsArrayOf(parseAsString),
  });
  const [sort] = useQueryState(
    "sort",
    getSortingStateParser<Account>(new Set(COLUMN_IDS)).withDefault([]),
  );

  const { rows, pageCount } = React.useMemo(
    () => queryAccounts(DATA, { page, perPage, sort, status }),
    [page, perPage, sort, status],
  );

  const { table } = useDataTable({
    data: rows,
    columns,
    pageCount,
    getRowId: (row) => row.id,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 5 },
    },
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}

export default function DataTableDemo() {
  return (
    <NuqsAdapter>
      <div className="w-full max-w-4xl">
        <ServerTable />
      </div>
    </NuqsAdapter>
  );
}
