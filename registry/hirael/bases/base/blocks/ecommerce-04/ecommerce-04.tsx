'use client';

import * as React from 'react';
import Image from 'next/image';
import { SlidersHorizontal, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Rating } from '@/registry/hirael/bases/base/components/rating';
import { Badge } from '@/registry/hirael/bases/base/ui/badge';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Checkbox } from '@/registry/hirael/bases/base/ui/checkbox';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/registry/hirael/bases/base/ui/empty';
import { Field, FieldLabel, FieldLegend, FieldSet } from '@/registry/hirael/bases/base/ui/field';
import { RadioGroup, RadioGroupItem } from '@/registry/hirael/bases/base/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/registry/hirael/bases/base/ui/select';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/registry/hirael/bases/base/ui/sheet';
import { Slider } from '@/registry/hirael/bases/base/ui/slider';
import { Switch } from '@/registry/hirael/bases/base/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/registry/hirael/bases/base/ui/toggle-group';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
const SWAP =
  'animate-in fade-in slide-in-from-bottom-2 duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

const CATEGORIES = [
  { value: 'tech', label: 'Tech' },
  { value: 'bags', label: 'Bags' },
  { value: 'apparel', label: 'Apparel' },
  { value: 'outdoor', label: 'Outdoor' },
] as const;

type Category = (typeof CATEGORIES)[number]['value'];

// Hard-coded on purpose: product finishes don't change with the theme.
const COLOURS = [
  { value: 'black', label: 'Black', swatch: 'oklch(0.24 0.005 260)' },
  { value: 'white', label: 'White', swatch: 'oklch(0.97 0.003 90)' },
  { value: 'sand', label: 'Sand', swatch: 'oklch(0.84 0.035 80)' },
  { value: 'olive', label: 'Olive', swatch: 'oklch(0.55 0.06 120)' },
  { value: 'navy', label: 'Navy', swatch: 'oklch(0.33 0.06 260)' },
] as const;

type Colour = (typeof COLOURS)[number]['value'];

const RATINGS = [
  { value: 'any', label: 'Any rating', min: 0 },
  { value: '4', label: '4 stars & up', min: 4 },
  { value: '3', label: '3 stars & up', min: 3 },
] as const;

type RatingFilter = (typeof RATINGS)[number]['value'];

const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price low to high' },
  { value: 'price-desc', label: 'Price high to low' },
  { value: 'newest', label: 'Newest' },
] as const;

type Sort = (typeof SORTS)[number]['value'];

const PRICE_MIN = 0;
const PRICE_MAX = 400;

interface Product {
  id: string;
  name: string;
  category: Category;
  colour: Colour;
  price: number;
  rating: number;
  reviews: number;
  inStock: boolean;
  added: string;
  image: string;
}

// Placeholder photos served from hirael.com. Swap them for your own assets, or
// add the host to `images.remotePatterns` in next.config to keep them.
const MEDIA = '/media/blocks/ecommerce-04';

