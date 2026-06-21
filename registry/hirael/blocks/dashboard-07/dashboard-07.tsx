"use no memo";
"use client";

import * as React from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/registry/hirael/ui/badge";
import { Checkbox } from "@/registry/hirael/ui/checkbox";
import { DataTable } from "@/registry/hirael/ui/data-table";
import { DataTableColumnHeader } from "@/registry/hirael/ui/data-table-column-header";
import { DataTableToolbar } from "@/registry/hirael/ui/data-table-toolbar";
import { useDataTable } from "@/registry/hirael/ui/use-data-table";

type Account = {
  id: string;
  customer: string;
  email: string;
  status: "active" | "trial" | "past_due" | "canceled";
  plan: "free" | "pro" | "enterprise";
  mrr: number;
  seats: number;
  signedUp: number;
};

const DAY = 86_400_000;
const CUSTOMERS = [
  ["Apex Studio", "billing@apex.studio"],
  ["Nimbus Labs", "ops@nimbus.dev"],
  ["Vela Goods", "ar@velagoods.com"],
  ["Orbit Media", "finance@orbit.media"],
  ["Pine & Co", "hello@pine.co"],
  ["Harbor Eight", "accounts@harbor8.io"],
  ["Sable Type", "team@sabletype.com"],
  ["Mara Health", "admin@marahealth.org"],
  ["Lumen Bank", "ops@lumen.bank"],
  ["Drift Audio", "pay@driftaudio.fm"],
];

const STATUSES: Account["status"][] = [
  "active",
  "trial",
  "past_due",
  "canceled",
];
const PLANS: Account["plan"][] = ["free", "pro", "enterprise"];

const DATA: Account[] = Array.from({ length: 64 }, (_, i) => {
  const [customer, email] = CUSTOMERS[i % CUSTOMERS.length] ?? [
    "Acme",
    "a@b.c",
  ];
  return {
    id: `ACC-${(3072 + i).toString()}`,
    customer: customer ?? "Acme",
    email: email ?? "a@b.c",
    status: STATUSES[i % STATUSES.length] ?? "active",
    plan: PLANS[i % PLANS.length] ?? "free",
    mrr: Math.round(((i * 173) % 1400) + 30),
    seats: ((i * 7) % 90) + 3,
    signedUp: Date.now() - (i % 45) * DAY,
  };
});

const STATUS_LABELS: Record<Account["status"], string> = {
  active: "Active",
  trial: "Trial",
  past_due: "Past due",
  canceled: "Canceled",
};
const PLAN_LABELS: Record<Account["plan"], string> = {
  free: "Free",
  pro: "Pro",
  enterprise: "Enterprise",
};

const currency = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const shortDate = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function useAccountColumns(): ColumnDef<Account>[] {
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
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 32,
      },
      {
        accessorKey: "customer",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Customer" />
        ),
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium">{row.original.customer}</span>
            <span className="text-muted-foreground text-xs">
              {row.original.email}
            </span>
          </div>
        ),
        enableColumnFilter: true,
        meta: {
          label: "Customer",
          placeholder: "Search customer…",
          variant: "text",
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          const tone =
            status === "active"
              ? "default"
              : status === "past_due"
                ? "destructive"
                : "secondary";
          return <Badge variant={tone}>{STATUS_LABELS[status]}</Badge>;
        },
        enableColumnFilter: true,
        meta: {
          label: "Status",
          variant: "multiSelect",
          options: STATUSES.map((value) => ({
            label: STATUS_LABELS[value],
            value,
          })),
        },
      },
      {
        accessorKey: "plan",
        header: "Plan",
        cell: ({ row }) => PLAN_LABELS[row.original.plan],
        enableColumnFilter: true,
        meta: {
          label: "Plan",
          variant: "select",
          options: PLANS.map((value) => ({ label: PLAN_LABELS[value], value })),
        },
      },
      {
        accessorKey: "mrr",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="MRR" />
        ),
        cell: ({ row }) => currency.format(row.original.mrr),
        enableColumnFilter: true,
        meta: { label: "MRR", variant: "range", range: [0, 1500], unit: "$" },
      },
      {
        accessorKey: "seats",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Seats" />
        ),
        cell: ({ row }) => (
          <span className="tabular-nums">{row.original.seats}</span>
        ),
      },
      {
        accessorKey: "signedUp",
        header: "Signed up",
        cell: ({ row }) => shortDate.format(row.original.signedUp),
        enableColumnFilter: true,
        meta: { label: "Signed up", variant: "date" },
      },
    ],
    [],
  );
}

function AccountsTable() {
  const columns = useAccountColumns();
  const { table } = useDataTable({
    data: DATA,
    columns,
    getRowId: (row) => row.id,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 8 },
    },
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}

export default function DashboardSeven() {
  return (
    <NuqsAdapter>
      <section
        data-slot="data-table-block"
        className="mx-auto w-full max-w-6xl p-4 sm:p-6"
      >
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-1">
            <h2 className="font-semibold text-xl tracking-tight">Accounts</h2>
            <p className="text-muted-foreground text-sm">
              Filter, sort and page through {DATA.length} accounts. The view
              lives in the URL, so any filtered, sorted page is a shareable
              link.
            </p>
          </div>
          <Badge variant="secondary" className="font-normal">
            {DATA.length} total
          </Badge>
        </div>
        <AccountsTable />
      </section>
    </NuqsAdapter>
  );
}
