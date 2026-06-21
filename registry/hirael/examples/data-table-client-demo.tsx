"use no memo";
"use client";

import * as React from "react";

import { useT } from "@/lib/demo-locale";
import { Badge } from "@/registry/hirael/ui/badge";
import { Checkbox } from "@/registry/hirael/ui/checkbox";
import { DataTable } from "@/registry/hirael/ui/data-table";
import { DataTableColumnHeader } from "@/registry/hirael/ui/data-table-column-header";
import { DataTableToolbar } from "@/registry/hirael/ui/data-table-toolbar";
import { useDataTableClient } from "@/registry/hirael/ui/data-table-client";
import type { ColumnDef } from "@tanstack/react-table";

type Invoice = {
  id: string;
  customer: string;
  status: "paid" | "pending" | "overdue" | "draft";
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
  "Lumen Bank",
  "Drift Audio",
];

const DATA: Invoice[] = Array.from({ length: 47 }, (_, i) => {
  const statuses: Invoice["status"][] = ["paid", "pending", "overdue", "draft"];
  return {
    id: `INV-${(1024 + i).toString()}`,
    customer: NAMES[i % NAMES.length] ?? "Acme",
    status: statuses[i % statuses.length] ?? "paid",
    amount: Math.round(((i * 137) % 900) + 80),
    date: Date.now() - (i % 30) * DAY,
  };
});

function useColumns(): ColumnDef<Invoice>[] {
  const t = useT();

  return React.useMemo<ColumnDef<Invoice>[]>(
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
            label={t({ en: "Invoice", ar: "الفاتورة" })}
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
        enableColumnFilter: true,
        meta: {
          label: t({ en: "Customer", ar: "العميل" }),
          placeholder: t({ en: "Search customer…", ar: "ابحث عن عميل…" }),
          variant: "text",
        },
      },
      {
        accessorKey: "status",
        header: t({ en: "Status", ar: "الحالة" }),
        cell: ({ row }) => {
          const status = row.original.status;
          const label = {
            paid: t({ en: "Paid", ar: "مدفوعة" }),
            pending: t({ en: "Pending", ar: "معلّقة" }),
            overdue: t({ en: "Overdue", ar: "متأخرة" }),
            draft: t({ en: "Draft", ar: "مسودة" }),
          }[status];
          const tone =
            status === "paid"
              ? "default"
              : status === "overdue"
                ? "destructive"
                : "secondary";
          return <Badge variant={tone}>{label}</Badge>;
        },
        enableColumnFilter: true,
        filterFn: (row, id, value) =>
          Array.isArray(value) && value.includes(row.getValue(id)),
        meta: {
          label: t({ en: "Status", ar: "الحالة" }),
          variant: "multiSelect",
          options: [
            { label: t({ en: "Paid", ar: "مدفوعة" }), value: "paid" },
            { label: t({ en: "Pending", ar: "معلّقة" }), value: "pending" },
            { label: t({ en: "Overdue", ar: "متأخرة" }), value: "overdue" },
            { label: t({ en: "Draft", ar: "مسودة" }), value: "draft" },
          ],
        },
      },
      {
        accessorKey: "amount",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            label={t({ en: "Amount", ar: "المبلغ" })}
          />
        ),
        cell: ({ row }) =>
          new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          }).format(row.original.amount),
        enableColumnFilter: true,
        meta: {
          label: t({ en: "Amount", ar: "المبلغ" }),
          variant: "range",
          range: [0, 1000],
          unit: "$",
        },
      },
      {
        accessorKey: "date",
        header: t({ en: "Issued", ar: "تاريخ الإصدار" }),
        cell: ({ row }) =>
          new Intl.DateTimeFormat(undefined, {
            month: "short",
            day: "numeric",
          }).format(row.original.date),
        enableColumnFilter: true,
        meta: {
          label: t({ en: "Issued", ar: "تاريخ الإصدار" }),
          variant: "date",
        },
      },
    ],
    [t],
  );
}

export default function DataTableClientDemo() {
  const columns = useColumns();

  const { table } = useDataTableClient({
    data: DATA,
    columns,
    getRowId: (row) => row.id,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 5 },
    },
  });

  return (
    <div className="w-full max-w-4xl">
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  );
}
