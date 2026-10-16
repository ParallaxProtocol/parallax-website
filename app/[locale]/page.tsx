'use client'
import { AudienceRouter } from "@/components/audience-router";
import Client from "@/components/client";
import { Community } from "@/components/community";
import { Documentation } from "@/components/documentation";
import { GenesisProof } from "@/components/genesis-proof";
import { Hero } from "@/components/hero";
import { Parallax } from "@/components/parallax";
import { NetworkStats } from "@/components/network-stats";
import { SoundMoney } from "@/components/sound-money";

export default function Home() {
  return (
    <>
      {/* No page-level fade: the hero and each section animate themselves,
          and a wrapper fade held the LCP text at opacity 0 (see "Entrance
          animations" in globals.css). */}
      <div className="flex flex-col gap-0 overflow-x-hidden">
        <Hero />
        <NetworkStats />
        <GenesisProof />
        <AudienceRouter />
        <Parallax />
        <SoundMoney />
        <Client />
        <Documentation />
        <Community />
      </div>
    </>
  );
}
