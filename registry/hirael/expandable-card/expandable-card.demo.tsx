"use client"

import {
  ExpandableCard,
  ExpandableCardContent,
  ExpandableCardTrigger,
} from "@/registry/hirael/ui/expandable-card"

export default function ExpandableCardDemo() {
  return (
    <div className="grid w-full max-w-md gap-3">
      <ExpandableCard defaultOpen>
        <ExpandableCardTrigger>
          <span className="flex flex-col">
            <span className="text-sm font-medium text-foreground">
              What counts as an active user?
            </span>
            <span className="text-xs text-muted-foreground">Billing</span>
          </span>
        </ExpandableCardTrigger>
        <ExpandableCardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Anyone who signs in at least once during the billing period. Invited
            members who never accept are not counted, and seats freed mid-cycle
            are prorated on your next invoice.
          </p>
        </ExpandableCardContent>
      </ExpandableCard>

      <ExpandableCard>
        <ExpandableCardTrigger>
          <span className="flex flex-col">
            <span className="text-sm font-medium text-foreground">
              Can I export my data?
            </span>
            <span className="text-xs text-muted-foreground">Account</span>
          </span>
        </ExpandableCardTrigger>
        <ExpandableCardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Yes. Export everything as JSON or CSV from Settings, any time. The
            archive is generated on demand and emailed to the account owner.
          </p>
        </ExpandableCardContent>
      </ExpandableCard>
    </div>
  )
}
