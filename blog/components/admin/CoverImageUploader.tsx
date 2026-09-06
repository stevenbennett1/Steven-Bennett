"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";

export default function CoverImageUploader({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("kind", "image");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onChange(data.url);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Cover image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  if (value) {
    return (
      <div className="relative aspect-[16/7] overflow-hidden rounded-xl border border-border">
        <Image src={value} alt="Cover" fill className="object-cover" />
        <button
          type="button"
          onClick={() => onChange(null)}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-ink/70 text-paper hover:bg-ink"
        >
          <X size={15} />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      disabled={uploading}
      className="flex aspect-[16/7] w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border text-ink-faint transition-colors hover:border-accent hover:text-accent-deep"
    >
      {uploading ? <Loader2 size={22} className="animate-spin" /> : <ImagePlus size={22} strokeWidth={1.5} />}
      <span className="text-sm">{uploading ? "Uploading…" : "Add a cover image"}</span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </button>
  );
}
