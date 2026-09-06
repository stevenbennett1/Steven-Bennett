"use client";

import { useState } from "react";
import { Loader2, ArrowRight } from "lucide-react";

export default function NewsletterSignup({ source = "footer" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "done" | "already" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStatus("error");
      return;
    }
    setSubmitting(true);
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source, companyWebsite }),
    });
    setSubmitting(false);

    if (!res.ok) {
      setStatus("error");
      return;
    }
    const data = await res.json();
    setStatus(data.alreadySubscribed ? "already" : "done");
    setEmail("");
  }

  if (status === "done") {
    return <p className="text-sm text-ink">You&apos;re subscribed — thanks for reading.</p>;
  }
  if (status === "already") {
    return <p className="text-sm text-ink-soft">You&apos;re already on the list.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row sm:items-start">
      <div className="flex-1">
        <div className="flex overflow-hidden border border-border focus-within:border-ink">
          <input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            type="email"
            placeholder="you@example.com"
            className="w-full bg-transparent px-3.5 py-2.5 text-sm text-ink outline-none"
          />
          <button
            type="submit"
            disabled={submitting}
            className="flex shrink-0 items-center gap-1.5 bg-ink px-4 text-sm font-medium text-paper transition-opacity hover:opacity-85 disabled:opacity-60"
          >
            {submitting ? <Loader2 size={14} className="animate-spin" /> : "Subscribe"}
            {!submitting && <ArrowRight size={13} />}
          </button>
        </div>
        {status === "error" && <p className="mt-1.5 text-xs text-red-600">Enter a valid email address.</p>}
      </div>
      {/* Honeypot — hidden from real visitors, catches simple bots */}
      <input
        value={companyWebsite}
        onChange={(e) => setCompanyWebsite(e.target.value)}
        name="companyWebsite"
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />
    </form>
  );
}
