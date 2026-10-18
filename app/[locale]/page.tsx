'use client'
import { AudienceRouter } from "@/components/audience-router";
import Client from "@/components/client";
import { Community } from "@/components/community";
import { Documentation } from "@/components/documentation";
import { Hero } from "@/components/hero";
import { MobileWallets } from "@/components/mobile-wallets";
import { NoForks } from "@/components/no-forks";
import { AskParallaxShowcase, ToolsShowcase, WalletShowcase } from "@/components/showcase";
import { SoundMoney } from "@/components/sound-money";

export default function Home() {
  return (
    <>
      {/* No page-level fade: the hero and each section animate themselves,
          and a wrapper fade held the LCP text at opacity 0 (see "Entrance
          animations" in globals.css). */}
      <div className="flex flex-col gap-0 overflow-x-hidden">
        <Hero />
        <SoundMoney />
        <NoForks />
        {/* The proof right after the claims: the live explorer and status page */}
        <ToolsShowcase />
        <AudienceRouter />
        <WalletShowcase />
        <MobileWallets />
        <AskParallaxShowcase />
        <Client />
        <Documentation />
        <Community />
      </div>
    </>
  );
}
