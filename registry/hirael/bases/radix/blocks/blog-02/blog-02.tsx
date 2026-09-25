'use client';

import * as React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/registry/hirael/bases/radix/ui/empty';
import { Tabs, TabsList, TabsTrigger } from '@/registry/hirael/bases/radix/ui/tabs';

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]';
const ENTER = `animate-in fade-in slide-in-from-bottom-4 duration-500 ${EASE} fill-mode-both motion-reduce:animate-none`;
const SWAP = `animate-in fade-in slide-in-from-bottom-2 duration-300 ${EASE} fill-mode-both motion-reduce:animate-none`;

const stagger = (index: number, step = 60): React.CSSProperties => ({ animationDelay: `${index * step}ms` });

// Placeholder photos served from hirael.com. Swap them for your own assets, or
// add the host to `images.remotePatterns` in next.config to keep them.
const IMG = {
  a: '/media/blocks/blog-02/cover-a.jpg',
  b: '/media/blocks/blog-02/cover-b.jpg',
  c: '/media/blocks/blog-02/cover-c.jpg',
} as const;

const CATEGORIES = ['Engineering', 'Design', 'Company', 'Research'] as const;

type Category = (typeof CATEGORIES)[number];
type Filter = 'All' | Category;

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  category: Category;
  /** ISO date, used for `dateTime`. */
  date: string;
  /** Display date, e.g. "Sep 04, 2026". */
  dateLabel: string;
  readMin: number;
  cover: string;
  href: string;
}

const POSTS: readonly Post[] = [
  {
    slug: 'sync-engine-rewrite',
    title: 'Rewriting the sync engine without a feature freeze',
    excerpt: 'We ran the old and new engines side by side for six weeks and compared every write.',
    category: 'Engineering',
    date: '2026-09-04',
    dateLabel: 'Sep 04, 2026',
    readMin: 9,
    cover: IMG.a,
    href: '#',
  },
  {
    slug: 'empty-states',
    title: 'What an empty inbox should say',
    excerpt: 'Three rounds of copy tests on the screen people see most on their first day.',
    category: 'Design',
    date: '2026-08-27',
    dateLabel: 'Aug 27, 2026',
    readMin: 5,
    cover: IMG.b,
    href: '#',
  },
  {
    slug: 'series-a',
    title: 'We raised a Series A, and here is what changes',
    excerpt: 'Short version: more people on support, the same pricing, and no plans to sell your data.',
    category: 'Company',
    date: '2026-08-19',
    dateLabel: 'Aug 19, 2026',
    readMin: 4,
    cover: IMG.c,
    href: '#',
  },
  {
    slug: 'search-latency',
    title: 'How we got search under 80ms at p95',
    excerpt: 'A smaller index, a warmer cache, and one query planner bug that cost us a month.',
    category: 'Engineering',
    date: '2026-08-06',
    dateLabel: 'Aug 06, 2026',
    readMin: 7,
    cover: IMG.b,
    href: '#',
  },
  {
    slug: 'density-settings',
    title: 'One layout, three densities',
    excerpt: 'Why compact mode is a spacing scale and not a separate set of components.',
    category: 'Design',
    date: '2026-07-24',
    dateLabel: 'Jul 24, 2026',
    readMin: 6,
    cover: IMG.a,
    href: '#',
  },
  {
    slug: 'on-call',
    title: 'On-call for a team of eight',
    excerpt: 'The rotation, the runbooks, and the rule that nobody gets paged twice in one night.',
    category: 'Engineering',
    date: '2026-07-10',
    dateLabel: 'Jul 10, 2026',
    readMin: 8,
    cover: IMG.c,
    href: '#',
  },
  {
    slug: 'keyboard-first',
    title: 'Designing for people who never touch the mouse',
    excerpt: 'Every action in the app now has a shortcut. Here is how we chose them.',
    category: 'Design',
    date: '2026-06-26',
    dateLabel: 'Jun 26, 2026',
    readMin: 6,
    cover: IMG.b,
    href: '#',
  },
  {
    slug: 'remote-offsite',
    title: 'Notes from our first offsite in Lisbon',
    excerpt: 'Four days, twenty-two people, and the planning doc that came out of it.',
    category: 'Company',
    date: '2026-06-12',
    dateLabel: 'Jun 12, 2026',
    readMin: 3,
    cover: IMG.a,
    href: '#',
  },
];

const FILTERS: readonly Filter[] = ['All', ...CATEGORIES];

const countFor = (filter: Filter) =>
  filter === 'All' ? POSTS.length : POSTS.filter((post) => post.category === filter).length;

interface PostRowProps {
  post: Post;
  index: number;
}

