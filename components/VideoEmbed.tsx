import { toEmbedUrl } from "@/lib/video";

export default function VideoEmbed({ url }: { url: string }) {
  const embedUrl = toEmbedUrl(url);
  if (!embedUrl) return null;

  return (
    <div className="overflow-hidden border-[1.6px] border-ink">
      <div className="relative aspect-video">
        <iframe
          src={embedUrl}
          title="Embedded video"
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
}
