import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PostEditorForm from "@/components/admin/PostEditorForm";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [post, categories] = await Promise.all([
    prisma.post.findUnique({
      where: { id },
      include: { tags: { include: { tag: true } }, attachments: true, categories: true },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!post) notFound();

  return (
    <div>
      <h1 className="mb-6 tracking-tight text-2xl font-bold text-ink">Edit post</h1>
      <PostEditorForm
        categories={categories}
        initialPost={{
          id: post.id,
          title: post.title,
          excerpt: post.excerpt,
          contentJson: post.contentJson,
          coverImageUrl: post.coverImageUrl,
          videoUrl: post.videoUrl,
          status: post.status,
          publishedAt: post.publishedAt,
          categories: post.categories,
          tags: post.tags,
          attachments: post.attachments.map((a) => ({
            url: a.url,
            publicId: a.publicId,
            fileName: a.fileName,
            type: "pdf" as const,
          })),
        }}
      />
    </div>
  );
}
