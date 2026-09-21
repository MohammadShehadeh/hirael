/**
 * Applies direction, theme, and preview flags before the page paints.
 * A framed visit hides the login notice. A static visit shows motion at its end state.
 * Theme here only affects this preview.
 */
export const embedDirScript = (): string => {
  return `(()=>{try{var p=new URLSearchParams(location.search);var d=p.get('dir');document.documentElement.dir=d==='rtl'?'rtl':'ltr';var t=p.get('theme');if(t==='light'||t==='dark'){document.documentElement.classList.remove('light','dark');document.documentElement.classList.add(t);document.documentElement.style.colorScheme=t;}if(window.self!==window.top)document.documentElement.setAttribute('data-framed','');if(p.get('static')==='1')document.documentElement.setAttribute('data-static','');if(p.get('fit')==='1')document.documentElement.setAttribute('data-fit','');}catch(e){}})();`;
};
