"use client"
import GridView from "@/components/grid-view";
import MainMotion from "@/components/main-motion";
import PageHeader from "@/components/page-header";
import { Cpu, Database, Key, Rabbit, Wallet } from "lucide-react";
import { useTranslations } from "next-intl";

const ICONS = [Wallet, Database, Key, Cpu, Rabbit];

type RawTopic = { title: string; description: string };

export default function ParallaxHowItWorks() {
  const t = useTranslations("introduction.howItWorks");
  const rawTopics = t.raw("topics") as RawTopic[];
  const topics = rawTopics.map((topic, i) => ({
    icon: ICONS[i] ?? Wallet,
    title: topic.title,
    description: topic.description,
  }));

  return (
    <MainMotion>
      <PageHeader
        title={t("pageTitle")}
        subTitle={t("pageSubtitle")}
      />
      <GridView items={topics} />
    </MainMotion>
  );
}
