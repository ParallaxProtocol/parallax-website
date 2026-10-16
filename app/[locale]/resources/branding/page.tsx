import MainMotion from "@/components/main-motion";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

const LOGO_ASSETS = [
  {
    files: [
      { type: "SVG", path: "/new_parallax_logo_square.svg" },
      { type: "PNG", path: "/new_parallax_logo_square.svg", png: true },
    ],
    preview: "/new_parallax_logo_square.svg",
  },
  {
    files: [
      { type: "SVG", path: "/new_parallax_logo_square_white.svg" },
      { type: "PNG", path: "/new_parallax_logo_square_white.svg", png: true },
    ],
    preview: "/new_parallax_logo_square_white.svg",
  },
  {
    files: [
      { type: "SVG", path: "/new_parallax_logo_rounded.svg" },
      { type: "PNG", path: "/new_parallax_logo_rounded.svg", png: true },
    ],
    preview: "/new_parallax_logo_rounded.svg",
  },
  {
    files: [
      { type: "SVG", path: "/new_parallax_logo_rounded_white.svg" },
      { type: "PNG", path: "/new_parallax_logo_rounded_white.svg", png: true },
    ],
    preview: "/new_parallax_logo_rounded_white.svg",
  },
  {
    files: [
      { type: "SVG", path: "/new_parallax_logo_transparent.svg" },
      { type: "PNG", path: "/new_parallax_logo_transparent.svg", png: true },
    ],
    preview: "/new_parallax_logo_transparent.svg",
  },
];

function getPngPath(svgPath: string) {
  // Replace .svg with .png for PNG download links
  return svgPath.replace(/\.svg$/, ".png");
}

export default async function BrandingPage() {
  const t = await getTranslations("resources.branding");
  const names = t.raw("logos") as Array<{ name: string }>;

  return (
    <MainMotion>
      <PageHeader
        title={t("title")}
        subTitle={t("subtitle")}
      />
      <section className="mx-auto max-w-[90rem] px-5 pt-20 md:px-10 md:pt-28">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {LOGO_ASSETS.map((logo, i) => {
            const name = names[i]?.name ?? "";
            return (
              <Card key={`${name}_${i}`} className="overflow-hidden py-0">
                <div className="flex justify-center border-b border-hairline bg-foreground/[0.02] px-6 py-12">
                  <Image src={logo.preview} alt={name} width={200} height={200} className="size-36 p-2 sm:size-40" />
                </div>
                <div className="flex flex-1 flex-col justify-between gap-6 p-6">
                  <div className="flex items-baseline justify-between gap-4">
                    <CardTitle className="text-xl">{name}</CardTitle>
                    <span className="font-mono text-xs tracking-[0.14em] text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {logo.files.map((file) => (
                      <Button key={file.type} variant="outline" size="sm" asChild>
                        <a href={file.png ? getPngPath(file.path) : file.path} download>
                          <Download />
                          {file.type}
                        </a>
                      </Button>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </MainMotion>
  );
}
