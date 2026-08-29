import type { Crumb } from '@/components/breadcrumbs';
import { JsonLd } from '@/components/json-ld';
import { breadcrumbJsonLd, entryJsonLd } from '@/lib/seo';
import { entryHref, type RegistryEntryMeta } from '@/registry/hirael/registry-meta';

/**
 * Structured data for a detail page: what the item is, and where it sits in
 * the catalog. Takes the same crumb list the header renders, so the trail a
 * search engine reads and the one on screen are one array.
 *
 * A server component on purpose — ComponentPage is a client component, and
 * this has to be in the exported HTML for a crawler that runs no JavaScript.
 */
export const EntryJsonLd = ({
  entry,
  breadcrumb,
  addedAt,
}: {
  entry: RegistryEntryMeta;
  breadcrumb: Crumb[];
  /** Release date from the changelog, when one claims the item. */
  addedAt?: string;
}) => {
  const crumbs = breadcrumb.map((crumb) => ({
    name: crumb.label,
    // The final crumb is the page itself, so it carries no href.
    path: crumb.href ?? entryHref(entry),
  }));

  return <JsonLd id={`jsonld-${entry.name}`} data={[breadcrumbJsonLd(crumbs), entryJsonLd(entry, addedAt)]} />;
};
