import Image from "next/image"
import { ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

// Captures of Hashwarp on a real rig, stored in public/showcase/hashwarp.
// Until one exists its src is null and a placeholder of the same shape
// holds its place: drop the .webp in, set src (and the real size), done.
export const hashwarpShots = {
  console: { src: "/showcase/hashwarp/console.webp" as string | null, width: 2326, height: 1706 },
  dashboard: { src: "/showcase/hashwarp/dashboard.webp" as string | null, width: 2880, height: 1530 },
} as const

export type HashwarpShotName = keyof typeof hashwarpShots

/* A screenshot framed like Parallax Wallet's: a rounded hairline edge and a
   shadow. */
export function HashwarpShot({
  shot,
  alt,
  placeholder,
  sizes = "(max-width: 1024px) 100vw, 50vw",
  priority,
  className,
}: {
  shot: HashwarpShotName
  alt: string
  placeholder: string
  sizes?: string
  priority?: boolean
  className?: string
}) {
  const { src, width, height } = hashwarpShots[shot]
  return (
    <div className={cn("overflow-hidden rounded-xl border border-stroke bg-black shadow-[0_24px_80px_-24px_rgb(0_0_0/0.6)]", className)}>
      {src ? (
        <Image src={src} alt={alt} width={width} height={height} sizes={sizes} priority={priority} className="block h-auto w-full" />
      ) : (
        <div
          role="img"
          aria-label={alt}
          style={{ aspectRatio: `${width} / ${height}` }}
          className="on-dark-surface flex w-full flex-col items-center justify-center gap-3 border border-dashed border-white/10 bg-[#0a0a0b] text-center"
        >
          <ImageIcon className="size-6 text-white/30" strokeWidth={1.5} aria-hidden />
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-white/40">{placeholder}</p>
          <p className="px-6 text-sm text-white/50">{alt}</p>
        </div>
      )}
    </div>
  )
}

/* A screenshot with a one-line caption under it. */
export function CaptionedHashwarpShot({
  caption,
  ...props
}: React.ComponentProps<typeof HashwarpShot> & { caption: string }) {
  return (
    <figure>
      <HashwarpShot {...props} />
      <figcaption className="mt-4 flex gap-3 text-sm leading-relaxed text-muted-foreground">
        <span aria-hidden className="mt-2 h-px w-4 shrink-0 bg-brand" />
        {caption}
      </figcaption>
    </figure>
  )
}
