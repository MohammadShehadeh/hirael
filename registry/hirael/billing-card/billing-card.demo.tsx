"use client"

import {
  BillingCard,
  BillingCardEyebrow,
  BillingCardFooter,
  BillingCardHeader,
  BillingCardMeter,
  BillingCardPlan,
  BillingCardPrice,
  BillingCardRow,
} from "@/registry/hirael/ui/billing-card"

export default function BillingCardDemo() {
  return (
    <BillingCard className="w-full max-w-sm">
      <BillingCardHeader>
        <div className="flex flex-col gap-1">
          <BillingCardEyebrow>Current plan</BillingCardEyebrow>
          <BillingCardPlan>Scale</BillingCardPlan>
        </div>
        <BillingCardPrice cycle="mo">$99</BillingCardPrice>
      </BillingCardHeader>

      <BillingCardMeter value={18} max={25} label="Seats used" />

      <div className="flex flex-col gap-2">
        <BillingCardRow label="Renews on">Jul 1, 2026</BillingCardRow>
        <BillingCardRow label="Payment">Visa ending 4242</BillingCardRow>
      </div>

      <BillingCardFooter>
        <button
          type="button"
          className="inline-flex h-9 flex-1 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Manage billing
        </button>
        <button
          type="button"
          className="inline-flex h-9 flex-1 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Upgrade
        </button>
      </BillingCardFooter>
    </BillingCard>
  )
}
