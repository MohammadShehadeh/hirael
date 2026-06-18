// Self-contained palette and visual language, scoped under `.infrazen`. A
// near-black monochrome canvas with a single calm mint-emerald signal (--zen).
// The helpers below carry the grid-based, cyber-industrial texture: dot grids,
// diagonal stripe separators, a subtle glitch, and a scanline sheen.
const INFRAZEN_CSS = `
.infrazen {
  --background: #07080a;
  --foreground: #e9ebee;
  --card: #0c0e11;
  --card-foreground: #e9ebee;
  --popover: #0c0e11;
  --popover-foreground: #e9ebee;
  --primary: #4fe6a8;
  --primary-foreground: #04140d;
  --secondary: #14181d;
  --secondary-foreground: #e9ebee;
  --muted: #0f1216;
  --muted-foreground: #868d96;
  --accent: #14181d;
  --accent-foreground: #e9ebee;
  --border: rgba(255, 255, 255, 0.08);
  --input: rgba(255, 255, 255, 0.12);
  --ring: #4fe6a8;
  --zen: #4fe6a8;
  --zen-strong: #36d695;
  --zen-soft: rgba(79, 230, 168, 0.12);
  --zen-line: rgba(79, 230, 168, 0.35);
  --surface-2: #101419;
  --hairline: rgba(255, 255, 255, 0.08);
}
.infrazen .zen-mono {
  font-family: var(--font-infrazen-mono), ui-monospace, SFMono-Regular, monospace;
}
.infrazen .zen-grid {
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 56px 56px;
}
.infrazen .zen-dots {
  background-image: radial-gradient(rgba(255, 255, 255, 0.10) 1px, transparent 1px);
  background-size: 22px 22px;
}
.infrazen .zen-fade-edges {
  -webkit-mask-image: radial-gradient(ellipse 75% 65% at 50% 30%, #000 35%, transparent 100%);
  mask-image: radial-gradient(ellipse 75% 65% at 50% 30%, #000 35%, transparent 100%);
}
.infrazen .zen-fade-b {
  -webkit-mask-image: linear-gradient(to bottom, #000 55%, transparent 100%);
  mask-image: linear-gradient(to bottom, #000 55%, transparent 100%);
}
.infrazen .zen-glow {
  background: radial-gradient(60% 50% at 50% 0%, var(--zen-soft), transparent 70%);
}
.infrazen .zen-diagonal {
  background-image: repeating-linear-gradient(
    -45deg,
    var(--border) 0,
    var(--border) 1px,
    transparent 1px,
    transparent 7px
  );
}
.infrazen .zen-ring {
  box-shadow: 0 0 0 1px var(--border), 0 30px 70px -32px rgba(0, 0, 0, 0.85);
}
.infrazen .zen-featured {
  box-shadow: 0 0 0 1px var(--zen-line), 0 0 70px -20px var(--zen-soft);
}
.infrazen .zen-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}
.infrazen .zen-lift:hover {
  transform: translateY(-3px);
  box-shadow: 0 24px 50px -28px rgba(0, 0, 0, 0.9);
}
.infrazen .zen-pulse {
  animation: infrazen-pulse 2.4s ease-in-out infinite;
}
.infrazen .zen-scan::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(180deg, transparent 0%, rgba(79, 230, 168, 0.05) 50%, transparent 100%);
  background-size: 100% 8px;
  opacity: 0.5;
}
.infrazen .zen-glitch {
  position: relative;
  display: inline-block;
}
.infrazen .zen-glitch::before,
.infrazen .zen-glitch::after {
  content: attr(data-text);
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.75;
}
.infrazen .zen-glitch::before {
  color: var(--zen);
  animation: infrazen-glitch-a 5.5s steps(2, end) infinite;
}
.infrazen .zen-glitch::after {
  color: #5bc8ff;
  animation: infrazen-glitch-b 5.5s steps(2, end) infinite;
}
@keyframes infrazen-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.82); }
}
@keyframes infrazen-glitch-a {
  0%, 92%, 100% { transform: translate(0, 0); clip-path: inset(0 0 0 0); }
  93% { transform: translate(-2px, 1px); clip-path: inset(12% 0 58% 0); }
  96% { transform: translate(2px, -1px); clip-path: inset(70% 0 8% 0); }
}
@keyframes infrazen-glitch-b {
  0%, 92%, 100% { transform: translate(0, 0); clip-path: inset(0 0 0 0); }
  94% { transform: translate(2px, -1px); clip-path: inset(64% 0 14% 0); }
  98% { transform: translate(-2px, 1px); clip-path: inset(20% 0 52% 0); }
}
@media (prefers-reduced-motion: reduce) {
  .infrazen .zen-pulse,
  .infrazen .zen-glitch::before,
  .infrazen .zen-glitch::after {
    animation: none;
  }
  .infrazen .zen-glitch::before,
  .infrazen .zen-glitch::after {
    display: none;
  }
}
`;

export function InfrazenStyles() {
  return <style dangerouslySetInnerHTML={{ __html: INFRAZEN_CSS }} />;
}
