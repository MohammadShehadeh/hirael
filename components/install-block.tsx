'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { SegmentedControl } from '@/components/segmented-control';
import { CopyButton } from '@/registry/hirael/bases/radix/components/copy-button';
import { PACKAGE_MANAGERS, type PackageManager, getShadcnAddCommand, usePackageManager } from '@/lib/package-managers';
import { SITE } from '@/lib/site';
import { useRegistryBase } from '@/components/active-theme';
import { registryItemPath } from '@/registry/hirael/registry-meta';

const installBlockVariants = cva('overflow-hidden rounded-md border border-border bg-card', {
  variants: {
    variant: {
      default: 'flex flex-col',
      inline: 'flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2',
      frame: 'flex flex-col rounded-none border-0 border-t bg-card/50',
    },
  },
  defaultVariants: { variant: 'default' },
});

const controlsVariants = cva('flex items-center gap-1', {
  variants: {
    variant: {
      default: 'order-first justify-between border-b border-border px-1 py-1',
      inline: 'ms-auto shrink-0',
      frame: 'order-first justify-between border-b border-border px-1 py-1',
    },
  },
  defaultVariants: { variant: 'default' },
});

const commandVariants = cva('flex min-w-0 items-center gap-2.5', {
  variants: {
    variant: {
      default: 'px-3 py-2.5',
      inline: 'flex-1 basis-64',
      frame: 'px-3 py-2.5',
    },
  },
  defaultVariants: { variant: 'default' },
});

interface InstallBlockProps extends VariantProps<typeof installBlockVariants> {
  name: string;
  className?: string;
}

export const InstallBlock = ({ name, className, variant }: InstallBlockProps) => {
  const { packageManager, setPackageManager } = usePackageManager();
  const origin = React.useSyncExternalStore(subscribeNoop, getClientOrigin, getServerOrigin);

  const url = `${origin}${registryItemPath(useRegistryBase(), name)}`;
  const command = getShadcnAddCommand(packageManager, url);

  return (
    <div className={cn(installBlockVariants({ variant }), className)}>
      <div className={commandVariants({ variant })}>
        <span aria-hidden className="select-none font-mono text-xs text-muted-foreground">
          $
        </span>
        <CommandLine command={command} />
      </div>

      <div className={controlsVariants({ variant })}>
        <SegmentedControl
          role="radio"
          ariaLabel="Package manager"
          value={packageManager}
          onValueChange={(value) => setPackageManager(value as PackageManager)}
          items={PACKAGE_MANAGERS.map((manager) => ({ value: manager, label: manager }))}
        />
        <CopyButton value={command} size="sm" aria-label="Copy install command" />
      </div>
    </div>
  );
};

// Read via useSyncExternalStore so the static HTML carries the canonical origin and the client swaps in its own on hydration without a mismatch.
const subscribeNoop = () => () => {};
const getServerOrigin = () => SITE.registry.origin;
const getClientOrigin = () => process.env.NEXT_PUBLIC_BASE_URL ?? window.location.origin;

// Hex values are VSCode light-plus / dark-plus token colors.
const TOKEN_CLASS = {
  runner: 'text-[#795e26] dark:text-[#dcdcaa]',
  verb: 'text-[#0000ff] dark:text-[#569cd6]',
  flag: 'text-[#0070c1] dark:text-[#9cdcfe]',
  pkg: 'text-[#267f99] dark:text-[#4ec9b0]',
  url: 'text-[#a31515] dark:text-[#ce9178]',
  plain: 'text-muted-foreground',
} as const;

const classifyToken = (token: string, index: number): keyof typeof TOKEN_CLASS => {
  if (index === 0) return 'runner';
  if (/^https?:\/\//.test(token)) return 'url';
  if (token.startsWith('-')) return 'flag';
  if (token === 'dlx' || token === 'add') return 'verb';
  if (token.includes('shadcn')) return 'pkg';
  return 'plain';
};

interface CommandLineProps {
  command: string;
}

const CommandLine = ({ command }: CommandLineProps) => {
  const tokens = command.split(' ');
  return (
    <code dir="ltr" className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-xs">
      {tokens.map((token, index) => (
        <React.Fragment key={index}>
          {index > 0 && ' '}
          <span className={TOKEN_CLASS[classifyToken(token, index)]}>{token}</span>
        </React.Fragment>
      ))}
    </code>
  );
};
