"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export default function HeroIntro() {
  return (
    <section className="border-b border-border py-20 sm:py-28">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="font-mono-label text-xs uppercase text-ink-faint"
      >
        {siteConfig.authorName}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.08 }}
        className="mt-3 max-w-2xl font-display text-4xl font-bold leading-[1.15] text-ink sm:text-5xl"
      >
        {siteConfig.tagline}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.16 }}
        className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft"
      >
        {siteConfig.description}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.24 }}
        className="mt-8"
      >
        <Link href="#latest" className="inline-flex items-center gap-2 text-sm font-medium text-ink hover:text-accent-deep">
          Read the latest
          <ArrowRight size={15} />
        </Link>
      </motion.div>
    </section>
  );
}
