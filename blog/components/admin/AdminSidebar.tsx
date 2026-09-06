"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, PlusCircle, Tags, MessageCircle, BookMarked, Mail, ExternalLink, LogOut, Feather } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export default function AdminSidebar({ pendingComments = 0 }: { pendingComments?: number }) {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/admin/posts/new", label: "New post", icon: PlusCircle, exact: true },
    { href: "/admin/categories", label: "Categories", icon: Tags, exact: true },
    { href: "/admin/resources", label: "Resources", icon: BookMarked, exact: true },
    { href: "/admin/comments", label: "Comments", icon: MessageCircle, exact: true, badge: pendingComments },
    { href: "/admin/subscribers", label: "Subscribers", icon: Mail, exact: true },
  ];

  return (
    <aside className="flex w-full shrink-0 flex-col border-border bg-surface md:h-screen md:w-60 md:border-r">
      <div className="flex items-center gap-2 border-b border-border px-5 py-5">
        <Feather size={18} className="text-accent" />
        <span className="tracking-tight text-base font-bold text-ink">{siteConfig.shortName} Admin</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {links.map(({ href, label, icon: Icon, exact, badge }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active ? "bg-accent-soft text-accent-deep" : "text-ink-soft hover:bg-paper-card hover:text-ink"
              }`}
            >
              <Icon size={16} />
              {label}
              {!!badge && (
                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-bold text-white">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-1 border-t border-border p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-soft hover:bg-paper-card hover:text-ink"
        >
          <ExternalLink size={16} />
          View site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-ink-soft hover:bg-paper-card hover:text-ink"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
