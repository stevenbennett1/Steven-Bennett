"use client";

import { useRef, useState } from "react";
import { FileText, Loader2, Paperclip, X } from "lucide-react";

export type AttachmentValue = {
  url: string;
  publicId?: string | null;
  fileName: string;
  type: "pdf";
};

export default function PdfAttachmentsField({
  value,
  onChange,
}: {
  value: AttachmentValue[];
  onChange: (attachments: AttachmentValue[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("kind", "pdf");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onChange([...value, { url: data.url, publicId: data.publicId, fileName: file.name, type: "pdf" }]);
    } catch (err) {
      alert(err instanceof Error ? err.message : "PDF upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      {value.map((att, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg border border-border px-3 py-2">
          <FileText size={16} className="shrink-0 text-accent-deep" />
          <span className="flex-1 truncate text-sm text-ink">{att.fileName}</span>
          <button
            type="button"
            onClick={() => onChange(value.filter((_, idx) => idx !== i))}
            className="text-ink-faint hover:text-red-600"
          >
            <X size={15} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-2 text-sm font-medium text-accent-deep hover:opacity-80 disabled:opacity-50"
      >
        {uploading ? <Loader2 size={15} className="animate-spin" /> : <Paperclip size={15} />}
        {uploading ? "Uploading…" : "Attach a PDF"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
