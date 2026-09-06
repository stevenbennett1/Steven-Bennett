"use client";

import { useEditor, EditorContent, type JSONContent } from "@tiptap/react";
import { Mark, mergeAttributes } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import Highlight from "@tiptap/extension-highlight";
import { useRef, useState } from "react";
import {
  Bold,
  Italic,
  UnderlineIcon,
  Heading2,
  Heading3,
  Type,
  List,
  ListOrdered,
  Quote,
  Link2,
  ImagePlus,
  Undo2,
  Redo2,
  Minus,
  Loader2,
  Highlighter,
} from "lucide-react";

// Lets the admin make specific words within a sentence read as heading-weight
// (bold + larger) without turning the whole line into a block-level heading.
const BigText = Mark.create({
  name: "bigText",
  parseHTML() {
    return [{ tag: "span.prose-big" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes, { class: "prose-big" }), 0];
  },
});

const FONT_OPTIONS = [
  { label: "Default", value: "" },
  { label: "Elegant serif", value: "var(--font-playfair)" },
  { label: "Reading serif", value: "var(--font-merriweather)" },
  { label: "Modern sans", value: "var(--font-space-grotesk)" },
  { label: "Handwritten", value: "var(--font-caveat)" },
  { label: "Monospace", value: "var(--font-dm-mono)" },
];

const HIGHLIGHT_SWATCHES = [
  { label: "Yellow", color: "#fdf1a8" },
  { label: "Pink", color: "#ffd1e3" },
  { label: "Green", color: "#c9f2d8" },
  { label: "Blue", color: "#c9e3ff" },
  { label: "Purple", color: "#e3d6ff" },
];

function ToolbarButton({
  active,
  onClick,
  title,
  children,
  disabled,
}: {
  active?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors disabled:opacity-30 ${
        active ? "bg-accent-soft text-accent-deep" : "text-ink-soft hover:bg-paper-card hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

export default function Editor({
  initialContent,
  onChange,
}: {
  initialContent?: JSONContent | null;
  onChange: (json: JSONContent, html: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true }),
      Image.configure({ HTMLAttributes: { class: "rounded-lg" } }),
      Placeholder.configure({ placeholder: "Start writing…" }),
      TextStyle,
      FontFamily,
      Highlight.configure({ multicolor: true }),
      BigText,
    ],
    content: initialContent || "",
    editorProps: {
      attributes: {
        class: "prose-notebook focus:outline-none px-4 py-4",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON(), editor.getHTML());
    },
  });

  async function uploadImage(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("kind", "image");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      editor?.chain().focus().setImage({ src: data.url }).run();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  function setLink() {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previousUrl || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="flex flex-wrap items-center gap-1 border-b border-border p-2">
        <select
          title="Font"
          value={(editor.getAttributes("textStyle").fontFamily as string) || ""}
          onChange={(e) => {
            const value = e.target.value;
            if (value) editor.chain().focus().setFontFamily(value).run();
            else editor.chain().focus().unsetFontFamily().run();
          }}
          className="h-8 rounded-md border-none bg-transparent px-1 text-xs text-ink-soft outline-none hover:bg-paper-card"
        >
          {FONT_OPTIONS.map((f) => (
            <option key={f.label} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
        <div className="mx-1 h-5 w-px bg-border" />
        <ToolbarButton title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton title="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton title="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon size={16} />
        </ToolbarButton>
        <ToolbarButton
          title="Emphasize selected words (heading style, stays inline)"
          active={editor.isActive("bigText")}
          onClick={() => editor.chain().focus().toggleMark("bigText").run()}
        >
          <Type size={16} />
        </ToolbarButton>
        {HIGHLIGHT_SWATCHES.map((s) => (
          <ToolbarButton
            key={s.color}
            title={`Highlight ${s.label}`}
            active={editor.isActive("highlight", { color: s.color })}
            onClick={() => editor.chain().focus().toggleHighlight({ color: s.color }).run()}
          >
            <Highlighter size={16} color={s.color} />
          </ToolbarButton>
        ))}
        <div className="mx-1 h-5 w-px bg-border" />
        <ToolbarButton
          title="Heading 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 size={16} />
        </ToolbarButton>
        <ToolbarButton
          title="Heading 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 size={16} />
        </ToolbarButton>
        <div className="mx-1 h-5 w-px bg-border" />
        <ToolbarButton title="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton title="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered size={16} />
        </ToolbarButton>
        <ToolbarButton title="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote size={16} />
        </ToolbarButton>
        <ToolbarButton title="Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus size={16} />
        </ToolbarButton>
        <div className="mx-1 h-5 w-px bg-border" />
        <ToolbarButton title="Link" active={editor.isActive("link")} onClick={setLink}>
          <Link2 size={16} />
        </ToolbarButton>
        <ToolbarButton title="Insert image" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
        </ToolbarButton>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadImage(file);
            e.target.value = "";
          }}
        />
        <div className="mx-1 h-5 w-px bg-border" />
        <ToolbarButton title="Undo" onClick={() => editor.chain().focus().undo().run()}>
          <Undo2 size={16} />
        </ToolbarButton>
        <ToolbarButton title="Redo" onClick={() => editor.chain().focus().redo().run()}>
          <Redo2 size={16} />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
