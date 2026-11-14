'use client';

import * as React from 'react';
import { ArrowLeft, ThumbsDown, ThumbsUp } from 'lucide-react';

import { cn } from '@/lib/utils';
import { CopyButton } from '@/registry/hirael/bases/base/components/copy-button';
import { Avatar, AvatarFallback } from '@/registry/hirael/bases/base/ui/avatar';
import { Badge } from '@/registry/hirael/bases/base/ui/badge';
import { Button } from '@/registry/hirael/bases/base/ui/button';

const POST_URL = 'https://hirael.com/blog/build-times';

const RESULTS = [
  { label: 'Median build', before: '4 min 10 s', after: '42 s' },
  { label: 'Cache hit rate', before: '31%', after: '88%' },
  { label: 'Builds per day', before: '1,900', after: '2,600' },
] as const;

const RELATED = [
  { title: 'What we learned moving 12 storefronts in a weekend', date: 'Oct 21, 2026', dateTime: '2026-10-21' },
  { title: 'Counting build minutes per second', date: 'Sep 30, 2026', dateTime: '2026-09-30' },
] as const;

type Vote = 'up' | 'down';

const VOTE_REPLY: Record<Vote, string> = {
  up: 'Thanks. We will write more like this.',
  down: 'Thanks. Tell us what was missing at hello@mohammadshehadeh.com.',
};

const FOCUS_RING = 'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none';

const PROSE = 'text-base leading-relaxed text-pretty text-foreground/90';

const ArticleHeader = () => (
  <header className="flex flex-col gap-6">
    <a
      href="#"
      className={cn(
        'group inline-flex w-fit items-center gap-1.5 rounded-sm text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground',
        FOCUS_RING,
      )}
    >
      <ArrowLeft
        aria-hidden
        className="size-4 transition-transform duration-150 group-hover:-translate-x-0.5 rtl:rotate-180 rtl:group-hover:translate-x-0.5"
      />
      All posts
    </a>
    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
      <Badge variant="secondary">Engineering</Badge>
      <time dateTime="2026-11-09">Nov 9, 2026</time>
      <span aria-hidden className="text-border">
        |
      </span>
      <span>6 min read</span>
    </div>
    <h1 className="text-4xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-5xl">
      How we cut build times from four minutes to 42 seconds
    </h1>
    <p className="text-lg leading-relaxed text-pretty text-muted-foreground">
      Most of the time went to installing the same dependencies again. Sharing one cache across branches fixed more than
      any faster machine did.
    </p>
    <div className="flex flex-wrap items-center justify-between gap-4 border-y border-border py-4">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarFallback>MS</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-medium">Mohammad Shehadeh</span>
          <span className="text-sm text-muted-foreground">Founder, Hirael</span>
        </div>
      </div>
      <CopyButton value={POST_URL} variant="outline" size="sm" copiedLabel="Link copied">
        Copy link
      </CopyButton>
    </div>
  </header>
);

const ArticleBody = () => (
  <div data-slot="blog-article-body" className="flex flex-col gap-6">
    <p className={PROSE}>
      In August the median build on Hirael took 4 minutes and 10 seconds. We had already moved to larger machines twice,
      and each move bought about 20 seconds. So we stopped guessing and timed every step of 500 builds.
    </p>

    <h2 className="mt-4 text-2xl font-semibold tracking-tight">Where the time went</h2>
    <p className={PROSE}>
      Compiling was not the problem. Installing dependencies took 61% of a typical build, because every branch kept its
      own cache and a new branch started with nothing. A pull request that changed one line still downloaded 1,400
      packages.
    </p>
    <blockquote className="border-s-2 border-primary ps-5 text-xl leading-snug font-medium tracking-tight text-balance">
      A new branch is almost never a new project. It should not have to build like one.
    </blockquote>

    <h2 className="mt-4 text-2xl font-semibold tracking-tight">What we changed</h2>
    <ol className="flex list-decimal flex-col gap-3 ps-5 marker:text-muted-foreground">
      <li className={PROSE}>The cache is keyed by the lockfile, not the branch, so branches share it.</li>
      <li className={PROSE}>Only packages that changed are fetched, and the rest are linked from the cache.</li>
      <li className={PROSE}>Build output is restored per route, so an unchanged page is not rebuilt.</li>
    </ol>

    <h2 className="mt-4 text-2xl font-semibold tracking-tight">The result</h2>
    <dl data-slot="blog-article-results" className="grid border-y border-border sm:grid-cols-3">
      {RESULTS.map((result) => (
        <div
          key={result.label}
          className="flex flex-col gap-1 border-b border-border py-4 last:border-b-0 sm:border-s sm:border-b-0 sm:px-5 sm:first:border-s-0 sm:first:ps-0"
        >
          <dt className="text-xs text-muted-foreground uppercase">{result.label}</dt>
          <dd className="text-2xl font-semibold tracking-tight tabular-nums">{result.after}</dd>
          <dd className="text-sm text-muted-foreground tabular-nums">was {result.before}</dd>
        </div>
      ))}
    </dl>
    <p className={PROSE}>
      The change went out to every workspace on November 9. There is nothing to turn on. If a build looks slower than
      before, the first run after the change is filling the shared cache, and the second one will show the difference.
    </p>
  </div>
);

const ArticleFeedback = () => {
  const [vote, setVote] = React.useState<Vote | null>(null);

  return (
    <div data-slot="blog-article-feedback" className="flex flex-col gap-3 border-y border-border py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium">Was this post useful?</p>
        <div className="flex items-center gap-2">
          <Button
            variant={vote === 'up' ? 'default' : 'outline'}
            size="sm"
            aria-pressed={vote === 'up'}
            onClick={() => setVote(vote === 'up' ? null : 'up')}
          >
            <ThumbsUp aria-hidden />
            Yes
          </Button>
          <Button
            variant={vote === 'down' ? 'default' : 'outline'}
            size="sm"
            aria-pressed={vote === 'down'}
            onClick={() => setVote(vote === 'down' ? null : 'down')}
          >
            <ThumbsDown aria-hidden />
            No
          </Button>
        </div>
      </div>
      <p aria-live="polite" className="text-sm text-muted-foreground empty:hidden">
        {vote ? VOTE_REPLY[vote] : null}
      </p>
    </div>
  );
};

const Blog03 = () => (
  <article data-slot="blog-article" className="bg-background py-16 sm:py-24">
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-6 md:px-10">
      <ArticleHeader />

      <ArticleBody />
      <ArticleFeedback />

      <nav aria-label="Related posts" className="flex flex-col gap-3">
        <h2 className="text-xs text-muted-foreground uppercase">Keep reading</h2>
        <ul className="flex flex-col">
          {RELATED.map((post) => (
            <li key={post.title} className="border-b border-border last:border-b-0">
              <a
                href="#"
                className={cn(
                  'group flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 rounded-sm py-3',
                  FOCUS_RING,
                )}
              >
                <span className="text-base font-medium tracking-[-0.01em] group-hover:underline group-hover:underline-offset-4">
                  {post.title}
                </span>
                <time dateTime={post.dateTime} className="text-sm text-muted-foreground tabular-nums">
                  {post.date}
                </time>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  </article>
);

export default Blog03;
