import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Portfolio and blog are one app now: portfolio owns "/", and every blog
  // route genuinely lives under app/blog/ (not a basePath prefix trick), so
  // there's no basePath config here — internal links are written with the
  // /blog prefix directly instead.
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
