import type { Crumb } from '@/components/breadcrumbs';
import { JsonLd } from '@/components/json-ld';
import { breadcrumbJsonLd, entryJsonLd } from '@/lib/seo';
import { entryHref, type RegistryEntryMeta } from '@/registry/hirael/registry-meta';

export interface EntryJsonLdProps {
  entry: RegistryEntryMeta;
  breadcrumb: Crumb[];
  addedAt?: string;
}

// Stays a server component so the data is in the exported HTML.
export const EntryJsonLd = ({ entry, breadcrumb, addedAt }: EntryJsonLdProps) => {
  const crumbs = breadcrumb.map((crumb) => ({
    name: crumb.label,
    path: crumb.href ?? entryHref(entry),
  }));

  return <JsonLd id={`jsonld-${entry.name}`} data={[breadcrumbJsonLd(crumbs), entryJsonLd(entry, addedAt)]} />;
};
