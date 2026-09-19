const AKOR_CSS = `
.akor {
  --background: hsl(0 0% 10%);
  --foreground: hsl(0 0% 96%);
  --card: hsl(0 0% 12%);
  --card-foreground: hsl(0 0% 96%);
  --popover: hsl(0 0% 12%);
  --popover-foreground: hsl(0 0% 96%);
  --primary: hsl(119 99% 46%);
  --primary-foreground: hsl(0 0% 4%);
  --secondary: hsl(0 0% 18%);
  --secondary-foreground: hsl(0 0% 96%);
  --muted: hsl(0 0% 18%);
  --muted-foreground: hsl(0 0% 60%);
  --accent: hsl(0 0% 18%);
  --accent-foreground: hsl(0 0% 96%);
  --border: hsl(0 0% 20%);
  --input: hsl(0 0% 20%);
  --ring: hsl(119 99% 46%);
  --radius: 0.5rem;
  --akor-hero: hsl(0 0% 8%);
  --akor-ink: hsl(0 0% 0%);
}
.akor ::selection {
  background: hsl(119 99% 46% / 0.35);
}
.akor .fade-up {
  animation-name: akor-fade-up;
  animation-duration: 0.6s;
  animation-timing-function: ease-out;
  animation-fill-mode: both;
}
@keyframes akor-fade-up {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@media (prefers-reduced-motion: reduce) {
  .akor .fade-up {
    animation: none;
  }
}
`;

export const AkorStyles = () => {
  return <style dangerouslySetInnerHTML={{ __html: AKOR_CSS }} />;
};
