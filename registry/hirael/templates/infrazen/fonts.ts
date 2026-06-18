import { JetBrains_Mono, Space_Grotesk } from "next/font/google";

export const spaceGrotesk = Space_Grotesk({
  variable: "--font-infrazen-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  variable: "--font-infrazen-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});
