'use client';

import * as React from 'react';
import Image from 'next/image';
import { Heart, Plus } from 'lucide-react';

import { Badge } from '@/registry/hirael/bases/base/ui/badge';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Rating } from '@/registry/hirael/bases/base/components/rating';

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

const Ecommerce01 = () => {
  const [filter, setFilter] = React.useState<Category | 'all'>('all');
  const [saved, setSaved] = React.useState<readonly string[]>([]);

  const visible = filter === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter);

  const toggleSaved = (id: string) =>
    setSaved((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));

  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="container flex w-full flex-col gap-10">
        <div className="flex flex-col gap-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground">shop</span>
          <h2 className="max-w-xl font-serif text-4xl font-medium leading-[1.04] tracking-tight sm:text-5xl md:text-6xl">
            The everyday carry edit.
          </h2>
          <p className="max-w-xl text-sm text-muted-foreground">
            Eight pieces we restock on purpose. Free shipping over $200, free returns for 60 days.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-y border-border py-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {FILTERS.map((f) => (
              <Button
                key={f.value}
                variant={filter === f.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(f.value)}
                aria-pressed={filter === f.value}
              >
                {f.label}
              </Button>
            ))}
          </div>
          <span className="font-mono text-[10px] tabular-nums uppercase tracking-[0.1em] text-muted-foreground">
            {visible.length} product{visible.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
          {visible.map((p) => {
            const isSaved = saved.includes(p.id);
            return (
              <article key={p.id} className="group flex flex-col">
                <div className="relative overflow-hidden rounded-md border border-border bg-muted">
                  <div className="relative aspect-square">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                    />
                  </div>
                  {p.badge && (
                    <Badge
                      variant="outline"
                      className="absolute start-2.5 top-2.5 bg-background/85 font-mono text-[10px] uppercase tracking-[0.08em] backdrop-blur"
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
                    <Heart className={`size-3.5 ${isSaved ? 'fill-current' : ''}`} />
                  </Button>
                </div>

                <div className="flex flex-col gap-1 pt-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    {CATEGORY_LABELS[p.category]}
                  </span>
                  <h3 className="text-sm font-medium tracking-[-0.01em]">{p.name}</h3>
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Rating value={p.rating} step={0.5} readOnly size="sm" aria-label={`Rated ${p.rating} out of 5`} />
                    <span className="font-mono tabular-nums">({p.reviews})</span>
                  </span>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="flex items-baseline gap-1.5">
                      <span className="font-mono text-sm font-semibold tabular-nums">{p.price}</span>
                      {p.compareAt && (
                        <span className="font-mono text-xs tabular-nums text-muted-foreground line-through">
                          {p.compareAt}
                        </span>
                      )}
                    </span>
                    <Button variant="outline" size="sm">
                      <Plus className="size-3.5" />
                      Add
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
