import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { CATEGORY_BY_SLUG } from "@/components/showcase/block-categories";
import { ComponentPage } from "@/components/showcase/component-page";
import { loadSource } from "@/lib/registry-source";
import { detailMetadata } from "@/lib/site";
import {
  REGISTRY,
  REGISTRY_BY_NAME,
  entryCategorySlug,
} from "@/registry/hirael/registry-meta";

export const dynamicParams = false;

export function generateStaticParams() {
  return REGISTRY.filter((entry) => entry.category === "blocks").map(
    (entry) => ({ category: entryCategorySlug(entry), block: entry.name }),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; block: string }>;
}): Promise<Metadata> {
  const { category, block } = await params;
  const entry = REGISTRY_BY_NAME[block];
  if (
    !entry ||
    entry.category !== "blocks" ||
    entryCategorySlug(entry) !== category
  )
    return {};
  return detailMetadata(entry, { titleSuffix: "block" });
}

export default async function BlockRoute({
  params,
}: {
  params: Promise<{ category: string; block: string }>;
}) {
  const { category, block } = await params;
  const entry = REGISTRY_BY_NAME[block];
  if (
    !entry ||
    entry.category !== "blocks" ||
    entryCategorySlug(entry) !== category
  )
    notFound();
  const source = await loadSource(entry.files?.map((f) => f.path));
  const meta = CATEGORY_BY_SLUG[category];
  return (
    <ComponentPage
      entry={entry}
      source={source}
      breadcrumb={[
        { label: "Blocks", href: "/blocks" },
        { label: meta?.title ?? category, href: `/blocks/${category}` },
        { label: entry.title },
      ]}
    />
  );
}
