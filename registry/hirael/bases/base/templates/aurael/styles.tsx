const AURAEL_CSS = `
.aurael {
  --radius: 0.375rem;
  --background: hsl(0 0% 100%);
  --foreground: hsl(0 0% 9%);
  --card: hsl(0 0% 100%);
  --card-foreground: hsl(0 0% 9%);
  --popover: hsl(0 0% 100%);
  --popover-foreground: hsl(0 0% 9%);
  --primary: hsl(28 88% 46%);
  --primary-foreground: hsl(0 0% 100%);
  --secondary: hsl(30 20% 96%);
  --secondary-foreground: hsl(0 0% 13%);
  --muted: hsl(30 20% 96%);
  --muted-foreground: hsl(0 0% 40%);
  --accent: hsl(30 20% 96%);
  --accent-foreground: hsl(0 0% 13%);
  --destructive: hsl(0 72% 46%);
  --destructive-foreground: hsl(0 0% 100%);
  --border: hsl(30 12% 88%);
  --input: hsl(30 12% 88%);
  --ring: hsl(28 88% 46%);
}

.aurael[data-scene='night'] {
  --background: hsl(220 9% 7%);
  --foreground: hsl(0 0% 91%);
  --card: hsl(220 9% 5%);
  --card-foreground: hsl(0 0% 91%);
  --popover: hsl(220 9% 8%);
  --popover-foreground: hsl(0 0% 91%);
  --primary: hsl(36 92% 62%);
  --primary-foreground: hsl(30 40% 10%);
  --secondary: hsl(220 7% 12%);
  --secondary-foreground: hsl(0 0% 91%);
  --muted: hsl(220 7% 11%);
  --muted-foreground: hsl(220 5% 58%);
  --accent: hsl(220 7% 17%);
  --accent-foreground: hsl(0 0% 100%);
  --destructive: hsl(0 70% 60%);
  --destructive-foreground: hsl(0 0% 100%);
  --border: hsl(0 0% 100% / 9%);
  --input: hsl(0 0% 100% / 13%);
  --ring: hsl(36 92% 62%);
}

.aurael {
  --aurael-sans: var(--font-aurael-sans), ui-sans-serif, system-ui, sans-serif;
  --aurael-display: var(--font-aurael-display), ui-sans-serif, system-ui, sans-serif;
  font-family: var(--aurael-sans);
}

.aurael:lang(ar) {
  --aurael-sans: var(--font-aurael-arabic), ui-sans-serif, system-ui, sans-serif;
  --aurael-display: var(--font-aurael-arabic), ui-sans-serif, system-ui, sans-serif;
}

.aurael [data-slot='aurael-display'] {
  font-family: var(--aurael-display);
}
`;

export const AuraelStyles = () => {
  return <style dangerouslySetInnerHTML={{ __html: AURAEL_CSS }} />;
};
