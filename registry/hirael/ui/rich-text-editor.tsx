"use client";

import * as React from "react";
import { Extension } from "@tiptap/core";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import {
  type Editor,
  EditorContent,
  useEditor,
  useEditorState,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Check,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Pilcrow,
  Quote,
  Redo,
  Strikethrough,
  Trash2,
  Underline as UnderlineIcon,
  Undo,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/registry/hirael/ui/button";
import { Input } from "@/registry/hirael/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/hirael/ui/popover";
import { Separator } from "@/registry/hirael/ui/separator";
import { Skeleton } from "@/registry/hirael/ui/skeleton";
import { Toggle } from "@/registry/hirael/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/hirael/ui/tooltip";

const fakeSelectionPluginKey = new PluginKey("rich-text-editor-fake-selection");

const SelectionHighlight = Extension.create({
  name: "richTextEditorSelectionHighlight",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: fakeSelectionPluginKey,
        state: {
          init: () => DecorationSet.empty,
          apply: (tr, old) => {
            const meta = tr.getMeta(fakeSelectionPluginKey) as
              | { from: number; to: number }
              | "clear"
              | undefined;
            if (meta === "clear") return DecorationSet.empty;
            if (meta) {
              const deco = Decoration.inline(meta.from, meta.to, {
                class: "fake-selection",
              });
              return DecorationSet.create(tr.doc, [deco]);
            }
            return old.map(tr.mapping, tr.doc);
          },
        },
        props: {
          decorations(state) {
            return this.getState(state);
          },
        },
      }),
    ];
  },
});

function showFakeSelection(editor: Editor) {
  const { from, to } = editor.state.selection;
  if (from === to) return;
  editor.view.dispatch(
    editor.state.tr.setMeta(fakeSelectionPluginKey, { from, to }),
  );
}

function clearFakeSelection(editor: Editor) {
  editor.view.dispatch(
    editor.state.tr.setMeta(fakeSelectionPluginKey, "clear"),
  );
}

const RichTextEditorContext = React.createContext<Editor | null>(null);

function useRichTextEditor(): Editor {
  const editor = React.useContext(RichTextEditorContext);
  if (!editor) {
    throw new Error(
      "Rich text editor parts must be rendered inside <RichTextEditor>.",
    );
  }
  return editor;
}

const contentClassName = cn(
  "text-foreground selection:bg-primary/20",
  "[&_.ProseMirror_h1]:mt-6 [&_.ProseMirror_h1]:mb-3 [&_.ProseMirror_h1]:text-3xl [&_.ProseMirror_h1]:font-bold max-sm:[&_.ProseMirror_h1]:text-2xl",
  "[&_.ProseMirror_h2]:mt-5 [&_.ProseMirror_h2]:mb-2 [&_.ProseMirror_h2]:text-2xl [&_.ProseMirror_h2]:font-semibold max-sm:[&_.ProseMirror_h2]:text-xl",
  "[&_.ProseMirror_h3]:mt-4 [&_.ProseMirror_h3]:mb-2 [&_.ProseMirror_h3]:text-xl [&_.ProseMirror_h3]:font-semibold max-sm:[&_.ProseMirror_h3]:text-lg",
  "[&_.ProseMirror_p]:my-3 [&_.ProseMirror_p]:text-base [&_.ProseMirror_p]:leading-7 [&_.ProseMirror_p:first-child]:mt-0 [&_.ProseMirror_p:last-child]:mb-0",
  "[&_.ProseMirror_ul]:my-3 [&_.ProseMirror_ul]:ms-6 [&_.ProseMirror_ul]:list-disc",
  "[&_.ProseMirror_ol]:my-3 [&_.ProseMirror_ol]:ms-6 [&_.ProseMirror_ol]:list-decimal",
  "[&_.ProseMirror_li]:my-1 [&_.ProseMirror_li_p]:my-0",
  "[&_.ProseMirror_code]:rounded [&_.ProseMirror_code]:bg-muted [&_.ProseMirror_code]:px-1.5 [&_.ProseMirror_code]:py-0.5 [&_.ProseMirror_code]:font-mono [&_.ProseMirror_code]:text-sm",
  "[&_.ProseMirror_pre]:my-3 [&_.ProseMirror_pre]:overflow-x-auto [&_.ProseMirror_pre]:rounded-lg [&_.ProseMirror_pre]:border [&_.ProseMirror_pre]:border-border [&_.ProseMirror_pre]:bg-muted [&_.ProseMirror_pre]:p-4 max-sm:[&_.ProseMirror_pre]:text-xs",
  "[&_.ProseMirror_pre_code]:bg-transparent [&_.ProseMirror_pre_code]:p-0 [&_.ProseMirror_pre_code]:text-sm [&_.ProseMirror_pre_code]:leading-relaxed",
  "[&_.ProseMirror_blockquote]:my-3 [&_.ProseMirror_blockquote]:border-s-4 [&_.ProseMirror_blockquote]:border-primary [&_.ProseMirror_blockquote]:ps-4 [&_.ProseMirror_blockquote]:italic [&_.ProseMirror_blockquote]:text-muted-foreground",
  "[&_.ProseMirror_hr]:my-6 [&_.ProseMirror_hr]:border-t [&_.ProseMirror_hr]:border-border",
  "[&_.ProseMirror_mark]:rounded-sm [&_.ProseMirror_mark]:bg-warm/40 [&_.ProseMirror_mark]:px-0.5 [&_.ProseMirror_mark]:text-warm-foreground",
  "[&_.ProseMirror_.fake-selection]:rounded-sm [&_.ProseMirror_.fake-selection]:bg-primary/20",
  "[&_.ProseMirror_p.is-editor-empty:first-child]:before:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child]:before:float-start [&_.ProseMirror_p.is-editor-empty:first-child]:before:h-0 [&_.ProseMirror_p.is-editor-empty:first-child]:before:text-muted-foreground [&_.ProseMirror_p.is-editor-empty:first-child]:before:content-[attr(data-placeholder)]",
);

