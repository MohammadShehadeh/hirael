import { SITE } from '@/lib/site';

export interface Sponsor {
  name: string;
  href: string;
  /** Path under `public/`, e.g. `/sponsors/acme.svg`. */
  logo: string;
  /** Monochrome dark logos read on the dark canvas only once inverted. */
  invertOnDark?: boolean;
  /** Set when `logo` is a bare mark, so the name renders beside it. */
  showName?: boolean;
}

export const SPONSOR_URL = 'https://github.com/sponsors/MohammadShehadeh';

/** When empty, the rail shows open slots instead. */
export const SPONSORS: Sponsor[] = [
  {
    name: 'Sahabti',
    href: 'https://sahabti.com/en',
    logo: '/sponsors/sahabti.svg',
    invertOnDark: true,
    showName: true,
  },
];

export const sponsorHref = (href: string) => {
  const url = new URL(href);
  url.searchParams.set('utm_source', SITE.registry.name);
  url.searchParams.set('utm_medium', 'sponsor');
  return url.toString();
};
