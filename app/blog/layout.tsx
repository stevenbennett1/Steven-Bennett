import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

// Blog-wide metadata (title template, description, canonical base) — applies
// to every route under /blog, public pages and admin alike. The true root
// layout (app/layout.tsx) only owns fonts and the <html>/<body> shell.
export const metadata: Metadata = {
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
