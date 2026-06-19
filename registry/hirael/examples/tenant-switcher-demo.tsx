"use client";

import * as React from "react";

import { useT } from "@/lib/demo-locale";
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

export default function TenantSwitcherDemo() {
  const t = useT();

  const WORKSPACES: Tenant[] = [
    {
      value: "personal",
      label: t({ en: "Personal", ar: "شخصي" }),
      caption: t({ en: "Free", ar: "مجاني" }),
      group: t({ en: "Personal", ar: "شخصي" }),
    },
    {
      value: "acme",
      label: t({ en: "Acme Inc", ar: "شركة نور" }),
      caption: t({ en: "Pro plan", ar: "خطة احترافية" }),
      group: t({ en: "Teams", ar: "الفرق" }),
    },
    {
      value: "globex",
      label: t({ en: "Globex", ar: "مشروع أطلس" }),
      caption: t({ en: "Enterprise", ar: "خطة المؤسسات" }),
      group: t({ en: "Teams", ar: "الفرق" }),
    },
    {
      value: "initech",
      label: t({ en: "Initech", ar: "فريق التصميم" }),
      caption: t({ en: "Pro plan", ar: "خطة احترافية" }),
      group: t({ en: "Teams", ar: "الفرق" }),
    },
  ];

  const PROJECTS: Tenant[] = [
    {
      value: "web",
      label: t({ en: "Web app", ar: "تطبيق الويب" }),
      caption: t({ en: "Owner", ar: "مالك" }),
    },
    {
      value: "marketing",
      label: t({ en: "Marketing site", ar: "الموقع التسويقي" }),
      caption: t({ en: "Admin", ar: "مدير" }),
    },
    {
      value: "docs",
      label: t({ en: "Docs", ar: "التوثيق" }),
      caption: t({ en: "Editor", ar: "محرر" }),
    },
    {
      value: "internal",
      label: t({ en: "Internal tools", ar: "الأدوات الداخلية" }),
      caption: t({ en: "Viewer", ar: "مشاهد" }),
      disabled: true,
    },
  ];

  const [workspace, setWorkspace] = React.useState<string | undefined>("acme");
  const [project, setProject] = React.useState<string | undefined>("web");

  return (
    <div className="grid w-full max-w-sm gap-8">
      <div className="grid gap-2">
        <Label>{t({ en: "Workspace", ar: "مساحة العمل" })}</Label>
        <TenantSwitcher
          tenants={WORKSPACES}
          value={workspace}
          onValueChange={setWorkspace}
        >
          <TenantSwitcherTrigger />
          <TenantSwitcherContent
            footer={
              <TenantSwitcherCreate onClick={() => setWorkspace("personal")}>
                {t({ en: "Create workspace", ar: "إنشاء مساحة عمل" })}
              </TenantSwitcherCreate>
            }
          />
        </TenantSwitcher>
      </div>

      <div className="grid gap-2">
        <Label>
          {t({
            en: "Project (compound, no search)",
            ar: "مشروع (مركّب، بلا بحث)",
          })}
        </Label>
        <TenantSwitcher
          tenants={PROJECTS}
          value={project}
          onValueChange={setProject}
        >
          <TenantSwitcherTrigger
            placeholder={t({ en: "Pick a project", ar: "اختر مشروعًا" })}
          />
          <TenantSwitcherContent searchable={false}>
            <CommandGroup heading={t({ en: "Projects", ar: "المشاريع" })}>
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
