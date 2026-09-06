"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Trash2, Download } from "lucide-react";

export type AdminSubscriber = {
  id: string;
  email: string;
  source: string | null;
  createdAt: string | Date;
};

export default function SubscribersManager({ initial }: { initial: AdminSubscriber[] }) {
  const [subscribers, setSubscribers] = useState(initial);

  async function remove(id: string) {
    if (!confirm("Remove this subscriber?")) return;
    const res = await fetch(`/api/admin/subscribers/${id}`, { method: "DELETE" });
    if (res.ok) setSubscribers((prev) => prev.filter((s) => s.id !== id));
  }

  function exportCsv() {
    const header = "Email,Source,Date\n";
    const rows = subscribers
      .map((s) => [s.email, s.source ?? "", format(new Date(s.createdAt), "yyyy-MM-dd")].map((v) => `"${v.replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-ink-soft">{subscribers.length} subscriber{subscribers.length === 1 ? "" : "s"}</p>
        {subscribers.length > 0 && (
          <button
            onClick={exportCsv}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-ink-soft hover:border-ink hover:text-ink"
          >
            <Download size={14} />
            Export CSV
          </button>
        )}
      </div>

      {subscribers.length === 0 ? (
        <p className="text-ink-soft">No subscribers yet.</p>
      ) : (
        <div className="overflow-hidden rounded-xl paper-card">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-ink-faint">
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Source</th>
                <th className="px-5 py-3 font-medium">Joined</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0 hover:bg-paper-card/60">
                  <td className="px-5 py-3.5 text-ink">{s.email}</td>
                  <td className="px-5 py-3.5 text-ink-soft">{s.source ?? "—"}</td>
                  <td className="px-5 py-3.5 text-ink-faint">{format(new Date(s.createdAt), "MMM d, yyyy")}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button onClick={() => remove(s.id)} className="text-ink-faint hover:text-red-600" title="Remove">
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
