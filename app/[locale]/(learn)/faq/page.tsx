"use client"

import MainMotion from "@/components/main-motion"
import PageHeader from "@/components/page-header"
import { cn } from "@/lib/utils"
import { Search, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { useMemo, useState } from "react"

type FaqItem = { question: string; answer: string }
type CategoryId = "general" | "technical" | "mining" | "economics" | "governance" | "development"

const CATEGORY_IDS: CategoryId[] = ["general", "technical", "mining", "economics", "governance", "development"]

export default function FAQPage() {
  const t = useTranslations("faq")
  const [activeCategory, setActiveCategory] = useState<CategoryId>("general")
  const [searchQuery, setSearchQuery] = useState("")

  const faqData = useMemo(() => {
    const data = {} as Record<CategoryId, FaqItem[]>
    for (const id of CATEGORY_IDS) {
      data[id] = t.raw(`items.${id}` as "items.general") as FaqItem[]
    }
    return data
  }, [t])

  const categories = CATEGORY_IDS.map((id) => ({
    id,
    name: t(`categories.${id}` as "categories.general"),
  }))

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null
    const query = searchQuery.toLowerCase()
    const results: { category: CategoryId; question: string; answer: string }[] = []
    for (const id of CATEGORY_IDS) {
      for (const faq of faqData[id]) {
        if (
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query)
        ) {
          results.push({ category: id, ...faq })
        }
      }
    }
    return results
  }, [searchQuery, faqData])

  const isSearching = searchQuery.trim().length > 0

  const items = isSearching ? searchResults ?? [] : faqData[activeCategory]

  return (
    <MainMotion>
      <PageHeader title={t("title")} subTitle={t("subtitle")} />
      <section className="flex mt-20 bg-transparent z-10 md:mt-28">
        <div className="flex flex-col lg:flex-row gap-12 mx-auto max-w-[90rem] w-full px-5 md:px-10">
          {/* Sidebar */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t("search.placeholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 w-full rounded-full border border-stroke bg-card pl-10 pr-10 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground hover:border-foreground/25 focus-visible:border-foreground/30 focus-visible:ring-[3px] focus-visible:ring-ring/40"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    aria-label={t("search.clear")}
                    className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-foreground/5 hover:text-foreground cursor-pointer"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>

              <nav className="flex flex-col overflow-hidden rounded-xl border border-stroke bg-card">
                {categories.map((category, i) => {
                  const active = !isSearching && activeCategory === category.id
                  return (
                    <button
                      key={category.id}
                      onClick={() => {
                        setActiveCategory(category.id)
                        setSearchQuery("")
                      }}
                      aria-current={active ? "true" : undefined}
                      className={cn(
                        "relative flex w-full cursor-pointer items-center gap-4 px-4 py-3.5 text-left text-base outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-ring/60",
                        i !== categories.length - 1 && "border-b border-hairline",
                        active
                          ? "bg-foreground text-background before:absolute before:inset-y-2 before:left-1.5 before:w-0.5 before:rounded-full before:bg-background"
                          : "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground"
                      )}
                    >
                      <span className={cn("font-mono text-xs tracking-[0.14em]", active ? "text-background/60" : "text-brand")}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {category.name}
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h2 className="mb-10 text-4xl leading-[1.05] text-foreground text-balance sm:text-5xl">
              {isSearching
                ? searchResults && searchResults.length > 0
                  ? t(
                      searchResults.length === 1
                        ? "search.resultsOne"
                        : "search.resultsOther",
                      { count: searchResults.length },
                    )
                  : t("search.noResults")
                : <span className="capitalize">{categories.find((cat) => cat.id === activeCategory)?.name}</span>}
            </h2>
            {items.length > 0 && (
              <div className="overflow-hidden rounded-2xl border border-stroke bg-card">
                {items.map((faq, index) => (
                  <div
                    key={isSearching ? `search-${index}` : `${activeCategory}-${index}`}
                    className={cn(
                      "grid grid-cols-[auto_1fr] gap-x-4 px-5 py-6 sm:gap-x-6 sm:px-8 sm:py-8",
                      index !== items.length - 1 && "border-b border-hairline"
                    )}
                  >
                    <span className="pt-1.5 font-mono text-xs tracking-[0.14em] text-brand">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-xl leading-tight text-foreground text-balance sm:text-2xl">
                        {faq.question}
                      </h3>
                      <div className="mt-3 text-base text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </div>
                      {"category" in faq && (
                        <span className="mt-4 inline-flex rounded-full border border-stroke px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                          {categories.find((c) => c.id === faq.category)?.name}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </MainMotion>
  )
}
