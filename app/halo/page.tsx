import type { Metadata } from "next"

import "./halo.css"
import { BackedBySection } from "./_components/backed-by-section"
import { HaloFooter } from "./_components/halo-footer"
import { HeroSection } from "./_components/hero-section"
import { InfoSection } from "./_components/info-section"
import { Navbar } from "./_components/navbar"
import { UseCasesSection } from "./_components/use-cases-section"

export const metadata: Metadata = {
  title: { absolute: "USD Halo · Your wealth works" },
  description:
    "An automated, reward-powered digital dollar built for native passive earnings and effortless connection into DeFi.",
  // Standalone product landing demo — keep it out of the registry's sitemap
  // and search index so it doesn't read as a real Hirael offering.
  robots: { index: false, follow: false },
}

export default function HaloPage() {
  return (
    <main className="halo-page flex flex-col bg-[#F5F5F5] text-black">
      <div className="relative flex h-screen flex-col overflow-hidden">
        <Navbar />
        <HeroSection />
      </div>
      <InfoSection />
      <BackedBySection />
      <UseCasesSection />
      <HaloFooter />
    </main>
  )
}
