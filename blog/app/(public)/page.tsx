import Link from "next/link";
import { ArrowRight, PenLine } from "lucide-react";
import PostCard from "@/components/PostCard";
import ScrollReveal from "@/components/ScrollReveal";
import HeroIntro from "@/components/HeroIntro";
import { getCategories, getLatestPosts } from "@/lib/queries";

// Otherwise Next.js prerenders this page once at build time (it has no
// dynamic inputs) and it would never show newly published posts.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [posts, categories] = await Promise.all([getLatestPosts(13), getCategories()]);
  const [featured, ...rest] = posts;

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8">
      <HeroIntro />

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-x-6 gap-y-2 border-b border-border py-6">
          {categories.map((c) => (
            <Link key={c.slug} href={`/category/${c.slug}`} className="text-sm text-ink-soft hover:text-ink">
              {c.name}
            </Link>
          ))}
        </div>
      )}

      {posts.length === 0 ? (
        <div className="flex flex-col items-center gap-3 border border-dashed border-border py-24 text-center">
          <PenLine className="text-ink-faint" size={26} strokeWidth={1.25} />
          <p className="text-ink-soft">No entries published yet — the first note is on its way.</p>
        </div>
      ) : (
        <section id="latest" className="scroll-mt-24 pb-20 pt-12">
          <ScrollReveal>
            <h2 className="mb-8 font-display text-2xl font-bold text-ink">Latest notes</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {featured && (
              <ScrollReveal className="sm:col-span-2">
                <PostCard post={featured} featured />
              </ScrollReveal>
            )}
            {rest.map((post, i) => (
              <ScrollReveal key={post.id} delay={Math.min(i * 0.05, 0.3)}>
                <PostCard post={post} />
              </ScrollReveal>
            ))}
          </div>
          {posts.length >= 13 && (
            <div className="mt-12 flex justify-center">
              <Link href={`/category/${categories[0]?.slug ?? ""}`} className="btn-outline">
                Browse by topic <ArrowRight size={15} />
              </Link>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
