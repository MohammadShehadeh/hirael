"use client"

import {
  Calendar,
  Folder,
  Home,
  Mail,
  Music,
  Settings,
} from "lucide-react"

import { Dock, DockItem, DockLabel } from "@/registry/hirael/ui/dock"

const APPS = [
  { label: "Home", icon: Home },
  { label: "Files", icon: Folder },
  { label: "Mail", icon: Mail },
  { label: "Calendar", icon: Calendar },
  { label: "Music", icon: Music },
  { label: "Settings", icon: Settings },
]

export default function DockDemo() {
  return (
    <div className="flex w-full max-w-xl items-end justify-center pt-12">
      <Dock>
        {APPS.map((app) => (
          <DockItem key={app.label} aria-label={app.label}>
            <DockLabel>{app.label}</DockLabel>
            <app.icon />
          </DockItem>
        ))}
      </Dock>
    </div>
  )
}
