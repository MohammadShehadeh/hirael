import type { MetadataRoute } from "next";

import { SITE } from "@/lib/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.fullName,
    short_name: SITE.name,
    description: SITE.longDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#0D1117",
    theme_color: "#0D1117",
    categories: ["developer", "design", "productivity"],
    icons: [
      {
        src: "/pwa-icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
