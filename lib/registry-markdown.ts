import { forConsumer } from '@/lib/consumer-source';
import { buildUsageCode, installTarget } from '@/lib/registry-usage';
import {
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

interface MarkdownExample {
  title: string;
  code: string;
}

/** A file the examples import that installing the item doesn't bring, labelled with where it goes. */
export interface MarkdownExampleFile {
  label: string;
  code: string;
}

export interface RegistryMarkdownInput {
  entry: RegistryEntryMeta;
  base: RegistryBase;
  origin: string;
  baseLabel: string;
  sources: Record<string, string>;
  examples: MarkdownExample[];
  exampleFiles?: MarkdownExampleFile[];
  api: MarkdownApiPart[] | null;
}

const DEMO_LOCALE_IMPORT = '@/lib/demo-locale';

const codeFence = (code: string, lang = 'tsx') => ['```' + lang, code.trim(), '```'];

const cell = (value: string) => value.replace(/\|/g, '\|').replace(/\s+/g, ' ').trim();

const yaml = (key: string, value: string) => `${key}: ${JSON.stringify(value)}`;

const exampleFilesSection = (files: MarkdownExampleFile[]): string[] => {
  if (files.length === 0) return [];

  return [
    '### Files the examples also use',
    '',
    ...files.flatMap((file) => [
      `#### \`${file.label}\``,
      '',
      ...codeFence(forConsumer(file.code), file.label.endsWith('.tsx') ? 'tsx' : 'ts'),
      '',
    ]),
  ];
};

const headerSection = (entry: RegistryEntryMeta, baseLabel: string, pageUrl: string, itemUrl: string): string[] => [
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

const examplesSection = (
  examples: MarkdownExample[],
  exampleFiles: MarkdownExampleFile[],
  isComposite: boolean,
): string[] => {
  if (examples.length === 0 && !isComposite) return [];
  if (examples.length === 0) {
    return [
      '## Example',
      '',
      'This item is a whole section or page. Compose it from the source below, or open the live preview.',
      '',
    ];
  }

  const out = [examples.length > 1 ? '## Examples' : '## Example', ''];
  if (examples.some((example) => example.code.includes(DEMO_LOCALE_IMPORT))) {
    out.push(
      `The demos below read their copy through \`useT\` from \`${DEMO_LOCALE_IMPORT}\`, a helper that exists only on ` +
        'this site so the previews can switch to Arabic. Copy it from below, or replace `t({ en, ar })` with the English string.',
      '',
    );
  }
  for (const example of examples) {
    if (examples.length > 1) out.push(`### ${example.title}`, '');
    out.push(...codeFence(forConsumer(example.code)), '');
  }

  return [...out, ...exampleFilesSection(exampleFiles)];
};

const sourceSection = (files: NonNullable<RegistryEntryMeta['files']>, sources: Record<string, string>): string[] => {
  const shipped = files.filter((file) => sources[file.path]);
  if (shipped.length === 0) return [];

  return [
    '## Source',
    '',
    ...shipped.flatMap((file) => [
      `### \`${installTarget(file)}\``,
      '',
      ...codeFence(forConsumer(sources[file.path])),
      '',
    ]),
  ];
};

const propRow = (prop: MarkdownApiProp): string => {
  const columns = [
    `\`${prop.name}\`${prop.required ? '\*' : ''}`,
    `\`${cell(prop.type)}\``,
    prop.default ? `\`${cell(prop.default)}\`` : 'none',
    cell(prop.description ?? ''),
  ];

  return `| ${columns.join(' | ')} |`;
};

const apiPartSection = (part: MarkdownApiPart): string[] => {
  const out = [`### \`<${part.name} />\``, ''];
  if (part.extendsNative) out.push("Also accepts the underlying element's own props.", '');
  if (part.props.length > 0) {
    out.push('| Prop | Type | Default | Description |', '| --- | --- | --- | --- |', ...part.props.map(propRow), '');
  }

  return out;
};

const dependenciesSection = (entry: RegistryEntryMeta): string[] => {
  const registryDeps = entry.registryDependencies ?? [];
  const npmDeps = entry.dependencies ?? [];
  if (registryDeps.length === 0 && npmDeps.length === 0) return [];

  const out = ['## Dependencies', ''];
  if (registryDeps.length) out.push(`- Registry: ${registryDeps.map((dep) => `\`${dep}\``).join(', ')}`);
  if (npmDeps.length) out.push(`- npm: ${npmDeps.map((dep) => `\`${dep}\``).join(', ')}`);

  return [...out, ''];
};

export const registryMarkdown = ({
  entry,
  base,
  origin,
  baseLabel,
  sources,
  examples,
  exampleFiles = [],
  api,
}: RegistryMarkdownInput): string => {
  const isComposite = entry.category === 'blocks' || entry.category === 'templates';
  const pageUrl = `${origin}${entryHref(entry)}`;
  const itemUrl = `${origin}${registryItemPath(base, entry.name)}`;
  const files = entry.files ?? [];
  const usage = buildUsageCode(files, (path) => sources[path], api);

  const out = [
    ...headerSection(entry, baseLabel, pageUrl, itemUrl),
    ...(usage ? ['## Usage', '', ...codeFence(usage), ''] : []),
    ...examplesSection(examples, exampleFiles, isComposite),
    ...sourceSection(files, sources),
    ...(api?.length ? ['## API', '', ...api.flatMap(apiPartSection)] : []),
    ...dependenciesSection(entry),
  ];

  return `${out
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()}\n`;
};
