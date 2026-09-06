"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2, Pencil, Check, X } from "lucide-react";

export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count: { posts: number };
};

export default function CategoriesManager({ initial }: { initial: AdminCategory[] }) {
  const router = useRouter();
  const [categories, setCategories] = useState(initial);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    setError(null);
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });
    setCreating(false);
    if (!res.ok) {
      setError("Could not create category.");
      return;
    }
    const created = await res.json();
    setCategories((prev) => [...prev, { ...created, _count: { posts: 0 } }].sort((a, b) => a.name.localeCompare(b.name)));
    setName("");
    setDescription("");
  }

  function startEdit(c: AdminCategory) {
    setEditingId(c.id);
    setEditName(c.name);
    setEditDescription(c.description ?? "");
  }

  async function saveEdit(id: string) {
    const res = await fetch(`/api/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName, description: editDescription }),
    });
    if (res.ok) {
      const updated = await res.json();
      setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
      setEditingId(null);
    } else {
      alert("Could not update category.");
    }
  }

  async function handleDelete(c: AdminCategory) {
    if (c._count.posts > 0) {
      alert(`Can't delete — ${c._count.posts} post(s) use this category.`);
      return;
    }
    if (!confirm(`Delete "${c.name}"?`)) return;
    const res = await fetch(`/api/categories/${c.id}`, { method: "DELETE" });
    if (res.ok) {
      setCategories((prev) => prev.filter((x) => x.id !== c.id));
      router.refresh();
    } else {
      alert("Could not delete category.");
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleCreate} className="flex flex-col gap-3 rounded-xl paper-card p-5 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-1.5">
          <label className="text-sm font-medium text-ink-soft">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Books I Recommend"
            className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-accent"
          />
        </div>
        <div className="flex-1 space-y-1.5">
          <label className="text-sm font-medium text-ink-soft">Description (optional)</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description"
            className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-accent"
          />
        </div>
        <button
          type="submit"
          disabled={creating}
          className="flex items-center justify-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-paper hover:opacity-90 disabled:opacity-60"
        >
          {creating ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
          Add
        </button>
      </form>
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="divide-y divide-border rounded-xl paper-card">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center gap-4 px-5 py-4">
            {editingId === c.id ? (
              <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm outline-none focus:border-accent"
                />
                <input
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="flex-1 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm outline-none focus:border-accent"
                />
                <div className="flex gap-2">
                  <button onClick={() => saveEdit(c.id)} className="text-emerald-600 hover:opacity-70">
                    <Check size={17} />
                  </button>
                  <button onClick={() => setEditingId(null)} className="text-ink-faint hover:opacity-70">
                    <X size={17} />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1">
                  <div className="font-medium text-ink">{c.name}</div>
                  {c.description && <div className="text-sm text-ink-soft">{c.description}</div>}
                </div>
                <div className="text-xs text-ink-faint">{c._count.posts} post(s)</div>
                <div className="flex items-center gap-3 text-ink-faint">
                  <button onClick={() => startEdit(c)} className="hover:text-ink" title="Edit">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => handleDelete(c)} className="hover:text-red-600" title="Delete">
                    <Trash2 size={15} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
