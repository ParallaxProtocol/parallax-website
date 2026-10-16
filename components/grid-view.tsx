'use client'
import { cn } from "@/lib/utils";
import { FadeIn } from "./fade-in";

export interface GridViewItem {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any,
  title: string,
  description: string,
}

/* Topics as one hairline grid: cells sit on a hairline-coloured ground with
   a 1px gap, so the gaps draw the rules. A grid whose last row is short is
   closed with filler cells (per breakpoint) that hold a soft aurora glow,
   rather than leaving a hole of bare hairline. */
export default function GridView({ items }: { items: GridViewItem[] }) {
  const fillSm = items.length % 2
  const fillLg = (3 - (items.length % 3)) % 3
  const fillers = Math.max(fillSm, fillLg)

  return (
    <section className="relative z-10">
      <div className="mx-auto max-w-[90rem] px-5 py-20 md:px-10 md:py-28">
        <FadeIn>
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-stroke bg-hairline sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => (
              <div key={item.title} className="flex flex-col bg-background p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <item.icon className={cn("size-7", i === 0 ? "text-brand" : "text-foreground")} strokeWidth={1.5} />
                  <span className="tag">
                    <span className={i === 0 ? "text-brand" : undefined}>{String(i + 1).padStart(2, "0")}</span>
                  </span>
                </div>
                <h3 className="mt-14 text-xl leading-tight text-foreground sm:text-2xl">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {item.description}
                </p>
              </div>
            ))}
            {Array.from({ length: fillers }, (_, i) => (
              <div
                key={`filler-${i}`}
                aria-hidden
                className={cn(
                  "relative hidden overflow-hidden bg-background",
                  i < fillSm ? "sm:block" : "sm:hidden",
                  i < fillLg ? "lg:block" : "lg:hidden"
                )}
              >
                <div className="aurora" />
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
