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
import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/registry/hirael/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/hirael/ui/card";
import { Checkbox } from "@/registry/hirael/ui/checkbox";
import { DataTable } from "@/registry/hirael/ui/data-table";
import { DataTableColumnHeader } from "@/registry/hirael/ui/data-table-column-header";
import { DataTableToolbar } from "@/registry/hirael/ui/data-table-toolbar";
import { getSortingStateParser } from "@/registry/hirael/ui/data-table-parsers";
import { useDataTableClient } from "@/registry/hirael/ui/data-table-client";
import { useDataTable } from "@/registry/hirael/ui/use-data-table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/hirael/ui/tabs";

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

function useAccountColumns(filterable: Set<string>): ColumnDef<Account>[] {
  return React.useMemo<ColumnDef<Account>[]>(() => {
    const canFilter = (id: string) => filterable.has(id);
    return [
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
        enableColumnFilter: canFilter("customer"),
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
        enableColumnFilter: canFilter("status"),
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
        cell: ({ row }) => (
          <span className="capitalize">{PLAN_LABELS[row.original.plan]}</span>
        ),
        enableColumnFilter: canFilter("plan"),
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
        enableColumnFilter: canFilter("mrr"),
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
        enableColumnFilter: canFilter("signedUp"),
        meta: { label: "Signed up", variant: "date" },
      },
    ];
  }, [filterable]);
}

const CLIENT_FILTERS = new Set([
  "customer",
  "status",
  "plan",
  "mrr",
  "signedUp",
]);
const SERVER_FILTERS = new Set(["status", "plan"]);
const SERVER_COLUMN_IDS = [
  "customer",
  "status",
  "plan",
  "mrr",
  "seats",
  "signedUp",
];

function ClientAccountsTable() {
  const columns = useAccountColumns(CLIENT_FILTERS);
  const { table } = useDataTableClient({
    data: DATA,
    columns,
    getRowId: (row) => row.id,
    initialState: { pagination: { pageIndex: 0, pageSize: 8 } },
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}

function queryAccounts(
  all: Account[],
  q: {
    page: number;
    perPage: number;
    sort: { id: string; desc: boolean }[];
    status: string[] | null;
    plan: string[] | null;
  },
) {
  let rows = all;
  if (q.status?.length) rows = rows.filter((r) => q.status?.includes(r.status));
  if (q.plan?.length) rows = rows.filter((r) => q.plan?.includes(r.plan));

  const sort = q.sort[0];
  if (sort) {
    rows = [...rows].sort((a, b) => {
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

function ServerAccountsTable() {
  const columns = useAccountColumns(SERVER_FILTERS);

  const [{ page, perPage, status, plan }] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(8),
    status: parseAsArrayOf(parseAsString),
    plan: parseAsArrayOf(parseAsString),
  });
  const [sort] = useQueryState(
    "sort",
    getSortingStateParser<Account>(new Set(SERVER_COLUMN_IDS)).withDefault([]),
  );

  const { rows, pageCount } = React.useMemo(
    () => queryAccounts(DATA, { page, perPage, sort, status, plan }),
    [page, perPage, sort, status, plan],
  );

  const { table } = useDataTable({
    data: rows,
    columns,
    pageCount,
    getRowId: (row) => row.id,
    initialState: { pagination: { pageIndex: 0, pageSize: 8 } },
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
        <Card className="gap-0 overflow-hidden p-0">
          <CardHeader className="border-b p-6">
            <CardTitle className="text-lg">Accounts</CardTitle>
            <CardDescription>
              {DATA.length} accounts. Filter, sort and page through the data —
              client-side in memory, or server-driven with the query in the URL.
            </CardDescription>
          </CardHeader>
          <Tabs defaultValue="client" className="gap-0">
            <div className="border-b px-6 pt-4">
              <TabsList>
                <TabsTrigger value="client">Client-side</TabsTrigger>
                <TabsTrigger value="server">Server-driven</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="client" className="p-6">
              <ClientAccountsTable />
            </TabsContent>
            <TabsContent value="server" className="p-6">
              <ServerAccountsTable />
            </TabsContent>
          </Tabs>
        </Card>
      </section>
    </NuqsAdapter>
  );
}
