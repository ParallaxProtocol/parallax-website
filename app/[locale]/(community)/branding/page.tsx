import { CopyButton } from "@/components/copy-button";
import MainMotion from "@/components/main-motion";
import PageHeader from "@/components/page-header";
import { Section, SectionHeading } from "@/components/section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CaseSensitive, Download, Maximize, Move, Palette, SunMoon, X } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

/* Each logo ships as SVG plus a PNG of the same name. `dark` previews the
   file on black, the only ground the bare gradient mark is drawn for. */
const LOGO_ASSETS = [
  { file: "new_parallax_logo_square" },
  { file: "new_parallax_logo_square_white" },
  { file: "new_parallax_logo_rounded" },
  { file: "new_parallax_logo_rounded_white" },
  { file: "new_parallax_logo_transparent", dark: true },
] as const

/* Exact values from the logo SVGs (public/new_parallax_logo_square.svg)
   and the site's dark theme (app/globals.css). */
const COLORS = [
  { key: "green", hex: "#00FF80", rgb: "0 255 128" },
  { key: "blue", hex: "#0080FF", rgb: "0 128 255" },
  { key: "black", hex: "#000000", rgb: "0 0 0" },
  { key: "white", hex: "#FFFFFF", rgb: "255 255 255" },
] as const

/* The mark's gradient vector points down and to the right at about 150°. */
const GRADIENT_CSS = "linear-gradient(150deg, #00FF80 0%, #0080FF 100%)"

const USAGE = [
  { key: "space", icon: Maximize },
  { key: "recolor", icon: Palette },
  { key: "stretch", icon: Move },
  { key: "contrast", icon: SunMoon },
  { key: "name", icon: CaseSensitive },
] as const

const MARK = "/new_parallax_logo_transparent.svg"

/* Misuse examples, drawn by transforming the real mark. */
const DONTS = [
  { key: "stretched", className: "scale-x-[1.6] scale-y-[0.8]", ground: "bg-black" },
  { key: "recolored", className: "hue-rotate-[150deg]", ground: "bg-black" },
  { key: "rotated", className: "rotate-[24deg]", ground: "bg-black" },
  { key: "lowContrast", className: "", ground: "bg-white" },
] as const

export default async function BrandingPage() {
  const t = await getTranslations("resources.branding");
  const logos = t.raw("logos") as Array<{ name: string; use: string }>;
  const copy = { label: t("copy"), copiedLabel: t("copied") }

  return (
    <MainMotion>
      <PageHeader title={t("title")} subTitle={t("subtitle")} />

      {/* Logo downloads */}
      <Section>
        <SectionHeading index="01" eyebrow={t("logosSection.eyebrow")} title={t("logosSection.heading")} subtitle={t("logosSection.subtitle")} />
        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LOGO_ASSETS.map((logo, i) => {
            const { name, use } = logos[i] ?? { name: "", use: "" }
            const svg = `/${logo.file}.svg`
            return (
              <div key={logo.file} className="flex flex-col overflow-hidden rounded-xl border border-stroke bg-card">
                <div
                  className={cn(
                    "flex justify-center border-b border-hairline px-6 py-12",
                    "dark" in logo && logo.dark ? "bg-black" : "bg-foreground/[0.02]",
                  )}
                >
                  <Image src={svg} alt={`Parallax logo, ${name}`} width={200} height={200} className="size-32 p-2 sm:size-36" />
                </div>
                <div className="flex flex-1 flex-col justify-between gap-6 p-6">
                  <div>
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="text-xl leading-tight text-foreground">{name}</h3>
                      <span className="font-mono text-xs tracking-[0.14em] text-muted-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{use}</p>
                  </div>
                  <div className="flex gap-2">
                    {(["SVG", "PNG"] as const).map((type) => (
                      <Button key={type} variant="outline" size="sm" asChild>
                        <a href={`/${logo.file}.${type.toLowerCase()}`} download>
                          <Download />
                          {type}
                        </a>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Section>

      {/* Colors */}
      <Section>
        <SectionHeading index="02" eyebrow={t("colorsSection.eyebrow")} title={t("colorsSection.heading")} subtitle={t("colorsSection.subtitle")} />

        <div className="mt-16 overflow-hidden rounded-2xl border border-stroke">
          <div className="h-40 sm:h-56" style={{ backgroundImage: GRADIENT_CSS }} />
          <div className="flex flex-col gap-3 border-t border-stroke bg-card px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="min-w-0">
              <p className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-foreground">{t("gradient.label")}</p>
              <p className="mt-1 text-sm text-muted-foreground">{t("gradient.note")}</p>
            </div>
            <div className="flex min-w-0 items-center gap-1 rounded-full border border-hairline bg-background pl-4">
              <code className="min-w-0 truncate font-mono text-[13px] text-foreground">{GRADIENT_CSS}</code>
              <CopyButton value={GRADIENT_CSS} {...copy} />
            </div>
          </div>
        </div>

        <ul className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-stroke bg-hairline lg:grid-cols-4">
          {COLORS.map(({ key, hex, rgb }) => (
            <li key={key} className="bg-background">
              <div className="h-24 border-b border-hairline sm:h-40" style={{ backgroundColor: hex }} />
              <div className="p-4 sm:p-6">
                <p className="tag">{t(`colors.${key}.role`)}</p>
                <h3 className="mt-3 text-xl leading-tight text-foreground">{t(`colors.${key}.name`)}</h3>
                <div className="mt-4 flex items-center justify-between gap-2">
                  <div className="font-mono text-[13px] leading-relaxed">
                    <p className="text-foreground">{hex}</p>
                    <p className="text-muted-foreground">RGB {rgb}</p>
                  </div>
                  <CopyButton value={hex} {...copy} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* Usage */}
      <Section className="border-b-0">
        <SectionHeading index="03" eyebrow={t("usageSection.eyebrow")} title={t("usageSection.heading")} subtitle={t("usageSection.subtitle")} />

        <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <ul className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:col-span-7">
            {USAGE.map(({ key, icon: Icon }) => (
              <li key={key}>
                <Icon className="size-6 text-brand" strokeWidth={1.5} aria-hidden />
                <h3 className="mt-5 text-lg leading-tight text-foreground">{t(`usage.${key}.title`)}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{t(`usage.${key}.description`)}</p>
              </li>
            ))}
          </ul>

          <div className="lg:col-span-5">
            {/* Clear space: the mark inside a dashed boundary a quarter of its width out */}
            <div className="relative flex items-center justify-center overflow-hidden rounded-2xl border border-stroke bg-black p-10">
              <div className="relative border border-dashed border-white/30 p-7 sm:p-9">
                <Image src={MARK} alt="" width={160} height={160} className="size-28 sm:size-36" />
                <span aria-hidden className="absolute top-0 left-1/2 h-7 w-px -translate-x-1/2 bg-white/40 sm:h-9" />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              {DONTS.map(({ key, className, ground }) => (
                <figure key={key} className="overflow-hidden rounded-xl border border-stroke bg-card">
                  <div className={cn("flex h-28 items-center justify-center overflow-hidden", ground)}>
                    <Image src={MARK} alt="" width={96} height={96} className={cn("size-14", className)} />
                  </div>
                  <figcaption className="flex items-center gap-2 border-t border-hairline px-3 py-2.5 text-sm text-muted-foreground">
                    <X className="size-3.5 shrink-0 text-destructive" aria-hidden />
                    <span className="sr-only">{t("dont.label")}: </span>
                    {t(`dont.${key}`)}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </MainMotion>
  );
}
