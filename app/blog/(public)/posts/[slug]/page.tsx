import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostBySlug, getRelatedPosts } from "@/lib/queries";
import VideoEmbed from "@/components/VideoEmbed";
import PdfCard from "@/components/PdfCard";
import PostCard from "@/components/PostCard";
import PostHero from "@/components/PostHero";
import CommentSection from "@/components/CommentSection";
import { siteConfig } from "@/lib/site-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      type: "article",
      images: post.coverImageUrl ? [post.coverImageUrl] : undefined,
      siteName: siteConfig.name,
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const categoryIds = post.categories.map((c) => c.categoryId);
  const related = await getRelatedPosts(categoryIds, post.id);
  const primaryCategory = post.categories[0]?.category;
  const categories = post.categories.map((c) => c.category);

  return (
    <article>
      <PostHero
        title={post.title}
        categories={categories}
        authorName={post.author?.name}
        publishedAt={post.publishedAt}
        coverImageUrl={post.coverImageUrl}
        videoUrl={post.videoUrl}
      />

      <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
        {post.coverImageUrl && post.videoUrl && (
          <div className="mb-10">
            <VideoEmbed url={post.videoUrl} />
          </div>
        )}

        <div className="prose-notebook" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />

        {post.attachments.length > 0 && (
          <div className="mt-12 space-y-3">
            <h2 className="font-display text-lg font-bold text-ink">Attachments</h2>
            {post.attachments.map((a) => (
              <PdfCard key={a.id} url={a.url} fileName={a.fileName} />
            ))}
          </div>
        )}

        {post.tags.length > 0 && (
          <div className="mt-12 flex flex-wrap gap-x-4 gap-y-2 border-t border-border pt-8">
            {post.tags.map(({ tag }) => (
              <span key={tag.id} className="text-sm text-ink-faint">
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        <CommentSection postId={post.id} comments={post.comments} />

        {related.length > 0 && (
          <div className="mt-16 border-t border-border pt-10">
            <h2 className="mb-6 font-display text-xl font-bold text-ink">More in {primaryCategory?.name ?? "this topic"}</h2>
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-3">
              {related.map((r) => (
                <PostCard key={r.id} post={r} />
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
