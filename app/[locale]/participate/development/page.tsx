"use client"
import GridView from "@/components/grid-view";
import MainMotion from "@/components/main-motion";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { BookOpen, Boxes, LayoutGrid, PackagePlus, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { FaGithub } from "react-icons/fa";

const TOPIC_ICONS = [LayoutGrid, Boxes, PackagePlus, BookOpen, Users]

export default function DevelopersPage() {
  const t = useTranslations("participate.development")
  const rawTopics = t.raw("topics") as Array<{ title: string; description: string }>
  const topics = rawTopics.map((topic, i) => ({
    icon: TOPIC_ICONS[i],
    title: topic.title,
    description: topic.description,
  }))

  return (
    <MainMotion>
      <PageHeader
        title={t("title")}
        subTitle={t("subtitle")}
      >
        <div
          className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row enter-fade-up"
          style={{ "--enter-delay": "0.35s" } as React.CSSProperties}
        >
          <Button variant="brand" className="w-full sm:w-fit" size={'xl'} asChild>
            <a href="https://github.com/ParallaxProtocol" target="_blank" rel="noopener">
              <FaGithub />
              {t("exploreGithub")}
            </a>
          </Button>
          <Button variant="outline" className="w-full sm:w-fit" size={'xl'} asChild>
            <Link href={"/resources/technical-documentation"}>
              <BookOpen />
              {t("readDocumentation")}
            </Link>
          </Button>
        </div>
      </PageHeader>
      <GridView
        items={topics}
      />
    </MainMotion>
  );
}
