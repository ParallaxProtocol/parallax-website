"use client"
import { FadeIn } from "@/components/fade-in"
import {
  ConfirmationStrip,
  DifficultyChart,
  EscrowDiagram,
  HalvingChart,
  KeyDerivation,
  MempoolAuction,
  MiningLoop,
  NodeChecks,
  TxLifecycle,
} from "@/components/learn/how-it-works-visuals"
import MainMotion from "@/components/main-motion"
import PageHeader from "@/components/page-header"
import { Section, SectionHeading, TwoToneTitle } from "@/components/section"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { ArrowRight, BookOpen, Code2, Rocket, ShieldCheck } from "lucide-react"
import { useTranslations } from "next-intl"

const SECTIONS = ["keys", "tx", "mining", "supply", "contracts", "nodes"] as const

type Point = { title: string; description: string }
type Fact = { value: string; label: string }
type Guide = { label: string; value: string }

function InlineLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2 text-[15px] font-medium text-foreground">
      {children}
      <ArrowRight className="size-4 text-brand transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
    </Link>
  )
}

/* Three short points in one hairline grid, under a diagram. */
function Points({ items }: { items: Point[] }) {
  return (
    <div className="grid gap-px overflow-hidden rounded-2xl border border-stroke bg-hairline md:grid-cols-3">
      {items.map((p) => (
        <div key={p.title} className="bg-background p-6">
          <h3 className="text-lg leading-tight text-foreground">{p.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
        </div>
      ))}
    </div>
  )
}

const NEXT = [
  { key: "start", href: "/get-started", icon: Rocket },
  { key: "verify", href: "/verify", icon: ShieldCheck },
  { key: "developers", href: "/developers", icon: Code2 },
  { key: "whitepaper", href: "/whitepaper", icon: BookOpen },
] as const

export default function HowItWorks() {
  const t = useTranslations("introduction.howItWorks")

  return (
    <MainMotion>
      <PageHeader title={t("pageTitle")} subTitle={t("pageSubtitle")}>
        <nav aria-label={t("contents")} className="enter-fade-up flex flex-wrap gap-2" style={{ "--enter-delay": "0.4s" } as React.CSSProperties}>
          {SECTIONS.map((s, i) => (
            <a
              key={s}
              href={`#${s}`}
              className="inline-flex items-center gap-2 rounded-full border border-stroke bg-background/40 px-4 py-2 text-sm text-foreground/85 backdrop-blur-sm transition-colors hover:border-foreground/30 hover:bg-foreground/5"
            >
              <span className="font-mono text-xs text-brand">{String(i + 1).padStart(2, "0")}</span>
              {t(`${s}.eyebrow`)}
            </a>
          ))}
        </nav>
      </PageHeader>

      {/* 01 Keys */}
      <Section id="keys" className="scroll-mt-16">
        <FadeIn>
          <SectionHeading index="01" eyebrow={t("keys.eyebrow")} title={t("keys.heading")} subtitle={t("keys.subtitle")} />
        </FadeIn>
        <FadeIn delay={0.1} className="mt-16">
          <KeyDerivation />
        </FadeIn>
        <FadeIn className="mt-4">
          <Points items={t.raw("keys.points") as Point[]} />
        </FadeIn>
      </Section>

      {/* 02 Transactions */}
      <Section id="tx" className="scroll-mt-16">
        <FadeIn>
          <SectionHeading index="02" eyebrow={t("tx.eyebrow")} title={t("tx.heading")} subtitle={t("tx.subtitle")} />
        </FadeIn>
        <FadeIn delay={0.1} className="mt-16">
          <TxLifecycle />
        </FadeIn>

        <div className="mt-4 grid gap-4 lg:grid-cols-12">
          <FadeIn className="lg:col-span-8">
            <div className="flex h-full flex-col rounded-2xl border border-stroke bg-card p-6 sm:p-8">
              <h3 className="text-2xl leading-tight text-foreground">{t("tx.confirmTitle")}</h3>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">{t("tx.confirmBody")}</p>
              <div className="mt-8 lg:mb-8">
                <ConfirmationStrip />
              </div>
              <dl className="mt-8 grid gap-px overflow-hidden rounded-xl border border-hairline bg-hairline sm:grid-cols-3 lg:mt-auto">
                {(t.raw("tx.guide") as Guide[]).map((g) => (
                  <div key={g.label} className="bg-card p-4">
                    <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{g.label}</dt>
                    <dd className="mt-1.5 text-[15px] text-foreground">{g.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </FadeIn>
          <FadeIn delay={0.1} className="lg:col-span-4">
            <div className="relative h-full overflow-hidden rounded-2xl border border-stroke bg-card p-6 sm:p-8">
              <div aria-hidden className="aurora opacity-70" />
              <div className="relative">
                <p className="tag">{t("tx.feeLabel")}</p>
                <h3 className="mt-6 text-2xl leading-tight text-foreground">{t("tx.feeTitle")}</h3>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">{t("tx.feeBody")}</p>
                <div className="mt-8">
                  <MempoolAuction />
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* 03 Mining */}
      <Section id="mining" className="scroll-mt-16">
        <FadeIn>
          <SectionHeading index="03" eyebrow={t("mining.eyebrow")} title={t("mining.heading")} subtitle={t("mining.subtitle")} />
        </FadeIn>
        <div className="mt-16 grid gap-4 lg:grid-cols-2">
          <FadeIn className="h-full">
            <div className="flex h-full flex-col rounded-2xl border border-stroke bg-card p-3 sm:p-4">
              <div className="px-3 pt-3 pb-8 sm:px-4 sm:pt-4">
                <h3 className="text-2xl leading-tight text-foreground">{t("mining.xhashTitle")}</h3>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">{t("mining.xhashBody")}</p>
              </div>
              <div className="mt-auto">
                <MiningLoop />
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.1} className="h-full">
            <div className="flex h-full flex-col rounded-2xl border border-stroke bg-card p-3 sm:p-4">
              <div className="px-3 pt-3 pb-8 sm:px-4 sm:pt-4">
                <h3 className="text-2xl leading-tight text-foreground">{t("mining.asertTitle")}</h3>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">{t("mining.asertBody")}</p>
              </div>
              <div className="mt-auto">
                <DifficultyChart />
              </div>
            </div>
          </FadeIn>
        </div>
        <FadeIn>
          <div className="mt-12 grid gap-6 lg:grid-cols-12 lg:items-center">
            <p className="accent-rule pl-6 text-xl font-light leading-snug text-foreground text-balance sm:text-2xl lg:col-span-8">
              {t("mining.reward")}
            </p>
            <div className="lg:col-span-4 lg:justify-self-end">
              <InlineLink href="/mining">{t("mining.cta")}</InlineLink>
            </div>
          </div>
        </FadeIn>
      </Section>

      {/* 04 Supply */}
      <Section id="supply" className="scroll-mt-16">
        <FadeIn>
          <SectionHeading index="04" eyebrow={t("supply.eyebrow")} title={t("supply.heading")} subtitle={t("supply.subtitle")} />
        </FadeIn>
        <FadeIn delay={0.1} className="mt-16">
          <HalvingChart />
        </FadeIn>
        <FadeIn>
          <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-stroke bg-hairline lg:grid-cols-4">
            {(t.raw("supply.facts") as Fact[]).map((f) => (
              <div key={f.label} className="bg-background p-6">
                <dd className="text-4xl font-light tracking-[-0.03em] text-foreground sm:text-5xl">{f.value}</dd>
                <dt className="mt-3 text-sm leading-snug text-muted-foreground">{f.label}</dt>
              </div>
            ))}
          </dl>
        </FadeIn>
        <FadeIn>
          <div className="mt-12 grid gap-6 lg:grid-cols-12 lg:items-center">
            <p className="accent-rule pl-6 text-xl font-light leading-snug text-foreground text-balance sm:text-2xl lg:col-span-8">
              {t("supply.fees")}
            </p>
            <div className="lg:col-span-4 lg:justify-self-end">
              <InlineLink href="/verify">{t("supply.cta")}</InlineLink>
            </div>
          </div>
        </FadeIn>
      </Section>

      {/* 05 Contracts */}
      <Section id="contracts" className="scroll-mt-16">
        <FadeIn>
          <SectionHeading index="05" eyebrow={t("contracts.eyebrow")} title={t("contracts.heading")} subtitle={t("contracts.subtitle")} />
        </FadeIn>
        <FadeIn delay={0.1} className="mt-16">
          <EscrowDiagram />
        </FadeIn>
        <FadeIn className="mt-4">
          <Points items={t.raw("contracts.points") as Point[]} />
        </FadeIn>
      </Section>

      {/* 06 Nodes */}
      <Section id="nodes" className="scroll-mt-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <FadeIn className="lg:col-span-5">
            <p className="tag mb-6">
              <span className="text-brand">06</span>
              <span aria-hidden className="text-hairline">/</span>
              {t("nodes.eyebrow")}
            </p>
            <h2 className="text-4xl leading-[1.05] text-foreground text-balance sm:text-5xl lg:text-6xl">
              <TwoToneTitle text={t("nodes.heading")} />
            </h2>
            <p className="mt-8 text-base text-muted-foreground text-pretty sm:text-lg">{t("nodes.subtitle")}</p>
            <div className="mt-10 border-t border-hairline pt-8">
              <h3 className="text-2xl leading-tight text-foreground">{t("nodes.noVoteTitle")}</h3>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">{t("nodes.noVoteBody")}</p>
            </div>
            <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
              <Button variant="outline" asChild>
                <Link href="/parallax-client">
                  {t("nodes.cta")}
                  <ArrowRight className="text-brand" />
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground">{t("nodes.ctaNote")}</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.1} className="lg:col-span-7 lg:self-center">
            <NodeChecks />
          </FadeIn>
        </div>
      </Section>

      {/* Next steps */}
      <Section className="border-b-0">
        <FadeIn>
          <h2 className="text-4xl leading-[1.05] text-foreground sm:text-5xl">{t("next.heading")}</h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {NEXT.map(({ key, href, icon: Icon }, i) => (
              <Link key={key} href={href} className="group">
                <div className="plate-lift relative flex h-full flex-col overflow-hidden rounded-2xl border border-stroke bg-card p-6 sm:p-8">
                  {i === 0 && <div aria-hidden className="aurora opacity-80" />}
                  <div className="relative flex items-center justify-between">
                    <Icon className="size-6 text-brand" strokeWidth={1.5} aria-hidden />
                    <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground motion-reduce:transition-none" aria-hidden />
                  </div>
                  <h3 className="relative mt-12 text-xl leading-tight text-foreground">{t(`next.items.${key}.title`)}</h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{t(`next.items.${key}.description`)}</p>
                </div>
              </Link>
            ))}
          </div>
        </FadeIn>
      </Section>
    </MainMotion>
  )
}