export type RichTextEditorProps = {
  value?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
  placeholder?: string;
  editable?: boolean;
  disabled?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
  children?: React.ReactNode;
};

function RichTextEditor({
  value,
  onChange,
  defaultValue = "",
  placeholder = "Write something…",
  editable = true,
  disabled = false,
  onFocus,
  onBlur,
  className,
  children,
}: RichTextEditorProps) {
  const isEditable = editable && !disabled;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
        link: {
          openOnClick: false,
          HTMLAttributes: {
            class:
              "text-primary underline underline-offset-2 hover:text-primary/80",
            rel: "noopener noreferrer",
            target: "_blank",
          },
        },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight.configure({ multicolor: false }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),
      SelectionHighlight,
    ],
    content: value ?? defaultValue,
    editable: isEditable,
    immediatelyRender: false,
    onUpdate: ({ editor: e }) => onChange?.(e.getHTML()),
    onFocus: () => onFocus?.(),
    onBlur: () => onBlur?.(),
    editorProps: {
      attributes: {
        class:
          "focus:outline-none min-h-[150px] px-3 py-2 text-base md:text-sm",
      },
    },
  });

  const isInternalUpdate = React.useRef(false);

  React.useEffect(() => {
    if (!editor) return;
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }
    if (value !== undefined && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  React.useEffect(() => {
    if (editor && editor.isEditable !== isEditable) {
      editor.setEditable(isEditable);
    }
  }, [isEditable, editor]);

  React.useEffect(() => {
    if (!editor) return;
    const handler = () => {
      isInternalUpdate.current = true;
    };
    editor.on("update", handler);
    return () => {
      editor.off("update", handler);
    };
  }, [editor]);

  if (!editor) {
    return (
      <div
        data-slot="rich-text-editor"
        className={cn(
          "grow rounded-md border border-input bg-transparent shadow-xs",
          className,
        )}
      >
        <div className="flex flex-wrap items-center gap-2 border-b border-border p-2">
          {Array.from({ length: 18 }).map((_, i) => (
            <Skeleton key={i} className="size-7 rounded" />
          ))}
        </div>
        <div className="min-h-[150px] space-y-2.5 px-3 py-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    );
  }

  return (
    <RichTextEditorContext.Provider value={editor}>
      <div
        data-slot="rich-text-editor"
        aria-disabled={disabled || undefined}
        className={cn(
          "rounded-md border border-input bg-transparent shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
      >
        {children ?? (
          <>
            {isEditable && <RichTextEditorToolbar />}
            <RichTextEditorContent />
          </>
        )}
      </div>
    </RichTextEditorContext.Provider>
  );
}

function RichTextEditorContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const editor = useRichTextEditor();
  return (
    <div
      data-slot="rich-text-editor-content"
      className={cn(contentClassName, className)}
      {...props}
    >
      <EditorContent editor={editor} />
    </div>
  );
}

function RichTextEditorToolbar({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <TooltipProvider>
      <div
        data-slot="rich-text-editor-toolbar"
        className={cn(
          "flex flex-wrap items-center gap-0.5 border-b border-border p-1",
          className,
        )}
        {...props}
      >
        {children ?? <DefaultToolbar />}
      </div>
    </TooltipProvider>
  );
}

export type RichTextEditorButtonProps = {
  tooltip: string;
  pressed?: boolean;
  onPressedChange?: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
};

function RichTextEditorButton({
  tooltip,
  pressed = false,
  onPressedChange,
  disabled,
  className,
  children,
}: RichTextEditorButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Toggle
          data-slot="rich-text-editor-button"
          size="sm"
          pressed={pressed}
          onPressedChange={onPressedChange}
          disabled={disabled}
          className={className}
        >
          {children}
        </Toggle>
      </TooltipTrigger>
      <TooltipContent side="top">{tooltip}</TooltipContent>
    </Tooltip>
  );
}

function RichTextEditorSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="rich-text-editor-separator"
      orientation="vertical"
      className={cn("mx-1 h-6", className)}
      {...props}
    />
  );
}

