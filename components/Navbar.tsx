"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

type NavCategory = { name: string; slug: string };

export default function Navbar({ categories }: { categories: NavCategory[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="flex items-center"
          title="Back to the portfolio site"
        >
          <span
            className="text-[1.05rem] font-bold tracking-tight text-ink"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            {siteConfig.name}
          </span>
        </Link>

        <div className="flex items-center gap-8">
          <Link
            href="/blog/resources"
            className="hidden border-b border-transparent pb-1.5 text-sm text-ink-soft transition-colors hover:border-ink hover:text-ink sm:inline"
          >
            Resources
          </Link>
          <Link
            href="/blog/about"
            className="hidden border-b border-transparent pb-1.5 text-sm text-ink-soft transition-colors hover:border-ink hover:text-ink sm:inline"
          >
            About
          </Link>

          <div className="relative" ref={ref}>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className="flex items-center gap-1.5 border-b border-transparent pb-1.5 text-sm text-ink-soft transition-colors hover:border-ink hover:text-ink"
            >
              Topics
              <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 z-50 mt-3 w-[min(90vw,20rem)] border border-border bg-surface p-2 shadow-lg"
                >
                  <div className="grid grid-cols-1 gap-0.5">
                    {categories.map((c) => (
                      <Link
                        key={c.slug}
                        href={`/blog/category/${c.slug}`}
                        onClick={() => setOpen(false)}
                        className="px-3 py-2 text-sm text-ink-soft hover:bg-paper-card hover:text-ink"
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                  <div className="mt-1 flex items-center justify-center gap-5 border-t border-border pt-2 sm:hidden">
                    <Link href="/blog/resources" onClick={() => setOpen(false)} className="text-sm text-ink-soft hover:text-ink">
                      Resources
                    </Link>
                    <Link href="/blog/about" onClick={() => setOpen(false)} className="text-sm text-ink-soft hover:text-ink">
                      About
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
