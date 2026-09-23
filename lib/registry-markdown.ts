import { buildUsageCode, installTarget } from '@/lib/registry-usage';
import {
  DISTRIBUTION_ONLY,
  REGISTRY,
  entryHref,
  registryItemPath,
  type RegistryBase,
  type RegistryEntryMeta,
} from '@/registry/hirael/registry-meta';

export interface MarkdownApiProp {
  name: string;
  type: string;
  required: boolean;
  default: string | null;
  description: string | null;
}

export interface MarkdownApiPart {
  name: string;
  props: MarkdownApiProp[];
  extendsNative: boolean;
}

export interface RegistryMarkdownInput {
  entry: RegistryEntryMeta;
  base: RegistryBase;
  origin: string;
  baseLabel: string;
  sources: Record<string, string>;
  examples: { title: string; code: string }[];
  api: MarkdownApiPart[] | null;
}

const CONSUMER_IMPORTS = new Map<string, string>(
  [...REGISTRY, ...DISTRIBUTION_ONLY].flatMap((entry) =>
    (entry.files ?? []).map(
      (file) => [file.path.replace(/\.tsx?$/, ''), `@/${installTarget(file).replace(/\.tsx?$/, '')}`] as const,
    ),
  ),
);

const BASE_IMPORT = /@\/registry\/hirael\/bases\/[a-z]+\/([\w./-]+)/g;

// The CLI rewrites imports on install; a page that is only read has to do it here.
const forConsumer = (code: string): string =>
  code.replace(BASE_IMPORT, (_match, file: string) => {
    const mapped = CONSUMER_IMPORTS.get(file);
    if (mapped) return mapped;

    return /^(?:ui|components)\//.test(file) ? `@/components/${file.replace(/^components\//, '')}` : `@/${file}`;
  });

const DEMO_LOCALE_IMPORT = '@/lib/demo-locale';

const codeFence = (code: string, lang = 'tsx') => ['```' + lang, code.trim(), '```'];

const cell = (value: string) => value.replace(/\|/g, '\|').replace(/\s+/g, ' ').trim();

const yaml = (key: string, value: string) => `${key}: ${JSON.stringify(value)}`;

export const registryMarkdown = ({
  entry,
  base,
  origin,
  baseLabel,
  sources,
  examples,
  api,
}: RegistryMarkdownInput): string => {
  const isComposite = entry.category === 'blocks' || entry.category === 'templates';
  const pageUrl = `${origin}${entryHref(entry)}`;
  const itemUrl = `${origin}${registryItemPath(base, entry.name)}`;
  const files = entry.files ?? [];
  const usage = buildUsageCode(files, (path) => sources[path], api);

  const out: string[] = [
    '---',
    yaml('title', entry.title),
    yaml('description', entry.description),
    yaml('collection', entry.blockKind ? `${entry.category}/${entry.blockKind}` : entry.category),
    yaml('base', baseLabel),
    yaml('documentation', pageUrl),
    yaml('registryItem', itemUrl),
    yaml('license', 'MIT'),
    '---',
    '',
    `# ${entry.title}`,
    '',
    `> ${entry.description}`,
    '',
    `Built on ${baseLabel}. Live preview: ${pageUrl}`,
    '',
    '## Installation',
    '',
    ...codeFence(`npx shadcn@latest add ${itemUrl}`, 'bash'),
    '',
  ];

  if (usage) {
    out.push('## Usage', '', ...codeFence(usage), '');
  }

  if (examples.length > 0) {
    out.push(examples.length > 1 ? '## Examples' : '## Example', '');
    if (examples.some((example) => example.code.includes(DEMO_LOCALE_IMPORT))) {
      out.push(
        `The demos below read their copy through \`useT\` from \`${DEMO_LOCALE_IMPORT}\`, a helper that exists only on ` +
          'this site so the previews can switch to Arabic. Replace `t({ en, ar })` with the English string.',
        '',
      );
    }
    for (const example of examples) {
      if (examples.length > 1) out.push(`### ${example.title}`, '');
      out.push(...codeFence(forConsumer(example.code)), '');
    }
  } else if (isComposite) {
    out.push(
      '## Example',
      '',
      'This item is a whole section or page. Compose it from the source below, or open the live preview.',
      '',
    );
  }

  const shipped = files.filter((file) => sources[file.path]);
  if (shipped.length > 0) {
    out.push('## Source', '');
    for (const file of shipped) {
      out.push(`### \`${installTarget(file)}\``, '', ...codeFence(forConsumer(sources[file.path])), '');
    }
  }

  if (api?.length) {
    out.push('## API', '');
    for (const part of api) {
      out.push(`### \`<${part.name} />\``, '');
      if (part.extendsNative) out.push("Also accepts the underlying element's own props.", '');
      if (part.props.length > 0) {
        out.push('| Prop | Type | Default | Description |', '| --- | --- | --- | --- |');
        for (const prop of part.props) {
          const columns = [
            `\`${prop.name}\`${prop.required ? '\*' : ''}`,
            `\`${cell(prop.type)}\``,
            prop.default ? `\`${cell(prop.default)}\`` : 'none',
            cell(prop.description ?? ''),
          ];
          out.push(`| ${columns.join(' | ')} |`);
        }
        out.push('');
      }
    }
  }

  const registryDeps = entry.registryDependencies ?? [];
  const npmDeps = entry.dependencies ?? [];
  if (registryDeps.length || npmDeps.length) {
    out.push('## Dependencies', '');
    if (registryDeps.length) out.push(`- Registry: ${registryDeps.map((dep) => `\`${dep}\``).join(', ')}`);
    if (npmDeps.length) out.push(`- npm: ${npmDeps.map((dep) => `\`${dep}\``).join(', ')}`);
    out.push('');
  }

  return `${out
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()}\n`;
};