function RichTextEditorLinkPopover() {
  const editor = useRichTextEditor();
  const [open, setOpen] = React.useState(false);
  const [url, setUrl] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const isLink = useEditorState({
    editor,
    selector: ({ editor }) => editor.isActive("link"),
  });

  const handleOpen = (nextOpen: boolean) => {
    if (nextOpen) {
      const existing = editor.getAttributes("link").href as string | undefined;
      setUrl(existing ?? "");
      showFakeSelection(editor);
    } else {
      clearFakeSelection(editor);
    }
    setOpen(nextOpen);
  };

  const applyLink = () => {
    clearFakeSelection(editor);
    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url.trim() })
        .run();
    }
    setOpen(false);
  };

  const removeLink = () => {
    clearFakeSelection(editor);
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={handleOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Toggle
              data-slot="rich-text-editor-link-trigger"
              size="sm"
              pressed={isLink}
              onPressedChange={() => handleOpen(!open)}
            >
              <LinkIcon className="size-4" />
            </Toggle>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent side="top">Link</TooltipContent>
      </Tooltip>

      <PopoverContent
        data-slot="rich-text-editor-link-popover"
        className="w-80 p-3"
        align="start"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          inputRef.current?.focus();
        }}
      >
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            applyLink();
          }}
        >
          <Input
            ref={inputRef}
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="h-8 text-sm"
          />
          <Button type="submit" variant="ghost" size="icon-sm">
            <Check className="size-4" />
          </Button>
          {isLink && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={removeLink}
            >
              <Trash2 className="size-4 text-destructive" />
            </Button>
          )}
        </form>
      </PopoverContent>
    </Popover>
  );
}

