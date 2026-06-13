import type { Metadata } from "next"

import { AxionLanding } from "./axion-landing"

export const metadata: Metadata = {
  // Standalone brand page — keep its own title instead of the site template.
  title: { absolute: "Axion Studio" },
  description:
    "Axion Studio crafts digital experiences for brands ready to dominate their category online.",
}

export default function AxionPage() {
  return <AxionLanding />
}
