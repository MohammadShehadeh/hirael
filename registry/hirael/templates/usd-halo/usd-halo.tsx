import { cn } from "@/lib/utils";

import { BackedBySection } from "./backed-by";
import { inter, manrope } from "./fonts";
import { FooterSection } from "./footer";
import { HeroSection } from "./hero";
import { InfoSection } from "./info";
import { Navbar } from "./navbar";
import { UseCasesSection } from "./use-cases";

const UsdHalo = () => {
  return (
    <div
      className={cn(
        manrope.variable,
        inter.variable,
        "flex flex-col bg-[#F5F5F5] text-black antialiased",
      )}
      style={{
        fontFamily: "var(--font-manrope), ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <div className="relative flex h-dvh flex-col overflow-hidden">
        <Navbar />
        <HeroSection />
      </div>
      <InfoSection />
      <BackedBySection />
      <UseCasesSection />
      <FooterSection />
    </div>
  );
};

export default UsdHalo;
