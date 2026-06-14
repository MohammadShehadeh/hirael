import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ComponentCategoryPage } from "@/components/showcase/component-category-page";
import { SITE } from "@/lib/site";
import {
  CATEGORY_LABELS,
  COMPONENT_CATEGORY_DESCRIPTIONS,
  COMPONENT_CATEGORY_ORDER,
} from "@/registry/hirael/registry-meta";

type ComponentCategory = (typeof COMPONENT_CATEGORY_ORDER)[number];

export const dynamicParams = false;

function isComponentCategory(value: string): value is ComponentCategory {
  return (COMPONENT_CATEGORY_ORDER as readonly string[]).includes(value);
}

export function generateStaticParams() {
  return COMPONENT_CATEGORY_ORDER.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  if (!isComponentCategory(category)) return {};
  const label = CATEGORY_LABELS[category];
  const description = COMPONENT_CATEGORY_DESCRIPTIONS[category];
  const title = `${label} components`;
  const url = `${SITE.url}/components/${category}`;
  return {
    title,
    description,
    alternates: {
      canonical: `/components/${category}`,
    },
    openGraph: {
      type: "website",
      url,
      siteName: SITE.name,
      title: `${title} | ${SITE.name}`,
      description,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: `${title} | ${SITE.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE.name}`,
      description,
      images: ["/opengraph-image"],
    },
  };
}

export default async function ComponentCategoryRoute({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!isComponentCategory(category)) notFound();
  return <ComponentCategoryPage category={category} />;
}
