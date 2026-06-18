// Self-contained palette and helpers, scoped under `.infrazen` so the template
// carries its own dark, technical theme instead of the site tokens. The canvas
// is near-black; a single calm mint-emerald signal (--zen) does all the
// accenting, kept off the usual neon web3 clichés.
const INFRAZEN_CSS = `
.infrazen {
  --background: #08090b;
  --foreground: #e9ebee;
  --card: #0d0f12;
  --card-foreground: #e9ebee;
  --popover: #0d0f12;
  --popover-foreground: #e9ebee;
  --primary: #4fe6a8;
  --primary-foreground: #04140d;
  --secondary: #14181d;
  --secondary-foreground: #e9ebee;
  --muted: #101317;
  --muted-foreground: #888f98;
  --accent: #14181d;
  --accent-foreground: #e9ebee;
  --border: rgba(255, 255, 255, 0.08);
  --input: rgba(255, 255, 255, 0.12);
  --ring: #4fe6a8;
  --zen: #4fe6a8;
  --zen-strong: #36d695;
  --zen-soft: rgba(79, 230, 168, 0.12);
  --zen-line: rgba(79, 230, 168, 0.35);
  --surface-2: #111419;
  --hairline: rgba(255, 255, 255, 0.08);
}
.infrazen .zen-mono {
  font-family: var(--font-infrazen-mono), ui-monospace, SFMono-Regular, monospace;
}
.infrazen .zen-grid {
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.045) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.045) 1px, transparent 1px);
  background-size: 56px 56px;
}
.infrazen .zen-grid-fade {
  -webkit-mask-image: radial-gradient(ellipse 72% 60% at 50% 28%, #000 35%, transparent 100%);
  mask-image: radial-gradient(ellipse 72% 60% at 50% 28%, #000 35%, transparent 100%);
}
.infrazen .zen-glow {
  background: radial-gradient(60% 50% at 50% 0%, var(--zen-soft), transparent 70%);
}
.infrazen .zen-ring {
  box-shadow: 0 0 0 1px var(--border), 0 24px 60px -28px rgba(0, 0, 0, 0.8);
}
.infrazen .zen-featured {
  box-shadow: 0 0 0 1px var(--zen-line), 0 0 60px -18px var(--zen-soft);
}
.infrazen .zen-pulse {
  animation: infrazen-pulse 2.4s ease-in-out infinite;
}
@keyframes infrazen-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.82); }
}
@media (prefers-reduced-motion: reduce) {
  .infrazen .zen-pulse { animation: none; }
}
`;

export function InfrazenStyles() {
  return <style dangerouslySetInnerHTML={{ __html: INFRAZEN_CSS }} />;
}
