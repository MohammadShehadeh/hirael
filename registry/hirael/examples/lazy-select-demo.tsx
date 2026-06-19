"use client";

import * as React from "react";

import { useT } from "@/lib/demo-locale";
import { Label } from "@/registry/hirael/ui/label";
import {
  LazySelect,
  LazySelectContent,
  LazySelectTrigger,
  useLazySelectOptions,
  type LazyPage,
} from "@/registry/hirael/ui/lazy-select";

type User = { id: string; name: string };

const PAGE_SIZE = 20;

const FIRST_NAMES = {
  en: [
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
  ],
  ar: [
    "سارة",
    "خالد",
    "ليلى",
    "عمر",
    "نور",
    "يوسف",
    "فاطمة",
    "أحمد",
    "هدى",
    "زيد",
  ],
};
const LAST_NAMES = {
  en: ["Khan", "Reyes", "Okafor", "Park", "Vance", "Sato", "Diallo", "Costa"],
  ar: ["خان", "رييس", "أوكافور", "بارك", "فانس", "ساتو", "ديالو", "كوستا"],
};

export default function LazySelectDemo() {
  const t = useT();

  const firstNames = t(FIRST_NAMES);
  const lastNames = t(LAST_NAMES);

  const ALL_USERS: User[] = React.useMemo(
    () =>
      Array.from({ length: 137 }, (_, i) => ({
        id: `u-${i + 1}`,
        name: `${firstNames[i % 10]} ${lastNames[i % 8]} #${i + 1}`,
      })),
    [firstNames, lastNames],
  );

  const fetchUsers = React.useCallback(
    async ({
      query,
      page,
    }: {
      query: string;
      page: number;
    }): Promise<LazyPage<User>> => {
      await new Promise((r) => setTimeout(r, 450));
      const filtered = query
        ? ALL_USERS.filter((u) =>
            u.name.toLowerCase().includes(query.toLowerCase()),
          )
        : ALL_USERS;
      const start = page * PAGE_SIZE;
      const items = filtered.slice(start, start + PAGE_SIZE);
      return { items, hasMore: start + PAGE_SIZE < filtered.length };
    },
    [ALL_USERS],
  );

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
      <Label>
        {t({
          en: "Assignee · lazy-loaded on open, paged on scroll",
          ar: "المسؤول · يُحمّل عند الفتح، ويُقسّم صفحات عند التمرير",
        })}
      </Label>
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
        <LazySelectTrigger
          placeholder={t({ en: "Select a teammate…", ar: "اختر زميلًا…" })}
        />
        <LazySelectContent
          searchPlaceholder={t({
            en: "Search teammates…",
            ar: "ابحث عن زملاء…",
          })}
          emptyMessage={t({
            en: "No teammates match.",
            ar: "لا زملاء مطابقون.",
          })}
          loadingMessage={t({
            en: "Fetching teammates…",
            ar: "جارٍ جلب الزملاء…",
          })}
          loadingMoreMessage={t({
            en: "Loading more…",
            ar: "جارٍ تحميل المزيد…",
          })}
          endMessage={t({ en: "End of list", ar: "نهاية القائمة" })}
        />
      </LazySelect>
      <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
        value = {value ? `"${value}"` : "-"} · loaded = {options.length}
      </p>
    </div>
  );
}
