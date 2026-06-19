"use client";

import { useT } from "@/lib/demo-locale";
import {
  AvatarStack,
  AvatarStackItem,
  AvatarStackOverflow,
} from "@/registry/hirael/ui/avatar-stack";

export default function AvatarStackDemo() {
  const t = useT();

  return (
    <div className="grid w-full max-w-3xl gap-8">
      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: "Sizes", ar: "الأحجام" })}
        </p>
        <div className="flex flex-wrap items-end gap-6">
          <AvatarStack size="sm">
            <AvatarStackItem>{t({ en: "AM", ar: "أم" })}</AvatarStackItem>
            <AvatarStackItem>{t({ en: "JK", ar: "خك" })}</AvatarStackItem>
            <AvatarStackItem>{t({ en: "RP", ar: "رب" })}</AvatarStackItem>
            <AvatarStackOverflow count={4} />
          </AvatarStack>
          <AvatarStack size="md">
            <AvatarStackItem>{t({ en: "AM", ar: "أم" })}</AvatarStackItem>
            <AvatarStackItem>{t({ en: "JK", ar: "خك" })}</AvatarStackItem>
            <AvatarStackItem>{t({ en: "RP", ar: "رب" })}</AvatarStackItem>
            <AvatarStackOverflow count={12} />
          </AvatarStack>
          <AvatarStack size="lg">
            <AvatarStackItem>{t({ en: "AM", ar: "أم" })}</AvatarStackItem>
            <AvatarStackItem>{t({ en: "JK", ar: "خك" })}</AvatarStackItem>
            <AvatarStackItem>{t({ en: "RP", ar: "رب" })}</AvatarStackItem>
            <AvatarStackOverflow count={28} />
          </AvatarStack>
        </div>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: "Spacing", ar: "التباعد" })}
        </p>
        <div className="flex flex-wrap items-center gap-8">
          <AvatarStack spacing="tight">
            <AvatarStackItem>{t({ en: "AM", ar: "أم" })}</AvatarStackItem>
            <AvatarStackItem>{t({ en: "JK", ar: "خك" })}</AvatarStackItem>
            <AvatarStackItem>{t({ en: "RP", ar: "رب" })}</AvatarStackItem>
            <AvatarStackItem>{t({ en: "DL", ar: "نل" })}</AvatarStackItem>
          </AvatarStack>
          <AvatarStack spacing="normal">
            <AvatarStackItem>{t({ en: "AM", ar: "أم" })}</AvatarStackItem>
            <AvatarStackItem>{t({ en: "JK", ar: "خك" })}</AvatarStackItem>
            <AvatarStackItem>{t({ en: "RP", ar: "رب" })}</AvatarStackItem>
            <AvatarStackItem>{t({ en: "DL", ar: "نل" })}</AvatarStackItem>
          </AvatarStack>
          <AvatarStack spacing="loose">
            <AvatarStackItem>{t({ en: "AM", ar: "أم" })}</AvatarStackItem>
            <AvatarStackItem>{t({ en: "JK", ar: "خك" })}</AvatarStackItem>
            <AvatarStackItem>{t({ en: "RP", ar: "رب" })}</AvatarStackItem>
            <AvatarStackItem>{t({ en: "DL", ar: "نل" })}</AvatarStackItem>
          </AvatarStack>
        </div>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: "With caption", ar: "مع تسمية" })}
        </p>
        <div className="flex items-center gap-3">
          <AvatarStack>
            <AvatarStackItem>{t({ en: "MR", ar: "سر" })}</AvatarStackItem>
            <AvatarStackItem>{t({ en: "SK", ar: "خك" })}</AvatarStackItem>
            <AvatarStackItem>{t({ en: "JT", ar: "لت" })}</AvatarStackItem>
            <AvatarStackOverflow count={6} />
          </AvatarStack>
          <p className="text-sm text-muted-foreground">
            {t({
              en: (
                <>
                  <span className="font-medium text-foreground">
                    9 collaborators
                  </span>{" "}
                  · last active 2m ago
                </>
              ),
              ar: (
                <>
                  <span className="font-medium text-foreground">
                    9 متعاونين
                  </span>{" "}
                  · آخر نشاط قبل دقيقتين
                </>
              ),
            })}
          </p>
        </div>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: "Clickable · asChild", ar: "قابل للنقر · asChild" })}
        </p>
        <AvatarStack>
          <AvatarStackItem asChild>
            <a href="#" aria-label={t({ en: "Maya Renner", ar: "سارة رينر" })}>
              {t({ en: "MR", ar: "سر" })}
            </a>
          </AvatarStackItem>
          <AvatarStackItem asChild>
            <a href="#" aria-label={t({ en: "Soren Kim", ar: "خالد كيم" })}>
              {t({ en: "SK", ar: "خك" })}
            </a>
          </AvatarStackItem>
          <AvatarStackItem asChild>
            <a
              href="#"
              aria-label={t({ en: "Jules Tanaka", ar: "ليلى تاناكا" })}
            >
              {t({ en: "JT", ar: "لت" })}
            </a>
          </AvatarStackItem>
          <AvatarStackOverflow asChild count={6}>
            <a
              href="#"
              aria-label={t({
                en: "View 6 more collaborators",
                ar: "عرض 6 متعاونين آخرين",
              })}
            >
              +6
            </a>
          </AvatarStackOverflow>
        </AvatarStack>
      </div>
    </div>
  );
}
