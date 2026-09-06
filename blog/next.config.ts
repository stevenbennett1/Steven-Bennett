import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Served as a subpage of the portfolio at yourdomain.com/blog (via a
  // rewrite proxy in the portfolio's vercel.json) — this makes every route,
  // asset, and API path the app emits carry the /blog prefix so it resolves
  // correctly once proxied.
  basePath: "/blog",
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "img.youtube.com" },
    ],
  },
};

export default nextConfig;
