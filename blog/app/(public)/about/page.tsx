import Image from "next/image";
import { siteConfig } from "@/lib/site-config";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-20 sm:px-8">
      <p className="font-mono-label text-xs uppercase text-ink-faint">About</p>
      <h1 className="mt-2 font-display text-4xl font-bold text-ink sm:text-5xl">{siteConfig.authorName}</h1>
      <p className="mt-3 text-lg text-ink-soft">{siteConfig.authorTitle}</p>

      <div className="mt-10 flex flex-col items-start gap-6 border-t border-border pt-10 sm:flex-row">
        <div className="relative h-32 w-32 shrink-0 overflow-hidden bg-paper-card">
          {siteConfig.authorPhotoUrl ? (
            <Image src={siteConfig.authorPhotoUrl} alt={siteConfig.authorName} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center px-3 text-center">
              <span className="font-mono-label text-[0.65rem] text-ink-faint">ADD YOUR PHOTO</span>
            </div>
          )}
        </div>

        <div className="flex-1">
          <p className="font-mono-label text-xs uppercase text-ink-faint">A few lines</p>
          <div className="prose-notebook mt-3">
            <p>{siteConfig.authorBio}</p>
          </div>
        </div>
      </div>

      <div className="prose-notebook mt-12 border-t border-border pt-10">
        <p>{siteConfig.description}</p>
        <p>New notes appear here as they&apos;re written — check back, or follow along by topic from the menu above.</p>
      </div>
    </div>
  );
}
