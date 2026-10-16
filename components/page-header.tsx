import { TwoToneTitle } from "./section"

/* Server component on purpose: the entrances run as CSS animations (see
   "Entrance animations" in globals.css) so the title — usually the page's
   LCP element — paints without waiting for hydration. */
export default function PageHeader({
  title,
  subTitle,
  children,
}: {
  title: string,
  subTitle?: string,
  children?: React.ReactNode,
}) {
  return (
    <div className="relative mt-16 overflow-hidden border-b border-hairline">
      <div aria-hidden className="aurora" />
      <div className="relative mx-auto flex max-w-[90rem] flex-col items-start gap-8 px-5 pt-24 pb-20 md:px-10 md:pt-32 md:pb-24">
        <h2
          className="max-w-4xl text-5xl leading-[1.02] text-foreground text-balance sm:text-6xl lg:text-7xl enter-fade-up"
          style={{ "--enter-delay": "0.1s" } as React.CSSProperties}
        >
          <TwoToneTitle text={title} />
        </h2>
        {subTitle && (
          <p
            className="max-w-xl text-lg text-muted-foreground text-pretty sm:text-xl enter-fade-up"
            style={{ "--enter-delay": "0.25s" } as React.CSSProperties}
          >
            {subTitle}
          </p>
        )}
        {children}
      </div>
    </div>
  )
}
