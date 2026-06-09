"use client"

import * as React from "react"
import {
  Bell,
  CreditCard,
  KeyRound,
  Plug,
  Search,
  Shield,
  User,
  type LucideIcon,
} from "lucide-react"

import { Badge } from "@/registry/hirael/ui/badge"
import { Button } from "@/registry/hirael/ui/button"
import { Card } from "@/registry/hirael/ui/card"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/hirael/ui/input-group"
import { Separator } from "@/registry/hirael/ui/separator"
import { cn } from "@/lib/utils"

const NAV = ["Overview", "Projects", "Activity", "Settings"] as const

type SettingsTab = {
  id: string
  label: string
  icon: LucideIcon
  desc: string
}

const TABS: readonly SettingsTab[] = [
  { id: "profile", label: "Profile", icon: User, desc: "Your personal details" },
  { id: "security", label: "Security", icon: Shield, desc: "Password and 2FA" },
  { id: "api", label: "API keys", icon: KeyRound, desc: "Tokens and access" },
  { id: "billing", label: "Billing", icon: CreditCard, desc: "Plan and invoices" },
  { id: "integrations", label: "Integrations", icon: Plug, desc: "Connected apps" },
]

type FieldDef = { label: string; value: string; hint?: string }

const PANELS: Record<string, FieldDef[]> = {
  profile: [
    { label: "Full name", value: "Mohammad Shehadeh" },
    { label: "Email", value: "mohammad@plinth.dev", hint: "Used for sign-in" },
    { label: "Role", value: "Workspace admin" },
  ],
  security: [
    { label: "Password", value: "••••••••••", hint: "Updated 12 days ago" },
    { label: "Two-factor auth", value: "Authenticator app" },
    { label: "Active sessions", value: "3 devices" },
  ],
  api: [
    { label: "Production key", value: "msh_live_••••8f2a", hint: "Last used 2h ago" },
    { label: "Development key", value: "msh_test_••••1c0d" },
    { label: "Webhook secret", value: "whsec_••••44b9" },
  ],
  billing: [
    { label: "Current plan", value: "Pro · $24/mo", hint: "Renews 2026-06-14" },
    { label: "Payment method", value: "Visa ending 4242" },
    { label: "Billing email", value: "ap@plinth.dev" },
  ],
  integrations: [
    { label: "Vercel", value: "Connected", hint: "plinth-labs" },
    { label: "Slack", value: "Connected", hint: "#product" },
    { label: "Linear", value: "Not connected" },
  ],
}

function BrandMark({ className }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="Hirael"
      className={cn(
        "flex aspect-square items-center justify-center rounded-md bg-foreground font-mono text-sm font-semibold text-background",
        className,
      )}
    >
      ◆
    </span>
  )
}

export default function AppShell02() {
  const [active, setActive] = React.useState<string>("profile")
  const tab = TABS.find((t) => t.id === active) ?? TABS[0]
  const fields = PANELS[active] ?? []

  return (
    <div className="flex min-h-[640px] flex-col bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-3 px-4 sm:px-6">
          <BrandMark className="size-7 shrink-0" />

          <Separator orientation="vertical" className="mx-1 hidden h-5 sm:block" />

          <nav
            aria-label="Primary"
            className="hidden items-center gap-1 md:flex"
          >
            {NAV.map((item) => (
              <a
                key={item}
                href="#"
                aria-current={item === "Settings" ? "page" : undefined}
                className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground aria-[current=page]:bg-accent aria-[current=page]:text-foreground"
              >
                {item}
              </a>
            ))}
          </nav>

          <InputGroup className="ml-auto h-8 max-w-[200px]">
            <InputGroupAddon align="inline-start">
              <Search className="size-3.5" />
            </InputGroupAddon>
            <InputGroupInput placeholder="Search…" aria-label="Search" />
          </InputGroup>

          <Button
            variant="outline"
            size="icon"
            aria-label="Notifications"
            className="relative size-8"
          >
            <Bell className="size-3.5" />
            <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-foreground" />
          </Button>
          <span className="inline-flex size-8 items-center justify-center rounded-full bg-foreground font-mono text-[10px] font-medium text-background">
            MS
          </span>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            workspace · plinth labs
          </span>
          <h1 className="text-2xl font-semibold tracking-[-0.02em]">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your account, security, and workspace integrations.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <nav aria-label="Settings" className="lg:col-span-3">
            <ul className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
              {TABS.map((t) => {
                const isActive = t.id === active
                return (
                  <li key={t.id} className="shrink-0 lg:shrink">
                    <button
                      type="button"
                      onClick={() => setActive(t.id)}
                      aria-current={isActive ? "page" : undefined}
                      className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent aria-[current=page]:bg-accent aria-[current=page]:font-medium"
                    >
                      <t.icon className="size-4 shrink-0 text-muted-foreground" />
                      <span className="whitespace-nowrap">{t.label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="lg:col-span-9">
            <Card className="gap-0 overflow-hidden p-0">
              <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-md border border-border bg-muted">
                    <tab.icon className="size-4" />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{tab.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {tab.desc}
                    </span>
                  </div>
                </div>
                <Badge variant="outline" className="hidden font-mono sm:inline-flex">
                  {fields.length} fields
                </Badge>
              </div>

              <dl className="divide-y divide-border">
                {fields.map((f) => (
                  <div
                    key={f.label}
                    className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                  >
                    <div className="flex flex-col">
                      <dt className="text-sm font-medium">{f.label}</dt>
                      {f.hint && (
                        <dd className="font-mono text-[11px] text-muted-foreground">
                          {f.hint}
                        </dd>
                      )}
                    </div>
                    <dd className="flex items-center gap-3">
                      <span className="font-mono text-sm tabular-nums text-foreground">
                        {f.value}
                      </span>
                      <Button variant="outline" size="sm" className="h-7">
                        Edit
                      </Button>
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="flex items-center justify-between border-t border-border bg-muted/30 px-5 py-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                  · changes save automatically
                </span>
                <Button size="sm">Done</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
