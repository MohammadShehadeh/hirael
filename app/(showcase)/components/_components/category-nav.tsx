import { CATEGORY_LABELS, COMPONENT_CATEGORY_ORDER, REGISTRY_BY_CATEGORY } from '@/registry/hirael/registry-meta';

export const CategoryNav = () => {
  return (
    <nav aria-label="Component categories" className="-mt-6 flex flex-wrap justify-center gap-2">
      {COMPONENT_CATEGORY_ORDER.map((category) => (
        <a
          key={category}
          href={`#${category}`}
          className="rounded-full border border-border bg-card px-3 py-1 text-xs uppercase text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
        >
          {CATEGORY_LABELS[category]}
          <span className="ms-1.5 tabular-nums text-muted-foreground/60">{REGISTRY_BY_CATEGORY[category].length}</span>
        </a>
      ))}
    </nav>
  );
};
