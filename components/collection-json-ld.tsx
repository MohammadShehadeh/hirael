import type { Crumb } from '@/components/breadcrumbs';
import { JsonLd } from '@/components/json-ld';
import { breadcrumbJsonLd, collectionJsonLd } from '@/lib/seo';
import type { RegistryEntryMeta } from '@/registry/hirael/registry-meta';

export interface CollectionJsonLdProps {
  id: string;
  path: string;
  name: string;
  description: string;
  entries: RegistryEntryMeta[];
  breadcrumb?: Crumb[];
}

// Server component on purpose: the payload must be in the exported HTML for crawlers that run no JavaScript.
export const CollectionJsonLd = ({ id, path, name, description, entries, breadcrumb }: CollectionJsonLdProps) => {
  const collection = collectionJsonLd({ path, name, description, entries });
  const crumbs = breadcrumb?.map((crumb) => ({ name: crumb.label, path: crumb.href ?? path }));

  return <JsonLd id={`jsonld-${id}`} data={crumbs ? [breadcrumbJsonLd(crumbs), collection] : [collection]} />;
};
