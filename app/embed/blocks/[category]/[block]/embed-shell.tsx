import type { ReactNode } from "react";
import Link from "next/link";

/**
 * Background wrapper for statically exported block embeds. Reading
 * direction is set on `<html>` before paint by the inline script in
 * `page.tsx` (see `lib/embed.ts`), so this stays a plain server wrapper
 * with no direction state to flip after mount.
 *
 * `demoNotice` renders a banner telling visitors the form is a demo. It is
 * always in the static HTML but hidden pre-paint when the page is framed
 * by the showcase (`html[data-framed]`, set in `lib/embed.ts`), so only
 * direct visits — including Safe Browsing's crawler — see it. Auth block
 * embeds are bare full-page login forms at a hirael.com URL; without the
 * notice Google's phishing classifier can flag them as credential
 * harvesting (Search Console: "Possible phishing detected on user login").
 */
export function BlockEmbedShell({
  children,
  demoNotice = false,
}: {
  children: ReactNode;
  demoNotice?: boolean;
}) {
  return (
    <div className="min-h-svh bg-background">
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
          component library. This form doesn&apos;t submit — don&apos;t enter
          real credentials.
        </div>
      )}
      {children}
    </div>
  );
}
