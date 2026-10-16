import { cn } from "@/lib/utils"

/* A full-bleed band closed by a hairline. Sections stack edge to edge, so
   the rules between them draw the page's structure — no spacer dividers. */
export function Section({
  className,
  innerClassName,
  children,
  ...props
}: React.ComponentProps<"section"> & { innerClassName?: string }) {
  return (
    <section data-band className={cn("relative border-b border-hairline", className)} {...props}>
      <div className={cn("relative mx-auto max-w-[90rem] px-5 py-20 md:px-10 md:py-28", innerClassName)}>
        {children}
      </div>
    </section>
  )
}

/* Splits a heading into a medium-weight lead and a light-weight tail, the
   two-voice headline solana.com uses ("The capital market / for every asset
   on earth."). The break falls on the word boundary nearest the middle by
   character count; titles of three words or fewer stay whole, since a
   one-word lead ("Two / Ways In") reads as a stammer. */
export function TwoToneTitle({ text }: { text: string }) {
  const words = text.trim().split(/\s+/)
  if (words.length < 4) return <>{text}</>
  const half = text.length / 2
  let best = 1
  let bestDistance = Infinity
  let running = 0
  for (let i = 0; i < words.length - 1; i++) {
    running += words[i].length + 1
    const distance = Math.abs(running - half)
    if (distance < bestDistance) {
      bestDistance = distance
      best = i + 1
    }
  }
  return (
    <>
      <span className="block">{words.slice(0, best).join(" ")}</span>
      <span className="block font-light">{words.slice(best).join(" ")}</span>
    </>
  )
}

/* Section opener: a mono kicker, a two-tone headline on the left and the
   standfirst on the right behind a thin gradient rule. */
export function SectionHeading({
  index,
  eyebrow,
  title,
  subtitle,
  className,
}: {
  index?: string
  eyebrow?: string
  title: React.ReactNode
  subtitle?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("grid gap-8 lg:grid-cols-12 lg:items-end", className)}>
      <div className="lg:col-span-7">
        {(index || eyebrow) && (
          <p className="tag mb-6">
            {index && <span className="text-brand">{index}</span>}
            {index && eyebrow && <span aria-hidden className="text-hairline">/</span>}
            {eyebrow}
          </p>
        )}
        <h2 className="text-4xl leading-[1.05] text-foreground text-balance sm:text-5xl lg:text-6xl">
          {typeof title === "string" ? <TwoToneTitle text={title} /> : title}
        </h2>
      </div>
      {subtitle && (
        <p className="accent-rule max-w-md pl-6 text-base text-muted-foreground text-pretty sm:text-lg lg:col-span-4 lg:col-start-9">
          {subtitle}
        </p>
      )}
    </div>
  )
}
