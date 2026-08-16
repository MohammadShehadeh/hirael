import type { Metadata } from "next";

import { ChangelogView } from "@/components/changelog-view";
import { getChangelog } from "@/lib/changelog";
import { getRepoStars } from "@/lib/github";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Changelog",
  description: `Release notes for ${SITE.name}: new components, blocks, fixes, and polish.`,
  alternates: { canonical: "/changelog" },
};

export default async function ChangelogPage() {
  const [changelog, stars] = await Promise.all([
    getChangelog(),
    getRepoStars(),
  ]);
  return <ChangelogView {...changelog} stars={stars} />;
}
