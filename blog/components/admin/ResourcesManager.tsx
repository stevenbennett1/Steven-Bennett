"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2, Pencil, Check, X, Star, BookOpen } from "lucide-react";
import CoverImageUploader from "./CoverImageUploader";
import { resourceTypeValues } from "@/lib/validation";

export type AdminResource = {
  id: string;
  title: string;
  type: string;
  creator: string | null;
  url: string;
  coverImageUrl: string | null;
  description: string | null;
  featured: boolean;
};

const emptyForm = {
  title: "",
  type: "book" as (typeof resourceTypeValues)[number],
  creator: "",
  url: "",
  coverImageUrl: null as string | null,
  description: "",
  featured: false,
};

export default function ResourcesManager({ initial }: { initial: AdminResource[] }) {
  const router = useRouter();
  const [resources, setResources] = useState(initial);
  const [form, setForm] = useState(emptyForm);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.url.trim()) return;
    setCreating(true);
    setError(null);
    const res = await fetch("/api/resources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setCreating(false);
    if (!res.ok) {
      setError("Could not save that resource — check the URL is a full link.");
      return;
    }
    const created = await res.json();
    setResources((prev) => [created, ...prev]);
    setForm(emptyForm);
  }

  function startEdit(r: AdminResource) {
    setEditingId(r.id);
    setEditForm({
      title: r.title,
      type: r.type as (typeof resourceTypeValues)[number],
      creator: r.creator ?? "",
      url: r.url,
      coverImageUrl: r.coverImageUrl,
      description: r.description ?? "",
      featured: r.featured,
    });
  }

  async function saveEdit(id: string) {
    const res = await fetch(`/api/resources/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    if (res.ok) {
      const updated = await res.json();
      setResources((prev) => prev.map((r) => (r.id === id ? updated : r)));
      setEditingId(null);
      router.refresh();
    } else {
      alert("Could not update that resource.");
    }
  }

  async function remove(id: string) {
    if (!confirm("Remove this resource?")) return;
    const res = await fetch(`/api/resources/${id}`, { method: "DELETE" });
    if (res.ok) setResources((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleCreate} className="space-y-4 paper-card p-5">
        <p className="text-sm font-bold text-ink">Add a recommendation</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Title"
            className="rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-accent"
          />
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as typeof form.type })}
            className="rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm capitalize outline-none focus:border-accent"
          >
            {resourceTypeValues.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <input
            value={form.creator}
            onChange={(e) => setForm({ ...form, creator: e.target.value })}
            placeholder="Author / creator (optional)"
            className="rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-accent"
          />
          <input
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            placeholder="https://…"
            className="rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-accent"
          />
        </div>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Why do you recommend it?"
          rows={2}
          className="w-full resize-none rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-accent"
        />
        <div className="max-w-xs">
          <CoverImageUploader value={form.coverImageUrl} onChange={(url) => setForm({ ...form, coverImageUrl: url })} />
        </div>
        <label className="flex items-center gap-2 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
          />
          Feature this at the top of the page
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={creating}
          className="flex items-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-paper hover:opacity-90 disabled:opacity-60"
        >
          {creating ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
          Add resource
        </button>
      </form>

      <div className="space-y-3">
        {resources.length === 0 && <p className="text-ink-soft">No resources yet.</p>}
        {resources.map((r) => (
          <div key={r.id} className="paper-card p-4">
            {editingId === r.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
                  />
                  <select
                    value={editForm.type}
                    onChange={(e) => setEditForm({ ...editForm, type: e.target.value as typeof editForm.type })}
                    className="rounded-lg border border-border bg-surface px-3 py-2 text-sm capitalize outline-none focus:border-accent"
                  >
                    {resourceTypeValues.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <input
                    value={editForm.creator}
                    onChange={(e) => setEditForm({ ...editForm, creator: e.target.value })}
                    className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
                  />
                  <input
                    value={editForm.url}
                    onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                    className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
                  />
                </div>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={2}
                  className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
                />
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm text-ink-soft">
                    <input
                      type="checkbox"
                      checked={editForm.featured}
                      onChange={(e) => setEditForm({ ...editForm, featured: e.target.checked })}
                    />
                    Featured
                  </label>
                  <button onClick={() => saveEdit(r.id)} className="text-emerald-600 hover:opacity-70">
                    <Check size={17} />
                  </button>
                  <button onClick={() => setEditingId(null)} className="text-ink-faint hover:opacity-70">
                    <X size={17} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden border-[1.6px] border-border bg-paper-card">
                  {r.coverImageUrl ? (
                    <Image src={r.coverImageUrl} alt={r.title} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <BookOpen size={18} className="text-ink-faint" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-ink">{r.title}</span>
                    <span className="font-mono-label bg-paper-card px-2 py-0.5 text-[0.6rem] text-ink-faint">
                      {r.type.toUpperCase()}
                    </span>
                    {r.featured && <Star size={13} className="fill-accent-deep text-accent-deep" />}
                  </div>
                  {r.creator && <div className="text-sm text-ink-soft">{r.creator}</div>}
                  {r.description && <p className="mt-1 text-sm text-ink-soft">{r.description}</p>}
                </div>
                <div className="flex items-center gap-3 text-ink-faint">
                  <button onClick={() => startEdit(r)} className="hover:text-ink" title="Edit">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => remove(r.id)} className="hover:text-red-600" title="Delete">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
