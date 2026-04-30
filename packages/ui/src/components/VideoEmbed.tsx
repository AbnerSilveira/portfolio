import { cn } from "../lib/cn";

export interface VideoEmbedProps {
  src: string;
  title: string;
  className?: string;
}

export function VideoEmbed({ src, title, className }: VideoEmbedProps) {
  return (
    <div
      className={cn(
        "aspect-video w-full overflow-hidden rounded-lg border",
        className,
      )}
    >
      <iframe
        src={src}
        title={title}
        loading="lazy"
        referrerPolicy="no-referrer"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  );
}
