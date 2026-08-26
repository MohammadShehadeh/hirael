"use client";

import * as React from "react";

import { useT } from "@/lib/demo-locale";
import {
  DiffViewer,
  DiffViewerContent,
  DiffViewerHeader,
  DiffViewerModeToggle,
  DiffViewerStats,
  DiffViewerTitle,
  type DiffViewerMode,
} from "@/registry/hirael/components/diff-viewer";

const OLD_CONFIG = `[server]
host = "0.0.0.0"
port = 8080
workers = 4
timeout = 30

[database]
url = "postgres://localhost:5432/app"
pool_size = 10
ssl = false

[cache]
driver = "memory"
ttl = 300

[logging]
level = "info"
format = "text"
file = "/var/log/app.log"

[features]
signup = true
billing = false
`;

const NEW_CONFIG = `[server]
host = "0.0.0.0"
port = 8080
workers = 8
timeout = 30
keepalive = 65

[database]
url = "postgres://db.internal:5432/app"
pool_size = 20
ssl = true

[cache]
driver = "redis"
url = "redis://cache.internal:6379"
ttl = 600

[logging]
level = "warn"
format = "json"
file = "/var/log/app.log"

[features]
signup = true
billing = true
`;

const OLD_FN = `export function formatPrice(amount, currency) {
  const value = amount / 100;
  return currency + " " + value.toFixed(2);
}
`;

const NEW_FN = `export function formatPrice(amount, currency, locale = "en") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount / 100);
}
`;

const DiffViewerDemo = () => {
  const t = useT();
  const [mode, setMode] = React.useState<DiffViewerMode>("split");

  return (
    <div className="grid w-full max-w-3xl gap-8">
      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: "Config change, unified", ar: "تغيير الإعدادات، موحّد" })}
        </p>
        <DiffViewer
          oldValue={OLD_CONFIG}
          newValue={NEW_CONFIG}
          oldTitle="config.toml"
          newTitle="config.toml"
          context={2}
        >
          <DiffViewerHeader>
            <DiffViewerTitle />
            <div className="flex items-center gap-3">
              <DiffViewerStats />
              <DiffViewerModeToggle
                unifiedLabel={t({ en: "Unified", ar: "موحّد" })}
                splitLabel={t({ en: "Split", ar: "مقسّم" })}
              />
            </div>
          </DiffViewerHeader>
          <DiffViewerContent
            gapLabel={(n) =>
              t({ en: `Expand ${n} lines`, ar: `إظهار ${n} أسطر` })
            }
          />
        </DiffViewer>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: "Split, controlled mode", ar: "مقسّم، وضع متحكّم به" })}
        </p>
        <DiffViewer
          oldValue={OLD_FN}
          newValue={NEW_FN}
          oldTitle="format.js"
          newTitle="format.ts"
          mode={mode}
          onModeChange={setMode}
          context={Infinity}
        >
          <DiffViewerHeader className="bg-transparent">
            <DiffViewerTitle className="font-mono text-xs" />
            <DiffViewerStats />
          </DiffViewerHeader>
          <DiffViewerContent showLineNumbers={false} />
          <div className="flex items-center justify-between gap-2 border-t border-border px-3 py-2 font-sans text-[11px] text-muted-foreground">
            <span>
              {t({
                en: mode === "split" ? "Side by side" : "One column",
                ar: mode === "split" ? "جنبًا إلى جنب" : "عمود واحد",
              })}
            </span>
            <DiffViewerModeToggle
              unifiedLabel={t({ en: "Unified", ar: "موحّد" })}
              splitLabel={t({ en: "Split", ar: "مقسّم" })}
            />
          </div>
        </DiffViewer>
      </div>
    </div>
  );
};

export default DiffViewerDemo;
