'use client';

import * as React from 'react';
import { FolderGit2, FolderPlus, Plus } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/radix/ui/badge';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/registry/hirael/bases/radix/ui/dialog';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/registry/hirael/bases/radix/ui/empty';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldTitle,
} from '@/registry/hirael/bases/radix/ui/field';
import { Input } from '@/registry/hirael/bases/radix/ui/input';
import { RadioGroup, RadioGroupItem } from '@/registry/hirael/bases/radix/ui/radio-group';

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]';
const ENTER = `animate-in fade-in slide-in-from-bottom-4 duration-500 ${EASE} fill-mode-both motion-reduce:animate-none`;
const SWAP = `animate-in fade-in slide-in-from-bottom-2 duration-300 ${EASE} fill-mode-both motion-reduce:animate-none`;

const stagger = (index: number, step = 60): React.CSSProperties => ({ animationDelay: `${index * step}ms` });

const NAME_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

interface Project {
  name: string;
  /** Repository the project was imported from; empty projects have none. */
  repo?: string;
}

interface Repo {
  fullName: string;
  description: string;
  updated: string;
}

const REPOS: readonly Repo[] = [
  { fullName: 'northwind/storefront', description: 'Next.js shop front', updated: 'Updated 2 hours ago' },
  { fullName: 'northwind/api-gateway', description: 'Edge routing and auth', updated: 'Updated yesterday' },
  { fullName: 'northwind/docs', description: 'Public docs site', updated: 'Updated 4 days ago' },
  { fullName: 'northwind/design-tokens', description: 'Shared colors and type scale', updated: 'Updated Sep 2' },
];

const TIPS = [
  { title: 'Preview every branch', text: 'Each push gets its own URL to share for review.' },
  { title: 'Keep secrets per project', text: 'Environment variables are scoped to one project.' },
  { title: 'Add a domain later', text: 'Connect a custom domain after the first deploy.' },
] as const;

const validateName = (name: string, taken: readonly string[]) => {
  if (!name) return 'Enter a project name.';
  if (name.length < 3 || name.length > 32) return 'Use 3 to 32 characters.';
  if (!NAME_RE.test(name)) return 'Use lowercase letters, numbers and single hyphens.';
  if (taken.includes(name)) return `A project named ${name} already exists.`;

  return null;
};

interface NewProjectDialogProps {
  trigger: React.ReactElement;
  taken: readonly string[];
  onCreate: (project: Project) => void;
}

const NewProjectDialog = ({ trigger, taken, onCreate }: NewProjectDialogProps) => {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);
  const inputId = React.useId();
  const errorId = React.useId();

  const error = validateName(name.trim(), taken);
  const showError = submitted && error !== null;

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    if (error) return;
    onCreate({ name: name.trim() });
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setName('');
          setSubmitted(false);
        }
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent data-slot="empty-state-01-dialog" className="sm:max-w-md">
        <form noValidate onSubmit={submit} className="flex flex-col gap-5">
          <DialogHeader>
            <DialogTitle>New project</DialogTitle>
            <DialogDescription>You can connect a repository after it is created.</DialogDescription>
          </DialogHeader>

          <Field data-invalid={showError || undefined} className="gap-2">
            <FieldLabel htmlFor={inputId}>Project name</FieldLabel>
            <Input
              id={inputId}
              value={name}
              autoComplete="off"
              spellCheck={false}
              placeholder="marketing-site"
              aria-invalid={showError || undefined}
              aria-describedby={showError ? errorId : undefined}
              onChange={(event) => setName(event.target.value)}
            />
            {showError ? (
              <FieldError id={errorId}>{error}</FieldError>
            ) : (
              <FieldDescription>Lowercase letters, numbers and hyphens.</FieldDescription>
            )}
          </Field>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create project</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface ImportDialogProps {
  trigger: React.ReactElement;
  imported: readonly string[];
  taken: readonly string[];
  onCreate: (project: Project) => void;
}

