import type * as React from "react";
import { Star } from "lucide-react";

import { SITE } from "@/lib/site";
import { Button } from "@/registry/hirael/ui/button";

export function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 2C6.48 2 2 6.58 2 12.22c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.7-2.78.61-3.37-1.36-3.37-1.36-.45-1.18-1.11-1.49-1.11-1.49-.91-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.9 1.56 2.35 1.11 2.92.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.13-4.55-5.04 0-1.11.39-2.02 1.03-2.74-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.04A9.4 9.4 0 0 1 12 7.04c.85 0 1.7.12 2.5.34 1.9-1.31 2.74-1.04 2.74-1.04.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.74 0 3.92-2.34 4.78-4.57 5.03.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.04 10.04 0 0 0 22 12.22C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

// Compact star count: 1234 -> "1.2k", 12345 -> "12k".
function formatStars(n: number): string {
  if (n < 1000) return `${n}`;
  return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
}

/**
 * Header GitHub link — icon-only, with the build-time star count appended when
 * available. Shared by the marketing `SiteHeader` and the showcase topbar so
 * the control reads identically across every page.
 */
export function GithubLink({ stars }: { stars?: number | null }) {
  return (
    <Button variant="ghost" asChild>
      <a
        href={SITE.githubRepoUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={`Star ${SITE.name} on GitHub, ${stars?.toLocaleString() ?? 0} stars`}
      >
        <GithubIcon />
        {stars ? (
          <span className="inline-flex items-center gap-1 tabular-nums">
            <Star className="size-3 fill-current" />
            {formatStars(stars)}
          </span>
        ) : null}
      </a>
    </Button>
  );
}
