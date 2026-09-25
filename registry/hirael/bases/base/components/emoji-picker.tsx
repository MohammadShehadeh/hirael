'use client';

import * as React from 'react';
import {
  EmojiPicker as EmojiPickerPrimitive,
  type EmojiPickerListCategoryHeaderProps,
  type EmojiPickerListEmojiProps,
  type EmojiPickerListRowProps,
} from 'frimousse';
import { Search } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface EmojiPickerProps extends Omit<
  React.ComponentProps<typeof EmojiPickerPrimitive.Root>,
  'onEmojiSelect'
> {
  /** Called with the picked emoji, skin tone applied. */
  onEmojiSelect?: (emoji: string) => void;
}

const EmojiPicker = ({ onEmojiSelect, className, ...props }: EmojiPickerProps) => {
  return (
    <EmojiPickerPrimitive.Root
      data-slot="emoji-picker"
      onEmojiSelect={({ emoji }) => onEmojiSelect?.(emoji)}
      className={cn(
        'isolate flex w-80 max-w-full flex-col gap-2 rounded-md border border-border bg-popover p-2 text-popover-foreground',
        className,
      )}
      {...props}
    />
  );
};

const EmojiPickerSearch = ({ className, ...props }: React.ComponentProps<typeof EmojiPickerPrimitive.Search>) => {
  return (
    <div data-slot="emoji-picker-search" className="relative">
      <Search className="pointer-events-none absolute start-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
      <EmojiPickerPrimitive.Search
        className={cn(
          'h-8 w-full rounded-md border border-input bg-transparent ps-8 pe-2 text-sm outline-none placeholder:text-muted-foreground',
          'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:bg-input/30',
          className,
        )}
        {...props}
      />
    </div>
  );
};

const CategoryHeader = ({ category, className, ...props }: EmojiPickerListCategoryHeaderProps) => {
  return (
    <div className={cn('bg-popover px-1 pt-2 pb-1 text-xs text-muted-foreground', className)} {...props}>
      {category.label}
    </div>
  );
};

const Row = ({ className, ...props }: EmojiPickerListRowProps) => {
  return <div className={cn('scroll-my-1 px-1', className)} {...props} />;
};

const Emoji = ({ emoji, className, ...props }: EmojiPickerListEmojiProps) => {
  return (
    <button
      data-slot="emoji-picker-item"
      className={cn('flex size-8 items-center justify-center rounded-sm text-xl data-[active]:bg-accent', className)}
      {...props}
    >
      {emoji.emoji}
    </button>
  );
};

export interface EmojiPickerListProps extends React.ComponentProps<typeof EmojiPickerPrimitive.Viewport> {
  loadingLabel?: React.ReactNode;
  emptyLabel?: React.ReactNode;
}

const EmojiPickerList = ({
  loadingLabel = 'Loading…',
  emptyLabel = 'No emoji found.',
  className,
  ...props
}: EmojiPickerListProps) => {
  return (
    <EmojiPickerPrimitive.Viewport
      data-slot="emoji-picker-list"
      className={cn('relative h-56 outline-hidden', className)}
      {...props}
    >
      <EmojiPickerPrimitive.Loading className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
        {loadingLabel}
      </EmojiPickerPrimitive.Loading>
      <EmojiPickerPrimitive.Empty className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
        {emptyLabel}
      </EmojiPickerPrimitive.Empty>
      <EmojiPickerPrimitive.List className="pb-1 select-none" components={{ CategoryHeader, Row, Emoji }} />
    </EmojiPickerPrimitive.Viewport>
  );
};

export interface EmojiPickerFooterProps extends React.ComponentProps<'div'> {
  placeholder?: string;
}

/** Shows the hovered or keyboard-active emoji and its name. */
const EmojiPickerFooter = ({
  placeholder = 'Pick an emoji',
  className,
  children,
  ...props
}: EmojiPickerFooterProps) => {
  return (
    <div
      data-slot="emoji-picker-footer"
      className={cn('flex h-9 items-center gap-2 border-t border-border pt-2 text-xs', className)}
      {...props}
    >
      <EmojiPickerPrimitive.ActiveEmoji>
        {({ emoji }) => (
          <>
            <span aria-hidden className="flex size-7 shrink-0 items-center justify-center text-xl leading-none">
              {emoji?.emoji}
            </span>
            <span
              className={cn('min-w-0 flex-1 truncate', emoji ? 'text-foreground capitalize' : 'text-muted-foreground')}
            >
              {emoji?.label ?? placeholder}
            </span>
          </>
        )}
      </EmojiPickerPrimitive.ActiveEmoji>
      {children}
    </div>
  );
};

const EmojiPickerSkinTone = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <EmojiPickerPrimitive.SkinTone emoji="👋">
      {({ skinTone, setSkinTone, skinToneVariations }) => (
        <div
          role="radiogroup"
          aria-label="Skin tone"
          data-slot="emoji-picker-skin-tone"
          className={cn('flex items-center gap-0.5', className)}
          {...props}
        >
          {skinToneVariations.map((variation) => (
            <button
              key={variation.skinTone}
              type="button"
              role="radio"
              aria-checked={skinTone === variation.skinTone}
              aria-label={variation.skinTone}
              onClick={() => setSkinTone(variation.skinTone)}
              className={cn(
                'flex size-7 items-center justify-center rounded-sm text-base leading-none transition-colors outline-none',
                'hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring',
                skinTone === variation.skinTone && 'bg-accent ring-1 ring-border',
              )}
            >
              {variation.emoji}
            </button>
          ))}
        </div>
      )}
    </EmojiPickerPrimitive.SkinTone>
  );
};

export { EmojiPicker, EmojiPickerSearch, EmojiPickerList, EmojiPickerFooter, EmojiPickerSkinTone };