const PRODUCTS: readonly Product[] = [
  {
    id: 'atlas-headphones',
    name: 'Atlas Over-Ear Headphones',
    category: 'tech',
    colour: 'black',
    price: 249,
    rating: 4.8,
    reviews: 1204,
    inStock: true,
    added: '2026-03-10',
    image: `${MEDIA}/atlas-headphones.jpg`,
  },
  {
    id: 'carryall-pack',
    name: 'Carryall Day Pack',
    category: 'bags',
    colour: 'olive',
    price: 96,
    rating: 4.7,
    reviews: 566,
    inStock: true,
    added: '2026-05-21',
    image: `${MEDIA}/carryall-pack.jpg`,
  },
  {
    id: 'meridian-watch',
    name: 'Meridian Chrono Watch',
    category: 'tech',
    colour: 'navy',
    price: 389,
    rating: 4.9,
    reviews: 318,
    inStock: true,
    added: '2026-01-14',
    image: `${MEDIA}/meridian-watch.jpg`,
  },
  {
    id: 'volt-runners',
    name: 'Volt Runner Sneakers',
    category: 'apparel',
    colour: 'white',
    price: 129,
    rating: 4.6,
    reviews: 942,
    inStock: true,
    added: '2026-08-30',
    image: `${MEDIA}/volt-runners.jpg`,
  },
  {
    id: 'horizon-sunglasses',
    name: 'Horizon Sunglasses',
    category: 'outdoor',
    colour: 'black',
    price: 74,
    rating: 4.5,
    reviews: 211,
    inStock: true,
    added: '2026-04-02',
    image: `${MEDIA}/horizon-sunglasses.jpg`,
  },
  {
    id: 'pioneer-camera',
    name: 'Pioneer Instant Camera',
    category: 'tech',
    colour: 'white',
    price: 179,
    rating: 4.7,
    reviews: 689,
    inStock: false,
    added: '2026-09-02',
    image: `${MEDIA}/pioneer-camera.jpg`,
  },
  {
    id: 'hydra-bottle',
    name: 'Hydra Steel Bottle, 750 ml',
    category: 'outdoor',
    colour: 'black',
    price: 32,
    rating: 4.4,
    reviews: 1870,
    inStock: true,
    added: '2025-11-18',
    image: `${MEDIA}/hydra-bottle.jpg`,
  },
  {
    id: 'field-cap',
    name: 'Field Cap',
    category: 'apparel',
    colour: 'sand',
    price: 28,
    rating: 4.3,
    reviews: 404,
    inStock: true,
    added: '2026-02-09',
    image: `${MEDIA}/field-cap.jpg`,
  },
  {
    id: 'carryall-sling',
    name: 'Carryall Sling',
    category: 'bags',
    colour: 'black',
    price: 64,
    rating: 4.2,
    reviews: 137,
    inStock: false,
    added: '2026-07-15',
    image: `${MEDIA}/carryall-pack.jpg`,
  },
  {
    id: 'volt-trail',
    name: 'Volt Trail Runner',
    category: 'outdoor',
    colour: 'olive',
    price: 149,
    rating: 3.8,
    reviews: 96,
    inStock: true,
    added: '2026-08-11',
    image: `${MEDIA}/volt-runners.jpg`,
  },
  {
    id: 'field-cap-wool',
    name: 'Field Cap, Wool',
    category: 'apparel',
    colour: 'navy',
    price: 36,
    rating: 3.9,
    reviews: 58,
    inStock: true,
    added: '2026-09-08',
    image: `${MEDIA}/field-cap.jpg`,
  },
  {
    id: 'hydra-bottle-large',
    name: 'Hydra Steel Bottle, 1 L',
    category: 'outdoor',
    colour: 'sand',
    price: 38,
    rating: 4.1,
    reviews: 322,
    inStock: true,
    added: '2026-06-27',
    image: `${MEDIA}/hydra-bottle.jpg`,
  },
];

interface Filters {
  categories: Category[];
  price: [number, number];
  colours: Colour[];
  inStock: boolean;
  rating: RatingFilter;
}

const EMPTY_FILTERS: Filters = {
  categories: [],
  price: [PRICE_MIN, PRICE_MAX],
  colours: [],
  inStock: false,
  rating: 'any',
};

const labelOf = <T extends string>(options: readonly { value: T; label: string }[], value: T) =>
  options.find((option) => option.value === value)?.label ?? value;

const usd = (amount: number) => `$${amount}`;

const matches = (product: Product, filters: Filters, ignoreCategory = false) => {
  const minRating = RATINGS.find((option) => option.value === filters.rating)?.min ?? 0;
  return (
    (ignoreCategory || filters.categories.length === 0 || filters.categories.includes(product.category)) &&
    product.price >= filters.price[0] &&
    product.price <= filters.price[1] &&
    (filters.colours.length === 0 || filters.colours.includes(product.colour)) &&
    (!filters.inStock || product.inStock) &&
    product.rating >= minRating
  );
};

