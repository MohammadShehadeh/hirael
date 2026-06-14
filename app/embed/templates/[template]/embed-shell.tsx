import type { ReactNode } from "react";

/**
 * Background wrapper for statically exported template embeds. Reading
 * direction is set on `<html>` before paint by the inline script in
 * `page.tsx` (see `lib/embed.ts`), so this stays a plain server wrapper
 * with no direction state to flip after mount.
 */
export function TemplateEmbedShell({ children }: { children: ReactNode }) {
  return <div className="min-h-svh bg-black">{children}</div>;
}
