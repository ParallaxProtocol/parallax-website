import { ChevronRight, LucideDownload } from "lucide-react";
import Link from "next/link";
import { FaGithub, FaXTwitter } from "react-icons/fa6";
import { Button } from "./ui/button";

export default function Sub() {
  return (
    <section className="relative overflow-visible">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808020_1px,transparent_1px),linear-gradient(to_bottom,#80808020_1px,transparent_1px)] bg-[size:48px_48px] -z-10" />
      {/* Description */}
      <div className="relative mx-auto max-w-[90rem] px-5 py-16 overflow-visible">
        <div className="mx-auto max-w-4xl text-center overflow-visible">
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-3xl mx-auto text-pretty">
            {`Parallax uses peer-to-peer technology to operate with no central authority or banks; managing transactions and the issuing of coins is carried out collectively by the network. Parallax is open-source; its design is public, nobody owns or controls Parallax and everyone can take part.`}
          </p>

          {/* CTA Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              asChild
            >
              <Link href="/parallax.pdf" target="_blank">
                Read white paper
                <ChevronRight />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
            >
              <Link href="/parallax-client">
                <LucideDownload />
                Download Parallax Client
              </Link>
            </Button>
          </div>

          {/* Social Links */}
          <div className="mt-8 flex justify-center gap-6">
            <Link href="https://x.com/prlxchain" target="_blank" className="text-muted-foreground hover:text-blue-400 transition-colors">
              <FaXTwitter className="h-6 w-6" />
            </Link>
            <Link href="https://github.com/ParallaxProtocol" target="_blank" className="text-muted-foreground hover:text-blue-400 transition-colors">
              <FaGithub className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