const sortProducts = (products: Product[], sort: Sort) => {
  if (sort === 'price-asc') return products.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') return products.sort((a, b) => b.price - a.price);
  if (sort === 'newest') return products.sort((a, b) => b.added.localeCompare(a.added));
  return products;
};

const toggle = <T,>(list: T[], value: T) =>
  list.includes(value) ? list.filter((item) => item !== value) : [...list, value];

interface ActiveFilter {
  key: string;
  label: string;
  remove: (filters: Filters) => Filters;
}

const getActiveFilters = (filters: Filters): ActiveFilter[] => [
  ...filters.categories.map((category) => ({
    key: `category-${category}`,
    label: labelOf(CATEGORIES, category),
    remove: (current: Filters) => ({ ...current, categories: current.categories.filter((c) => c !== category) }),
  })),
  ...(filters.price[0] !== PRICE_MIN || filters.price[1] !== PRICE_MAX
    ? [
        {
          key: 'price',
          label: `${usd(filters.price[0])} to ${usd(filters.price[1])}`,
          remove: (current: Filters) => ({ ...current, price: EMPTY_FILTERS.price }),
        },
      ]
    : []),
  ...filters.colours.map((colour) => ({
    key: `colour-${colour}`,
    label: labelOf(COLOURS, colour),
    remove: (current: Filters) => ({ ...current, colours: current.colours.filter((c) => c !== colour) }),
  })),
  ...(filters.inStock
    ? [{ key: 'stock', label: 'In stock', remove: (current: Filters) => ({ ...current, inStock: false }) }]
    : []),
  ...(filters.rating !== 'any'
    ? [
        {
          key: 'rating',
          label: labelOf(RATINGS, filters.rating),
          remove: (current: Filters) => ({ ...current, rating: EMPTY_FILTERS.rating }),
        },
      ]
    : []),
];

interface FilterPanelProps {
  filters: Filters;
  onFiltersChange: (next: Filters) => void;
}

