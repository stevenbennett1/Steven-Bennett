"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

export default function AdminProviders({ children }: { children: ReactNode }) {
  // next-auth/react defaults to calling /api/auth/* — this app's auth route
  // actually lives at /blog/api/auth/* (app/blog/api/auth/...), so without
  // this it 404s.
  return <SessionProvider basePath="/blog/api/auth">{children}</SessionProvider>;
}
