"use client";

import { useT } from "@/lib/demo-locale";
import {
  AvatarStack,
  AvatarStackItem,
  AvatarStackOverflow,
} from "@/registry/hirael/ui/avatar-stack";

const TRIO = [
  { en: "AM", ar: "أم" },
  { en: "JK", ar: "خك" },
  { en: "RP", ar: "رب" },
];
const QUARTET = [...TRIO, { en: "DL", ar: "نل" }];

export default function AvatarStackDemo() {
  const t = useT();

  return (
    <div className="grid w-full max-w-3xl gap-8">
      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: "Sizes", ar: "الأحجام" })}
        </p>
        <div className="flex flex-wrap items-end gap-6">
          {(
            [
              { size: "sm", count: 4 },
              { size: "md", count: 12 },
              { size: "lg", count: 28 },
            ] as const
          ).map(({ size, count }) => (
            <AvatarStack key={size} size={size}>
              {TRIO.map((i) => (
                <AvatarStackItem key={i.en}>{t(i)}</AvatarStackItem>
              ))}
              <AvatarStackOverflow count={count} />
            </AvatarStack>
          ))}
        </div>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: "Spacing", ar: "التباعد" })}
        </p>
        <div className="flex flex-wrap items-center gap-8">
          {(["tight", "normal", "loose"] as const).map((spacing) => (
            <AvatarStack key={spacing} spacing={spacing}>
              {QUARTET.map((i) => (
                <AvatarStackItem key={i.en}>{t(i)}</AvatarStackItem>
              ))}
            </AvatarStack>
          ))}
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
