import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  // sitemap.ts lives at the true app root (required, so it's served at the
  // standard /sitemap.xml path) — siteConfig.url is the blog's own base
  // (.../blog), so this strips that back down to the real site origin.
  const siteRoot = new URL(siteConfig.url).origin;
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/blog/admin" }],
    sitemap: `${siteRoot}/sitemap.xml`,
  };
}
