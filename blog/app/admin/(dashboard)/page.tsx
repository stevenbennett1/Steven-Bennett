import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import PostsTable from "@/components/admin/PostsTable";

export default async function AdminDashboardPage() {
  const [posts, subscriberCount] = await Promise.all([
    prisma.post.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        updatedAt: true,
        publishedAt: true,
        categories: { select: { category: { select: { name: true } } } },
      },
    }),
    prisma.subscriber.count(),
  ]);

  const counts = {
    total: posts.length,
    published: posts.filter((p) => p.status === "published").length,
    draft: posts.filter((p) => p.status === "draft").length,
    scheduled: posts.filter((p) => p.status === "scheduled").length,
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="tracking-tight text-2xl font-bold text-ink">Dashboard</h1>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 rounded-lg bg-ink px-4 py-2 text-sm font-medium text-paper transition-opacity hover:opacity-90"
        >
          <PlusCircle size={16} />
          New post
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
        {[
          { label: "Total", value: counts.total },
          { label: "Published", value: counts.published },
          { label: "Drafts", value: counts.draft },
          { label: "Scheduled", value: counts.scheduled },
          { label: "Subscribers", value: subscriberCount },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl paper-card px-4 py-4">
            <div className="text-2xl font-bold text-ink">{stat.value}</div>
            <div className="text-xs uppercase tracking-wider text-ink-faint">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <PostsTable posts={posts} />
      </div>
    </div>
  );
}
