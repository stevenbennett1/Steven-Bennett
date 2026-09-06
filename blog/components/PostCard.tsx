import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { BookOpen } from "lucide-react";

export type PostCardData = {
  slug: string;
  title: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  publishedAt: Date | string | null;
  categories: { category: { name: string; slug: string } }[];
};

export default function PostCard({ post, featured = false }: { post: PostCardData; featured?: boolean }) {
  const primaryCategory = post.categories[0]?.category;

  return (
    <Link href={`/posts/${post.slug}`} className={`group block ${featured ? "sm:col-span-2" : ""}`}>
      <div
        className={`relative overflow-hidden bg-paper-card ${featured ? "aspect-[16/8]" : "aspect-[16/10]"}`}
      >
        {post.coverImageUrl ? (
          <Image
            src={post.coverImageUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes={featured ? "(min-width: 640px) 800px, 100vw" : "(min-width: 640px) 400px, 100vw"}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <BookOpen className="text-ink-faint" size={28} strokeWidth={1.25} />
          </div>
        )}
      </div>
      <div className="pt-4">
        <div className="flex items-center gap-2 text-xs">
          {primaryCategory && (
            <span className="font-mono-label uppercase text-accent-deep">{primaryCategory.name}</span>
          )}
          {post.publishedAt && (
            <>
              {primaryCategory && <span className="text-ink-faint">·</span>}
              <span className="text-ink-faint">{format(new Date(post.publishedAt), "MMM d, yyyy")}</span>
            </>
          )}
        </div>
        <h3
          className={`mt-2 font-display font-bold leading-snug text-ink transition-colors group-hover:text-accent-deep ${
            featured ? "text-2xl sm:text-3xl" : "text-xl"
          }`}
        >
          {post.title}
        </h3>
        {post.excerpt && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-soft">{post.excerpt}</p>}
      </div>
    </Link>
  );
}
