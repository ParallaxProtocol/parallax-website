"use client"

import { cn } from "@/lib/utils"
import { Info, Play, TriangleAlert } from "lucide-react"
import { useState } from "react"

function Caption({ children }: { children?: React.ReactNode }) {
  if (!children) return null
  return (
    <figcaption className="accent-rule mt-4 pl-4 text-sm leading-relaxed text-muted-foreground text-pretty">
      {children}
    </figcaption>
  )
}

const frameClass =
  "overflow-hidden rounded-xl border border-stroke bg-surface-elevated"

/**
 * Self-hosted video. Put the file in `public/blog/<post>/` and reference it by
 * its absolute path: <Video src="/blog/my-post/demo.mp4" caption="..." />
 */
export function Video({
  src,
  poster,
  caption,
  loop = false,
  autoPlay = false,
  muted = autoPlay,
  className,
}: {
  src: string
  poster?: string
  caption?: string
  loop?: boolean
  autoPlay?: boolean
  muted?: boolean
  className?: string
}) {
  return (
    <figure className="my-10">
      <video
        className={cn(frameClass, "w-full", className)}
        src={src}
        poster={poster}
        controls
        playsInline
        preload="metadata"
        loop={loop}
        autoPlay={autoPlay}
        muted={muted}
      />
      <Caption>{caption}</Caption>
    </figure>
  )
}

/**
 * YouTube embed that loads nothing from Google until the viewer clicks play:
 * until then it is a thumbnail, so the post costs no third-party requests.
 */
export function YouTube({
  id,
  title = "YouTube video",
  start,
  caption,
}: {
  id: string
  title?: string
  start?: number
  caption?: string
}) {
  const [playing, setPlaying] = useState(false)
  const params = new URLSearchParams({ autoplay: "1", rel: "0" })
  if (start) params.set("start", String(start))

  return (
    <figure className="my-10">
      <div className={cn(frameClass, "relative aspect-video")}>
        {playing ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${id}?${params}`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 h-full w-full cursor-pointer"
            aria-label={`Play video: ${title}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex size-16 items-center justify-center rounded-full border border-white/25 bg-black/55 text-white backdrop-blur-md transition-[background-color,border-color] duration-200 group-hover:border-white/50 group-hover:bg-black/70 motion-reduce:transition-none">
                <Play className="size-5 translate-x-0.5 fill-white" strokeWidth={1.5} />
              </span>
            </span>
          </button>
        )}
      </div>
      <Caption>{caption}</Caption>
    </figure>
  )
}

/**
 * Generic 16:9 iframe for anything else worth embedding (Vimeo, a dashboard,
 * a hosted player): <Embed src="https://player.vimeo.com/video/123" />
 */
export function Embed({
  src,
  title = "Embedded content",
  caption,
  aspect = "video",
}: {
  src: string
  title?: string
  caption?: string
  aspect?: "video" | "square" | "wide"
}) {
  const aspectClass = {
    video: "aspect-video",
    square: "aspect-square",
    wide: "aspect-[21/9]",
  }[aspect]

  return (
    <figure className="my-10">
      <div className={cn(frameClass, aspectClass, "relative")}>
        <iframe
          className="absolute inset-0 h-full w-full"
          src={src}
          title={title}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      <Caption>{caption}</Caption>
    </figure>
  )
}

/** Aside for a note or a caveat: <Callout type="warning">…</Callout> */
export function Callout({
  type = "note",
  title,
  children,
}: {
  type?: "note" | "warning"
  title?: string
  children: React.ReactNode
}) {
  return (
    <aside className="my-10 flex gap-4 rounded-xl border border-stroke bg-card px-5 py-5 text-base leading-relaxed sm:px-6 sm:py-6">
      {type === "warning" ? (
        <TriangleAlert aria-hidden className="mt-0.5 size-5 shrink-0 text-pop-yellow" strokeWidth={1.5} />
      ) : (
        <Info aria-hidden className="mt-0.5 size-5 shrink-0 text-brand" strokeWidth={1.5} />
      )}
      <div className="min-w-0 flex-1">
        {title && (
          <p className="mb-2 font-mono text-xs font-medium uppercase tracking-[0.14em] text-foreground">
            {title}
          </p>
        )}
        <div className="text-muted-foreground [&_p]:my-3 [&_p]:text-base [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
          {children}
        </div>
      </div>
    </aside>
  )
}