const PostRow = ({ post, index }: PostRowProps) => {
  return (
    <li data-slot="blog-post" style={stagger(index, 50)} className={cn(SWAP, 'border-b border-border')}>
      <a
        href={post.href}
        className="group grid grid-cols-1 gap-x-8 gap-y-2 py-6 transition-colors duration-150 outline-none hover:bg-muted/30 focus-visible:bg-muted/30 focus-visible:ring-2 focus-visible:ring-ring/50 sm:grid-cols-[7rem_minmax(0,1fr)_auto] sm:items-center sm:px-3"
      >
        <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
          <time dateTime={post.date} className="tabular-nums">
            {post.dateLabel}
          </time>
          <span className="sm:hidden">
            {post.category}, <span className="tabular-nums">{post.readMin}</span> min read
          </span>
        </div>

        <div className="flex min-w-0 flex-col gap-1.5">
          <h3 className="text-base leading-snug font-medium tracking-[-0.01em] text-foreground sm:text-lg">
            {post.title}
          </h3>
          <p className="truncate text-sm text-muted-foreground">{post.excerpt}</p>
        </div>

        <div className="hidden items-center gap-6 sm:flex">
          <div className="flex w-24 flex-col items-end gap-1 text-end text-xs">
            <span className="text-foreground">{post.category}</span>
            <span className="text-muted-foreground">
              <span className="tabular-nums">{post.readMin}</span> min read
            </span>
          </div>
          <div className="relative aspect-4/3 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
            <Image
              src={post.cover}
              alt=""
              fill
              sizes="80px"
              className="object-cover opacity-80 transition-[opacity,scale] duration-300 ease-out group-hover:scale-105 group-hover:opacity-100 motion-reduce:transition-none"
            />
          </div>
          <ArrowRight
            aria-hidden
            className="size-4 shrink-0 -translate-x-1 text-muted-foreground opacity-0 transition-[translate,opacity] duration-150 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 rtl:translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-0 rtl:group-focus-visible:translate-x-0"
          />
        </div>
      </a>
    </li>
  );
};

const Blog02 = () => {
  const [filter, setFilter] = React.useState<Filter>('All');
  const visible = filter === 'All' ? POSTS : POSTS.filter((post) => post.category === filter);

  return (
    <section data-slot="blog" aria-labelledby="blog-02-heading" className="bg-background py-20 sm:py-28">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 md:px-10">
        <header
          data-slot="blog-header"
          className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-10"
        >
          <div className="flex max-w-md flex-col gap-4">
            <span className={cn(ENTER, 'text-xs text-muted-foreground uppercase')}>Journal</span>
            <h2
              id="blog-02-heading"
              style={stagger(1, 80)}
              className={cn(ENTER, 'text-3xl font-semibold tracking-tight text-balance sm:text-4xl')}
            >
              Writing
            </h2>
            <p style={stagger(2, 80)} className={cn(ENTER, 'text-base leading-relaxed text-muted-foreground')}>
              How we build Hirael, why it looks the way it does, and what the company is up to.
            </p>
          </div>

          <div style={stagger(3, 80)} className={cn(ENTER, '-mx-6 overflow-x-auto px-6 md:mx-0 md:px-0')}>
            <Tabs value={filter} onValueChange={(value) => setFilter(value as Filter)} aria-label="Filter posts">
              <TabsList data-slot="blog-filter" variant="line">
                {FILTERS.map((item) => (
                  <TabsTrigger key={item} value={item}>
                    {item}
                    <span className="text-xs text-muted-foreground tabular-nums">{countFor(item)}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </header>

        <div style={stagger(4, 80)} className={cn(ENTER, 'border-t border-border')}>
          {visible.length === 0 ? (
            <div key={filter} className="border-b border-border">
              <Empty data-slot="blog-empty" className={SWAP}>
                <EmptyHeader>
                  <EmptyTitle>No {filter.toLowerCase()} posts yet</EmptyTitle>
                  <EmptyDescription>
                    The first one is in review. Subscribe to the feed and it will show up when it is published.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button variant="outline" size="sm" onClick={() => setFilter('All')}>
                    Show all posts
                  </Button>
                </EmptyContent>
              </Empty>
            </div>
          ) : (
            <ul key={filter} data-slot="blog-list" className="flex flex-col">
              {visible.map((post, index) => (
                <PostRow key={post.slug} post={post} index={index} />
              ))}
            </ul>
          )}
        </div>

        <footer data-slot="blog-footer" className="flex items-center justify-between gap-4">
          <span className="text-xs text-muted-foreground">
            Showing <span className="tabular-nums">{visible.length}</span> of{' '}
            <span className="tabular-nums">{POSTS.length}</span>
          </span>
          <Button variant="link" className="group/more h-auto" asChild>
            <a href="#">
              View all posts
              <ArrowRight
                aria-hidden
                className="size-3.5 transition-transform duration-150 ease-out group-hover/more:translate-x-0.5 rtl:rotate-180 rtl:group-hover/more:-translate-x-0.5"
              />
            </a>
          </Button>
        </footer>
      </div>
    </section>
  );
};

export default Blog02;
