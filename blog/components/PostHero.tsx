import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { toEmbedUrl } from "@/lib/video";

type Category = { name: string; slug: string };

export default function PostHero({
  title,
  categories,
  authorName,
  publishedAt,
  coverImageUrl,
  videoUrl,
}: {
  title: string;
  categories: Category[];
  authorName?: string | null;
  publishedAt: Date | string | null;
  coverImageUrl: string | null;
  videoUrl: string | null;
}) {
  const dateLabel = publishedAt ? format(new Date(publishedAt), "MMMM d, yyyy") : null;
  const embedUrl = !coverImageUrl && videoUrl ? toEmbedUrl(videoUrl) : null;

  const meta = (
    <div className="flex flex-wrap gap-3">
      {categories.map((c) => (
        <Link key={c.slug} href={`/category/${c.slug}`} className="font-mono-label text-xs uppercase hover:opacity-75">
          {c.name}
        </Link>
      ))}
    </div>
  );

  if (coverImageUrl) {
    return (
      <div className="relative -mt-px h-[52vh] min-h-[360px] w-full overflow-hidden sm:h-[70vh] sm:max-h-[720px]">
        <Image src={coverImageUrl} alt={title} fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-3xl px-5 pb-10 text-white sm:px-8 sm:pb-14">
          <div className="text-white/90">{meta}</div>
          <h1 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-5xl">{title}</h1>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-white/75">
            {authorName && <span>{authorName}</span>}
            {dateLabel && (
              <>
                {authorName && <span>·</span>}
                <span>{dateLabel}</span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (embedUrl) {
    return (
      <div className="w-full border-b border-border bg-ink">
        <div className="relative aspect-video w-full sm:max-h-[70vh]">
          <iframe
            src={embedUrl}
            title={title}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8">
          <div className="text-accent-deep">{meta}</div>
          <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-ink sm:text-5xl">{title}</h1>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-ink-faint">
            {authorName && <span>{authorName}</span>}
            {dateLabel && (
              <>
                {authorName && <span>·</span>}
                <span>{dateLabel}</span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 pt-16 sm:px-8">
      <div className="text-accent-deep">{meta}</div>
      <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-ink sm:text-5xl">{title}</h1>
      <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-ink-faint">
        {authorName && <span>{authorName}</span>}
        {dateLabel && (
          <>
            {authorName && <span>·</span>}
            <span>{dateLabel}</span>
          </>
        )}
      </div>
    </div>
  );
}
