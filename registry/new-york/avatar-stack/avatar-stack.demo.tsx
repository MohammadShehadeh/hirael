"use client"

import {
  AvatarStack,
  AvatarStackItem,
  AvatarStackOverflow,
} from "@/registry/new-york/ui/avatar-stack"

export default function AvatarStackDemo() {
  return (
    <div className="grid w-full max-w-3xl gap-8">
      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Sizes
        </p>
        <div className="flex flex-wrap items-end gap-6">
          <AvatarStack size="sm">
            <AvatarStackItem>AM</AvatarStackItem>
            <AvatarStackItem>JK</AvatarStackItem>
            <AvatarStackItem>RP</AvatarStackItem>
            <AvatarStackOverflow count={4} />
          </AvatarStack>
          <AvatarStack size="md">
            <AvatarStackItem>AM</AvatarStackItem>
            <AvatarStackItem>JK</AvatarStackItem>
            <AvatarStackItem>RP</AvatarStackItem>
            <AvatarStackOverflow count={12} />
          </AvatarStack>
          <AvatarStack size="lg">
            <AvatarStackItem>AM</AvatarStackItem>
            <AvatarStackItem>JK</AvatarStackItem>
            <AvatarStackItem>RP</AvatarStackItem>
            <AvatarStackOverflow count={28} />
          </AvatarStack>
        </div>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Spacing
        </p>
        <div className="flex flex-wrap items-center gap-8">
          <AvatarStack spacing="tight">
            <AvatarStackItem>AM</AvatarStackItem>
            <AvatarStackItem>JK</AvatarStackItem>
            <AvatarStackItem>RP</AvatarStackItem>
            <AvatarStackItem>DL</AvatarStackItem>
          </AvatarStack>
          <AvatarStack spacing="normal">
            <AvatarStackItem>AM</AvatarStackItem>
            <AvatarStackItem>JK</AvatarStackItem>
            <AvatarStackItem>RP</AvatarStackItem>
            <AvatarStackItem>DL</AvatarStackItem>
          </AvatarStack>
          <AvatarStack spacing="loose">
            <AvatarStackItem>AM</AvatarStackItem>
            <AvatarStackItem>JK</AvatarStackItem>
            <AvatarStackItem>RP</AvatarStackItem>
            <AvatarStackItem>DL</AvatarStackItem>
          </AvatarStack>
        </div>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          With caption
        </p>
        <div className="flex items-center gap-3">
          <AvatarStack>
            <AvatarStackItem>MR</AvatarStackItem>
            <AvatarStackItem>SK</AvatarStackItem>
            <AvatarStackItem>JT</AvatarStackItem>
            <AvatarStackOverflow count={6} />
          </AvatarStack>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">9 collaborators</span>{" "}
            · last active 2m ago
          </p>
        </div>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Clickable · asChild
        </p>
        <AvatarStack>
          <AvatarStackItem asChild>
            <a href="#" aria-label="Maya Renner">
              MR
            </a>
          </AvatarStackItem>
          <AvatarStackItem asChild>
            <a href="#" aria-label="Soren Kim">
              SK
            </a>
          </AvatarStackItem>
          <AvatarStackItem asChild>
            <a href="#" aria-label="Jules Tanaka">
              JT
            </a>
          </AvatarStackItem>
          <AvatarStackOverflow asChild count={6}>
            <a href="#" aria-label="View 6 more collaborators">
              +6
            </a>
          </AvatarStackOverflow>
        </AvatarStack>
      </div>
    </div>
  )
}
