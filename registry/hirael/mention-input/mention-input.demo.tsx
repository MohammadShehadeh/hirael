"use client"

import * as React from "react"

import {
  MentionInput,
  getMentions,
  type MentionItem,
} from "@/registry/hirael/ui/mention-input"

const TEAM: MentionItem[] = [
  { id: "1", label: "john.doe", description: "John Doe · Design lead" },
  { id: "2", label: "mohammad.shehadeh", description: "Mohammad Shehadeh · Frontend" },
  { id: "3", label: "jane.doe", description: "Jane Doe · Product" },
  { id: "4", label: "richard.roe", description: "Richard Roe · Backend" },
  { id: "5", label: "mary.major", description: "Mary Major · QA" },
]

const CHANNELS: MentionItem[] = [
  { id: "c1", label: "general", description: "Company-wide announcements" },
  { id: "c2", label: "design", description: "Design critiques and reviews" },
  { id: "c3", label: "engineering", description: "Build, ship, repeat" },
  { id: "c4", label: "random", description: "Watercooler" },
]

function searchPeopleAndChannels(
  query: string,
  trigger: string
): Promise<MentionItem[]> {
  const source = trigger === "#" ? CHANNELS : TEAM
  const q = query.toLowerCase()
  return Promise.resolve(
    source.filter(
      (it) =>
        it.label.toLowerCase().includes(q) ||
        it.description?.toLowerCase().includes(q)
    )
  )
}

function searchDirectory(query: string): Promise<MentionItem[]> {
  const q = query.toLowerCase()
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        TEAM.filter(
          (it) =>
            it.label.toLowerCase().includes(q) ||
            it.description?.toLowerCase().includes(q)
        )
      )
    }, 600)
  })
}

export default function MentionInputDemo() {
  const [comment, setComment] = React.useState(
    "Looks great @jane.doe can you take a final pass?"
  )
  const mentions = getMentions(comment)

  return (
    <div className="grid w-full max-w-2xl gap-8">
      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Team mentions · controlled
        </p>
        <MentionInput
          value={comment}
          onValueChange={setComment}
          items={TEAM}
          placeholder="Type @ to mention a teammate…"
          maxRows={6}
        />
        <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
          mentioned: {mentions.length ? mentions.join(", ") : "nobody yet"}
        </p>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Multiple triggers · @ people + # channels
        </p>
        <MentionInput
          defaultValue=""
          trigger={["@", "#"]}
          onSearch={searchPeopleAndChannels}
          placeholder="Type @ for people or # for channels…"
          maxRows={6}
        />
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Async search · debounced with spinner
        </p>
        <MentionInput
          defaultValue=""
          onSearch={searchDirectory}
          placeholder="Type @ to search the directory…"
          maxRows={6}
          onMention={(item) => console.log("mentioned", item)}
        />
      </div>
    </div>
  )
}
