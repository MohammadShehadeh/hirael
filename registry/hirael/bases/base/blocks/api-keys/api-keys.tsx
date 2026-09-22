'use client';

import * as React from 'react';
import { Check, Copy, Eye, EyeOff, Plus, Trash2 } from 'lucide-react';

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
      {children ? <span className="truncate text-xs uppercase text-muted-foreground">{children}</span> : null}
    </div>
  );
};

interface ApiKeyValueProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  value: string;
  /** Whether the key starts revealed. */
  defaultRevealed?: boolean;
  /** Show the reveal toggle. Turn off for keys that can only be seen once. */
  revealable?: boolean;
  /** Show the copy button. */
  copyable?: boolean;
}

const ApiKeyValue = ({
  value,
  defaultRevealed = false,
  revealable = true,
  copyable = true,
  className,
  ...props
}: ApiKeyValueProps) => {
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
      <code dir="ltr" className="truncate font-mono text-xs text-foreground">
        {revealed ? value : masked}
      </code>
      {revealable ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          aria-label={revealed ? 'Hide key' : 'Reveal key'}
          aria-pressed={revealed}
          onClick={() => setRevealed((value) => !value)}
        >
          {revealed ? <EyeOff /> : <Eye />}
        </Button>
      ) : null}
      {copyable ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          aria-label={copied ? 'Copied' : 'Copy key'}
          onClick={copy}
        >
          {copied ? <Check className="text-foreground" /> : <Copy />}
        </Button>
      ) : null}
    </div>
  );
};

type ApiKeyMetaProps = React.ComponentProps<'span'>;

const ApiKeyMeta = ({ className, ...props }: ApiKeyMetaProps) => {
  return (
    <span data-slot="api-key-meta" className={cn('text-xs uppercase text-muted-foreground', className)} {...props} />
  );
};

export { ApiKeys, ApiKeysHeader, ApiKeysTitle, ApiKeysList, ApiKeyItem, ApiKeyName, ApiKeyValue, ApiKeyMeta };

const ENTER =
  'animate-in fade-in slide-in-from-bottom-2 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
const SWAP =
  'animate-in fade-in slide-in-from-bottom-1 duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

interface ApiKeyRow {
  id: string;
  label: string;
  created: string;
  used: string;
  value: string;
  /** Keys created here can't be revealed again once the one-time notice is dismissed. */
  sealed?: boolean;
}

const API_KEY_ROWS: ApiKeyRow[] = [
  {
    id: 'production',
    label: 'Production',
    created: 'Created Mar 4',
    used: 'Used 2h ago',
    value: 'sk_live_9f8a7b6c5d4e3f2a1b0c',
  },
  {
    id: 'development',
    label: 'Development',
    created: 'Created Apr 18',
    used: 'Used 5d ago',
    value: 'sk_test_1a2b3c4d5e6f7g8h9i0j',
  },
];

const generateSecret = () => {
  const bytes = new Uint8Array(10);
  crypto.getRandomValues(bytes);
  return `sk_live_${Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')}`;
};

const ApiKeysBlock = () => {
  const [rows, setRows] = React.useState<ApiKeyRow[]>(API_KEY_ROWS);
  const [revealedId, setRevealedId] = React.useState<string | null>(null);
  const [confirmId, setConfirmId] = React.useState<string | null>(null);
  const createdCount = React.useRef(0);

  const revealedRow = rows.find((row) => row.id === revealedId);

  const createKey = () => {
    createdCount.current += 1;
    const count = createdCount.current;
    const id = `key-${count}`;
    const row: ApiKeyRow = {
      id,
      label: `Server key ${count}`,
      created: 'Created just now',
      used: 'Never used',
      value: generateSecret(),
      sealed: true,
    };
    setRows((current) => [...current, row]);
    setRevealedId(id);
    setConfirmId(null);
  };

  const revoke = (id: string) => {
    setRows((current) => current.filter((row) => row.id !== id));
    setConfirmId(null);
    if (revealedId === id) setRevealedId(null);
  };

  return (
    <section data-slot="api-keys-block" className="flex w-full justify-center bg-background p-6 sm:p-10">
      <ApiKeys className={cn(ENTER, 'w-full max-w-xl')}>
        <ApiKeysHeader>
          <ApiKeysTitle>API keys</ApiKeysTitle>
          <Button type="button" size="sm" onClick={createKey}>
            <Plus />
            Create key
          </Button>
        </ApiKeysHeader>

        {revealedRow ? (
          <div
            key={revealedRow.id}
            data-slot="api-keys-reveal"
            role="status"
            className={cn(SWAP, 'flex flex-col gap-3 border-b border-border bg-muted/40 px-4 py-3')}
          >
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-medium">{revealedRow.label} is ready</p>
              <p className="text-xs text-muted-foreground">
                Copy it now and store it somewhere safe. You won&apos;t be able to see it again.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <ApiKeyValue value={revealedRow.value} defaultRevealed revealable={false} className="min-w-0" />
              <Button type="button" variant="ghost" size="sm" className="ms-auto" onClick={() => setRevealedId(null)}>
                Done
              </Button>
            </div>
          </div>
        ) : null}

        {rows.length === 0 ? (
          <div
            key="empty"
            data-slot="api-keys-empty"
            className={cn(SWAP, 'flex flex-col items-center gap-1 px-4 py-10 text-center')}
          >
            <p className="text-sm font-medium">No API keys</p>
            <p className="text-xs text-muted-foreground">Create a key to call the API from your servers.</p>
          </div>
        ) : (
          <ApiKeysList>
            {rows.map((row) =>
              confirmId === row.id ? (
                <ApiKeyItem key={`${row.id}-confirm`} className={cn(SWAP, 'bg-destructive/5')}>
                  <p className="min-w-0 flex-1 text-sm">
                    Revoke <span className="font-medium">{row.label}</span>? Requests using it start failing right away.
                  </p>
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="ghost" size="sm" onClick={() => setConfirmId(null)}>
                      Cancel
                    </Button>
                    <Button type="button" variant="destructive" size="sm" onClick={() => revoke(row.id)}>
                      Revoke
                    </Button>
                  </div>
                </ApiKeyItem>
              ) : (
                <ApiKeyItem key={row.id} className={SWAP}>
                  <ApiKeyName label={row.label}>{row.created}</ApiKeyName>
                  <ApiKeyValue value={row.value} revealable={!row.sealed} copyable={!row.sealed} className="ms-auto" />
                  <ApiKeyMeta>{row.used}</ApiKeyMeta>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Revoke ${row.label}`}
                    onClick={() => setConfirmId(row.id)}
                  >
                    <Trash2 />
                  </Button>
                </ApiKeyItem>
              ),
            )}
          </ApiKeysList>
        )}
      </ApiKeys>
    </section>
  );
};

export default ApiKeysBlock;
