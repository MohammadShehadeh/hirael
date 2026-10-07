'use client';

import * as React from 'react';
import { CircleCheck, SmilePlus } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/hirael/bases/base/ui/avatar';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/hirael/bases/base/ui/popover';
import { Textarea } from '@/registry/hirael/bases/base/ui/textarea';
import { useControllableState } from '@/registry/hirael/hooks/use-controllable-state';

interface CommentThreadContextValue {
  resolved: boolean;
  setResolved: (resolved: boolean) => void;
}

const CommentThreadContext = React.createContext<CommentThreadContextValue | null>(null);

const useCommentThread = () => {
  const ctx = React.useContext(CommentThreadContext);
  if (!ctx) {
    throw new Error('CommentThread compound parts must be used inside <CommentThread>');
  }

  return ctx;
};

export interface CommentThreadProps extends React.ComponentProps<'section'> {
  /** Resolved threads collapse their replies and composer. */
  resolved?: boolean;
  defaultResolved?: boolean;
  onResolvedChange?: (resolved: boolean) => void;
}

const CommentThread = ({
  resolved: resolvedProp,
  defaultResolved = false,
  onResolvedChange,
  className,
  ...props
}: CommentThreadProps) => {
  const [resolved, setResolved] = useControllableState({
    prop: resolvedProp,
    defaultProp: defaultResolved,
    onChange: onResolvedChange,
  });
  const ctx = React.useMemo<CommentThreadContextValue>(() => ({ resolved, setResolved }), [resolved, setResolved]);

  return (
    <CommentThreadContext.Provider value={ctx}>
      <section
        data-slot="comment-thread"
        data-resolved={resolved || undefined}
        className={cn(
          'group/thread grid gap-4 rounded-lg border border-border bg-card p-4 text-card-foreground data-resolved:bg-muted/40',
          className,
        )}
        {...props}
      />
    </CommentThreadContext.Provider>
  );
};

const CommentThreadHeader = ({ className, ...props }: React.ComponentProps<'header'>) => {
  return (
    <header
      data-slot="comment-thread-header"
      className={cn('flex items-center justify-between gap-3 text-sm', className)}
      {...props}
    />
  );
};

export interface CommentThreadResolveProps extends Omit<React.ComponentProps<typeof Button>, 'children'> {
  resolveLabel?: string;
  reopenLabel?: string;
}

/** Resolves or reopens the thread it sits in. */
const CommentThreadResolve = ({
  resolveLabel = 'Resolve',
  reopenLabel = 'Reopen',
  variant = 'ghost',
  size = 'sm',
  ...props
}: CommentThreadResolveProps) => {
  const { resolved, setResolved } = useCommentThread();

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      aria-pressed={resolved}
      data-slot="comment-thread-resolve"
      onClick={() => setResolved(!resolved)}
      {...props}
    >
      <CircleCheck className={cn(resolved && 'text-success')} />
      {resolved ? reopenLabel : resolveLabel}
    </Button>
  );
};

export interface CommentAuthor {
  name: string;
  /** Image URL. Initials are shown without one. */
  avatar?: string;
}

export interface CommentProps extends React.ComponentProps<'article'> {
  author: CommentAuthor;
  /** When it was posted, already formatted, like "2h ago". */
  time?: React.ReactNode;
  /** Shown after the time, like "edited". */
  meta?: React.ReactNode;
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

const Comment = ({ author, time, meta, className, children, ...props }: CommentProps) => {
  return (
    <article data-slot="comment" className={cn('flex gap-3', className)} {...props}>
      <Avatar size="sm" className="mt-0.5">
        {author.avatar && <AvatarImage src={author.avatar} alt="" />}
        <AvatarFallback>{initials(author.name)}</AvatarFallback>
      </Avatar>
      <div className="grid min-w-0 flex-1 gap-1">
        <div className="flex flex-wrap items-baseline gap-x-2 text-sm">
          <span className="font-medium">{author.name}</span>
          {time && <span className="text-xs text-muted-foreground">{time}</span>}
          {meta && <span className="text-xs text-muted-foreground">{meta}</span>}
        </div>
        {children}
      </div>
    </article>
  );
};

const CommentBody = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="comment-body"
      className={cn('text-sm leading-relaxed break-words whitespace-pre-wrap', className)}
      {...props}
    />
  );
};

