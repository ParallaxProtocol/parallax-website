'use client'
import {
  BookText,
  ScrollText,
  ExternalLink,
  Mountain,
  Timer,
  Shield,
  Signature,
  Scale,
  KeyRound,
  Network,
  Eye,
  Layers,
  Ghost,
  GitBranch,
  ChevronDown,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import MainMotion from "./main-motion"
import PageHeader from "./page-header"
import { FadeIn } from "./fade-in"
import { Section, TwoToneTitle } from "./section"
import { cn } from "@/lib/utils"

type RawAxiom = {
  id: string
  title: string
  subtitle: string
  commentary: string
}

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  I: Mountain,
  II: Timer,
  III: Shield,
  IV: Signature,
  V: Scale,
  VI: KeyRound,
  VII: Network,
  VIII: Eye,
  IX: Layers,
  X: ScrollText,
  XI: BookText,
  XII: GitBranch,
  XIII: Ghost,
}

/* Reading measure: ~68 characters of whichever size the block is set in. */
const MEASURE = "max-w-[68ch]"

function Paragraphs({ text }: { text: string }) {
  return (
    <div className={cn("space-y-5 text-[17px] leading-[1.75] text-foreground/80", MEASURE)}>
      {text.split("\n\n").map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  )
}

/* A preamble block: a heading under a hairline rule, then the prose. */
function Preamble({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-hairline pt-12">
      <h2 className="text-3xl leading-[1.1] text-foreground sm:text-4xl">{heading}</h2>
      <div className={cn("mt-7 space-y-6 text-lg leading-[1.7] text-foreground/85", MEASURE)}>{children}</div>
    </section>
  )
}

/* Short declarative lines ("It does not argue.") set large and light
   behind the thin gradient rule. */
function Declaration({ children }: { children: React.ReactNode }) {
  return (
    <p className="accent-rule my-2 py-1 pl-6 text-2xl font-light leading-[1.25] tracking-[-0.02em] text-foreground sm:text-3xl">
      {children}
    </p>
  )
}

const SOURCES = [
  { key: "canonicalSource", href: "https://github.com/ParallaxProtocol/parallax-doctrine", icon: ExternalLink },
  { key: "axioms", href: "https://github.com/ParallaxProtocol/parallax-doctrine/blob/main/AXIOMS.md", icon: ScrollText },
  { key: "commentary", href: "https://github.com/ParallaxProtocol/parallax-doctrine/blob/main/COMMENTARY.md", icon: BookText },
] as const

/* Which axiom the reader is in: the last one whose top has passed a line
   a third of the way down the viewport. */
function useActiveAxiom(ids: string[]) {
  const [active, setActive] = useState<string | null>(null)
  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(`axiom-${id}`))
      .filter((el): el is HTMLElement => el !== null)
    if (!els.length) return
    let frame = 0
    const update = () => {
      frame = 0
      const line = window.innerHeight / 3
      let current: string | null = null
      for (const el of els) {
        if (el.getBoundingClientRect().top <= line) current = el.id.slice("axiom-".length)
      }
      // Past the last axiom's end (the closing section): clear the marker
      const last = els[els.length - 1]
      if (current && last.getBoundingClientRect().bottom < line) current = null
      setActive(current)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [ids])
  return active
}

function AxiomIndex({ axioms, active }: { axioms: RawAxiom[]; active?: string | null }) {
  return (
    <ol className="p-2">
      {axioms.map(({ id, title }) => {
        const current = active === id
        return (
          <li key={id}>
            <a
              href={`#axiom-${id}`}
              aria-current={current ? "location" : undefined}
              className={cn(
                "relative grid grid-cols-[2.5rem_1fr] gap-2 rounded-lg px-3 py-1.5 text-[13px] leading-snug transition-colors",
                current
                  ? "bg-foreground/[0.06] text-foreground before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:rounded-full before:bg-brand"
                  : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
              )}
            >
              <span className="pt-0.5 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-brand">{id}</span>
              <span>{title}</span>
            </a>
          </li>
        )
      })}
    </ol>
  )
}

