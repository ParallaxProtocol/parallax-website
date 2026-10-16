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
} from "lucide-react"
import { useTranslations } from "next-intl"
import MainMotion from "./main-motion"
import PageHeader from "./page-header"
import { Button } from "./ui/button"
import { FadeIn } from "./fade-in"
import { Section, TwoToneTitle } from "./section"

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

function Paragraphs({ text }: { text: string }) {
  return (
    <div className="space-y-4">
      {text.split("\n\n").map((p, i) => (
        <p key={i} className="text-base leading-relaxed">
          {p}
        </p>
      ))}
    </div>
  )
}

/* A preamble block: a heading under a hairline rule, then the prose. */
function Preamble({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-hairline pt-10">
      <h3 className="text-3xl leading-[1.1] text-foreground sm:text-4xl">{heading}</h3>
      <div className="mt-6 space-y-5 text-lg leading-relaxed text-foreground/85">{children}</div>
    </div>
  )
}

/* Short declarative lines ("It does not argue.") set large and light
   behind the thin gradient rule. */
function Declaration({ children }: { children: React.ReactNode }) {
  return (
    <p className="accent-rule my-2 py-1 pl-6 text-2xl font-light leading-[1.2] tracking-[-0.03em] text-foreground sm:text-3xl">
      {children}
    </p>
  )
}

const SOURCES = [
  { key: "canonicalSource", href: "https://github.com/ParallaxProtocol/parallax-doctrine", icon: ExternalLink },
  { key: "axioms", href: "https://github.com/ParallaxProtocol/parallax-doctrine/blob/main/AXIOMS.md", icon: ScrollText },
  { key: "commentary", href: "https://github.com/ParallaxProtocol/parallax-doctrine/blob/main/COMMENTARY.md", icon: BookText },
] as const

export function Doctrine() {
  const t = useTranslations("introduction.doctrine")
  const axioms = t.raw("axioms") as RawAxiom[]

  return (
    <>
      <MainMotion>
        <PageHeader
          title={t("pageTitle")}
          subTitle={t("pageSubtitle")}
        />
        {/* Runs flush into the footer's rule instead of leaving MainMotion's bottom padding */}
        <Section className="border-b-0">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Rail: the canonical sources, and on desktop an index of the axioms */}
            <aside className="lg:col-span-4">
              <div className="flex h-full flex-col gap-10">
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:flex-col">
                  {SOURCES.map(({ key, href, icon: Icon }) => (
                    <Button key={key} variant={"outline"} className="justify-start" asChild>
                      <a href={href} target="_blank" rel="noopener noreferrer">
                        <Icon className="size-4" />
                        {t(`buttons.${key}`)}
                      </a>
                    </Button>
                  ))}
                </div>

                <nav aria-label={t("buttons.axioms")} className="hidden overflow-hidden rounded-xl border border-stroke bg-card lg:sticky lg:top-28 lg:block">
                  <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
                    <p className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-foreground">
                      {t("buttons.axioms")}
                    </p>
                    <span aria-hidden className="font-mono text-xs tracking-[0.2em] text-muted-foreground/50">||||||||</span>
                  </div>
                  <ol className="p-2">
                    {axioms.map(({ id, title }) => (
                      <li key={id}>
                        <a
                          href={`#axiom-${id}`}
                          className="grid grid-cols-[2.75rem_1fr] gap-2 rounded-lg px-3 py-2 text-sm leading-snug text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                        >
                          <span className="pt-0.5 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-brand">{id}</span>
                          <span>{title}</span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              </div>
            </aside>

            <div className="min-w-0 space-y-16 lg:col-span-8">
              {/* Preamble */}
              <div>
                <p className="font-mono text-xs font-medium uppercase leading-relaxed tracking-[0.14em] text-muted-foreground">
                  {t("intro.date")}<br />
                  {t("intro.author")}
                </p>
                <h3 className="mt-6 text-4xl leading-[1.05] text-foreground text-balance sm:text-5xl">
                  <TwoToneTitle text={t("intro.heading")} />
                </h3>
                <div className="mt-8 space-y-5 text-lg leading-relaxed text-foreground/85">
                  <p dangerouslySetInnerHTML={{ __html: t.raw("intro.body1") as string }} />
                  <p>
                    {t("intro.body2Line1")}<br />
                    {t("intro.body2Line2")}
                  </p>
                  <p className="font-medium text-foreground">
                    {t("intro.body3")}
                  </p>
                </div>
              </div>

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
              <div className="space-y-16">
                {axioms.map(({ id, title, subtitle, commentary }) => {
                  const Icon = ICONS[id] ?? ScrollText
                  return (
                    <FadeIn key={id}>
                      <article className="scroll-mt-28 border-t border-hairline pt-10" id={`axiom-${id}`}>
                        <span className="inline-flex h-8 min-w-12 items-center justify-center rounded-full border border-stroke bg-foreground/[0.03] px-3 font-mono text-xs font-medium tracking-[0.14em] text-brand">
                          {id}
                        </span>
                        <h4 className="mt-6 text-3xl leading-[1.05] text-foreground text-balance sm:text-4xl">
                          {title}
                        </h4>
                        <p className="mt-5 text-xl font-light leading-snug text-foreground/90 text-pretty">{subtitle}</p>

                        <div className="mt-8 overflow-hidden rounded-xl border border-stroke bg-card">
                          <div className="flex items-center justify-between border-b border-hairline px-5 py-3">
                            <p className="flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.14em] text-foreground">
                              <Icon className="size-4 text-brand" />
                              {t("commentaryLabel")}
                            </p>
                            <span aria-hidden className="font-mono text-xs tracking-[0.2em] text-muted-foreground/50">||||||||</span>
                          </div>
                          <div className="p-5 text-muted-foreground sm:p-6">
                            <Paragraphs text={commentary} />
                          </div>
                        </div>
                      </article>
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
          </div>
        </Section>
      </MainMotion>
    </>
  )
}
