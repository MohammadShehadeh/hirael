'use client';

import * as React from 'react';
import Image from 'next/image';
import { Check, Heart, Plus, ShoppingBag } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/base/ui/badge';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Rating } from '@/registry/hirael/bases/base/components/rating';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
const SWAP =
  'animate-in fade-in slide-in-from-bottom-2 duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

type Category = 'audio' | 'wearables' | 'travel' | 'everyday';

const FILTERS: { value: Category | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'audio', label: 'Audio' },
  { value: 'wearables', label: 'Wearables' },
  { value: 'travel', label: 'Travel' },
  { value: 'everyday', label: 'Everyday' },
];

interface Product {
  id: string;
  name: string;
  category: Category;
  price: string;
  compareAt?: string;
  rating: number;
  reviews: string;
  badge?: string;
  image: string;
}

const PRODUCTS: readonly Product[] = [
  {
    id: 'atlas-headphones',
    name: 'Atlas Over-Ear Headphones',
    category: 'audio',
    price: '$249',
    rating: 4.8,
    reviews: '1,204',
    badge: 'Bestseller',
    image: '/media/blocks/ecommerce-01/atlas-headphones.jpg',
  },
  {
    id: 'meridian-watch',
    name: 'Meridian Chrono Watch',
    category: 'wearables',
    price: '$389',
    compareAt: '$460',
    rating: 4.9,
    reviews: '318',
    badge: '−15%',
    image: '/media/blocks/ecommerce-01/meridian-watch.jpg',
  },
  {
    id: 'volt-runners',
    name: 'Volt Runner Sneakers',
    category: 'everyday',
    price: '$129',
    rating: 4.6,
    reviews: '942',
    badge: 'New',
    image: '/media/blocks/ecommerce-01/volt-runners.jpg',
  },
  {
    id: 'carryall-pack',
    name: 'Carryall Day Pack',
    category: 'travel',
    price: '$96',
    rating: 4.7,
    reviews: '566',
    image: '/media/blocks/ecommerce-01/carryall-pack.jpg',
  },
  {
    id: 'horizon-sunglasses',
    name: 'Horizon Sunglasses',
    category: 'everyday',
    price: '$74',
    compareAt: '$92',
    rating: 4.5,
    reviews: '211',
    badge: '−20%',
    image: '/media/blocks/ecommerce-01/horizon-sunglasses.jpg',
  },
  {
    id: 'hydra-bottle',
    name: 'Hydra Steel Bottle',
    category: 'everyday',
    price: '$32',
    rating: 4.4,
    reviews: '1,870',
    image: '/media/blocks/ecommerce-01/hydra-bottle.jpg',
  },
  {
    id: 'field-cap',
    name: 'Field Cap',
    category: 'everyday',
    price: '$28',
    rating: 4.3,
    reviews: '404',
    image: '/media/blocks/ecommerce-01/field-cap.jpg',
  },
  {
    id: 'pioneer-camera',
    name: 'Pioneer Instant Camera',
    category: 'travel',
    price: '$179',
    rating: 4.7,
    reviews: '689',
    badge: 'New',
    image: '/media/blocks/ecommerce-01/pioneer-camera.jpg',
  },
];

const CATEGORY_LABELS: Record<Category, string> = {
  audio: 'Audio',
  wearables: 'Wearables',
  travel: 'Travel',
  everyday: 'Everyday',
};

const ADDED_FEEDBACK_MS = 1600;