export function Doctrine() {
  const t = useTranslations("introduction.doctrine")
  const axioms = t.raw("axioms") as RawAxiom[]
  const [ids] = useState(() => axioms.map((a) => a.id))
  const active = useActiveAxiom(ids)
  const activeIndex = active ? ids.indexOf(active) : -1

  const sources = (
    <ul className="flex flex-col gap-1">
      {SOURCES.map(({ key, href, icon: Icon }) => (
        <li key={key}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
          >
            <Icon className="size-4 text-brand" />
            {t(`buttons.${key}`)}
          </a>
        </li>
      ))}
    </ul>
  )

  return (
    <>
      <MainMotion>
        <PageHeader
          title={t("pageTitle")}
          subTitle={t("pageSubtitle")}
        />
        {/* Runs flush into the footer's rule instead of leaving MainMotion's bottom padding */}
        <Section className="border-b-0">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
            {/* Rail: on desktop a sticky index of the axioms plus the canonical sources */}
            <aside className="lg:col-span-4 xl:col-span-3">
              <div className="flex h-full flex-col gap-4">
                <nav aria-label={t("buttons.axioms")} className="order-last hidden overflow-hidden rounded-xl border border-stroke bg-card lg:sticky lg:top-24 lg:block lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
                    <p className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-foreground">
                      {t("buttons.axioms")}
                    </p>
                    <span aria-hidden className="font-mono text-xs tracking-[0.14em] text-muted-foreground tabular-nums">
                      {activeIndex >= 0 ? `${String(activeIndex + 1).padStart(2, "0")} / ${axioms.length}` : `— / ${axioms.length}`}
                    </span>
                  </div>
                  <AxiomIndex axioms={axioms} active={active} />
                </nav>

                {/* Mobile: the index folds away above the text */}
                <details className="group overflow-hidden rounded-xl border border-stroke bg-card lg:hidden">
                  <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 [&::-webkit-details-marker]:hidden">
                    <span className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-foreground">
                      {t("buttons.axioms")} <span className="text-muted-foreground">· {axioms.length}</span>
                    </span>
                    <ChevronDown className="size-4 text-muted-foreground transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="border-t border-hairline">
                    <AxiomIndex axioms={axioms} />
                  </div>
                </details>

                <div className="rounded-xl border border-stroke p-1.5">{sources}</div>
              </div>
            </aside>

            <article className="min-w-0 lg:col-span-8 xl:col-span-9">
              {/* Preamble */}
              <header>
                <p className="font-mono text-xs font-medium uppercase leading-relaxed tracking-[0.14em] text-muted-foreground">
                  {t("intro.date")}<br />
                  {t("intro.author")}
                </p>
                <h2 className="mt-6 max-w-3xl text-4xl leading-[1.05] text-foreground text-balance sm:text-5xl">
                  <TwoToneTitle text={t("intro.heading")} />
                </h2>
                <div className={cn("mt-10 space-y-6 text-lg leading-[1.7] text-foreground/85 sm:text-xl sm:leading-[1.65]", MEASURE)}>
                  <p dangerouslySetInnerHTML={{ __html: t.raw("intro.body1") as string }} />
                  <p>
                    {t("intro.body2Line1")}<br />
                    {t("intro.body2Line2")}
                  </p>
                  <p className="font-medium text-foreground">
                    {t("intro.body3")}
                  </p>
                </div>
              </header>

              <div className="mt-20 space-y-20">
                <Preamble heading={t("purpose.heading")}>
                  <p>{t("purpose.body1")}</p>
                  <Declaration>
                    {t("purpose.body2Line1")}<br />
                    {t("purpose.body2Line2")}<br />
                    {t("purpose.body2Line3")}
                  </Declaration>
                  <p>{t("purpose.body3")}</p>
                </Preamble>

                <Preamble heading={t("scope.heading")}>
                  <p>{t("scope.body1")}</p>
                  <p>{t("scope.body2")}</p>
                  <p>{t("scope.body3")}</p>
                </Preamble>

                {/* The axioms */}
                <div className="space-y-20">
                  {axioms.map(({ id, title, subtitle, commentary }) => {
                    const Icon = ICONS[id] ?? ScrollText
                    return (
                      <FadeIn key={id}>
                        <section className="scroll-mt-28 border-t border-hairline pt-12" id={`axiom-${id}`} aria-labelledby={`axiom-${id}-title`}>
                          <span className="inline-flex h-8 min-w-12 items-center justify-center rounded-full border border-stroke bg-foreground/[0.03] px-3 font-mono text-xs font-medium tracking-[0.14em] text-brand">
                            {id}
                          </span>
                          <h3 id={`axiom-${id}-title`} className="mt-6 max-w-3xl text-3xl leading-[1.08] text-foreground text-balance sm:text-4xl">
                            {title}
                          </h3>
                          <p className={cn("accent-rule mt-6 pl-6 text-xl font-light leading-snug text-foreground text-pretty sm:text-2xl", MEASURE)}>
                            {subtitle}
                          </p>

                          <p className="mt-10 mb-5 flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                            <Icon className="size-4 text-brand" />
                            {t("commentaryLabel")}
                          </p>
                          <Paragraphs text={commentary} />
                        </section>
                      </FadeIn>
                    )
                  })}
                </div>

                <FadeIn>
                  <Preamble heading={t("closing.heading")}>
                    <p>{t("closing.body1")}</p>
                    <p>{t("closing.body2")}</p>
                    <Declaration>
                      {t("closing.body3Line1")} <br />
                      {t("closing.body3Line2")} <br />
                      {t("closing.body3Line3")}
                    </Declaration>
                    <p className="font-medium text-foreground">{t("closing.body4")}</p>
                  </Preamble>
                </FadeIn>
              </div>
            </article>
          </div>
        </Section>
      </MainMotion>
    </>
  )
}
