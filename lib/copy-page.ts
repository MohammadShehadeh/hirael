import type {
  ApiPart,
  ExampleEntry,
  SourceFile,
} from "@/components/component-page";
import { getShadcnAddCommand } from "@/lib/package-managers";
import { SITE } from "@/lib/site";

export interface CopyPageInput {
  name: string;
  title: string;
  description: string;
  /** Canonical page URL, e.g. https://hirael.com/components/forms/combobox */
  url: string;
  isComposite: boolean;
  usage?: SourceFile | null;
  examples?: ExampleEntry[];
  api?: ApiPart[] | null;
  source: Record<string, SourceFile>;
  files: { path: string }[];}

/**
 * Assembles the detail page as a single Markdown document — the payload behind
 * the "Copy page" control. Everything it needs is already client-side (the
 * route passes pre-highlighted sources as props), so no build step or extra
 * fetch is involved.
 */
export const copyPageMarkdown = ({
  name,
  title,
  description,
  url,
  isComposite,
  usage,
  examples,
  api,
  source,
  files,
}: CopyPageInput): string => {
  const install = getShadcnAddCommand(
    "npm",
    `${SITE.registry.origin}/r/${name}.json`,
  );
  const out: string[] = [];

  out.push(`# ${title}`, "", `> ${description}`, "");
  if (isComposite) {
    out.push(
      `Live preview: ${url}`,
      "",
    );
  }
  out.push("## Installation", "", "```bash", install, "```", "");

  if (!isComposite && usage) {
    out.push("## Usage", "", "```tsx", usage.code.trim(), "```", "");
  }

  const exampleList = examples ?? [];
  if (exampleList.length > 0) {
    out.push(isComposite ? "## Examples" : "## Example");
    for (const example of exampleList) {
      if (!example.source) continue;
      if (exampleList.length > 1) out.push("", `### ${example.title}`);
      out.push("", "```tsx", example.source.code.trim(), "```");
    }
    out.push("");
  }
  if (isComposite && exampleList.length === 0) {
    out.push(
      "This item is a composite block/template; compose it from its source below.",
      "",
    );
  }

  const fileEntries = files
    .map((f) => [f.path, source[f.path]] as const)
    .filter(([, file]) => file != null);
  if (fileEntries.length > 0) {
    out.push("## Source");
    for (const [path, file] of fileEntries) {
      out.push("", `### \`${path}\``, "", "```tsx", file.code.trim(), "```");
    }
    out.push("");
  }

  if (!isComposite && api?.length) {
    out.push("## API");
    for (const part of api) {
      out.push(
        "",
        `### \`<${part.name} />\``,
        "",
      );
      if (part.extendsNative) {
        out.push("Also accepts the native element's props.");
      }
      if (part.props.length > 0) {
        out.push(
          "",
          "| Prop | Type | Default | Description |",
          "| --- | --- | --- | --- |",
        );
        for (const prop of part.props) {
          const cells = [
            `\`${prop.name}\`${prop.required ? "\\*" : ""}`,
            `\`${prop.type}\``,
            prop.default ? `\`${prop.default}\`` : "—",
            (prop.description ?? "").replaceAll("|", "\\|"),
          ];
          out.push(`| ${cells.join(" | ")} |`);
        }
      }
    }
    out.push("");
  }

  return `${out.join("\n").trim()}\n`;
};
