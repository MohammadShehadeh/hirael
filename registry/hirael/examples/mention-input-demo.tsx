"use client";

import * as React from "react";

import { useT } from "@/lib/demo-locale";
import {
  MentionInput,
  getMentions,
  type MentionItem,
} from "@/registry/hirael/ui/mention-input";

export default function MentionInputDemo() {
  const t = useT();

  const TEAM: MentionItem[] = [
    {
      id: "1",
      label: "john.doe",
      description: t({
        en: "John Doe · Design lead",
        ar: "John Doe · قائد التصميم",
      }),
    },
    {
      id: "2",
      label: "mohammad.shehadeh",
      description: t({
        en: "Mohammad Shehadeh · Frontend",
        ar: "Mohammad Shehadeh · واجهة أمامية",
      }),
    },
    {
      id: "3",
      label: "jane.doe",
      description: t({ en: "Jane Doe · Product", ar: "Jane Doe · المنتج" }),
    },
    {
      id: "4",
      label: "richard.roe",
      description: t({
        en: "Richard Roe · Backend",
        ar: "Richard Roe · واجهة خلفية",
      }),
    },
    {
      id: "5",
      label: "mary.major",
      description: t({ en: "Mary Major · QA", ar: "Mary Major · ضمان الجودة" }),
    },
  ];

  const CHANNELS: MentionItem[] = [
    {
      id: "c1",
      label: "general",
      description: t({
        en: "Company-wide announcements",
        ar: "إعلانات على مستوى الشركة",
      }),
    },
    {
      id: "c2",
      label: "design",
      description: t({
        en: "Design critiques and reviews",
        ar: "نقد التصميم ومراجعاته",
      }),
    },
    {
      id: "c3",
      label: "engineering",
      description: t({ en: "Build, ship, repeat", ar: "ابنِ، انشر، كرّر" }),
    },
    {
      id: "c4",
      label: "random",
      description: t({ en: "Watercooler", ar: "دردشة جانبية" }),
    },
  ];

  function searchPeopleAndChannels(
    query: string,
    trigger: string,
  ): Promise<MentionItem[]> {
    const source = trigger === "#" ? CHANNELS : TEAM;
    const q = query.toLowerCase();
    return Promise.resolve(
      source.filter(
        (it) =>
          it.label.toLowerCase().includes(q) ||
          it.description?.toLowerCase().includes(q),
      ),
    );
  }

  function searchDirectory(query: string): Promise<MentionItem[]> {
    const q = query.toLowerCase();
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          TEAM.filter(
            (it) =>
              it.label.toLowerCase().includes(q) ||
              it.description?.toLowerCase().includes(q),
          ),
        );
      }, 600);
    });
  }

  const [comment, setComment] = React.useState(
    t({
      en: "Looks great @jane.doe can you take a final pass?",
      ar: "يبدو رائعًا @jane.doe هل يمكنك إلقاء نظرة أخيرة؟",
    }),
  );
  const mentions = getMentions(comment);

  return (
    <div className="grid w-full max-w-2xl gap-8">
      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({
            en: "Team mentions · controlled",
            ar: "إشارات الفريق · متحكَّم بها",
          })}
        </p>
        <MentionInput
          value={comment}
          onValueChange={setComment}
          items={TEAM}
          placeholder={t({
            en: "Type @ to mention a teammate…",
            ar: "اكتب @ للإشارة إلى زميل…",
          })}
          maxRows={6}
        />
        <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
          {t({ en: "mentioned:", ar: "أُشير إلى:" })}{" "}
          {mentions.length
            ? mentions.join(", ")
            : t({ en: "nobody yet", ar: "لا أحد بعد" })}
        </p>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({
            en: "Multiple triggers · @ people + # channels",
            ar: "محفّزات متعددة · @ للأشخاص + # للقنوات",
          })}
        </p>
        <MentionInput
          defaultValue=""
          trigger={["@", "#"]}
          onSearch={searchPeopleAndChannels}
          placeholder={t({
            en: "Type @ for people or # for channels…",
            ar: "اكتب @ للأشخاص أو # للقنوات…",
          })}
          maxRows={6}
        />
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({
            en: "Async search · debounced with spinner",
            ar: "بحث غير متزامن · مؤجَّل مع مؤشر تحميل",
          })}
        </p>
        <MentionInput
          defaultValue=""
          onSearch={searchDirectory}
          placeholder={t({
            en: "Type @ to search the directory…",
            ar: "اكتب @ للبحث في الدليل…",
          })}
          maxRows={6}
          onMention={(item) => console.log("mentioned", item)}
        />
      </div>
    </div>
  );
}
