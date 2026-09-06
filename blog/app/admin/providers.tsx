"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

export default function AdminProviders({ children }: { children: ReactNode }) {
  // next-auth/react doesn't automatically pick up Next.js's `basePath` config
  // (the app is served under /blog) — without this it calls /api/auth/*
  // instead of /blog/api/auth/*, which 404s.
  return <SessionProvider basePath="/blog/api/auth">{children}</SessionProvider>;
}