const Ecommerce01 = () => {
  const [filter, setFilter] = React.useState<Category | 'all'>('all');
  const [saved, setSaved] = React.useState<readonly string[]>([]);
  const [cart, setCart] = React.useState<Readonly<Record<string, number>>>({});
  const [hasFiltered, setHasFiltered] = React.useState(false);
  const [justAdded, setJustAdded] = React.useState<string | null>(null);
  const addedTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (addedTimer.current) clearTimeout(addedTimer.current);
    };
  }, []);

  const visible = filter === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter);
  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  const toggleSaved = (id: string) =>
    setSaved((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));

  const addToCart = (id: string) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
    setJustAdded(id);
    if (addedTimer.current) clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setJustAdded(null), ADDED_FEEDBACK_MS);
  };

  return (
    <section data-slot="ecommerce" className="bg-background py-20 sm:py-28">
      <div className="container flex w-full flex-col gap-10">
        <div data-slot="ecommerce-header" className="flex flex-col gap-4">
          <span className={cn(ENTER, 'text-xs uppercase text-muted-foreground')}>Shop</span>
          <h2
            style={stagger(1, 70)}
            className={cn(
              ENTER,
              'max-w-xl font-serif text-4xl font-medium leading-[1.04] tracking-tight sm:text-5xl md:text-6xl',
            )}
          >
            The everyday carry edit.
          </h2>
          <p style={stagger(2, 70)} className={cn(ENTER, 'max-w-xl text-sm text-muted-foreground')}>
            Eight pieces we restock on purpose. Free shipping over $200, free returns for 60 days.
          </p>
        </div>

        <div
          data-slot="ecommerce-toolbar"
          style={stagger(3, 70)}
          className={cn(ENTER, 'flex flex-wrap items-center justify-between gap-3 border-y border-border py-3')}
        >
          <div role="group" aria-label="Filter by category" className="flex flex-wrap items-center gap-1.5">
            {FILTERS.map((f) => (
              <Button
                key={f.value}
                variant={filter === f.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setFilter(f.value);
                  setHasFiltered(true);
                }}
                aria-pressed={filter === f.value}
              >
                {f.label}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-3 text-xs uppercase text-muted-foreground">
            <span className="tabular-nums">
              {visible.length} product{visible.length === 1 ? '' : 's'}
            </span>
            <span aria-hidden className="text-border">
              |
            </span>
            <span data-slot="ecommerce-cart-count" aria-live="polite" className="inline-flex items-center gap-1.5">
              <ShoppingBag aria-hidden className="size-3.5" />
              <span
                key={cartCount}
                className={cn(
                  cartCount > 0 && 'animate-in fade-in zoom-in-95 duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:animate-none',
                  'tabular-nums',
                  cartCount > 0 && 'text-foreground',
                )}
              >
                {cartCount} in cart
              </span>
            </span>
          </div>
        </div>

        <div
          key={filter}
          data-slot="ecommerce-grid"
          className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4"
        >
          {visible.map((p, index) => {
            const isSaved = saved.includes(p.id);
            const added = justAdded === p.id;
            const inCart = cart[p.id] ?? 0;
            return (
              <article
                key={p.id}
                data-slot="ecommerce-product"
                style={hasFiltered ? stagger(index, 40) : stagger(index, 50, 280)}
                className={cn(hasFiltered ? SWAP : ENTER, 'group flex flex-col')}
              >
                <div className="relative overflow-hidden rounded-md border border-border bg-muted">
                  <div className="relative aspect-square">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="object-cover transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 motion-reduce:transition-none"
                    />
                  </div>
                  {p.badge && (
                    <Badge
                      variant="outline"
                      className="absolute start-2.5 top-2.5 bg-background/85 text-xs uppercase backdrop-blur"
                    >
                      {p.badge}
                    </Badge>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    onClick={() => toggleSaved(p.id)}
                    aria-pressed={isSaved}
                    aria-label={isSaved ? `Remove ${p.name} from wishlist` : `Add ${p.name} to wishlist`}
                    className="absolute end-2.5 top-2.5 size-7 rounded-full bg-background/85 text-foreground backdrop-blur"
                  >
                    <Heart className={cn('size-3.5', isSaved && 'fill-current')} />
                  </Button>
                </div>

                <div className="flex flex-col gap-1 pt-3">
                  <span className="text-xs uppercase text-muted-foreground">{CATEGORY_LABELS[p.category]}</span>
                  <h3 className="text-sm font-medium tracking-[-0.01em] text-pretty">{p.name}</h3>
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Rating value={p.rating} step={0.5} readOnly size="sm" aria-label={`Rated ${p.rating} out of 5`} />
                    <span className="tabular-nums">({p.reviews})</span>
                  </span>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="flex items-baseline gap-1.5">
                      <span className="text-sm font-semibold tabular-nums">{p.price}</span>
                      {p.compareAt && (
                        <span className="text-xs tabular-nums text-muted-foreground line-through">
                          {p.compareAt}
                        </span>
                      )}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addToCart(p.id)}
                      aria-label={inCart > 0 ? `Add another ${p.name}, ${inCart} in cart` : `Add ${p.name} to cart`}
                      data-slot="ecommerce-add"
                    >
                      <span
                        key={added ? 'added' : 'add'}
                        className="inline-flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:animate-none"
                      >
                        {added ? <Check className="size-3.5" /> : <Plus className="size-3.5" />}
                        {added ? 'Added' : 'Add'}
                      </span>
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Ecommerce01;
