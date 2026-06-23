"use client";

import { ArrowLeftRight, FilePlus2, UserPlus, Wallet } from "lucide-react";

import { useT } from "@/lib/demo-locale";
import {
  QuickAction,
  QuickActionDescription,
  QuickActionIcon,
  QuickActionLabel,
  QuickActions,
} from "@/registry/hirael/components/quick-actions";

export default function QuickActionsDemo() {
  const t = useT();

  const ACTIONS = [
    {
      icon: FilePlus2,
      label: t({ en: "New invoice", ar: "فاتورة جديدة" }),
      description: t({ en: "Bill a customer", ar: "إصدار فاتورة لعميل" }),
    },
    {
      icon: UserPlus,
      label: t({ en: "Invite", ar: "دعوة" }),
      description: t({ en: "Add a teammate", ar: "إضافة عضو للفريق" }),
    },
    {
      icon: Wallet,
      label: t({ en: "Payout", ar: "سحب أموال" }),
      description: t({ en: "Move funds out", ar: "تحويل الأموال للخارج" }),
    },
    {
      icon: ArrowLeftRight,
      label: t({ en: "Transfer", ar: "تحويل" }),
      description: t({ en: "Between accounts", ar: "بين الحسابات" }),
    },
  ];

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
  );
}