const FilterPanel = ({ filters, onFiltersChange }: FilterPanelProps) => {
  const id = React.useId();
  const update = (patch: Partial<Filters>) => onFiltersChange({ ...filters, ...patch });

  return (
    <div data-slot="filter-panel" className="flex flex-col divide-y divide-border">
      <FieldSet className="gap-3 pb-6">
        <FieldLegend variant="label">Category</FieldLegend>
        {CATEGORIES.map((category) => {
          const count = PRODUCTS.filter(
            (product) => product.category === category.value && matches(product, filters, true),
          ).length;
          const checked = filters.categories.includes(category.value);
          return (
            <Field key={category.value} orientation="horizontal" data-disabled={count === 0 && !checked}>
              <Checkbox
                id={`${id}-${category.value}`}
                checked={checked}
                disabled={count === 0 && !checked}
                onCheckedChange={() => update({ categories: toggle(filters.categories, category.value) })}
              />
              <FieldLabel htmlFor={`${id}-${category.value}`}>{category.label}</FieldLabel>
              <span className="ms-auto text-xs tabular-nums text-muted-foreground">{count}</span>
            </Field>
          );
        })}
      </FieldSet>

      <FieldSet className="gap-4 py-6">
        <FieldLegend variant="label">Price</FieldLegend>
        <Slider
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={10}
          minStepsBetweenValues={1}
          value={filters.price}
          onValueChange={(next) => {
            const [min, max] = next as number[];
            update({ price: [min, max] });
          }}
          aria-label="Price range"
        />
        <div className="flex items-center justify-between text-sm tabular-nums">
          <span>
            <span className="sr-only">From </span>
            {usd(filters.price[0])}
          </span>
          <span>
            <span className="sr-only">To </span>
            {usd(filters.price[1])}
            {filters.price[1] === PRICE_MAX && '+'}
          </span>
        </div>
      </FieldSet>

      <FieldSet className="gap-3 py-6">
        <FieldLegend variant="label">Colour</FieldLegend>
        <ToggleGroup
          multiple
          spacing={2}
          value={filters.colours}
          onValueChange={(next) => update({ colours: next as Colour[] })}
          className="flex-wrap"
        >
          {COLOURS.map((colour) => (
            <ToggleGroupItem key={colour.value} value={colour.value} aria-label={colour.label} title={colour.label}>
              <span
                aria-hidden
                style={{ backgroundColor: colour.swatch }}
                className="size-4 shrink-0 rounded-full border border-foreground/15"
              />
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </FieldSet>

      <Field orientation="horizontal" className="py-6">
        <FieldLabel htmlFor={`${id}-stock`}>In stock only</FieldLabel>
        <Switch
          id={`${id}-stock`}
          checked={filters.inStock}
          onCheckedChange={(checked) => update({ inStock: checked })}
        />
      </Field>

      <FieldSet className="gap-3 pt-6">
        <FieldLegend variant="label">Rating</FieldLegend>
        <RadioGroup value={filters.rating} onValueChange={(next) => update({ rating: next as RatingFilter })}>
          {RATINGS.map((option) => (
            <Field key={option.value} orientation="horizontal">
              <RadioGroupItem id={`${id}-rating-${option.value}`} value={option.value} />
              <FieldLabel htmlFor={`${id}-rating-${option.value}`} className="items-center">
                {option.min > 0 && <Rating value={option.min} readOnly size="sm" aria-hidden />}
                {option.label}
              </FieldLabel>
            </Field>
          ))}
        </RadioGroup>
      </FieldSet>
    </div>
  );
};

const ProductCard = ({ product, index }: { product: Product; index: number }) => {
  return (
    <article
      data-slot="product-card"
      style={stagger(Math.min(index, 8), 45)}
      className={cn(SWAP, 'group relative flex flex-col gap-3')}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-md border border-border bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className={cn(
            'object-cover transition-transform duration-300 ease-out group-hover:scale-105 motion-reduce:transition-none',
            !product.inStock && 'opacity-60',
          )}
        />
        {!product.inStock && (
          <Badge variant="secondary" className="absolute start-2.5 top-2.5">
            Sold out
          </Badge>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-sm font-medium text-pretty">
            <a href="#" className="after:absolute after:inset-0 focus-visible:outline-none">
              {product.name}
            </a>
          </h3>
          <span className="shrink-0 text-sm font-semibold tabular-nums">{usd(product.price)}</span>
        </div>
        <span className="text-xs text-muted-foreground">{labelOf(COLOURS, product.colour)}</span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Rating
            value={product.rating}
            step={0.5}
            readOnly
            size="sm"
            aria-label={`Rated ${product.rating} out of 5`}
          />
          <span className="tabular-nums">{product.rating.toFixed(1)}</span>
          <span className="tabular-nums">({product.reviews.toLocaleString('en-US')})</span>
        </span>
      </div>
    </article>
  );
};

const Ecommerce04 = () => {
  const [filters, setFilters] = React.useState<Filters>(EMPTY_FILTERS);
  const [sort, setSort] = React.useState<Sort>('featured');

  const results = sortProducts(
    PRODUCTS.filter((product) => matches(product, filters)),
    sort,
  );
  const active = getActiveFilters(filters);
  const resultKey = JSON.stringify([filters, sort]);
  const clearAll = () => setFilters(EMPTY_FILTERS);
  const resultLabel = `${results.length} ${results.length === 1 ? 'product' : 'products'}`;

  return (
    <section data-slot="category-page" className="bg-background py-16 md:py-24">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 md:px-10">
        <div data-slot="category-header" className="flex max-w-xl flex-col gap-4">
          <span className={cn(ENTER, 'text-xs uppercase text-muted-foreground')}>Shop</span>
          <h2
            style={stagger(1, 80)}
            className={cn(ENTER, 'text-balance text-3xl font-semibold tracking-tight sm:text-4xl')}
          >
            Everyday carry
          </h2>
          <p style={stagger(2, 80)} className={cn(ENTER, 'text-base leading-relaxed text-muted-foreground')}>
            Bags, bottles and small tech we use every day. Free shipping over $200 and free returns for 60 days.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14">
          <aside
            data-slot="category-filters"
            aria-label="Filters"
            style={stagger(3, 80)}
            className={cn(ENTER, 'hidden lg:sticky lg:top-8 lg:block lg:self-start')}
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-sm font-medium">Filters</span>
              <Button type="button" variant="ghost" size="xs" onClick={clearAll} disabled={active.length === 0}>
                Clear all
              </Button>
            </div>
            <div className="pt-6">
              <FilterPanel filters={filters} onFiltersChange={setFilters} />
            </div>
          </aside>

          <div data-slot="category-results" style={stagger(4, 80)} className={cn(ENTER, 'flex min-w-0 flex-col gap-6')}>
            <div className="flex flex-col gap-4 border-b border-border pb-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Sheet>
                    <SheetTrigger render={<Button type="button" variant="outline" size="sm" className="lg:hidden" />}>
                      <SlidersHorizontal />
                      Filters
                      {active.length > 0 && <span className="tabular-nums">({active.length})</span>}
                    </SheetTrigger>
                    <SheetContent side="bottom" className="max-h-[85svh]">
                      <div className="border-b border-border">
                        <SheetHeader>
                          <SheetTitle>Filters</SheetTitle>
                          <SheetDescription>Results update as you change them.</SheetDescription>
                        </SheetHeader>
                      </div>
                      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6">
                        <FilterPanel filters={filters} onFiltersChange={setFilters} />
                      </div>
                      <div className="border-t border-border">
                        <SheetFooter className="flex-row">
                          <Button type="button" variant="outline" onClick={clearAll} disabled={active.length === 0}>
                            Clear all
                          </Button>
                          <SheetClose render={<Button type="button" className="flex-1" />}>
                            {results.length === 0
                              ? 'No matches'
                              : `Show ${results.length} ${results.length === 1 ? 'result' : 'results'}`}
                          </SheetClose>
                        </SheetFooter>
                      </div>
                    </SheetContent>
                  </Sheet>
                  <p aria-live="polite" className="text-sm tabular-nums text-muted-foreground">
                    {resultLabel}
                  </p>
                </div>
                <Select items={SORTS} value={sort} onValueChange={(next) => setSort(next as Sort)}>
                  <SelectTrigger size="sm" aria-label="Sort products" className="min-w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent alignItemWithTrigger={false} align="end">
                    {SORTS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {active.length > 0 && (
                <ul
                  data-slot="active-filters"
                  aria-label="Active filters"
                  className="flex flex-wrap items-center gap-2"
                >
                  {active.map((filter) => (
                    <li
                      key={filter.key}
                      className="animate-in fade-in zoom-in-95 duration-200 motion-reduce:animate-none"
                    >
                      <Badge variant="outline" className="h-7">
                        {filter.label}
                        <button
                          type="button"
                          aria-label={`Remove ${filter.label}`}
                          onClick={() => setFilters(filter.remove(filters))}
                          className="grid size-5 place-items-center rounded-full text-muted-foreground outline-none transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <X className="size-3" />
                        </button>
                      </Badge>
                    </li>
                  ))}
                  <li>
                    <Button type="button" variant="link" size="xs" onClick={clearAll}>
                      Clear all
                    </Button>
                  </li>
                </ul>
              )}
            </div>

            {results.length > 0 ? (
              <div
                key={resultKey}
                data-slot="product-grid"
                className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6"
              >
                {results.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <Empty data-slot="product-empty" className={SWAP}>
                <EmptyHeader>
                  <EmptyTitle>Nothing matches those filters</EmptyTitle>
                  <EmptyDescription>
                    Try a wider price range or fewer colours. Sold out items come back most weeks.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button type="button" variant="outline" onClick={clearAll}>
                    Clear filters
                  </Button>
                </EmptyContent>
              </Empty>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Ecommerce04;
