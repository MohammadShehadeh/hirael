'use client';

import * as React from 'react';
import { Check, Copy, Eye, EyeOff, Plus } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';

type ApiKeysProps = React.ComponentProps<'div'>;

const ApiKeys = ({ className, ...props }: ApiKeysProps) => {
  return (
    <div
      data-slot="api-keys"
      className={cn(
        'flex flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground',
        className,
      )}
      {...props}
    />
  );
};

type ApiKeysHeaderProps = React.ComponentProps<'div'>;

const ApiKeysHeader = ({ className, ...props }: ApiKeysHeaderProps) => {
  return (
    <div
      data-slot="api-keys-header"
      className={cn('flex items-center justify-between gap-2 border-b border-border px-4 py-3', className)}
      {...props}
    />
  );
};

type ApiKeysTitleProps = React.ComponentProps<'h3'>;

const ApiKeysTitle = ({ className, ...props }: ApiKeysTitleProps) => {
  return <h3 data-slot="api-keys-title" className={cn('text-sm font-medium text-foreground', className)} {...props} />;
};

type ApiKeysListProps = React.ComponentProps<'ul'>;

const ApiKeysList = ({ className, ...props }: ApiKeysListProps) => {
  return <ul data-slot="api-keys-list" className={cn('divide-y divide-border', className)} {...props} />;
};

type ApiKeyItemProps = React.ComponentProps<'li'>;

const ApiKeyItem = ({ className, ...props }: ApiKeyItemProps) => {
  return (
    <li
      data-slot="api-key-item"
      className={cn('flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3', className)}
      {...props}
    />
  );
};

interface ApiKeyNameProps extends React.ComponentProps<'div'> {
  label: React.ReactNode;
}

const ApiKeyName = ({ label, className, children, ...props }: ApiKeyNameProps) => {
  return (
    <div data-slot="api-key-name" className={cn('flex min-w-0 flex-col', className)} {...props}>
      <span className="truncate text-sm font-medium text-foreground">{label}</span>
      {children ? (
        <span className="truncate font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
          {children}
        </span>
      ) : null}
    </div>
  );
};

interface ApiKeyValueProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  value: string;
  /** Whether the key starts revealed. */
  defaultRevealed?: boolean;
}

const ApiKeyValue = ({ value, defaultRevealed = false, className, ...props }: ApiKeyValueProps) => {
  const [revealed, setRevealed] = React.useState(defaultRevealed);
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  React.useEffect(() => () => clearTimeout(timer.current), []);

  const masked = `${value.slice(0, 3)}${'•'.repeat(8)}${value.slice(-4)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      data-slot="api-key-value"
      className={cn(
        'inline-flex items-center gap-0.5 rounded-md border border-border bg-background py-0.5 pe-0.5 ps-2',
        className,
      )}
      {...props}
    >
      <code className="truncate font-mono text-xs text-foreground">{revealed ? value : masked}</code>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={revealed ? 'Hide key' : 'Reveal key'}
        aria-pressed={revealed}
        onClick={() => setRevealed((value) => !value)}
        className="size-6 rounded text-muted-foreground hover:text-foreground [&_svg]:size-3.5"
      >
        {revealed ? <EyeOff /> : <Eye />}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={copied ? 'Copied' : 'Copy key'}
        onClick={copy}
        className="size-6 rounded text-muted-foreground hover:text-foreground [&_svg]:size-3.5"
      >
        {copied ? <Check className="text-success" /> : <Copy />}
      </Button>
    </div>
  );
};

type ApiKeyMetaProps = React.ComponentProps<'span'>;

const ApiKeyMeta = ({ className, ...props }: ApiKeyMetaProps) => {
  return (
    <span
      data-slot="api-key-meta"
      className={cn('font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground', className)}
      {...props}
    />
  );
};

export { ApiKeys, ApiKeysHeader, ApiKeysTitle, ApiKeysList, ApiKeyItem, ApiKeyName, ApiKeyValue, ApiKeyMeta };

const API_KEY_ROWS = [
  {
    label: 'Production',
    created: 'Created Mar 4',
    used: 'Used 2h ago',
    value: 'sk_live_9f8a7b6c5d4e3f2a1b0c',
  },
  {
    label: 'Development',
    created: 'Created Apr 18',
    used: 'Used 5d ago',
    value: 'sk_test_1a2b3c4d5e6f7g8h9i0j',
  },
];

const ApiKeysBlock = () => {
  return (
    <section data-slot="api-keys-block" className="flex w-full justify-center bg-background p-6 sm:p-10">
      <ApiKeys className="w-full max-w-xl">
        <ApiKeysHeader>
          <ApiKeysTitle>API keys</ApiKeysTitle>
          <Button type="button" size="sm">
            <Plus />
            Create key
          </Button>
        </ApiKeysHeader>
        <ApiKeysList>
          {API_KEY_ROWS.map((key) => (
            <ApiKeyItem key={key.label}>
              <ApiKeyName label={key.label}>{key.created}</ApiKeyName>
              <ApiKeyValue value={key.value} className="ms-auto" />
              <ApiKeyMeta>{key.used}</ApiKeyMeta>
            </ApiKeyItem>
          ))}
        </ApiKeysList>
      </ApiKeys>
    </section>
  );
};

export default ApiKeysBlock;
