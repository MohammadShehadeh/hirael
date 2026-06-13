"use client"

import { ArrowLeftRight, FilePlus2, UserPlus, Wallet } from "lucide-react"

import {
  QuickAction,
  QuickActionDescription,
  QuickActionIcon,
  QuickActionLabel,
  QuickActions,
} from "@/registry/hirael/ui/quick-actions"

const ACTIONS = [
  { icon: FilePlus2, label: "New invoice", description: "Bill a customer" },
  { icon: UserPlus, label: "Invite", description: "Add a teammate" },
  { icon: Wallet, label: "Payout", description: "Move funds out" },
  { icon: ArrowLeftRight, label: "Transfer", description: "Between accounts" },
]

export default function QuickActionsDemo() {
  return (
    <QuickActions columns={2} className="w-full max-w-md">
      {ACTIONS.map((action) => (
        <QuickAction key={action.label}>
          <QuickActionIcon>
            <action.icon />
          </QuickActionIcon>
          <QuickActionLabel>{action.label}</QuickActionLabel>
          <QuickActionDescription>{action.description}</QuickActionDescription>
        </QuickAction>
      ))}
    </QuickActions>
  )
}
