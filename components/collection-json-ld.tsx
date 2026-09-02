import type { Crumb } from '@/components/breadcrumbs';
import { JsonLd } from '@/components/json-ld';
import { breadcrumbJsonLd, collectionJsonLd } from '@/lib/seo';
import type { RegistryEntryMeta } from '@/registry/hirael/registry-meta';

/**
 * Structured data for a listing page: the collection, its items in display
 * order, and the trail to it. {@link EntryJsonLd} is the detail-page twin.
 *
 * A server component on purpose — the payload has to be in the exported HTML
 * for a crawler that runs no JavaScript.
 */
export const CollectionJsonLd = ({
  id,
  path,
  name,
  description,
  entries,
  breadcrumb,
}: {
  id: string;
  path: string;
  name: string;
  description: string;
  entries: RegistryEntryMeta[];
  /** The crumbs the page renders. Omitted on the indexes, which show none. */
  breadcrumb?: Crumb[];
}) => {
  const collection = collectionJsonLd({ path, name, description, entries });
  const crumbs = breadcrumb?.map((crumb) => ({ name: crumb.label, path: crumb.href ?? path }));

  return <JsonLd id={`jsonld-${id}`} data={crumbs ? [breadcrumbJsonLd(crumbs), collection] : [collection]} />;
};
