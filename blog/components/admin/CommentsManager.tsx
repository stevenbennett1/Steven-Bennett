"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Check, Trash2, Undo2 } from "lucide-react";

export type AdminComment = {
  id: string;
  authorName: string;
  authorEmail: string;
  body: string;
  status: string;
  createdAt: string | Date;
  post: { title: string; slug: string };
};

export default function CommentsManager({ initial }: { initial: AdminComment[] }) {
  const router = useRouter();
  const [comments, setComments] = useState(initial);

  async function setStatus(id: string, status: "approved" | "pending") {
    const res = await fetch(`/api/admin/comments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setComments((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
      router.refresh();
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this comment?")) return;
    const res = await fetch(`/api/admin/comments/${id}`, { method: "DELETE" });
    if (res.ok) setComments((prev) => prev.filter((c) => c.id !== id));
  }

  if (comments.length === 0) {
    return <p className="text-ink-soft">No comments yet.</p>;
  }

  return (
    <div className="space-y-3">
      {comments.map((c) => (
        <div key={c.id} className="paper-card p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-ink">{c.authorName}</span>
                <span className="text-xs text-ink-faint">{c.authorEmail}</span>
                <span
                  className={`font-mono-label px-2 py-0.5 text-[0.65rem] ${
                    c.status === "approved" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {c.status.toUpperCase()}
                </span>
              </div>
              <p className="mt-1 text-xs text-ink-faint">
                on{" "}
                <Link href={`/posts/${c.post.slug}`} target="_blank" className="hover:text-accent-deep">
                  {c.post.title}
                </Link>{" "}
                · {format(new Date(c.createdAt), "MMM d, yyyy")}
              </p>
            </div>
            <div className="flex items-center gap-3 text-ink-faint">
              {c.status === "pending" ? (
                <button onClick={() => setStatus(c.id, "approved")} className="hover:text-emerald-600" title="Approve">
                  <Check size={16} />
                </button>
              ) : (
                <button onClick={() => setStatus(c.id, "pending")} className="hover:text-ink" title="Unapprove">
                  <Undo2 size={16} />
                </button>
              )}
              <button onClick={() => remove(c.id)} className="hover:text-red-600" title="Delete">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">{c.body}</p>
        </div>
      ))}
    </div>
  );
}