export interface CommentReaction {
  emoji: string;
  count: number;
  /** The current user is one of the people who reacted. */
  reacted?: boolean;
}

export interface CommentReactionsProps extends Omit<React.ComponentProps<'div'>, 'onToggle'> {
  reactions: CommentReaction[];
  /** Adds or removes the current user's reaction. */
  onToggle: (emoji: string) => void;
  /** Emoji offered by the add button. */
  choices?: string[];
  addLabel?: string;
}

const DEFAULT_CHOICES = ['👍', '❤️', '🎉', '😄', '👀', '🚀', '🙏', '✅'];

const CommentReactions = ({
  reactions,
  onToggle,
  choices = DEFAULT_CHOICES,
  addLabel = 'Add reaction',
  className,
  ...props
}: CommentReactionsProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div data-slot="comment-reactions" className={cn('flex flex-wrap items-center gap-1 pt-1', className)} {...props}>
      {reactions
        .filter((reaction) => reaction.count > 0)
        .map((reaction) => (
          <button
            key={reaction.emoji}
            type="button"
            aria-pressed={reaction.reacted ?? false}
            onClick={() => onToggle(reaction.emoji)}
            className="inline-flex h-6 items-center gap-1 rounded-full border border-border px-2 text-xs tabular-nums transition-colors outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-pressed:border-primary/50 aria-pressed:bg-primary/10"
          >
            <span aria-hidden>{reaction.emoji}</span>
            {reaction.count}
          </button>
        ))}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <button
              type="button"
              aria-label={addLabel}
              title={addLabel}
              className="inline-flex size-6 items-center justify-center rounded-full text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
          }
        >
          <SmilePlus className="size-3.5" />
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-1">
          <div className="grid grid-cols-4 gap-0.5">
            {choices.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => {
                  onToggle(emoji);
                  setOpen(false);
                }}
                className="flex size-8 items-center justify-center rounded-md text-base outline-none hover:bg-accent focus-visible:bg-accent"
              >
                {emoji}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

/** Replies indented under their parent comment, with a thread line. */
const CommentReplies = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="comment-replies"
      className={cn('ms-3 grid gap-4 border-s border-border ps-6 group-data-resolved/thread:hidden', className)}
      {...props}
    />
  );
};

export interface CommentComposerProps extends Omit<React.ComponentProps<'form'>, 'onSubmit'> {
  onSubmit: (text: string) => void;
  placeholder?: string;
  submitLabel?: string;
  /** Hint under the field. Defaults to the keyboard shortcut. */
  hint?: React.ReactNode;
}

/** Posts with the button or Ctrl/⌘ + Enter, then clears. */
const CommentComposer = ({
  onSubmit,
  placeholder = 'Reply…',
  submitLabel = 'Reply',
  hint = 'Ctrl + Enter to send',
  className,
  ...props
}: CommentComposerProps) => {
  const [text, setText] = React.useState('');
  const send = () => {
    const value = text.trim();
    if (!value) return;
    onSubmit(value);
    setText('');
  };

  return (
    <form
      data-slot="comment-composer"
      onSubmit={(event) => {
        event.preventDefault();
        send();
      }}
      className={cn('grid gap-2 group-data-resolved/thread:hidden', className)}
      {...props}
    >
      <Textarea
        value={text}
        rows={2}
        placeholder={placeholder}
        aria-label={placeholder}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
            event.preventDefault();
            send();
          }
        }}
      />
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground">{hint}</span>
        <Button type="submit" size="sm" disabled={!text.trim()}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export {
  CommentThread,
  CommentThreadHeader,
  CommentThreadResolve,
  Comment,
  CommentBody,
  CommentReactions,
  CommentReplies,
  CommentComposer,
  useCommentThread,
};
