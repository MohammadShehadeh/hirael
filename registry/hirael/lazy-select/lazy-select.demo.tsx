"use client";

import * as React from "react";

import { Label } from "@/registry/hirael/ui/label";
import {
  LazySelect,
  LazySelectContent,
  LazySelectTrigger,
  useLazySelectOptions,
  type LazyPage,
} from "@/registry/hirael/ui/lazy-select";

type User = { id: string; name: string };

const ALL_USERS: User[] = Array.from({ length: 137 }, (_, i) => ({
  id: `u-${i + 1}`,
  name: `${
    [
      "Ava",
      "Liam",
      "Noah",
      "Mia",
      "Zoe",
      "Ezra",
      "Iris",
      "Omar",
      "Lena",
      "Kai",
    ][i % 10]
  } ${
    ["Khan", "Reyes", "Okafor", "Park", "Vance", "Sato", "Diallo", "Costa"][
      i % 8
    ]
  } #${i + 1}`,
}));

const PAGE_SIZE = 20;

// Stand-in for a paginated, searchable API endpoint.
async function fetchUsers({
  query,
  page,
}: {
  query: string;
  page: number;
}): Promise<LazyPage<User>> {
  await new Promise((r) => setTimeout(r, 450));
  const filtered = query
    ? ALL_USERS.filter((u) =>
        u.name.toLowerCase().includes(query.toLowerCase()),
      )
    : ALL_USERS;
  const start = page * PAGE_SIZE;
  const items = filtered.slice(start, start + PAGE_SIZE);
  return { items, hasMore: start + PAGE_SIZE < filtered.length };
}

export default function LazySelectDemo() {
  const [value, setValue] = React.useState<string | undefined>();
  const [open, setOpen] = React.useState(false);

  const mapUser = React.useCallback(
    (u: User) => ({ value: u.id, label: u.name }),
    [],
  );

  // `enabled: open` defers all network work until the dropdown is opened —
  // the "lazy" half. `loadMore` appends the next page on scroll — the
  // "autocomplete + paginate" half.
  const { setQuery, options, loading, loadingMore, hasMore, loadMore } =
    useLazySelectOptions(fetchUsers, mapUser, { enabled: open });

  return (
    <div className="grid w-full max-w-md gap-2">
      <Label>Assignee · lazy-loaded on open, paged on scroll</Label>
      <LazySelect
        value={value}
        onValueChange={setValue}
        open={open}
        onOpenChange={setOpen}
        options={options}
        loading={loading}
        loadingMore={loadingMore}
        hasMore={hasMore}
        onSearchChange={setQuery}
        onLoadMore={loadMore}
      >
        <LazySelectTrigger placeholder="Select a teammate…" />
        <LazySelectContent
          searchPlaceholder="Search teammates…"
          emptyMessage="No teammates match."
          loadingMessage="Fetching teammates…"
          loadingMoreMessage="Loading more…"
          endMessage="End of list"
        />
      </LazySelect>
      <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
        value = {value ? `"${value}"` : "-"} · loaded = {options.length}
      </p>
    </div>
  );
}
