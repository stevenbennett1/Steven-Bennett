import { prisma } from "@/lib/prisma";
import CommentsManager from "@/components/admin/CommentsManager";

export default async function AdminCommentsPage() {
  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: "desc" },
    include: { post: { select: { title: true, slug: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-ink">Comments</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Comments go live immediately. Un-approve or delete anything from here if you need to
        take it down — readers can also delete their own comment directly on the post.
      </p>
      <div className="mt-6">
        <CommentsManager initial={comments} />
      </div>
    </div>
  );
}
