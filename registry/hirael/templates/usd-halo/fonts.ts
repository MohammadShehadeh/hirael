import { Inter, Manrope } from "next/font/google"

// Manrope is the geometric grotesque that carries the page; Inter is the
// inline override on the hero paragraph. Both are variable, so weight is
// omitted and the full axis is available to `font-medium` and friends.
export const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
})

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
})
