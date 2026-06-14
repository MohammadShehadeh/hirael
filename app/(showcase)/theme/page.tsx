import type { Metadata } from "next";

import { SITE } from "@/lib/site";
import { ThemePlayground } from "./playground";

const THEME_DESCRIPTION =
  "Preview every Hirael component against your own theme. Paste CSS variables, pick a preset, and see the registry render live.";

export const metadata: Metadata = {
  title: "Theme playground",
  description: THEME_DESCRIPTION,
  alternates: {
    canonical: "/theme",
  },
  openGraph: {
    type: "website",
    url: `${SITE.url}/theme`,
    siteName: SITE.name,
    title: `Theme playground | ${SITE.name}`,
    description: THEME_DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `Theme playground | ${SITE.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Theme playground | ${SITE.name}`,
    description: THEME_DESCRIPTION,
    images: ["/opengraph-image"],
  },
};

export default function ThemePage() {
  return <ThemePlayground />;
}
