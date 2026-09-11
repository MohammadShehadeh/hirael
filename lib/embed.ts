/**
 * Runs before first paint so `dir`, `data-framed`, `data-static` and `data-fit` are on `<html>` ahead of hydration.
 * `data-framed` hides the auth demo notice Google Safe Browsing requires on direct visits; `data-static` marks
 * gallery thumbnails, which never scroll, so globals.css shows reveals' final frame.
 */
export const embedDirScript = (): string => {
  return `(()=>{try{var p=new URLSearchParams(location.search);var d=p.get('dir');document.documentElement.dir=d==='rtl'?'rtl':'ltr';if(window.self!==window.top)document.documentElement.setAttribute('data-framed','');if(p.get('static')==='1')document.documentElement.setAttribute('data-static','');if(p.get('fit')==='1')document.documentElement.setAttribute('data-fit','');}catch(e){}})();`;
};
