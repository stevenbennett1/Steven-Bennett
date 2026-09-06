"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { JSONContent } from "@tiptap/react";
import { Loader2, Save } from "lucide-react";
import Editor from "./Editor";
import CoverImageUploader from "./CoverImageUploader";
import PdfAttachmentsField, { type AttachmentValue } from "./PdfAttachmentsField";
import TagInput from "./TagInput";
import { toEmbedUrl } from "@/lib/video";

export type EditorCategory = { id: string; name: string };

export type EditorPost = {
  id: string;
  title: string;
  excerpt: string | null;
  contentJson: string;
  coverImageUrl: string | null;
  videoUrl: string | null;
  status: string;
  publishedAt: string | Date | null;
  categories: { categoryId: string }[];
  tags: { tag: { name: string } }[];
  attachments: AttachmentValue[];
};

function toDatetimeLocal(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function PostEditorForm({
  categories,
  initialPost,
}: {
  categories: EditorCategory[];
  initialPost?: EditorPost;
}) {
  const router = useRouter();
  const isEdit = Boolean(initialPost);

  const [title, setTitle] = useState(initialPost?.title ?? "");
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt ?? "");
  const [categoryIds, setCategoryIds] = useState<string[]>(
    initialPost?.categories.map((c) => c.categoryId) ?? []
  );
  const [tags, setTags] = useState<string[]>(initialPost?.tags.map((t) => t.tag.name) ?? []);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(initialPost?.coverImageUrl ?? null);
  const [videoUrl, setVideoUrl] = useState(initialPost?.videoUrl ?? "");
  const [attachments, setAttachments] = useState<AttachmentValue[]>(initialPost?.attachments ?? []);
  const [publishMode, setPublishMode] = useState<"draft" | "published" | "scheduled">(
    (initialPost?.status as "draft" | "published" | "scheduled") ?? "draft"
  );
  const [scheduledAt, setScheduledAt] = useState(
    initialPost?.publishedAt ? toDatetimeLocal(new Date(initialPost.publishedAt)) : ""
  );

  const initialJson: JSONContent | null = initialPost ? JSON.parse(initialPost.contentJson) : null;
  const [contentJson, setContentJson] = useState<JSONContent | null>(initialJson);
  const [contentHtml, setContentHtml] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const videoLooksValid = videoUrl.trim() === "" || Boolean(toEmbedUrl(videoUrl));

  function toggleCategory(id: string) {
    setCategoryIds((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  }

  async function submit(status: "draft" | "published" | "scheduled") {
    setError(null);

    if (!title.trim()) {
      setError("Give the post a title.");
      return;
    }
    if (status !== "draft" && categoryIds.length === 0) {
      setError("What is this post about? Pick at least one category before publishing.");
      return;
    }
    if (!contentJson) {
      setError("Write something in the body.");
      return;
    }
    if (videoUrl.trim() && !toEmbedUrl(videoUrl)) {
      setError("That video URL doesn't look like a YouTube or Vimeo link.");
      return;
    }
    if (status === "scheduled" && !scheduledAt) {
      setError("Pick a date and time to schedule this for.");
      return;
    }

    setSaving(true);
    const payload = {
      title,
      excerpt: excerpt || null,
      contentJson: JSON.stringify(contentJson),
      contentHtml,
      coverImageUrl: coverImageUrl || null,
      videoUrl: videoUrl || null,
      status,
      publishedAt: status === "scheduled" ? new Date(scheduledAt).toISOString() : null,
      categoryIds,
      tags,
      attachments,
    };

    const res = await fetch(isEdit ? `/api/posts/${initialPost!.id}` : "/api/posts", {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    if (!res.ok) {
      setError("Something went wrong saving this post.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="space-y-6 pb-16">
      {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title"
        className="w-full border-none bg-transparent tracking-tight text-3xl font-bold text-ink outline-none placeholder:text-ink-faint sm:text-4xl"
      />

      <textarea
        value={excerpt}
        onChange={(e) => setExcerpt(e.target.value)}
        placeholder="One or two sentence summary shown on the homepage…"
        rows={2}
        className="w-full resize-none rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-ink outline-none focus:border-accent"
      />

      <CoverImageUploader value={coverImageUrl} onChange={setCoverImageUrl} />

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-ink-soft">
          What&apos;s this post about? <span className="text-ink-faint">(pick at least one)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => {
            const active = categoryIds.includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => toggleCategory(c.id)}
                className={`border px-3 py-1.5 text-sm transition-colors ${
                  active ? "border-ink bg-ink text-paper" : "border-border text-ink-soft hover:border-ink hover:text-ink"
                }`}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-ink-soft">Tags</label>
        <TagInput value={tags} onChange={setTags} />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-ink-soft">Video link (YouTube or Vimeo, optional)</label>
        <input
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="https://youtube.com/watch?v=…"
          className={`w-full rounded-lg border bg-surface px-3.5 py-2.5 text-sm text-ink outline-none ${
            videoLooksValid ? "border-border focus:border-accent" : "border-red-400"
          }`}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-ink-soft">Body</label>
        <Editor
          initialContent={contentJson}
          onChange={(json, html) => {
            setContentJson(json);
            setContentHtml(html);
          }}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-ink-soft">PDF attachments (optional)</label>
        <PdfAttachmentsField value={attachments} onChange={setAttachments} />
      </div>

      <div className="sticky bottom-0 -mx-5 flex flex-col gap-3 border-t border-border bg-paper/95 px-5 py-4 backdrop-blur sm:-mx-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-center gap-3">
          <select
            value={publishMode}
            onChange={(e) => setPublishMode(e.target.value as typeof publishMode)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent"
          >
            <option value="draft">Draft</option>
            <option value="published">Publish now</option>
            <option value="scheduled">Schedule</option>
          </select>
          {publishMode === "scheduled" && (
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent"
            />
          )}
        </div>
        <button
          onClick={() => submit(publishMode)}
          disabled={saving}
          className="flex items-center justify-center gap-2 rounded-lg bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {publishMode === "draft" ? "Save draft" : publishMode === "scheduled" ? "Schedule" : "Publish"}
        </button>
      </div>
    </div>
  );
}
