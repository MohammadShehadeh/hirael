import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { RegistryDemo } from "@/registry/hirael/registry-demos";
import { REGISTRY, REGISTRY_BY_NAME } from "@/registry/hirael/registry-meta";
import { embedDirScript } from "@/lib/embed";

import { TemplateEmbedShell } from "./embed-shell";

export const dynamicParams = false;

export function generateStaticParams() {
  return REGISTRY.filter((entry) => entry.category === "templates").map(
    (entry) => ({ template: entry.name }),
  );
}

export const metadata: Metadata = { robots: { index: false } };

export default async function TemplateEmbedRoute({
  params,
}: {
  params: Promise<{ template: string }>;
}) {
  const { template } = await params;
  const entry = REGISTRY_BY_NAME[template];
  if (!entry || entry.category !== "templates") notFound();
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: embedDirScript() }} />
      <TemplateEmbedShell>
        <RegistryDemo name={entry.name} />
      </TemplateEmbedShell>
    </>
  );
}
