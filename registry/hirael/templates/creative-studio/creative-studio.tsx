"use client";

import { cn } from "@/lib/utils";

import { About } from "./about";
import { Features } from "./features";
import { almarai, instrumentSerif } from "./fonts";
import { Footer } from "./footer";
import { Hero } from "./hero";

const CREATIVE_STUDIO_CSS = `
.creative-studio {
  --cs-cream: #e1e0cc;
  --cs-ink: #dedbc8;
  --cs-muted: #8b8a80;
}
`;

const CreativeStudio = () => {
  return (
    <div
      className={cn(
        "creative-studio",
        almarai.variable,
        instrumentSerif.variable,
        "bg-black text-(--cs-ink) antialiased",
      )}
      style={{
        fontFamily: "var(--font-almarai), ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: CREATIVE_STUDIO_CSS }} />
      <Hero />
      <About />
      <Features />
      <Footer />
    </div>
  );
};

export default CreativeStudio;