function DefaultToolbar() {
  const editor = useRichTextEditor();
  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      canUndo: editor.can().undo(),
      canRedo: editor.can().redo(),
      isParagraph: editor.isActive("paragraph"),
      isHeading1: editor.isActive("heading", { level: 1 }),
      isHeading2: editor.isActive("heading", { level: 2 }),
      isHeading3: editor.isActive("heading", { level: 3 }),
      isBold: editor.isActive("bold"),
      isItalic: editor.isActive("italic"),
      isUnderline: editor.isActive("underline"),
      isStrike: editor.isActive("strike"),
      isCode: editor.isActive("code"),
      isHighlight: editor.isActive("highlight"),
      isAlignLeft: editor.isActive({ textAlign: "left" }),
      isAlignCenter: editor.isActive({ textAlign: "center" }),
      isAlignRight: editor.isActive({ textAlign: "right" }),
      isAlignJustify: editor.isActive({ textAlign: "justify" }),
      isBulletList: editor.isActive("bulletList"),
      isOrderedList: editor.isActive("orderedList"),
      isBlockquote: editor.isActive("blockquote"),
    }),
  });

  return (
    <>
      <RichTextEditorButton
        tooltip="Undo"
        onPressedChange={() => editor.chain().focus().undo().run()}
        disabled={!state.canUndo}
      >
        <Undo className="size-4" />
      </RichTextEditorButton>
      <RichTextEditorButton
        tooltip="Redo"
        onPressedChange={() => editor.chain().focus().redo().run()}
        disabled={!state.canRedo}
      >
        <Redo className="size-4" />
      </RichTextEditorButton>

      <RichTextEditorSeparator />

      <RichTextEditorButton
        tooltip="Paragraph"
        pressed={state.isParagraph}
        onPressedChange={() => editor.chain().focus().setParagraph().run()}
      >
        <Pilcrow className="size-4" />
      </RichTextEditorButton>
      <RichTextEditorButton
        tooltip="Heading 1"
        pressed={state.isHeading1}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
      >
        <Heading1 className="size-4" />
      </RichTextEditorButton>
      <RichTextEditorButton
        tooltip="Heading 2"
        pressed={state.isHeading2}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
      >
        <Heading2 className="size-4" />
      </RichTextEditorButton>
      <RichTextEditorButton
        tooltip="Heading 3"
        pressed={state.isHeading3}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
      >
        <Heading3 className="size-4" />
      </RichTextEditorButton>

      <RichTextEditorSeparator />

      <RichTextEditorButton
        tooltip="Bold"
        pressed={state.isBold}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="size-4" />
      </RichTextEditorButton>
      <RichTextEditorButton
        tooltip="Italic"
        pressed={state.isItalic}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="size-4" />
      </RichTextEditorButton>
      <RichTextEditorButton
        tooltip="Underline"
        pressed={state.isUnderline}
        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className="size-4" />
      </RichTextEditorButton>
      <RichTextEditorButton
        tooltip="Strikethrough"
        pressed={state.isStrike}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="size-4" />
      </RichTextEditorButton>
      <RichTextEditorButton
        tooltip="Code"
        pressed={state.isCode}
        onPressedChange={() => editor.chain().focus().toggleCode().run()}
      >
        <Code className="size-4" />
      </RichTextEditorButton>
      <RichTextEditorButton
        tooltip="Highlight"
        pressed={state.isHighlight}
        onPressedChange={() => editor.chain().focus().toggleHighlight().run()}
      >
        <Highlighter className="size-4" />
      </RichTextEditorButton>

      <RichTextEditorSeparator />

      <RichTextEditorLinkPopover />

      <RichTextEditorSeparator />

      <RichTextEditorButton
        tooltip="Align left"
        pressed={state.isAlignLeft}
        onPressedChange={() =>
          editor.chain().focus().setTextAlign("left").run()
        }
      >
        <AlignLeft className="size-4" />
      </RichTextEditorButton>
      <RichTextEditorButton
        tooltip="Align center"
        pressed={state.isAlignCenter}
        onPressedChange={() =>
          editor.chain().focus().setTextAlign("center").run()
        }
      >
        <AlignCenter className="size-4" />
      </RichTextEditorButton>
      <RichTextEditorButton
        tooltip="Align right"
        pressed={state.isAlignRight}
        onPressedChange={() =>
          editor.chain().focus().setTextAlign("right").run()
        }
      >
        <AlignRight className="size-4" />
      </RichTextEditorButton>
      <RichTextEditorButton
        tooltip="Justify"
        pressed={state.isAlignJustify}
        onPressedChange={() =>
          editor.chain().focus().setTextAlign("justify").run()
        }
      >
        <AlignJustify className="size-4" />
      </RichTextEditorButton>

      <RichTextEditorSeparator />

      <RichTextEditorButton
        tooltip="Bullet list"
        pressed={state.isBulletList}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="size-4" />
      </RichTextEditorButton>
      <RichTextEditorButton
        tooltip="Ordered list"
        pressed={state.isOrderedList}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="size-4" />
      </RichTextEditorButton>
      <RichTextEditorButton
        tooltip="Blockquote"
        pressed={state.isBlockquote}
        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="size-4" />
      </RichTextEditorButton>
      <RichTextEditorButton
        tooltip="Horizontal rule"
        onPressedChange={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <Minus className="size-4" />
      </RichTextEditorButton>
    </>
  );
}

export {
  RichTextEditor,
  RichTextEditorToolbar,
  RichTextEditorButton,
  RichTextEditorSeparator,
  RichTextEditorContent,
  RichTextEditorLinkPopover,
  useRichTextEditor,
};
