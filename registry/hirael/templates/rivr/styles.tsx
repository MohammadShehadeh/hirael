const RIVR_CSS = `
.rivr {
  --background: hsl(210 24% 98%);
  --foreground: hsl(218 48% 24%);
  --card: hsl(0 0% 100%);
  --card-foreground: hsl(218 48% 24%);
  --popover: hsl(0 0% 100%);
  --popover-foreground: hsl(218 48% 24%);
  --primary: hsl(218 48% 24%);
  --primary-foreground: hsl(0 0% 100%);
  --secondary: hsl(212 26% 93%);
  --secondary-foreground: hsl(218 48% 24%);
  --muted: hsl(212 26% 93%);
  --muted-foreground: hsl(215 16% 42%);
  --accent: hsl(212 32% 91%);
  --accent-foreground: hsl(218 48% 24%);
  --border: hsl(214 24% 88%);
  --input: hsl(214 24% 88%);
  --ring: hsl(218 48% 40%);
}
.rivr .font-display {
  font-family: var(--font-rivr-display), ui-sans-serif, system-ui, sans-serif;
  letter-spacing: -0.02em;
}
`

export function RivrStyles() {
  return <style dangerouslySetInnerHTML={{ __html: RIVR_CSS }} />
}
