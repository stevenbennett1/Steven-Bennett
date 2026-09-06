"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Loader2, Send, MessageCircle, Trash2 } from "lucide-react";

type Comment = {
  id: string;
  authorName: string;
  body: string;
  createdAt: string | Date;
};

const STORAGE_KEY = "notebook_my_comments";

function loadMyTokens(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveMyTokens(map: Record<string, string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // localStorage unavailable (private browsing, blocked, etc) — self-delete
    // just won't be offered for this comment, posting still works fine.
  }
}

export default function CommentSection({ postId, comments }: { postId: string; comments: Comment[] }) {
  const [commentsList, setCommentsList] = useState(comments);
  const [myTokens, setMyTokens] = useState<Record<string, string>>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [justPosted, setJustPosted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMyTokens(loadMyTokens());
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !body.trim()) {
      setError("Add your name and a comment.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Add a valid email — it's required, but never shown publicly.");
      return;
    }
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, authorName: name, authorEmail: email, body, companyWebsite }),
    });

    setSubmitting(false);
    if (!res.ok) {
      setError("Couldn't post that comment — try again.");
      return;
    }

    const created = await res.json();
    setCommentsList((prev) => [
      ...prev,
      { id: created.id, authorName: created.authorName, body: created.body, createdAt: created.createdAt },
    ]);
    const nextTokens = { ...myTokens, [created.id]: created.deleteToken };
    setMyTokens(nextTokens);
    saveMyTokens(nextTokens);

    setName("");
    setEmail("");
    setBody("");
    setJustPosted(true);
    setTimeout(() => setJustPosted(false), 4000);
  }

  async function handleDelete(id: string) {
    const token = myTokens[id];
    if (!token) return;
    if (!confirm("Delete your comment? This can't be undone.")) return;

    const res = await fetch(`/api/comments/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    if (res.ok) {
      setCommentsList((prev) => prev.filter((c) => c.id !== id));
      const nextTokens = { ...myTokens };
      delete nextTokens[id];
      setMyTokens(nextTokens);
      saveMyTokens(nextTokens);
    } else {
      alert("Couldn't delete that comment.");
    }
  }

  return (
    <div className="mt-16 border-t border-border pt-10">
      <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-ink">
        <MessageCircle size={20} className="text-accent" />
        Comments {commentsList.length > 0 && `(${commentsList.length})`}
      </h2>

      <div className="mt-8 space-y-5">
        {commentsList.length === 0 ? (
          <p className="text-sm text-ink-soft">No comments yet — be the first to leave a note.</p>
        ) : (
          commentsList.map((c) => (
            <div key={c.id} className="flex gap-3 paper-card p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-bold text-accent-deep">
                {c.authorName.trim().slice(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold text-ink">{c.authorName}</span>
                  <span className="text-xs text-ink-faint">{format(new Date(c.createdAt), "MMM d, yyyy")}</span>
                </div>
                <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">{c.body}</p>
              </div>
              {myTokens[c.id] && (
                <button
                  onClick={() => handleDelete(c.id)}
                  title="Delete your comment"
                  className="shrink-0 self-start text-ink-faint hover:text-red-600"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-8 paper-card p-5">
        <p className="text-sm font-bold text-ink">Leave a comment — no account needed</p>

        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm text-ink outline-none focus:border-accent"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              placeholder="Email (required, kept private)"
              className="rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm text-ink outline-none focus:border-accent"
            />
          </div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What did you think?"
            rows={3}
            className="w-full resize-none rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm text-ink outline-none focus:border-accent"
          />
          {/* Honeypot — hidden from real visitors, catches simple bots */}
          <input
            value={companyWebsite}
            onChange={(e) => setCompanyWebsite(e.target.value)}
            name="companyWebsite"
            tabIndex={-1}
            autoComplete="off"
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
            aria-hidden="true"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          {justPosted && <p className="text-sm text-emerald-600">Posted — thanks for the note.</p>}
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? <Loader2 size={15} className="animate-spin" /> : <Send size={14} />}
            Post comment
          </button>
        </div>
      </form>
    </div>
  );
}
