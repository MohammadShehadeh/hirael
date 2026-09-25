const PRISM_CSS = `
.prism {
  --background: hsl(0 0% 0%);
  --foreground: hsl(0 0% 100%);
  --card: hsl(0 0% 5%);
  --card-foreground: hsl(0 0% 100%);
  --popover: hsl(0 0% 5%);
  --popover-foreground: hsl(0 0% 100%);
  --primary: hsl(0 0% 100%);
  --primary-foreground: hsl(0 0% 0%);
  --secondary: hsl(0 0% 10%);
  --secondary-foreground: hsl(0 0% 100%);
  --muted: hsl(0 0% 10%);
  --muted-foreground: hsl(0 0% 60%);
  --accent: hsl(0 0% 100% / 0.06);
  --accent-foreground: hsl(0 0% 100%);
  --border: hsl(0 0% 100% / 0.2);
  --input: hsl(0 0% 100% / 0.2);
  --ring: hsl(0 0% 100%);
  --radius: 0.75rem;
}
.prism ::selection {
  background: rgba(255, 255, 255, 0.25);
  color: #000;
}
.prism .liquid-glass,
.prism .liquid-glass-strong {
  background: rgba(255, 255, 255, 0.01);
  background-blend-mode: luminosity;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: none;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}
.prism .liquid-glass-strong {
  backdrop-filter: blur(50px);
  -webkit-backdrop-filter: blur(50px);
  box-shadow:
    4px 4px 4px rgba(0, 0, 0, 0.05),
    inset 0 1px 1px rgba(255, 255, 255, 0.15);
}
.prism .liquid-glass::before,
.prism .liquid-glass-strong::before {
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
.prism .liquid-glass-strong::before {
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.5) 0%,
    rgba(255, 255, 255, 0.2) 20%,
    rgba(255, 255, 255, 0) 40%,
    rgba(255, 255, 255, 0) 60%,
    rgba(255, 255, 255, 0.2) 80%,
    rgba(255, 255, 255, 0.5) 100%
  );
}
.prism .rise {
  animation-name: prism-rise;
  animation-duration: 0.6s;
  animation-timing-function: ease-out;
  animation-fill-mode: both;
}
/* Headline words and the lead only move: text that starts at opacity 0 or blurred holds back Largest Contentful Paint. */
.prism .rise-still {
  animation-name: prism-rise-still;
  animation-duration: 0.6s;
  animation-timing-function: ease-out;
  animation-fill-mode: both;
}
.prism .word-rise {
  display: inline-block;
  animation-name: prism-word-rise;
  animation-duration: 0.7s;
  animation-timing-function: ease-out;
  animation-fill-mode: both;
}
@keyframes prism-rise {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes prism-rise-still {
  from {
    transform: translateY(20px);
  }
  to {
    transform: translateY(0);
  }
}
@keyframes prism-word-rise {
  0% {
    transform: translateY(50px);
  }
  50% {
    transform: translateY(-5px);
  }
  100% {
    transform: translateY(0);
  }
}
@media (prefers-reduced-motion: reduce) {
  .prism .rise,
  .prism .rise-still,
  .prism .word-rise {
    animation: none;
  }
}
`;

export const PrismStyles = () => {
  return <style dangerouslySetInnerHTML={{ __html: PRISM_CSS }} />;
};
