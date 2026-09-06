"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Pencil, Trash2, ExternalLink, Loader2 } from "lucide-react";

export type AdminPostRow = {
  id: string;
  title: string;
  slug: string;
  status: string;
  updatedAt: string | Date;
  publishedAt: string | Date | null;
  categories: { category: { name: string } }[];
};

const statusStyles: Record<string, string> = {
  published: "bg-emerald-100 text-emerald-700",
  draft: "bg-ink/10 text-ink-soft",
  scheduled: "bg-amber-100 text-amber-700",
};

export default function PostsTable({ posts }: { posts: AdminPostRow[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This can't be undone.`)) return;
    setDeletingId(id);
    const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
    setDeletingId(null);
    if (res.ok) router.refresh();
    else alert("Failed to delete post.");
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border py-16 text-center text-ink-soft">
        No posts yet.{" "}
        <Link href="/admin/posts/new" className="text-accent-deep hover:underline">
          Write your first one
        </Link>
        .
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl paper-card">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs uppercase tracking-wider text-ink-faint">
            <th className="px-5 py-3 font-medium">Title</th>
            <th className="px-5 py-3 font-medium">Category</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 font-medium">Updated</th>
            <th className="px-5 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} className="border-b border-border last:border-0 hover:bg-paper-card/60">
              <td className="max-w-xs truncate px-5 py-3.5 font-medium text-ink">{post.title}</td>
              <td className="px-5 py-3.5 text-ink-soft">
                {post.categories.map((c) => c.category.name).join(", ") || "—"}
              </td>
              <td className="px-5 py-3.5">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusStyles[post.status] ?? ""}`}
                >
                  {post.status}
                </span>
              </td>
              <td className="px-5 py-3.5 text-ink-faint">{format(new Date(post.updatedAt), "MMM d, yyyy")}</td>
              <td className="px-5 py-3.5">
                <div className="flex items-center justify-end gap-3 text-ink-faint">
                  {post.status === "published" && (
                    <Link href={`/posts/${post.slug}`} target="_blank" className="hover:text-ink" title="View">
                      <ExternalLink size={16} />
                    </Link>
                  )}
                  <Link href={`/admin/posts/${post.id}/edit`} className="hover:text-ink" title="Edit">
                    <Pencil size={16} />
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id, post.title)}
                    disabled={deletingId === post.id}
                    className="hover:text-red-600"
                    title="Delete"
                  >
                    {deletingId === post.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
