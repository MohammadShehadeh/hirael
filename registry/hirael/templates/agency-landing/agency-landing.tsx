import { About } from "./about"
import { CaseStudies } from "./case-studies"
import { Hero } from "./hero"

const SYSTEM_FONT =
  'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'

export default function AgencyLanding() {
  return (
    <div
      className="bg-white text-gray-900 antialiased"
      style={{ fontFamily: SYSTEM_FONT }}
    >
      <Hero />
      <About />
      <CaseStudies />
    </div>
  )
}
