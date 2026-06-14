// Self-contained design system for the template. Scoped to the root
// `[data-slot="portfolio"]` so the palette, fonts and keyframes never leak
// into the consuming app. Tailwind reads the `--bg`/`--surface`/… channels
// through `hsl(var(--token))` arbitrary values; the rest is plain CSS.
export const PORTFOLIO_STYLES = `
[data-slot="portfolio"] {
  --bg: 0 0% 4%;
  --surface: 0 0% 8%;
  --text: 0 0% 96%;
  --muted: 0 0% 53%;
  --stroke: 0 0% 12%;
  --accent: 0 0% 96%;
  font-family: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
}
[data-slot="portfolio"] .font-display {
  font-family: var(--font-instrument-serif), ui-serif, Georgia, serif;
}
[data-slot="portfolio"] .accent-gradient {
  background-image: linear-gradient(90deg, #89AACC 0%, #4E85BF 100%);
}
[data-slot="portfolio"] .accent-gradient-animated {
  background-image: linear-gradient(90deg, #89AACC 0%, #4E85BF 50%, #89AACC 100%);
  background-size: 200% 100%;
  animation: pf-gradient-shift 6s ease infinite;
}
[data-slot="portfolio"] .animate-scroll-down {
  animation: pf-scroll-down 1.5s ease-in-out infinite;
}
[data-slot="portfolio"] .animate-role-fade-in {
  animation: pf-role-fade-in 0.4s ease-out both;
}
@keyframes pf-scroll-down {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(200%); }
}
@keyframes pf-role-fade-in {
  0% { opacity: 0; transform: translateY(8px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes pf-gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@media (prefers-reduced-motion: reduce) {
  [data-slot="portfolio"] .animate-scroll-down,
  [data-slot="portfolio"] .accent-gradient-animated {
    animation: none;
  }
}
`;
