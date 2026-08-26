import type * as React from "react";
import type { MDXComponents } from "mdx/types";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Separator } from "@/registry/hirael/ui/separator";

/**
 * Prose styling for MDX rendered in the changelog. Kept token-only so it reads
 * correctly in both themes; internal links route through next/link.
 */
export const mdxComponents: MDXComponents = {
  h2: ({ className, ...props }: React.ComponentProps<"h2">) => (
    <h2
      className={cn(
        "mt-8 text-lg font-medium tracking-[-0.01em] text-foreground first:mt-0",
        className,
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: React.ComponentProps<"h3">) => (
    <h3
      className={cn(
        "mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground",
        className,
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }: React.ComponentProps<"p">) => (
    <p
      className={cn(
        "mt-4 text-sm leading-relaxed text-foreground/80 first:mt-0",
        className,
      )}
      {...props}
    />
  ),
  ul: ({ className, ...props }: React.ComponentProps<"ul">) => (
    <ul className={cn("mt-3 space-y-2 text-sm", className)} {...props} />
  ),
  ol: ({ className, ...props }: React.ComponentProps<"ol">) => (
    <ol
      className={cn("mt-3 list-decimal space-y-2 ps-5 text-sm", className)}
      {...props}
    />
  ),
  li: ({ className, children, ...props }: React.ComponentProps<"li">) => (
    <li className={cn("flex gap-2.5", className)} {...props}>
      <span
        aria-hidden
        className="mt-2 size-1 shrink-0 rounded-full bg-muted-foreground/50"
      />
      <span className="leading-relaxed text-foreground/80">{children}</span>
    </li>
  ),
  a: ({ className, href, ...props }: React.ComponentProps<"a">) => {
    const classes = cn(
      "font-medium text-foreground underline underline-offset-4 decoration-border transition-colors hover:decoration-foreground",
      className,
    );
    if (href && /^https?:\/\//.test(href)) {
      return (
        <a
          href={href}
          className={classes}
          target="_blank"
          rel="noreferrer"
          {...props}
        />
      );
    }
    return <Link href={href ?? "#"} className={classes} {...props} />;
  },
  strong: ({ className, ...props }: React.ComponentProps<"strong">) => (
    <strong
      className={cn("font-medium text-foreground", className)}
      {...props}
    />
  ),
  code: ({ className, ...props }: React.ComponentProps<"code">) => (
    <code
      className={cn(
        "rounded-sm border border-border bg-card px-1.5 py-0.5 font-mono text-[0.85em]",
        className,
      )}
      {...props}
    />
  ),
  pre: ({ className, ...props }: React.ComponentProps<"pre">) => (
    <pre
      className={cn(
        "mt-4 overflow-x-auto rounded-lg border border-border bg-card p-4 font-mono text-[13px] leading-relaxed [&_code]:border-0 [&_code]:bg-transparent [&_code]:p-0",
        className,
      )}
      {...props}
    />
  ),
  hr: ({ className }: React.ComponentProps<"hr">) => (
    <Separator className={cn("my-8", className)} />
  ),
};
