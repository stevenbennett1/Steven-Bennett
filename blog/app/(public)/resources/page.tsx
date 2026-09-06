import Image from "next/image";
import { ExternalLink, BookOpen, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata = { title: "Resources" };

// Otherwise Next.js prerenders this page once at build time and it would
// never show resources added afterward from the admin.
export const dynamic = "force-dynamic";

export default async function ResourcesPage() {
  const resources = await prisma.resource.findMany({
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
      <p className="font-mono-label text-xs uppercase text-ink-faint">Recommended</p>
      <h1 className="mt-2 font-display text-4xl font-bold text-ink sm:text-5xl">Resources</h1>
      <p className="mt-4 max-w-xl text-lg text-ink-soft">
        Books, courses, magazines, and tools worth recommending — updated as I find things worth sharing.
      </p>

      {resources.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-3 border border-dashed border-border py-24 text-center">
          <BookOpen className="text-ink-faint" size={26} strokeWidth={1.25} />
          <p className="text-ink-soft">No resources listed yet — check back soon.</p>
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 border-t border-border pt-12 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((r, i) => (
            <ScrollReveal key={r.id} delay={Math.min(i * 0.04, 0.3)}>
              <a href={r.url} target="_blank" rel="noopener noreferrer" className="group flex h-full flex-col">
                <div className="relative aspect-[4/3] overflow-hidden bg-paper-card">
                  {r.coverImageUrl ? (
                    <Image
                      src={r.coverImageUrl}
                      alt={r.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(min-width: 640px) 400px, 100vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <BookOpen className="text-ink-faint" size={28} strokeWidth={1.25} />
                    </div>
                  )}
                  {r.featured && (
                    <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center bg-surface shadow">
                      <Star size={13} className="fill-accent-deep text-accent-deep" />
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col pt-4">
                  <span className="font-mono-label text-xs uppercase text-accent-deep">{r.type}</span>
                  <h3 className="mt-2 font-display font-bold leading-snug text-ink transition-colors group-hover:text-accent-deep">
                    {r.title}
                  </h3>
                  {r.creator && <p className="mt-1 text-sm text-ink-faint">{r.creator}</p>}
                  {r.description && <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{r.description}</p>}
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-ink">
                    View
                    <ExternalLink size={12} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </a>
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  );
}
