import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { RegistryDemo } from "@/registry/hirael/registry-demos";
import {
  REGISTRY,
  REGISTRY_BY_NAME,
  entryCategorySlug,
} from "@/registry/hirael/registry-meta";
import { embedDirScript } from "@/lib/embed";

import { BlockEmbedShell } from "./embed-shell";
import { EmbedStaticMotion } from "./embed-static-motion";

export const dynamicParams = false;

export function generateStaticParams() {
  return REGISTRY.filter((entry) => entry.category === "blocks").map(
    (entry) => ({ category: entryCategorySlug(entry), block: entry.name }),
  );
}

export const metadata: Metadata = { robots: { index: false } };

export default async function BlockEmbedRoute({
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

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: embedDirScript() }} />
      <BlockEmbedShell demoNotice={entry.blockKind === "login"}>
        <EmbedStaticMotion>
          <RegistryDemo name={entry.name} />
        </EmbedStaticMotion>
      </BlockEmbedShell>
    </>
  );
}
