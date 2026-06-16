"use client";

import {
  TableOfContents,
  TableOfContentsLabel,
  TableOfContentsList,
  type TocItem,
} from "@/registry/hirael/ui/toc";

const flatItems: TocItem[] = [
  { id: "overview", text: "Overview", level: 2 },
  { id: "install", text: "Install", level: 2 },
  { id: "usage", text: "Usage", level: 2 },
  { id: "props", text: "Props", level: 2 },
];

const nestedItems: TocItem[] = [
  {
    id: "getting-started",
    text: "Getting started",
    level: 2,
    children: [
      { id: "requirements", text: "Requirements", level: 3 },
      { id: "first-run", text: "First run", level: 3 },
    ],
  },
  {
    id: "configuration",
    text: "Configuration",
    level: 2,
    children: [
      { id: "tokens", text: "Tokens", level: 3 },
      { id: "themes", text: "Themes", level: 3 },
    ],
  },
  { id: "faq", text: "FAQ", level: 2 },
];

export default function TocDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-10 sm:grid-cols-2">
      <TableOfContents items={flatItems} />

      <TableOfContents>
        <TableOfContentsLabel>Contents</TableOfContentsLabel>
        <TableOfContentsList items={nestedItems} />
      </TableOfContents>
    </div>
  );
}
