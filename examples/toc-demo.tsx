"use client";

import { useT } from "@/lib/demo-locale";
import {
  TableOfContents,
  TableOfContentsLabel,
  TableOfContentsList,
  type TocItem,
} from "@/registry/hirael/components/toc";

export default function TocDemo() {
  const t = useT();

  const flatItems: TocItem[] = [
    { id: "overview", text: t({ en: "Overview", ar: "نظرة عامة" }), level: 2 },
    { id: "install", text: t({ en: "Install", ar: "التثبيت" }), level: 2 },
    { id: "usage", text: t({ en: "Usage", ar: "الاستخدام" }), level: 2 },
    { id: "props", text: t({ en: "Props", ar: "الخصائص" }), level: 2 },
  ];

  const nestedItems: TocItem[] = [
    {
      id: "getting-started",
      text: t({ en: "Getting started", ar: "البدء" }),
      level: 2,
      children: [
        {
          id: "requirements",
          text: t({ en: "Requirements", ar: "المتطلبات" }),
          level: 3,
        },
        {
          id: "first-run",
          text: t({ en: "First run", ar: "التشغيل الأول" }),
          level: 3,
        },
      ],
    },
    {
      id: "configuration",
      text: t({ en: "Configuration", ar: "الإعداد" }),
      level: 2,
      children: [
        { id: "tokens", text: t({ en: "Tokens", ar: "الرموز" }), level: 3 },
        { id: "themes", text: t({ en: "Themes", ar: "السمات" }), level: 3 },
      ],
    },
    { id: "faq", text: t({ en: "FAQ", ar: "الأسئلة الشائعة" }), level: 2 },
  ];

  const onThisPage = t({ en: "On this page", ar: "في هذه الصفحة" });

  return (
    <div className="grid w-full max-w-2xl gap-10 sm:grid-cols-2">
      <TableOfContents
        items={flatItems}
        label={onThisPage}
        aria-label={onThisPage}
      />

      <TableOfContents>
        <TableOfContentsLabel>
          {t({ en: "Contents", ar: "المحتويات" })}
        </TableOfContentsLabel>
        <TableOfContentsList items={nestedItems} />
      </TableOfContents>
    </div>
  );
}
