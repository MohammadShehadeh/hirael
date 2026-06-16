"use client";

import * as React from "react";

import { Label } from "@/registry/hirael/ui/label";
import { CommandGroup } from "@/registry/hirael/ui/command";
import {
  TenantSwitcher,
  TenantSwitcherContent,
  TenantSwitcherCreate,
  TenantSwitcherItem,
  TenantSwitcherTrigger,
  type Tenant,
} from "@/registry/hirael/ui/tenant-switcher";

const WORKSPACES: Tenant[] = [
  { value: "personal", label: "Personal", caption: "Free", group: "Personal" },
  { value: "acme", label: "Acme Inc", caption: "Pro plan", group: "Teams" },
  { value: "globex", label: "Globex", caption: "Enterprise", group: "Teams" },
  { value: "initech", label: "Initech", caption: "Pro plan", group: "Teams" },
];

const PROJECTS: Tenant[] = [
  { value: "web", label: "Web app", caption: "Owner" },
  { value: "marketing", label: "Marketing site", caption: "Admin" },
  { value: "docs", label: "Docs", caption: "Editor" },
  {
    value: "internal",
    label: "Internal tools",
    caption: "Viewer",
    disabled: true,
  },
];

export default function TenantSwitcherDemo() {
  const [workspace, setWorkspace] = React.useState<string | undefined>("acme");
  const [project, setProject] = React.useState<string | undefined>("web");

  return (
    <div className="grid w-full max-w-sm gap-8">
      <div className="grid gap-2">
        <Label>Workspace</Label>
        <TenantSwitcher
          tenants={WORKSPACES}
          value={workspace}
          onValueChange={setWorkspace}
        >
          <TenantSwitcherTrigger />
          <TenantSwitcherContent
            footer={
              <TenantSwitcherCreate onClick={() => setWorkspace("personal")}>
                Create workspace
              </TenantSwitcherCreate>
            }
          />
        </TenantSwitcher>
      </div>

      <div className="grid gap-2">
        <Label>Project (compound, no search)</Label>
        <TenantSwitcher
          tenants={PROJECTS}
          value={project}
          onValueChange={setProject}
        >
          <TenantSwitcherTrigger placeholder="Pick a project" />
          <TenantSwitcherContent searchable={false}>
            <CommandGroup heading="Projects">
              {PROJECTS.map((p) => (
                <TenantSwitcherItem key={p.value} tenant={p} />
              ))}
            </CommandGroup>
          </TenantSwitcherContent>
        </TenantSwitcher>
      </div>
    </div>
  );
}
