const NOVAEL_CSS = `
/*
 * Novael runs as an always-dark surface, so one token set covers the page.
 * \`--novael-panel\` is the teal slab the services section sits on — the one
 * place the accent fills a whole band rather than a detail.
 */
.novael {
  --radius: 0.375rem;
  --background: hsl(210 5% 7%);
  --foreground: hsl(0 0% 91%);
  --card: hsl(180 3% 5%);
  --card-foreground: hsl(0 0% 91%);
  --popover: hsl(200 4% 8%);
  --popover-foreground: hsl(0 0% 91%);
  --primary: hsl(174 65% 40%);
  --primary-foreground: hsl(0 0% 100%);
  --secondary: hsl(210 3% 11%);
  --secondary-foreground: hsl(0 0% 91%);
  --muted: hsl(210 3% 10%);
  --muted-foreground: hsl(240 1% 54%);
  --accent: hsl(240 1% 17%);
  --accent-foreground: hsl(0 0% 100%);
  --destructive: hsl(0 70% 60%);
  --destructive-foreground: hsl(0 0% 100%);
  --border: hsl(0 0% 100% / 10%);
  --input: hsl(0 0% 100% / 13%);
  --ring: hsl(174 65% 50%);
  --novael-panel: hsl(174 65% 34%);
  --novael-panel-foreground: hsl(0 0% 100%);
  --novael-panel-muted: hsl(0 0% 0% / 55%);
}

/*
 * Arabic leads with Cairo so RTL copy is set in its own typeface rather than
 * only falling back for the glyphs the Latin faces can't draw. The stack
 * follows the \`lang\` on the template root, so it switches with the toggle.
 */
.novael {
  --novael-sans: var(--font-novael-sans), ui-sans-serif, system-ui, sans-serif;
  --novael-display: var(--font-novael-display), ui-sans-serif, system-ui, sans-serif;
  font-family: var(--novael-sans);
}

.novael:lang(ar) {
  --novael-sans: var(--font-novael-arabic), ui-sans-serif, system-ui, sans-serif;
  --novael-display: var(--font-novael-arabic), ui-sans-serif, system-ui, sans-serif;
}

.novael [data-slot='novael-display'] {
  font-family: var(--novael-display);
}
`;

/**
 * Scoped palette and type stacks for the template, injected alongside it so
 * the page is self-contained — nothing to add to `globals.css`.
 */
export const NovaelStyles = () => {
  return <style dangerouslySetInnerHTML={{ __html: NOVAEL_CSS }} />;
};
