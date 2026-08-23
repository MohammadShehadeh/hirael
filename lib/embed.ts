/**
 * Inline pre-paint script for framed `/embed/*` routes. Sets three things on
 * `<html>` before first paint, avoiding a post-hydration flash:
 * - `dir` from `?dir=rtl`, so RTL previews are correct on frame one.
 * - `data-framed` when inside an iframe — standalone-only UI (the auth
 *   demo-credentials notice Safe Browsing needs) hides under it.
 * - `data-static` from `?static=1` on gallery thumbnails — globals.css keys
 *   off it to show reveals' final frame (the non-scrolling preview never
 *   triggers `whileInView`) and to fit the card to content.
 * - `data-fit` from `?fit=1` on the detail-page viewer — drops the shell's
 *   viewport min-height (keeping animations live) so the iframe can size
 *   itself to the block's natural height.
 */
export function embedDirScript(): string {
  return `(()=>{try{var p=new URLSearchParams(location.search);var d=p.get('dir');document.documentElement.dir=d==='rtl'?'rtl':'ltr';if(window.self!==window.top)document.documentElement.setAttribute('data-framed','');if(p.get('static')==='1')document.documentElement.setAttribute('data-static','');if(p.get('fit')==='1')document.documentElement.setAttribute('data-fit','');}catch(e){}})();`;
}
