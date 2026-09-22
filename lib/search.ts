import { BLOCK_KIND_LABELS, CATEGORY_LABELS, type RegistryEntryMeta } from '@/registry/hirael/registry-meta';

const ALIASES: Record<string, string[]> = {
  modal: ['dialog'],
  popup: ['dialog', 'popover'],
  dropdown: ['select', 'menu', 'combobox'],
  autocomplete: ['combobox'],
  toast: ['notification'],
  loader: ['spinner'],
  loading: ['spinner'],
  upload: ['dropzone', 'file'],
  uploader: ['dropzone', 'file'],
  calendar: ['date'],
  datepicker: ['date'],
  grid: ['masonry'],
  wizard: ['stepper'],
  steps: ['stepper'],
  onboarding: ['tour'],
  shortcut: ['kbd'],
  keyboard: ['kbd'],
  alert: ['callout', 'confirm'],
  banner: ['announcement', 'callout'],
  chip: ['tag'],
  tags: ['tag'],
  stars: ['rating'],
  editor: ['rich', 'text'],
  wysiwyg: ['rich', 'text'],
  login: ['auth', 'sign'],
  signin: ['auth', 'sign'],
  signup: ['auth', 'sign'],
  landing: ['hero', 'template'],
  chart: ['sparkline', 'heatmap', 'stat', 'metric'],
  graph: ['sparkline', 'heatmap'],
  kpi: ['stat', 'metric'],
  drag: ['sortable', 'kanban'],
  dnd: ['sortable', 'kanban'],
  carousel: ['marquee', 'lightbox', 'gallery'],
  slider: ['range', 'compare'],
  otp: ['input'],
  navbar: ['header'],
  nav: ['header', 'navigation'],
  sidebar: ['shell', 'split'],
  cmdk: ['command'],
  search: ['command'],
};

const STOPWORDS = new Set(['a', 'an', 'and', 'the', 'with', 'for', 'of', 'to', 'in', 'on', 'or']);

// `01` and `1` compare equal so "hero 1" finds `hero-01`.
const words = (text: string) =>
  text
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean)
    .map((word) => (/^\d+$/.test(word) ? String(Number(word)) : word));

const compact = (text: string) => words(text).join('');

interface Field {
  words: string[];
  weight: number;
}

export interface SearchDoc {
  entry: RegistryEntryMeta;
  kindLabel: string;
  fields: Field[];
  compactTitle: string;
  compactName: string;
}

export const entryKindLabel = (entry: RegistryEntryMeta) => {
  if (entry.category === 'templates') return 'Template';
  if (entry.category === 'blocks') return entry.blockKind ? BLOCK_KIND_LABELS[entry.blockKind] : 'Block';
  return CATEGORY_LABELS[entry.category];
};

export const buildSearchIndex = (entries: RegistryEntryMeta[]): SearchDoc[] =>
  entries.map((entry) => {
    const kindLabel = entryKindLabel(entry);
    const kindWords = [
      kindLabel,
      entry.blockKind ?? '',
      entry.category === 'blocks' ? 'block section' : '',
      entry.category === 'templates' ? 'template page' : 'component',
    ].join(' ');

    return {
      entry,
      kindLabel,
      compactTitle: compact(entry.title),
      compactName: compact(entry.name),
      fields: [
        { words: words(entry.title), weight: 100 },
        { words: words(entry.name), weight: 90 },
        { words: words(kindWords), weight: 50 },
        { words: words(entry.blockTagline ?? ''), weight: 30 },
        { words: words(entry.description), weight: 20 },
      ],
    };
  });

const withinOneEdit = (a: string, b: string) => {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i++;
      j++;
      continue;
    }
    if (++edits > 1) return false;
    if (a.length > b.length) i++;
    else if (a.length < b.length) j++;
    else {
      i++;
      j++;
    }
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
};

const wordScore = (token: string, word: string) => {
  if (word === token) return 1;
  if (word.startsWith(token)) return 0.75;
  if (token.length >= 3 && word.includes(token)) return 0.4;
  if (token.length >= 5 && withinOneEdit(token, word)) return 0.5;
  if (word.length >= 4 && token.startsWith(word) && token.length - word.length <= 2) return 0.6;
  return 0;
};

const tokenScore = (doc: SearchDoc, token: string, exact = false) => {
  let best = 0;
  for (const field of doc.fields) {
    for (const word of field.words) {
      const score = (exact ? Number(word === token) : wordScore(token, word)) * field.weight;
      if (score > best) best = score;
    }
  }
  return best;
};

const scoreDoc = (doc: SearchDoc, tokens: string[], query: string) => {
  let score = 0;

  if (query.length >= 3) {
    if (doc.compactTitle === query || doc.compactName === query) score += 400;
    else if (doc.compactTitle.startsWith(query) || doc.compactName.startsWith(query)) score += 250;
    else if (doc.compactTitle.includes(query) || doc.compactName.includes(query)) score += 150;
  }

  let matchedAll = true;
  for (const token of tokens) {
    let best = tokenScore(doc, token);
    for (const alias of ALIASES[token] ?? []) best = Math.max(best, tokenScore(doc, alias, true) * 0.8);
    if (best === 0) matchedAll = false;
    score += best;
  }

  if (!matchedAll) return score >= 150 ? score : 0;
  return score;
};

export const searchIndex = (index: SearchDoc[], rawQuery: string, limit = 40) => {
  const allTokens = words(rawQuery);
  const meaningful = allTokens.filter((token) => !STOPWORDS.has(token));
  const tokens = meaningful.length > 0 ? meaningful : allTokens;
  if (tokens.length === 0) return [];
  const query = allTokens.join('');

  return index
    .map((doc, order) => ({ doc, order, score: scoreDoc(doc, tokens, query) }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.doc.entry.title.length - b.doc.entry.title.length || a.order - b.order)
    .slice(0, limit)
    .map((result) => result.doc);
};
