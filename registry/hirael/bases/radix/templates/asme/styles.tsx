const ASME_CSS = `
.asme {
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
  --accent: hsl(0 0% 12%);
  --accent-foreground: hsl(0 0% 100%);
  --border: hsl(0 0% 20%);
  --input: hsl(0 0% 18%);
  --ring: hsl(0 0% 40%);
}
.asme ::selection {
  background: rgba(255, 255, 255, 0.25);
  color: #000;
}
.asme .liquid-glass {
  background: rgba(255, 255, 255, 0.01);
  background-blend-mode: luminosity;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: none;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}
.asme .liquid-glass::before {
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
.asme .glow-top {
  background: radial-gradient(ellipse at top, rgba(255, 255, 255, 0.03) 0%, transparent 70%);
}
.asme .glow-center {
  background: radial-gradient(ellipse at center, rgba(255, 255, 255, 0.02) 0%, transparent 60%);
}
`;

export const AsmeStyles = () => {
  return <style dangerouslySetInnerHTML={{ __html: ASME_CSS }} />;
};
