"use client";

import { useT } from "@/lib/demo-locale";
import {
  DeploymentHistory,
  DeploymentHistoryCommit,
  DeploymentHistoryItem,
  DeploymentHistoryMeta,
} from "@/registry/hirael/components/deployment-history";

export default function DeploymentHistoryDemo() {
  const t = useT();

  return (
    <div className="w-full max-w-lg">
      <DeploymentHistory>
        <DeploymentHistoryItem
          state="building"
          version="v2.4.0"
          environment={t({ en: "production", ar: "production" })}
        >
          <DeploymentHistoryMeta>
            <DeploymentHistoryCommit sha="a1b9c4d" />
            <span>{t({ en: "by maya", ar: "بواسطة مايا" })}</span>
            <span>{t({ en: "just now", ar: "الآن" })}</span>
          </DeploymentHistoryMeta>
        </DeploymentHistoryItem>

        <DeploymentHistoryItem
          state="success"
          version="v2.3.9"
          environment={t({ en: "production", ar: "production" })}
        >
          <DeploymentHistoryMeta>
            <DeploymentHistoryCommit sha="7f2e10a" />
            <span>{t({ en: "by omar", ar: "بواسطة عمر" })}</span>
            <span>{t({ en: "2h ago · 48s", ar: "قبل ساعتين · 48ث" })}</span>
          </DeploymentHistoryMeta>
        </DeploymentHistoryItem>

        <DeploymentHistoryItem
          state="rolled-back"
          version="v2.3.8"
          environment={t({ en: "production", ar: "production" })}
        >
          <DeploymentHistoryMeta>
            <DeploymentHistoryCommit sha="c03be91" />
            <span>
              {t({
                en: "reverted failing migration",
                ar: "تراجع عن ترحيل فاشل",
              })}
            </span>
            <span>{t({ en: "5h ago", ar: "قبل 5 ساعات" })}</span>
          </DeploymentHistoryMeta>
        </DeploymentHistoryItem>

        <DeploymentHistoryItem
          state="failed"
          version="v2.3.7"
          environment={t({ en: "staging", ar: "staging" })}
          last
        >
          <DeploymentHistoryMeta>
            <DeploymentHistoryCommit sha="11de4f0" />
            <span>
              {t({
                en: "build step exited 1",
                ar: "خطوة البناء انتهت بالرمز 1",
              })}
            </span>
            <span>{t({ en: "6h ago", ar: "قبل 6 ساعات" })}</span>
          </DeploymentHistoryMeta>
        </DeploymentHistoryItem>
      </DeploymentHistory>
    </div>
  );
}
