import type { ReactNode } from "react";
import Link from "next/link";

/**
 * Background wrapper for statically exported block embeds; a plain server
 * wrapper since reading direction is set pre-paint in `lib/embed.ts`.
 *
 * `demoNotice` renders a banner marking the form a demo. It's in the static
 * HTML but hidden under `html[data-framed]`, so only direct visits (including
 * Safe Browsing's crawler) see it: auth embeds are bare login forms on a real
 * URL, which Google's phishing classifier flags without the notice.
 */
export const BlockEmbedShell = ({
  children,
  demoNotice = false,
}: {
  children: ReactNode;
  demoNotice?: boolean;
}) => {
  return (
    <div data-embed-shell className="min-h-svh bg-background">
      {demoNotice && (
        <div
          role="note"
          className="fixed inset-x-0 top-0 z-50 border-b border-border bg-card px-4 py-2 text-center text-xs text-muted-foreground [[data-framed]_&]:hidden"
        >
          Demo from the{" "}
          <Link
            href="/"
            target="_top"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Hirael
          </Link>{" "}
          component library. This form doesn&apos;t submit; don&apos;t enter
          real credentials.
        </div>
      )}
      {children}
    </div>
  );
};
