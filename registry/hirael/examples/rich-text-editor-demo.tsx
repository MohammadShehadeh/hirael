"use client";

import * as React from "react";
import { useEditorState } from "@tiptap/react";
import { Bold, Italic, List, Underline } from "lucide-react";

import { useT } from "@/lib/demo-locale";
import {
  RichTextEditor,
  RichTextEditorButton,
  RichTextEditorContent,
  RichTextEditorLinkPopover,
  RichTextEditorSeparator,
  RichTextEditorToolbar,
  useRichTextEditor,
} from "@/registry/hirael/ui/rich-text-editor";

function CompactToolbar() {
  const t = useT();
  const editor = useRichTextEditor();
  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      isBold: editor.isActive("bold"),
      isItalic: editor.isActive("italic"),
      isUnderline: editor.isActive("underline"),
      isBulletList: editor.isActive("bulletList"),
    }),
  });

  return (
    <RichTextEditorToolbar>
      <RichTextEditorButton
        tooltip={t({ en: "Bold", ar: "عريض" })}
        pressed={state.isBold}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="size-4" />
      </RichTextEditorButton>
      <RichTextEditorButton
        tooltip={t({ en: "Italic", ar: "مائل" })}
        pressed={state.isItalic}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="size-4" />
      </RichTextEditorButton>
      <RichTextEditorButton
        tooltip={t({ en: "Underline", ar: "تسطير" })}
        pressed={state.isUnderline}
        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
      >
        <Underline className="size-4" />
      </RichTextEditorButton>
      <RichTextEditorButton
        tooltip={t({ en: "Bullet list", ar: "قائمة نقطية" })}
        pressed={state.isBulletList}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="size-4" />
      </RichTextEditorButton>
      <RichTextEditorSeparator />
      <RichTextEditorLinkPopover />
    </RichTextEditorToolbar>
  );
}

export default function RichTextEditorDemo() {
  const t = useT();

  const initialHtml = t({
    en: "<h2>Release notes</h2><p>We shipped a <strong>rich text editor</strong> with <em>formatting</em>, lists and <mark>highlights</mark>.</p><ul><li>Headings, quotes and code</li><li>Links and text alignment</li></ul>",
    ar: "<h2>ملاحظات الإصدار</h2><p>أطلقنا <strong>محرّر نصوص غنيًا</strong> مع <em>تنسيق</em> وقوائم و<mark>تمييز</mark>.</p><ul><li>عناوين واقتباسات وشيفرة</li><li>روابط ومحاذاة النص</li></ul>",
  });

  const [value, setValue] = React.useState(
    t({
      en: "<p>Type below — this editor is <strong>controlled</strong>.</p>",
      ar: "<p>اكتب أدناه — هذا المحرّر <strong>متحكَّم به</strong>.</p>",
    }),
  );

  return (
    <div className="grid w-full max-w-2xl gap-8">
      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: "Default toolbar", ar: "شريط الأدوات الافتراضي" })}
        </p>
        <RichTextEditor
          defaultValue={initialHtml}
          placeholder={t({ en: "Write something…", ar: "اكتب شيئًا…" })}
        />
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({
            en: "Custom toolbar · controlled",
            ar: "شريط أدوات مخصّص · متحكَّم به",
          })}
        </p>
        <RichTextEditor
          value={value}
          onChange={setValue}
          placeholder={t({ en: "Write something…", ar: "اكتب شيئًا…" })}
        >
          <CompactToolbar />
          <RichTextEditorContent />
        </RichTextEditor>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: "Read-only", ar: "للقراءة فقط" })}
        </p>
        <RichTextEditor
          disabled
          value={t({
            en: '<p>Published content renders without a toolbar. <a href="https://hirael.com">Read more</a>.</p>',
            ar: '<p>المحتوى المنشور يُعرض بدون شريط أدوات. <a href="https://hirael.com">اقرأ المزيد</a>.</p>',
          })}
        />
      </div>
    </div>
  );
}
