'use client';

import * as React from 'react';
import Image from 'next/image';
import { ArrowRight, Clock } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/base/ui/badge';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/registry/hirael/bases/base/ui/card';
import { Separator } from '@/registry/hirael/bases/base/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/registry/hirael/bases/base/ui/toggle-group';

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]';
const ENTER = `animate-in fade-in slide-in-from-bottom-4 duration-500 ${EASE} fill-mode-both motion-reduce:animate-none`;
const SWAP = `animate-in fade-in slide-in-from-bottom-2 duration-250 ${EASE} fill-mode-both motion-reduce:animate-none`;

const stagger = (index: number, step = 70, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

interface Post {
  category: string;
  title: string;
  excerpt: string;
  author: { name: string; initials: string };
  date: string;
  readMin: number;
  href: string;
  /** Optional cover image URL. If absent, a stylized placeholder renders. */
  cover?: string;
}

// Placeholder photos served from hirael.com. Swap them for your own assets, or
// add the host to `images.remotePatterns` in next.config to keep them.
const IMG = {
  a: '/media/blocks/blog-01/cover-a.jpg',
  b: '/media/blocks/blog-01/cover-b.jpg',
  c: '/media/blocks/blog-01/cover-c.jpg',
} as const;

const FEATURED: Post = {
  category: 'Engineering',
  title: 'Why we build every component from small, swappable parts.',
  excerpt:
    "Every Hirael item starts as a flat set of parts you compose yourself. Here's the contract behind that choice, and the four bugs it quietly prevented in production.",
  author: { name: 'Nadia Rahman', initials: 'NR' },
  date: 'May 22, 2026',
  readMin: 9,
  href: '#',
  cover: IMG.a,
};

const POSTS: readonly Post[] = [
  {
    category: 'Patterns',
    title: 'Async combobox without the race conditions.',
    excerpt: 'A debounced loader, a stable request id, and an abort signal walk into a useEffect…',
    author: { name: 'Maya Renner', initials: 'MR' },
    date: 'May 14',
    readMin: 5,
    href: '#',
    cover: IMG.b,
  },
  {
    category: 'Design',
    title: 'The 1px border, and other invisible decisions.',
    excerpt: 'How a single token decision propagates through every surface in the registry, and why we picked 0.65rem.',
    author: { name: 'Jules Tanaka', initials: 'JT' },
    date: 'May 06',
    readMin: 4,
    href: '#',
    cover: IMG.c,
  },
  {
    category: 'Release',
    title: 'v1.3: year picker, eyedropper, dense data tables.',
    excerpt:
      'Three new primitives, a quiet API revision to combobox, and a long-deferred fix for SSR hydration in tag-input.',
    author: { name: 'Adaeze Okafor', initials: 'AO' },
    date: 'Apr 29',
    readMin: 3,
    href: '#',
    cover: IMG.a,
  },
  {
    category: 'Field notes',
    title: 'Shipping for design systems teams, by design systems teams.',
    excerpt: 'What we learned watching three platform teams swap our components into their codebase over a sprint.',
    author: { name: 'Soren Kim', initials: 'SK' },
    date: 'Apr 18',
    readMin: 7,
    href: '#',
    cover: IMG.b,
  },
];

const ALL = 'All';
const ALL_POSTS: readonly Post[] = [FEATURED, ...POSTS];
const CATEGORIES = [ALL, ...Array.from(new Set(ALL_POSTS.map((post) => post.category)))];

const PostCover = ({
  cover,
  alt,
  category,
  featured,
}: {
  cover?: string;
  alt: string;
  category: string;
  featured?: boolean;
}) => {
  if (cover) {
    return (
      <div className="relative size-full overflow-hidden">
        <Image
          src={cover}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02] motion-reduce:transition-none"
        />
        {/* Photo scrim: fixed dark overlay so the badges stay legible on any image, in both themes. */}
        <div className="absolute inset-x-0 bottom-0 flex items-end gap-2 bg-linear-to-t from-black/60 via-black/10 to-transparent p-4">
          {featured && <Badge className="bg-background/85 text-foreground backdrop-blur-sm">Featured</Badge>}
          <Badge variant="outline" className="border-white/30 text-white">
            {category}
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <div className="relative size-full overflow-hidden bg-card">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -end-16 -top-16 size-64 rounded-full opacity-[0.18] blur-3xl"
        style={{ background: 'var(--primary)' }}
      />
      <div className="absolute inset-0 flex items-end p-4">
        <div className="flex items-center gap-2">
          {featured && <Badge>Featured</Badge>}
          <Badge variant="outline">{category}</Badge>
        </div>
      </div>
    </div>
  );
};

const PostCard = ({ post, style }: { post: Post; style?: React.CSSProperties }) => {
  const titleId = `blog-01-post-${post.title.replace(/[^a-z0-9]+/gi, '-').slice(0, 24)}`;
  return (
    <Card
      data-slot="blog-post"
      style={style}
      className={cn(
        SWAP,
        'group relative gap-0 overflow-hidden p-0 transition-colors hover:border-foreground/30 focus-within:border-foreground/30',
      )}
    >
      <article aria-labelledby={titleId} className="flex h-full flex-col">
        {post.cover && (
          <a href={post.href} aria-hidden tabIndex={-1} className="block aspect-[16/10] overflow-hidden">
            <PostCover cover={post.cover} alt={post.title} category={post.category} />
          </a>
        )}
        <CardHeader className="px-5 pt-5">
          <div className="flex items-center justify-between">
            {!post.cover ? <Badge variant="outline">{post.category}</Badge> : <span aria-hidden />}
            <span className="inline-flex items-center gap-1 text-xs uppercase text-muted-foreground">
              <Clock aria-hidden className="size-2.5" />
              {post.readMin} min
            </span>
          </div>
          <CardTitle id={titleId} className="mt-2 text-base leading-snug tracking-[-0.01em] text-pretty">
            <a href={post.href} className="after:absolute after:inset-0 focus-visible:outline-none">
              {post.title}
            </a>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 px-5 py-4">
          <CardDescription className="text-pretty">{post.excerpt}</CardDescription>
        </CardContent>
        <Separator />
        <CardFooter className="px-5 py-4">
          <div className="flex w-full items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-[10px] font-medium text-foreground">
                {post.author.initials}
              </span>
              <span className="truncate text-xs text-foreground">{post.author.name}</span>
            </div>
            <span className="shrink-0 text-xs uppercase text-muted-foreground">{post.date}</span>
          </div>
        </CardFooter>
      </article>
    </Card>
  );
};

const Blog01 = () => {
  const [category, setCategory] = React.useState(ALL);
  // The first render staggers in after the header; later filter changes swap immediately.
  const [filtered, setFiltered] = React.useState(false);
  const showFeatured = category === ALL;
  const posts = showFeatured ? POSTS : ALL_POSTS.filter((post) => post.category === category);

  return (
    <section data-slot="blog" className="bg-background py-20 sm:py-28">
      <div className="container w-full">
        <div
          data-slot="blog-header"
          className="flex flex-col gap-5 border-b border-border pb-10 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="flex max-w-xl flex-col gap-4">
            <span className={cn(ENTER, 'text-xs uppercase text-muted-foreground')}>Journal</span>
            <h2
              style={stagger(1)}
              className={cn(ENTER, 'font-serif text-4xl font-medium leading-[1.04] tracking-tight sm:text-5xl')}
            >
              Writing from the workshop.
            </h2>
            <p style={stagger(2)} className={cn(ENTER, 'text-base text-muted-foreground')}>
              Patterns, release notes, and field reports from teams putting Hirael to work. No launch threads, no growth
              posts.
            </p>
          </div>
          <Button
            variant="link"
            className={cn(ENTER, 'group h-auto w-fit p-0')}
            style={stagger(3)}
            render={<a href="#" />}
            nativeButton={false}
          >
            All posts
            <ArrowRight className="size-3.5 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
          </Button>
        </div>

        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          spacing={2}
          value={category}
          onValueChange={(next) => {
            if (!next) return;
            setCategory(next);
            setFiltered(true);
          }}
          aria-label="Filter posts by category"
          data-slot="blog-filter"
          style={stagger(3)}
          className={cn(ENTER, 'mt-8 flex-wrap')}
        >
          {CATEGORIES.map((item) => (
            <ToggleGroupItem
              key={item}
              value={item}
              className="rounded-full data-pressed:border-primary data-pressed:bg-primary data-pressed:text-primary-foreground"
            >
              {item}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        {showFeatured && (
          <Card
            data-slot="blog-featured"
            style={filtered ? undefined : stagger(4)}
            className={cn(
              filtered ? SWAP : ENTER,
              'group mt-8 gap-0 overflow-hidden p-0 transition-colors hover:border-foreground/30 focus-within:border-foreground/30',
            )}
          >
            <article aria-labelledby="blog-01-featured-title" className="relative grid grid-cols-1 lg:grid-cols-12">
              <a
                href={FEATURED.href}
                aria-hidden
                tabIndex={-1}
                className="block aspect-[16/10] lg:col-span-7 lg:aspect-auto"
              >
                <PostCover cover={FEATURED.cover} alt={FEATURED.title} category={FEATURED.category} featured />
              </a>

              <div className="flex flex-col gap-4 p-6 lg:col-span-5 lg:p-8">
                <span className="flex items-center gap-2 text-xs uppercase text-muted-foreground">
                  <span>{FEATURED.date}</span>
                  <span aria-hidden className="text-border">
                    |
                  </span>
                  <span>{FEATURED.readMin} min read</span>
                </span>
                <h3
                  id="blog-01-featured-title"
                  className="text-2xl font-semibold leading-[1.15] tracking-[-0.025em] text-pretty sm:text-3xl"
                >
                  <a href={FEATURED.href} className="after:absolute after:inset-0 focus-visible:outline-none">
                    {FEATURED.title}
                  </a>
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{FEATURED.excerpt}</p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="inline-flex size-8 items-center justify-center rounded-full border border-border bg-muted text-xs font-medium text-foreground">
                    {FEATURED.author.initials}
                  </span>
                  <span className="text-sm text-foreground">{FEATURED.author.name}</span>
                </div>
                <Button
                  render={<a href={FEATURED.href} />}
                  nativeButton={false}
                  variant="default"
                  className="group/cta relative z-10 mt-2 w-fit"
                >
                  Read the post
                  <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover/cta:translate-x-0.5 rtl:rotate-180 rtl:group-hover/cta:-translate-x-0.5" />
                </Button>
              </div>
            </article>
          </Card>
        )}

        <div
          key={category}
          data-slot="blog-grid"
          className={cn('grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4', showFeatured ? 'mt-10' : 'mt-8')}
        >
          {posts.map((post, index) => (
            <PostCard key={post.title} post={post} style={stagger(index, 60, filtered ? 0 : 320)} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog01;
