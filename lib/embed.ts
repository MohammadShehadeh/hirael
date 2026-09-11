/**
 * Runs before first paint so `dir`, `theme`, `data-framed`, `data-static` and `data-fit` are on `<html>` ahead of hydration.
 * `data-framed` hides the auth demo notice Google Safe Browsing requires on direct visits; `data-static` marks
 * gallery thumbnails, which never scroll, so globals.css shows reveals' final frame. `theme` is a preview-only
 * light/dark lock so the block viewer can flip an iframe without writing the site theme.
 */
export const embedDirScript = (): string => {
  return `(()=>{try{var p=new URLSearchParams(location.search);var d=p.get('dir');document.documentElement.dir=d==='rtl'?'rtl':'ltr';var t=p.get('theme');if(t==='light'||t==='dark'){document.documentElement.classList.remove('light','dark');document.documentElement.classList.add(t);document.documentElement.style.colorScheme=t;}if(window.self!==window.top)document.documentElement.setAttribute('data-framed','');if(p.get('static')==='1')document.documentElement.setAttribute('data-static','');if(p.get('fit')==='1')document.documentElement.setAttribute('data-fit','');}catch(e){}})();`;
};
