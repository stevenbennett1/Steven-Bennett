import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PostEditorForm from "@/components/admin/PostEditorForm";

export default async function NewPostPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  if (categories.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border py-16 text-center text-ink-soft">
        You need at least one category before writing a post.{" "}
        <Link href="/admin/categories" className="text-accent-deep hover:underline">
          Create one
        </Link>
        .
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 tracking-tight text-2xl font-bold text-ink">New post</h1>
      <PostEditorForm categories={categories} />
    </div>
  );
}
