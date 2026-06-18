"use client";

import * as React from "react";
import { Bot, Copy, RefreshCw, ArrowUp } from "lucide-react";

import {
  AiChat,
  AiChatActions,
  AiChatAvatar,
  AiChatBubble,
  AiChatComposer,
  AiChatGroup,
  AiChatInput,
  AiChatMessage,
  AiChatMessages,
  AiChatSend,
  AiChatTimestamp,
  AiChatTyping,
} from "@/registry/hirael/ui/ai-chat";

export default function AiChatDemo() {
  const [value, setValue] = React.useState("");

  return (
    <div className="grid w-full max-w-xl gap-8">
      <AiChat className="h-[28rem]">
        <AiChatMessages>
          <AiChatMessage role="assistant">
            <AiChatAvatar>
              <Bot />
            </AiChatAvatar>
            <AiChatGroup role="assistant">
              <AiChatBubble role="assistant">
                Hi, I can help you draft release notes. Paste a few commits and
                I will group them.
              </AiChatBubble>
              <AiChatTimestamp>09:41</AiChatTimestamp>
            </AiChatGroup>
          </AiChatMessage>

          <AiChatMessage role="user">
            <AiChatGroup role="user">
              <AiChatBubble role="user">
                Can you turn these into Highlights and Fixes sections?
              </AiChatBubble>
              <AiChatTimestamp>09:42</AiChatTimestamp>
            </AiChatGroup>
          </AiChatMessage>

          <AiChatMessage role="assistant">
            <AiChatAvatar>
              <Bot />
            </AiChatAvatar>
            <AiChatGroup role="assistant">
              <AiChatBubble role="assistant">
                Sure. Send the commit list and I will sort each line into the
                right heading.
              </AiChatBubble>
            </AiChatGroup>
          </AiChatMessage>

          <AiChatMessage role="assistant">
            <AiChatAvatar>
              <Bot />
            </AiChatAvatar>
            <AiChatTyping />
          </AiChatMessage>
        </AiChatMessages>

        <AiChatComposer
          onSubmit={(event) => {
            event.preventDefault();
            setValue("");
          }}
        >
          <AiChatInput
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Send a message"
          />
          <AiChatSend disabled={value.trim().length === 0}>
            <ArrowUp />
          </AiChatSend>
        </AiChatComposer>
      </AiChat>

      <AiChat>
        <AiChatMessages className="gap-4 p-3">
          <AiChatMessage role="user">
            <AiChatGroup role="user">
              <AiChatBubble role="user" tone="muted" className="text-sm">
                Summarize this thread in one line.
              </AiChatBubble>
            </AiChatGroup>
          </AiChatMessage>

          <AiChatMessage role="assistant">
            <AiChatAvatar className="size-7">
              <Bot />
            </AiChatAvatar>
            <AiChatGroup role="assistant">
              <AiChatBubble role="assistant">
                You asked for release notes and I offered to sort commits into
                Highlights and Fixes.
              </AiChatBubble>
              <AiChatActions>
                <button
                  type="button"
                  aria-label="Copy reply"
                  className="inline-flex size-6 items-center justify-center rounded-md transition-colors hover:bg-accent hover:text-foreground"
                >
                  <Copy />
                </button>
                <button
                  type="button"
                  aria-label="Regenerate reply"
                  className="inline-flex size-6 items-center justify-center rounded-md transition-colors hover:bg-accent hover:text-foreground"
                >
                  <RefreshCw />
                </button>
              </AiChatActions>
            </AiChatGroup>
          </AiChatMessage>
        </AiChatMessages>
      </AiChat>
    </div>
  );
}
