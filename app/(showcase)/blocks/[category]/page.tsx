import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { CategoryPage } from "@/components/showcase/category-page";
import {
  CATEGORY_BY_SLUG,
  CATEGORY_REGISTRY,
} from "@/components/showcase/block-categories";
import { SITE } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORY_REGISTRY.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const meta = CATEGORY_BY_SLUG[category];
  if (!meta) return {};
  const title = `${meta.title} blocks`;
  const url = `${SITE.url}/blocks/${meta.slug}`;
  return {
    title,
    description: meta.description,
    alternates: {
      canonical: `/blocks/${meta.slug}`,
    },
    openGraph: {
      type: "website",
      url,
      siteName: SITE.name,
      title: `${title} - ${SITE.name}`,
      description: meta.description,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: `${title} - ${SITE.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - ${SITE.name}`,
      description: meta.description,
      images: ["/opengraph-image"],
    },
  };
}

export default async function BlockCategoryRoute({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const meta = CATEGORY_BY_SLUG[category];
  if (!meta) notFound();
  return <CategoryPage category={meta} />;
}