const ImportDialog = ({ trigger, imported, taken, onCreate }: ImportDialogProps) => {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string | null>(null);
  const listId = React.useId();

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selected) return;
    const base = selected.split('/')[1] ?? selected;
    let name = base;
    for (let n = 2; taken.includes(name); n++) name = `${base}-${n}`;
    onCreate({ name, repo: selected });
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setSelected(null);
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent data-slot="empty-state-01-import" className="sm:max-w-md">
        <form onSubmit={submit} className="flex flex-col gap-5">
          <DialogHeader>
            <DialogTitle>Import from GitHub</DialogTitle>
            <DialogDescription>Pick a repository from the northwind organization.</DialogDescription>
          </DialogHeader>

          <RadioGroup
            aria-label="Repositories"
            value={selected ?? ''}
            onValueChange={(value) => setSelected(value as string)}
          >
            {REPOS.map((repo) => {
              const done = imported.includes(repo.fullName);
              const id = `${listId}-${repo.fullName.replace('/', '-')}`;

              return (
                <FieldLabel key={repo.fullName} htmlFor={id} data-slot="empty-state-01-repo">
                  <Field orientation="horizontal" data-disabled={done}>
                    <FieldContent className="min-w-0">
                      <FieldTitle>{repo.fullName}</FieldTitle>
                      <FieldDescription>
                        {done ? 'Already imported' : `${repo.description}, ${repo.updated.toLowerCase()}`}
                      </FieldDescription>
                    </FieldContent>
                    <RadioGroupItem id={id} value={repo.fullName} disabled={done} />
                  </Field>
                </FieldLabel>
              );
            })}
          </RadioGroup>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!selected}>
              Import repository
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const EmptyState01 = () => {
  const [projects, setProjects] = React.useState<Project[]>([]);

  const taken = projects.map((project) => project.name);
  const imported = projects.flatMap((project) => (project.repo ? [project.repo] : []));
  const create = (project: Project) => setProjects((current) => [project, ...current]);

  return (
    <section data-slot="empty-state-01" className="bg-background">
      <div className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-24">
        <div
          data-slot="empty-state-01-panel"
          className={cn(ENTER, 'overflow-hidden rounded-lg border border-border bg-card text-card-foreground')}
        >
          <header
            data-slot="empty-state-01-header"
            className="flex items-center justify-between gap-4 border-b border-border px-5 py-3.5"
          >
            <div className="flex min-w-0 flex-col">
              <h2 className="text-sm font-medium text-foreground">Projects</h2>
              <p className="text-xs text-muted-foreground">
                <span className="tabular-nums">{projects.length}</span> {projects.length === 1 ? 'project' : 'projects'}{' '}
                in Northwind Labs
              </p>
            </div>
            {projects.length > 0 ? (
              <NewProjectDialog
                taken={taken}
                onCreate={create}
                trigger={
                  <Button type="button" size="sm">
                    <Plus aria-hidden />
                    New project
                  </Button>
                }
              />
            ) : null}
          </header>

          {projects.length === 0 ? (
            <div data-slot="empty-state-01-empty" className={SWAP}>
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <FolderPlus />
                  </EmptyMedia>
                  <EmptyTitle>Create your first project</EmptyTitle>
                  <EmptyDescription>
                    A project holds your deployments, environment variables and domains. Start empty or bring a
                    repository.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <div className="flex flex-wrap justify-center gap-2">
                    <NewProjectDialog
                      taken={taken}
                      onCreate={create}
                      trigger={
                        <Button type="button">
                          <Plus aria-hidden />
                          New project
                        </Button>
                      }
                    />
                    <ImportDialog
                      taken={taken}
                      imported={imported}
                      onCreate={create}
                      trigger={
                        <Button type="button" variant="outline">
                          <FolderGit2 aria-hidden />
                          Import from GitHub
                        </Button>
                      }
                    />
                  </div>
                </EmptyContent>
              </Empty>

              <ul data-slot="empty-state-01-tips" className="grid border-t border-border sm:grid-cols-3">
                {TIPS.map((tip, index) => (
                  <li
                    key={tip.title}
                    data-slot="empty-state-01-tip"
                    style={stagger(index + 2)}
                    className={cn(
                      ENTER,
                      'flex flex-col gap-0.5 border-border px-5 py-4 not-first:border-t sm:not-first:border-s sm:not-first:border-t-0',
                    )}
                  >
                    <span className="text-sm font-medium text-foreground">{tip.title}</span>
                    <span className="text-xs/relaxed text-muted-foreground">{tip.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <ul data-slot="empty-state-01-list" className="divide-y divide-border">
              {projects.map((project) => (
                <li
                  key={project.name}
                  data-slot="empty-state-01-project"
                  className={cn(SWAP, 'flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3.5')}
                >
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-medium text-foreground">{project.name}</span>
                    <span className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
                      {project.repo ? (
                        <>
                          <FolderGit2 aria-hidden className="size-3.5 shrink-0" />
                          <span className="truncate">{project.repo}, created just now</span>
                        </>
                      ) : (
                        <span>Empty project, created just now</span>
                      )}
                    </span>
                  </span>
                  <Badge variant="outline">No deploys yet</Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};

export default EmptyState01;
