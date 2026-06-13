"use client"

import { Plus } from "lucide-react"

import {
  ApiKeyItem,
  ApiKeyMeta,
  ApiKeyName,
  ApiKeyValue,
  ApiKeys,
  ApiKeysHeader,
  ApiKeysList,
  ApiKeysTitle,
} from "@/registry/hirael/ui/api-keys"

const KEYS = [
  { label: "Production", created: "Created Mar 4", used: "Used 2h ago", value: "sk_live_9f8a7b6c5d4e3f2a1b0c" },
  { label: "Development", created: "Created Apr 18", used: "Used 5d ago", value: "sk_test_1a2b3c4d5e6f7g8h9i0j" },
]

export default function ApiKeysDemo() {
  return (
    <ApiKeys className="w-full max-w-xl">
      <ApiKeysHeader>
        <ApiKeysTitle>API keys</ApiKeysTitle>
        <button
          type="button"
          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&_svg]:size-3.5"
        >
          <Plus />
          Create key
        </button>
      </ApiKeysHeader>
      <ApiKeysList>
        {KEYS.map((key) => (
          <ApiKeyItem key={key.label}>
            <ApiKeyName label={key.label}>{key.created}</ApiKeyName>
            <ApiKeyValue value={key.value} className="ms-auto" />
            <ApiKeyMeta>{key.used}</ApiKeyMeta>
          </ApiKeyItem>
        ))}
      </ApiKeysList>
    </ApiKeys>
  )
}
