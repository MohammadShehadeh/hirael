// Runs in `pnpm og:shots`, after `pnpm build`. Screenshots every block and template preview from the
// built site into content/og-shots/, where their social cards frame them. Run it again when an item
// changes how it looks, and commit the images: the deploy build has no browser to take them.
//
//   pnpm og:shots                every block and template
//   pnpm og:shots --items=a,b    only these items

import { existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import path from 'node:path';
import { chromium, type Browser, type Page } from 'playwright';

import { OG_SHOTS_DIR, OG_SHOT_SIZE, needsOgShot, ogShotPath } from '@/lib/og-shots';
import { REGISTRY, entryEmbedHref, type RegistryEntryMeta } from '@/registry/hirael/registry-meta';

import { ROOT } from './shared.mts';

const OUT_DIR = path.join(ROOT, 'out');
const DESKTOP_WIDTH = 1280;
// A desktop-width layout, scaled down so it lands on the card at its frame size. The window is the frame's
// shape too, so pinned UI like a cookie banner is in view and full-height sections centre in it.
const SCALE = OG_SHOT_SIZE.width / DESKTOP_WIDTH;
const VIEWPORT = { width: DESKTOP_WIDTH, height: Math.round(OG_SHOT_SIZE.height / SCALE) };
const CONCURRENCY = 4;
const NAVIGATION_TIMEOUT_MS = 30_000;
const ANIMATION_TIMEOUT_MS = 6_000;
// Shader backdrops paint a few frames after load, and nothing signals when they have.
const SHADER_SETTLE_MS = 1_200;
const STILL_POLL_MS = 400;
// Videos and shaders never hold still, so the wait for a still frame gives up here.
const STILL_TIMEOUT_MS = 6_000;

const CONTENT_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.mp4': 'video/mp4',
  '.woff2': 'font/woff2',
};

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [key, value] = arg.replace(/^--/, '').split('=');

    return [key, value ?? 'true'];
  }),
);

// The export writes `/blocks/hero/hero-01.html` for the `/blocks/hero/hero-01` route.
const resolveFile = (pathname: string): string | null => {
  const base = path.join(OUT_DIR, decodeURIComponent(pathname));
  if (!base.startsWith(OUT_DIR)) return null;

  return (
    [base, `${base}.html`, path.join(base, 'index.html')].find((file) => existsSync(file) && statSync(file).isFile()) ??
    null
  );
};

const serveOut = () =>
  new Promise<Server>((resolve) => {
    const server = createServer((request, response) => {
      const file = resolveFile(new URL(request.url ?? '/', 'http://localhost').pathname);
      if (!file) {
        response.writeHead(404).end();

        return;
      }
      response.writeHead(200, { 'content-type': CONTENT_TYPES[path.extname(file)] ?? 'application/octet-stream' });
      response.end(readFileSync(file));
    });
    server.listen(0, () => resolve(server));
  });

const serverOrigin = (server: Server) => {
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('og:shots: the local server has no port');

  return `http://localhost:${address.port}`;
};

// Intros, counters and late images keep the page changing; it is ready once two frames in a row match.
const waitUntilStill = async (page: Page) => {
  let previous = await page.screenshot();
  for (let waited = 0; waited < STILL_TIMEOUT_MS; waited += STILL_POLL_MS) {
    await page.waitForTimeout(STILL_POLL_MS);
    const next = await page.screenshot();
    if (next.equals(previous)) return;
    previous = next;
  }
};

const capture = async (browser: Browser, origin: string, entry: RegistryEntryMeta) => {
  const page = await browser.newPage({ viewport: VIEWPORT, deviceScaleFactor: SCALE });
  try {
    await page.goto(`${origin}${entryEmbedHref(entry)}?static=1&fit=1&theme=dark`, {
      waitUntil: 'networkidle',
      timeout: NAVIGATION_TIMEOUT_MS,
    });
    await page.evaluate(async () => {
      await document.fonts.ready;
    });
    await page
      .waitForFunction(
        () =>
          document
            .getAnimations()
            .every(
              (animation) =>
                animation.playState !== 'running' || animation.effect?.getComputedTiming().endTime === Infinity,
            ),
        undefined,
        { timeout: ANIMATION_TIMEOUT_MS },
      )
      .catch(() => console.warn(`  ${entry.name}: an entrance is still running, captured anyway`));
    await page.waitForTimeout(SHADER_SETTLE_MS);
    // With fit=1 the page is only as tall as the block, so a small one centres instead of sitting on top.
    await page.evaluate(() => {
      const shell = document.querySelector('[data-embed-shell]');
      const gap = window.innerHeight - (shell?.getBoundingClientRect().height ?? window.innerHeight);
      if (gap > 0) document.body.style.paddingTop = `${gap / 2}px`;
    });
    await waitUntilStill(page);
    await page.screenshot({ path: ogShotPath(entry.name), type: 'jpeg', quality: 80, scale: 'device' });
  } finally {
    await page.close();
  }
};

const selectedEntries = () => {
  const entries = REGISTRY.filter(needsOgShot);
  if (!args.items) return entries;
  const names = args.items.split(',');

  return entries.filter((entry) => names.includes(entry.name));
};

if (!existsSync(OUT_DIR)) {
  console.error('og:shots reads the built site. Run `pnpm build` first.');
  process.exit(1);
}

const entries = selectedEntries();
mkdirSync(OG_SHOTS_DIR, { recursive: true });
const server = await serveOut();
const browser = await chromium.launch();

try {
  const origin = serverOrigin(server);
  for (let index = 0; index < entries.length; index += CONCURRENCY) {
    const batch = entries.slice(index, index + CONCURRENCY);
    await Promise.all(batch.map((entry) => capture(browser, origin, entry)));
    console.log(
      `  ${Math.min(index + CONCURRENCY, entries.length)}/${entries.length} ${batch.map((entry) => entry.name).join(', ')}`,
    );
  }
} finally {
  await browser.close();
  server.close();
}

console.log(`✓ ${entries.length} screenshot(s) in ${path.relative(ROOT, OG_SHOTS_DIR)}`);
