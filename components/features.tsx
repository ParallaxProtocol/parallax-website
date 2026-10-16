import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bolt, BookOpenText, ChevronRight, Cpu, HandCoins, Lock, Shield } from "lucide-react"
import { Separator } from "./ui/separator"
import { Button } from "./ui/button"
import Link from "next/link"

const features = [
  {
    icon: Lock,
    title: "Immutable Monetary Rules",
    description: [
      "Ossified monetary policy resistant to governance capture and discretionary changes.",
    ],
  },
  {
    icon: Cpu,
    title: "Full EVM Compatibility",
    description: [
      "Deploy Ethereum smart contracts with existing tools like Hardhat and Foundry.",
    ],
  },
  {
    icon: Shield,
    title: "Proof of Work",
    description: [
      "XHash mining ensures decentralization and accessibility via commodity CPUs & GPUs.",
      "Parallax implements the Nakamoto consensus with 10-minutes block target, difficulty is adjusted by the ASERT algorithm and fork-choice rules based on proof-of-work weight."
    ],
  },
]

export function Features() {
  return (
    <section className="relative py-24 z-10 px-6 border-b sm:px-8">
      <div className="mx-auto max-w-[90rem] w-fit pt-0">
        <div className="mx-auto w-full text-center">
          <h2 className="text-3xl text-foreground sm:text-4xl">Bridging two Worlds</h2>
          <p className="mt-8 text-base text-muted-foreground text-pretty">
            Parallax combines Bitcoin’s uncompromising monetary discipline with Ethereum’s programmable smart contract ecosystem, creating a network where sound money meets expressive computation. By uniting immutable monetary rules, full EVM compatibility, and proof-of-work security, Parallax bridges the gap between economic resilience and developer freedom—without sacrificing decentralization.
          </p>
        </div>

        <div className="mx-auto mt-24 grid max-w-[90rem] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <feature.icon />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {feature.description[0]}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mx-auto mt-8 grid max-w-[90rem] grid-cols-1 gap-8 lg:grid-cols-2">
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center gap-4">
                <HandCoins className="size-6" />
                <CardTitle>Emission Schedule</CardTitle>
              </div>
            </CardHeader>
            <CardDescription>
              {`Block rewards follow Bitcoin's exact halving pattern`}
            </CardDescription>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">Initial Block Reward</span>
                <span>50 coins</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">Halving Interval</span>
                <span>210,000 blocks (~4 years)</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">Maximum Supply</span>
                <span>21,000,000 coins</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">Premine</span>
                <span>0 coins</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Bolt className="size-6" />
              <CardTitle>Network Parameters</CardTitle>
            </CardHeader>
            <CardDescription>
              Core protocol settings optimized for decentralization
            </CardDescription>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">Consensus Mechanism</span>
                <span>Proof of Work</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">Block Interval</span>
                <span>10 minutes</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">Difficulty Adjustment Algorithm</span>
                <span>ASERT</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">Coinbase Maturity</span>
                <span>100 blocks</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <BookOpenText />
            <CardTitle>Whitepaper</CardTitle>
          </CardHeader>
          <CardDescription>
            Parallax: A New Perspective on Programmable Cash
          </CardDescription>
          <CardContent>
            <h2 className="border-b pb-2 text-lg w-full font-semibold first:mt-0">
              Abstract
            </h2>
            <p className="leading-7 [&:not(:first-child)]:mt-2 text-sm">
              Parallax is a timechain protocol that unites Bitcoin’s immutability and monetary discipline with Ethereum’s programmability. Operating under Bitcoin’s fixed rules — Proof of Work, ten-minute blocks, halving cycles, and a capped 21 million supply — Parallax extends these foundations with the Ethereum Virtual Machine. By adopting XHash mining — a modified Ethash variant designed to obsolete existing ASICs — and rejecting premine or privileged allocations, it launches as a fair and neutral experiment in programmable cash: scarce, decentralized, and permissionless.
            </p>
            <div className="inline-flex w-full justify-end mt-8">
              <Button variant={"secondary"} asChild className="w-full sm:w-fit">
                <Link href={"/parallax.pdf"} target="_blank">
                  Read Whitepaper
                  <ChevronRight />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
