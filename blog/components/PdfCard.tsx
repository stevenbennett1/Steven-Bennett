import { FileText, Download } from "lucide-react";

export default function PdfCard({ url, fileName }: { url: string; fileName: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      download={fileName}
      className="group flex items-center gap-4 paper-card p-4 transition-colors hover:border-accent"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-accent-soft text-accent-deep">
        <FileText size={20} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-ink">{fileName}</div>
        <div className="text-xs text-ink-faint">PDF attachment</div>
      </div>
      <Download size={16} className="shrink-0 text-ink-faint transition-colors group-hover:text-accent-deep" />
    </a>
  );
}
