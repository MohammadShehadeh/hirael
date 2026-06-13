/**
 * Inline, pre-paint script for the framed `/embed/*` routes.
 *
 * The embed previews are loaded in an iframe whose `src` carries the
 * reading direction as a `?dir=rtl` query param. Reacting to that param
 * in a client effect flips the layout *after* the first paint, which
 * reads as a flash. Running this synchronously in the document head sets
 * `<html dir>` before anything paints, so RTL previews come up correct on
 * the first frame — the same trick the theme uses in `lib/theme.ts`.
 */
export function embedDirScript(): string {
  return `(()=>{try{var d=new URLSearchParams(location.search).get('dir');document.documentElement.dir=d==='rtl'?'rtl':'ltr';}catch(e){}})();`
}
