const MINDLOOP_CSS = `
.mindloop {
  --background: hsl(0 0% 0%);
  --foreground: hsl(0 0% 100%);
  --card: hsl(0 0% 5%);
  --card-foreground: hsl(0 0% 100%);
  --primary: hsl(0 0% 100%);
  --primary-foreground: hsl(0 0% 0%);
  --secondary: hsl(0 0% 12%);
  --secondary-foreground: hsl(0 0% 85%);
  --muted: hsl(0 0% 15%);
  --muted-foreground: hsl(0 0% 65%);
  --accent: hsl(170 15% 45%);
  --accent-foreground: hsl(0 0% 100%);
  --border: hsl(0 0% 20%);
  --input: hsl(0 0% 18%);
  --ring: hsl(0 0% 40%);
  --hero-subtitle: 210 17% 95%;
}
.mindloop .liquid-glass {
  background: rgba(255, 255, 255, 0.01);
  background-blend-mode: luminosity;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: none;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}
.mindloop .liquid-glass::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.4px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.45) 0%,
    rgba(255, 255, 255, 0.15) 20%,
    rgba(255, 255, 255, 0) 40%,
    rgba(255, 255, 255, 0) 60%,
    rgba(255, 255, 255, 0.15) 80%,
    rgba(255, 255, 255, 0.45) 100%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}
`

export function MindloopStyles() {
  return <style dangerouslySetInnerHTML={{ __html: MINDLOOP_CSS }} />
}
