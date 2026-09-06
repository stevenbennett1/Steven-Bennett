import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import NewsletterSignup from "./NewsletterSignup";

export default function Footer({ categories }: { categories: { name: string; slug: string }[] }) {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="w-full max-w-sm shrink-0">
            <div className="font-display text-lg font-bold text-ink">{siteConfig.name}</div>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{siteConfig.tagline}</p>
            <div className="mt-5 max-w-xs">
              <NewsletterSignup source="footer" />
            </div>
          </div>
          <div className="flex flex-wrap gap-x-12 gap-y-6">
            <div>
              <div className="font-mono-label text-xs uppercase text-ink-faint">Topics</div>
              <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                {categories.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/blog/category/${c.slug}`} className="text-sm text-ink-soft hover:text-accent-deep">
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-mono-label text-xs uppercase text-ink-faint">More</div>
              <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                <li>
                  <Link href="/blog/resources" className="text-sm text-ink-soft hover:text-accent-deep">
                    Resources
                  </Link>
                </li>
                <li>
                  <Link href="/blog/about" className="text-sm text-ink-soft hover:text-accent-deep">
                    About
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-xs text-ink-faint">
          © {new Date().getFullYear()} {siteConfig.authorName}. All notes are my own.
        </div>
      </div>
    </footer>
  );
}
