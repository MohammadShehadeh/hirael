"use client";

import { copyPageMarkdown, type CopyPageInput } from "@/lib/copy-page";
import { CopyButton } from "@/registry/hirael/components/copy-button";

/**
 * "Copy page" — hands the whole detail page (description, install command,
 * usage, examples, source, API) to the clipboard as one Markdown document,
 * ready to paste into an AI agent or notes. Renders as a ghost toolbar button
 * matching its Source / Report issue siblings.
 */
export const CopyPageButton = ({
  input,
  className,
}: {
  input: CopyPageInput;
  className?: string;
}) => {
  return (
    <CopyButton
      value={copyPageMarkdown(input)}
      size="sm"
      variant="ghost"
      aria-label="Copy this page as Markdown"
      title="Copy this page as Markdown"
      className={className}
    >
      Copy page
    </CopyButton>
  );
};
