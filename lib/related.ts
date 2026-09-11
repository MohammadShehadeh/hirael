import { REGISTRY, type RegistryEntryMeta } from '@/registry/hirael/registry-meta';

const STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'component',
  'components',
  'composable',
  'for',
  'from',
  'into',
  'its',
  'own',
  'parts',
  'ships',
  'that',
  'the',
  'their',
  'this',
  'to',
  'with',
  'you',
  'your',
]);

const tokens = (entry: RegistryEntryMeta): Set<string> =>
  new Set(
    `${entry.name} ${entry.title} ${entry.description}`
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((word) => word.length > 2 && !STOP_WORDS.has(word)),
  );

const score = (entry: RegistryEntryMeta, candidate: RegistryEntryMeta, entryTokens: Set<string>): number => {
  let total = 0;

  if (entry.blockKind && entry.blockKind === candidate.blockKind) total += 24;
  else if (entry.category === candidate.category) total += 12;

  const deps = new Set(entry.registryDependencies ?? []);
  for (const dep of candidate.registryDependencies ?? []) if (deps.has(dep)) total += 3;

  for (const token of tokens(candidate)) if (entryTokens.has(token)) total += 2;

  return total;
};

export const relatedEntries = (entry: RegistryEntryMeta, limit = 3): RegistryEntryMeta[] => {
  const entryTokens = tokens(entry);
  const index = REGISTRY.findIndex((candidate) => candidate.name === entry.name);

  return REGISTRY.filter((candidate) => candidate.name !== entry.name)
    .map((candidate) => ({
      candidate,
      score: score(entry, candidate, entryTokens),
      distance: Math.abs(REGISTRY.indexOf(candidate) - index),
    }))
    .filter(({ score: value }) => value > 0)
    .sort((a, b) => b.score - a.score || a.distance - b.distance)
    .slice(0, limit)
    .map(({ candidate }) => candidate);
};
