const VELORAH_CSS = `
.velorah {
  --background: hsl(0 0% 0%);
  --foreground: hsl(0 0% 100%);
  --card: hsl(0 0% 6%);
  --card-foreground: hsl(0 0% 100%);
  --primary: hsl(0 0% 100%);
  --primary-foreground: hsl(0 0% 4%);
  --secondary: hsl(0 0% 10%);
  --secondary-foreground: hsl(0 0% 100%);
  --muted: hsl(0 0% 10%);
  --muted-foreground: hsl(240 4% 66%);
  --accent: hsl(0 0% 10%);
  --accent-foreground: hsl(0 0% 100%);
  --destructive: hsl(0 84.2% 60.2%);
  --destructive-foreground: hsl(0 0% 100%);
  --border: hsl(0 0% 18%);
  --input: hsl(0 0% 18%);
  --ring: hsl(0 0% 100%);
  --radius: 0.5rem;
}
.velorah .liquid-glass {
  background: rgba(255, 255, 255, 0.01);
  background-blend-mode: luminosity;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: none;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}
.velorah .liquid-glass::before {
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
.velorah .animate-fade-rise,
.velorah .animate-fade-rise-delay,
.velorah .animate-fade-rise-delay-2 {
  animation: velorah-fade-rise 0.8s ease-out both;
}
.velorah .animate-fade-rise-delay {
  animation-delay: 0.2s;
}
.velorah .animate-fade-rise-delay-2 {
  animation-delay: 0.4s;
}
@keyframes velorah-fade-rise {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@media (prefers-reduced-motion: reduce) {
  .velorah .animate-fade-rise,
  .velorah .animate-fade-rise-delay,
  .velorah .animate-fade-rise-delay-2 {
    animation: none;
  }
}
`;

export function VelorahStyles() {
  return <style dangerouslySetInnerHTML={{ __html: VELORAH_CSS }} />;
}
