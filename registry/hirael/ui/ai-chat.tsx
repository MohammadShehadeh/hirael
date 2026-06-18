"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Button } from "@/registry/hirael/ui/button";

type AiChatProps = React.ComponentProps<"div">;

function AiChat({ className, ...props }: AiChatProps) {
  return (
    <div
      data-slot="ai-chat"
      className={cn(
        "flex flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground",
        className,
      )}
      {...props}
    />
  );
}

type AiChatMessagesProps = React.ComponentProps<"div">;

function AiChatMessages({ className, ...props }: AiChatMessagesProps) {
  return (
    <div
      data-slot="ai-chat-messages"
      className={cn("flex flex-1 flex-col gap-5 overflow-y-auto p-4", className)}
      {...props}
    />
  );
}

type AiChatMessageProps = React.ComponentProps<"div"> & {
  /** Who sent the message. Lays the row out from the start (assistant) or the end (user). */
  role: "user" | "assistant";
};

function AiChatMessage({ role, className, ...props }: AiChatMessageProps) {
  return (
    <div
      data-slot="ai-chat-message"
      data-role={role}
      className={cn(
        "flex w-full gap-3",
        role === "user" ? "flex-row-reverse" : "flex-row",
        className,
      )}
      {...props}
    />
  );
}

type AiChatAvatarProps = React.ComponentProps<"span"> & {
  /** Image source for the avatar. Falls back to children (initials or an icon) when absent. */
  src?: string;
  /** Alt text for the avatar image. */
  alt?: string;
};

function AiChatAvatar({
  src,
  alt,
  className,
  children,
  ...props
}: AiChatAvatarProps) {
  return (
    <span
      data-slot="ai-chat-avatar"
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted text-[11px] font-medium text-muted-foreground [&_svg]:size-4",
        className,
      )}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt ?? ""}
          loading="lazy"
          className="size-full object-cover"
        />
      ) : (
        children
      )}
    </span>
  );
}

type AiChatGroupProps = React.ComponentProps<"div"> & {
  /** Aligns the bubble, actions, and timestamp stack to the start (assistant) or the end (user). */
  role: "user" | "assistant";
};

function AiChatGroup({ role, className, ...props }: AiChatGroupProps) {
  return (
    <div
      data-slot="ai-chat-group"
      data-role={role}
      className={cn(
        "flex min-w-0 flex-col gap-1.5",
        role === "user" ? "items-end" : "items-start",
        className,
      )}
      {...props}
    />
  );
}

const bubbleVariants = cva(
  "w-fit max-w-[34rem] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words",
  {
    variants: {
      role: {
        user: "rounded-ee-sm bg-primary text-primary-foreground",
        assistant: "rounded-es-sm border border-border bg-card text-foreground",
      },
      tone: {
        solid: "",
        muted: "",
      },
    },
    compoundVariants: [
      {
        role: "user",
        tone: "muted",
        className: "bg-muted text-foreground",
      },
    ],
    defaultVariants: {
      role: "assistant",
      tone: "solid",
    },
  },
);

type AiChatBubbleProps = React.ComponentProps<"div"> &
  VariantProps<typeof bubbleVariants> & {
    /** Who sent the message. Selects the user or assistant surface. */
    role: "user" | "assistant";
  };

function AiChatBubble({ role, tone, className, ...props }: AiChatBubbleProps) {
  return (
    <div
      data-slot="ai-chat-bubble"
      data-role={role}
      className={cn(bubbleVariants({ role, tone }), className)}
      {...props}
    />
  );
}

type AiChatActionsProps = React.ComponentProps<"div">;

function AiChatActions({ className, ...props }: AiChatActionsProps) {
  return (
    <div
      data-slot="ai-chat-actions"
      className={cn(
        "flex items-center gap-0.5 text-muted-foreground [&_svg]:size-3.5",
        className,
      )}
      {...props}
    />
  );
}

type AiChatTypingProps = React.ComponentProps<"div"> & {
  /** Accessible label announced while the reply is pending. Defaults to "Assistant is typing". */
  label?: string;
};

function AiChatTyping({
  label = "Assistant is typing",
  className,
  ...props
}: AiChatTypingProps) {
  return (
    <div
      data-slot="ai-chat-typing"
      role="status"
      aria-live="polite"
      aria-label={label}
      className={cn(
        "flex w-fit items-center gap-1 rounded-2xl rounded-es-sm border border-border bg-card px-3.5 py-3",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className="size-1.5 animate-bounce rounded-full bg-muted-foreground/70 [animation-delay:-0.3s] motion-reduce:animate-pulse"
      />
      <span
        aria-hidden
        className="size-1.5 animate-bounce rounded-full bg-muted-foreground/70 [animation-delay:-0.15s] motion-reduce:animate-pulse"
      />
      <span
        aria-hidden
        className="size-1.5 animate-bounce rounded-full bg-muted-foreground/70 motion-reduce:animate-pulse"
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

type AiChatComposerProps = React.ComponentProps<"form">;

function AiChatComposer({ className, ...props }: AiChatComposerProps) {
  return (
    <form
      data-slot="ai-chat-composer"
      className={cn(
        "flex items-end gap-2 border-t border-border bg-card p-3",
        className,
      )}
      {...props}
    />
  );
}

type AiChatInputProps = Omit<React.ComponentProps<"textarea">, "onSubmit"> & {
  /** Called when the message is submitted with Enter (Shift+Enter inserts a newline). */
  onSubmit?: () => void;
};

function AiChatInput({
  className,
  rows = 1,
  onKeyDown,
  onSubmit,
  ...props
}: AiChatInputProps) {
  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (onSubmit) {
        onSubmit();
      } else {
        event.currentTarget.form?.requestSubmit();
      }
    }
  }

  return (
    <textarea
      data-slot="ai-chat-input"
      rows={rows}
      onKeyDown={handleKeyDown}
      className={cn(
        "field-sizing-content max-h-40 min-h-9 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm leading-relaxed text-foreground outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

type AiChatSendProps = React.ComponentProps<typeof Button> & {
  /** Accessible label for the send button. Defaults to "Send message". */
  label?: string;
};

function AiChatSend({
  label = "Send message",
  className,
  children,
  ...props
}: AiChatSendProps) {
  return (
    <Button
      type="submit"
      size="icon"
      data-slot="ai-chat-send"
      aria-label={label}
      className={cn("shrink-0", className)}
      {...props}
    >
      {children}
    </Button>
  );
}

type AiChatTimestampProps = React.ComponentProps<"time">;

function AiChatTimestamp({ className, ...props }: AiChatTimestampProps) {
  return (
    <time
      data-slot="ai-chat-timestamp"
      className={cn(
        "font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export {
  AiChat,
  AiChatMessages,
  AiChatMessage,
  AiChatAvatar,
  AiChatGroup,
  AiChatBubble,
  AiChatActions,
  AiChatTyping,
  AiChatComposer,
  AiChatInput,
  AiChatSend,
  AiChatTimestamp,
};
