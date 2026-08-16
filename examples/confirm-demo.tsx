"use client";

import * as React from "react";
import { Trash2 } from "lucide-react";

import { useT } from "@/lib/demo-locale";
import { Button } from "@/registry/hirael/ui/button";
import {
  ConfirmProvider,
  useConfirm,
} from "@/registry/hirael/components/confirm";

function ConfirmDemoInner() {
  const t = useT();
  const confirm = useConfirm();
  const [status, setStatus] = React.useState<React.ReactNode>(
    t({ en: "No action yet.", ar: "لا إجراء بعد." }),
  );
  const [deleted, setDeleted] = React.useState(false);

  async function handlePublish() {
    const ok = await confirm({
      title: t({ en: "Publish changes?", ar: "نشر التغييرات؟" }),
      description: t({
        en: "Your edits go live for everyone right away.",
        ar: "ستظهر تعديلاتك للجميع فورًا.",
      }),
      confirmText: t({ en: "Publish", ar: "نشر" }),
    });
    setStatus(
      ok
        ? t({ en: "Changes published.", ar: "تم نشر التغييرات." })
        : t({ en: "Publish cancelled.", ar: "أُلغي النشر." }),
    );
  }

  async function handleDelete() {
    await confirm({
      tone: "destructive",
      icon: <Trash2 />,
      title: t({ en: "Delete project?", ar: "حذف المشروع؟" }),
      description: t({
        en: "This removes the project and all of its files. You can't undo it.",
        ar: "سيؤدي هذا إلى حذف المشروع وكل ملفاته. لا يمكن التراجع.",
      }),
      confirmText: t({ en: "Delete", ar: "حذف" }),
      onConfirm: async () => {
        await new Promise((resolve) => setTimeout(resolve, 1200));
        setDeleted(true);
        setStatus(t({ en: "Project deleted.", ar: "تم حذف المشروع." }));
      },
    });
  }

  return (
    <div className="grid w-full max-w-sm gap-4">
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={handlePublish}>
          {t({ en: "Publish changes", ar: "نشر التغييرات" })}
        </Button>
        <Button variant="outline" onClick={handleDelete} disabled={deleted}>
          {t({ en: "Delete project", ar: "حذف المشروع" })}
        </Button>
      </div>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {status}
      </p>
    </div>
  );
}

export default function ConfirmDemo() {
  return (
    <ConfirmProvider>
      <ConfirmDemoInner />
    </ConfirmProvider>
  );
}
