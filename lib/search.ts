import { BLOCK_KIND_LABELS, entryCategoryLabel, type RegistryEntryMeta } from '@/registry/hirael/registry-meta';

// Each alias is an extra exact word to look for, so point it at words that sit in the
// target's name or title. Numeric keys work because `words` normalizes digits.
const ALIASES: Record<string, string[]> = {
  modal: ['dialog'],
  popup: ['dialog', 'popover'],
  dropdown: ['select', 'menu'],
  combobox: ['autocomplete', 'select'],
  autocomplete: ['mention'],
  typeahead: ['autocomplete', 'select'],
  suggestions: ['autocomplete'],
  toast: ['notifications', 'notification'],
  inbox: ['notifications', 'message', 'chat'],
  loader: ['shimmer', 'pull'],
  loading: ['shimmer', 'pull'],
  skeleton: ['shimmer'],
  placeholder: ['empty', 'shimmer'],
  upload: ['dropzone', 'file', 'queue'],
  uploader: ['dropzone', 'file', 'queue'],
  calendar: ['date'],
  datepicker: ['date'],
  grid: ['masonry', 'bento'],
  datagrid: ['table'],
  spreadsheet: ['table'],
  wizard: ['stepper', 'onboarding'],
  steps: ['stepper'],
  onboarding: ['tour'],
  shortcut: ['kbd'],
  keyboard: ['kbd'],
  alert: ['callout', 'confirm'],
  banner: ['announcement', 'callout', 'cookie'],
  chip: ['tag'],
  tags: ['tag'],
  stars: ['rating'],
  review: ['testimonial', 'rating'],
  reviews: ['testimonial', 'rating'],
  quote: ['testimonial'],
  quotes: ['testimonial'],
  editor: ['rich', 'text'],
  wysiwyg: ['rich', 'text'],
  markdown: ['rich'],
  textarea: ['prompt', 'mention'],
  login: ['auth', 'sign'],
  signin: ['auth', 'sign'],
  signup: ['auth', 'sign'],
  register: ['auth', 'sign'],
  '2fa': ['factor', 'otp'],
  mfa: ['factor', 'otp'],
  landing: ['hero', 'template'],
  jumbotron: ['hero'],
  masthead: ['hero'],
  chart: ['charts', 'sparkline', 'heatmap', 'gauge', 'meter', 'stat', 'metric'],
  graph: ['charts', 'chart', 'sparkline', 'heatmap', 'gauge', 'meter'],
  plot: ['charts', 'chart', 'sparkline'],
  donut: ['chart'],
  pie: ['donut', 'chart'],
  funnel: ['chart'],
  kpi: ['stat', 'metric'],
  metrics: ['stat', 'metric', 'kpi'],
  gauge: ['meter'],
  meter: ['gauge'],
  dial: ['gauge'],
  progress: ['meter', 'gauge', 'stepper'],
  quota: ['meter', 'usage'],
  spinbutton: ['number'],
  stepper: ['number'],
  increment: ['number'],
  toggle: ['segmented', 'switch', 'theme'],
  switcher: ['segmented', 'tenant', 'theme', 'language'],
  tabs: ['segmented', 'bottom'],
  tab: ['segmented', 'bottom'],
  radio: ['segmented'],
  checkboxes: ['checkbox'],
  checklist: ['checkbox'],
  drag: ['sortable', 'kanban'],
  dnd: ['sortable', 'kanban'],
  reorder: ['sortable'],
  board: ['kanban', 'roadmap'],
  carousel: ['marquee', 'lightbox', 'gallery'],
  slider: ['range', 'compare'],
  otp: ['input'],
  navbar: ['header'],
  topbar: ['header'],
  nav: ['header', 'navigation'],
  sidebar: ['shell', 'split'],
  drilldown: ['nested'],
  drill: ['nested'],
  multilevel: ['nested'],
  submenu: ['nested'],
  vercel: ['nested'],
  admin: ['shell', 'dashboard'],
  layout: ['shell'],
  cmdk: ['command'],
  search: ['command', 'palette'],
  find: ['search'],
  filter: ['faceted'],
  facets: ['faceted'],
  facet: ['faceted'],
  blank: ['empty'],
  zero: ['empty'],
  nodata: ['empty'],
  questionnaire: ['survey'],
  nps: ['survey'],
  feedback: ['survey', 'rating'],
  poll: ['survey'],
  form: ['contact', 'survey'],
  chat: ['message', 'prompt', 'ai', 'reasoning', 'tool', 'sources'],
  messenger: ['chat', 'message', 'inbox'],
  messages: ['message', 'chat', 'inbox'],
  chatbot: ['chat', 'ai', 'prompt'],
  llm: ['ai', 'prompt', 'chat', 'model', 'reasoning'],
  assistant: ['ai', 'chat'],
  composer: ['prompt'],
  support: ['contact', 'chat', 'help'],
  help: ['faq', 'support'],
  questions: ['faq'],
  accordion: ['faq'],
  price: ['pricing'],
  prices: ['pricing'],
  plans: ['pricing', 'subscription'],
  payment: ['credit', 'billing'],
  money: ['currency'],
  compare: ['comparison'],
  vs: ['comparison', 'versus'],
  versus: ['comparison'],
  logos: ['logo'],
  customers: ['logo', 'testimonial'],
  partners: ['logo'],
  subscribe: ['newsletter'],
  release: ['changelog'],
  releases: ['changelog'],
  jobs: ['careers', 'job'],
  hiring: ['careers'],
  shop: ['ecommerce', 'product', 'cart'],
  store: ['ecommerce', 'product'],
  checkout: ['cart'],
  posts: ['blog'],
  articles: ['blog'],
  photos: ['gallery', 'lightbox'],
  images: ['gallery', 'lightbox'],
  people: ['team', 'members'],
  workspace: ['tenant'],
  organization: ['tenant'],
  preferences: ['settings'],
  account: ['settings'],
  apps: ['integrations'],
  connectors: ['integrations'],
  plugins: ['integrations'],
  '404': ['found'],
  '500': ['error'],
  launch: ['coming'],
  offline: ['maintenance'],
  console: ['terminal', 'log'],
  cli: ['terminal'],
  kubernetes: ['k8s'],
  environment: ['env'],
  secrets: ['env'],
  gdpr: ['cookie', 'consent'],
  particles: ['sparkles'],
  fab: ['floating'],
  explorer: ['tree', 'storage'],
  schedule: ['slot', 'calendar'],
  scheduler: ['slot', 'calendar'],
  booking: ['slot', 'calendar'],
  appointment: ['slot'],
  project: ['kanban'],
  datetime: ['date', 'time'],
  query: ['filter'],
  querybuilder: ['filter'],
  excel: ['table'],
  editable: ['inline'],
  dark: ['theme'],
  darkmode: ['theme'],
  i18n: ['language'],
  locale: ['language'],
  translation: ['language'],
  ai: ['reasoning', 'tool', 'sources', 'model', 'prompt'],
  agent: ['tool', 'reasoning'],
  thinking: ['reasoning'],
  citation: ['sources'],
  citations: ['sources'],
  references: ['sources'],
  function: ['tool'],
  models: ['model'],
  comments: ['comment'],
  discussion: ['comment'],
  reactions: ['comment'],
  thread: ['comment', 'message'],
  infinite: ['virtual'],
  virtualized: ['virtual'],
  windowing: ['virtual'],
  maps: ['map'],
  geo: ['map'],
  location: ['map', 'address'],
  document: ['pdf'],
  attachment: ['file'],
  attachments: ['file'],
  mobile: ['bottom', 'swipe', 'pull'],
  tabbar: ['bottom'],
  gesture: ['swipe', 'pull'],
  refresh: ['pull'],
  mask: ['masked'],
  iban: ['masked'],
  postcode: ['masked'],
  cascader: ['tree'],
  hierarchy: ['tree'],
  properties: ['description'],
  details: ['description'],
  keyvalue: ['description'],
  throttle: ['debounce'],
  clipboard: ['copy'],
  breakpoint: ['media'],
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

  return entryCategoryLabel(entry);
};

export const buildSearchIndex = (entries: RegistryEntryMeta[]): SearchDoc[] =>
  entries.map((entry) => {
    const kindLabel = entryKindLabel(entry);
    const kindWords = [
      kindLabel,
      entry.blockKind ?? '',
      entry.category === 'blocks' ? 'block section' : '',
      entry.category === 'templates'
        ? 'template page'
        : entry.category === 'utilities'
          ? 'react hook utility helper'
          : 'component',
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
