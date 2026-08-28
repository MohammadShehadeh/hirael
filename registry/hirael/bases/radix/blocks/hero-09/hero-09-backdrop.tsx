'use client';

import * as React from 'react';

/**
 * A WebGL fluid-noise gradient: two layers of simplex noise warp the UVs, then
 * five color stops are mixed across the warped field and dithered with grain.
 * The stops are derived from `--background`, `--primary` and `--accent-cool` at
 * runtime, so the wash follows the theme instead of freezing one palette.
 */

type Rgb = [number, number, number];
type Oklch = { l: number; c: number; h: number };

type Palette = {
  base: Rgb;
  wisp: Rgb;
  sky: Rgb;
  deep: Rgb;
  blue: Rgb;
};

// Share of the accent each stop carries; the remainder is `--background`. Dark
// canvases need more of it to lift off the background, light ones less before
// the copy stops reading.
const SHADES = {
  light: { wisp: 0.16, sky: 0.52, deep: 0.4, blue: 0.22 },
  dark: { wisp: 0.26, sky: 0.72, deep: 0.58, blue: 0.36 },
} as const;

let probe: CanvasRenderingContext2D | null | undefined;

const getProbe = () => {
  if (probe !== undefined) return probe;
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  probe = canvas.getContext('2d', { willReadFrequently: true });
  return probe;
};

/** Resolves any CSS color — oklch included — to sRGB, via a 1x1 canvas. */
const resolveCssColor = (value: string): Rgb | null => {
  const ctx = getProbe();
  if (!ctx) return null;
  // An unparseable value leaves fillStyle untouched, so seed a sentinel and
  // reject the color if it never moved off it.
  ctx.fillStyle = '#000000';
  ctx.fillStyle = value;
  if (ctx.fillStyle === '#000000' && value.trim() !== '#000000') return null;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  if (r === undefined || g === undefined || b === undefined) return null;
  return [r / 255, g / 255, b / 255];
};

const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toGamma = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

const srgbToOklch = ([r, g, b]: Rgb): Oklch => {
  const lr = toLinear(r);
  const lg = toLinear(g);
  const lb = toLinear(b);
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  const okL = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const okA = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const okB = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return { l: okL, c: Math.hypot(okA, okB), h: (Math.atan2(okB, okA) * 180) / Math.PI };
};

const oklchToLinearSrgb = ({ l: okL, c, h }: Oklch): Rgb => {
  const rad = (h * Math.PI) / 180;
  const okA = c * Math.cos(rad);
  const okB = c * Math.sin(rad);
  const l = (okL + 0.3963377774 * okA + 0.2158037573 * okB) ** 3;
  const m = (okL - 0.1055613458 * okA - 0.0638541728 * okB) ** 3;
  const s = (okL - 0.0894841775 * okA - 1.291485548 * okB) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
};

const inGamut = (rgb: Rgb) => rgb.every((c) => c >= -1e-4 && c <= 1 + 1e-4);

// Reduce chroma until the color fits sRGB, mirroring CSS Color 4 gamut mapping
// rather than clipping channels — clipping would shift the hue.
const oklchToSrgb = (color: Oklch): Rgb => {
  let lo = 0;
  let hi = color.c;
  if (inGamut(oklchToLinearSrgb(color))) lo = color.c;
  else {
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      if (inGamut(oklchToLinearSrgb({ ...color, c: mid }))) lo = mid;
      else hi = mid;
    }
  }
  return oklchToLinearSrgb({ ...color, c: lo }).map((c) =>
    Math.min(1, Math.max(0, toGamma(Math.min(1, Math.max(0, c))))),
  ) as Rgb;
};

/**
 * Mixes in Oklab, not Oklch. Interpolating hue would sweep a cream background
 * (h~91) round to the cool accent (h~260) *through green*; going rectangular
 * passes through near-neutral instead, which is what a wash of one color over
 * another actually looks like.
 */
const mixOklab = (a: Oklch, b: Oklch, t: number): Oklch => {
  const toAB = ({ c, h }: Oklch) => {
    const rad = (h * Math.PI) / 180;
    return [c * Math.cos(rad), c * Math.sin(rad)] as const;
  };
  const [aA, aB] = toAB(a);
  const [bA, bB] = toAB(b);
  const okA = aA + (bA - aA) * t;
  const okB = aB + (bB - aB) * t;
  return {
    l: a.l + (b.l - a.l) * t,
    c: Math.hypot(okA, okB),
    h: (Math.atan2(okB, okA) * 180) / Math.PI,
  };
};

/**
 * Reads the tokens off `<html>` and expands them into the five stops the shader
 * mixes: warm ones from `--primary`, cool ones from `--accent-cool`. Returns
 * null when the tokens can't be read, so the caller can leave the CSS wash
 * showing rather than paint something off-palette.
 */
const buildPalette = (): Palette | null => {
  const styles = getComputedStyle(document.documentElement);
  const backgroundRgb = resolveCssColor(styles.getPropertyValue('--background'));
  const primaryRgb = resolveCssColor(styles.getPropertyValue('--primary'));
  const coolRgb = resolveCssColor(styles.getPropertyValue('--accent-cool'));
  if (!backgroundRgb || !primaryRgb || !coolRgb) return null;

  const background = srgbToOklch(backgroundRgb);
  const primary = srgbToOklch(primaryRgb);
  const cool = srgbToOklch(coolRgb);
  // Lightness alone decides the theme, so this works under `.dark`, `.light`,
  // a media query, or a token override — no theme context needed.
  const shades = background.l < 0.5 ? SHADES.dark : SHADES.light;
  const shade = (accent: Oklch, amount: number) =>
    oklchToSrgb(mixOklab(background, accent, amount));

  return {
    base: backgroundRgb,
    wisp: shade(primary, shades.wisp),
    sky: shade(primary, shades.sky),
    deep: shade(cool, shades.deep),
    blue: shade(cool, shades.blue),
  };
};

const VERTEX_SHADER = 'attribute vec4 p;void main(){gl_Position=p;}';

const FRAGMENT_SHADER = `
  precision highp float;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_dark;
  uniform vec3 u_base;
  uniform vec3 u_wisp;
  uniform vec3 u_sky;
  uniform vec3 u_deep;
  uniform vec3 u_blue;
  vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
  vec2 mod289(vec2 x){return x-floor(x*(1./289.))*289.;}
  vec3 permute(vec3 x){return mod289(((x*34.)+1.)*x);}
  float snoise(vec2 v){
    const vec4 C=vec4(.211324865405187,.366025403784439,-.577350269189626,.024390243902439);
    vec2 i=floor(v+dot(v,C.yy));
    vec2 x0=v-i+dot(i,C.xx);
    vec2 i1=(x0.x>x0.y)?vec2(1.,0.):vec2(0.,1.);
    vec4 x12=x0.xyxy+C.xxzz;
    x12.xy-=i1;
    i=mod289(i);
    vec3 pv=permute(permute(i.y+vec3(0.,i1.y,1.))+i.x+vec3(0.,i1.x,1.));
    vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.);
    m=m*m;m=m*m;
    vec3 x=2.*fract(pv*C.www)-1.;
    vec3 h=abs(x)-.5;
    vec3 ox=floor(x+.5);
    vec3 a0=x-ox;
    m*=1.79284291400159-.85373472095314*(a0*a0+h*h);
    vec3 g;
    g.x=a0.x*x0.x+h.x*x0.y;
    g.yz=a0.yz*x12.xz+h.yz*x12.yw;
    return 130.*dot(m,g);
  }
  void main(){
    vec2 st=gl_FragCoord.xy/u_resolution.xy;
    vec2 asp=st; asp.x*=u_resolution.x/u_resolution.y;
    float t=u_time*0.12;
    vec2 uv=st;
    uv.x+=snoise(asp*1.5+vec2(t*.4,t*.3))*0.25;
    uv.y+=snoise(asp*1.995-vec2(t*.2,t*.5))*0.25;
    float n1=snoise(uv*1.2+vec2(t,0.))*.5+.5;
    float n2=snoise(uv*1.5-vec2(0.,t*.6))*.5+.5;
    float n3=snoise(uv*1.3+vec2(-t*.5,t*.3))*.5+.5;
    vec3 bg=mix(u_base,u_blue,clamp(uv.x+n1*.4,0.,1.));
    bg=mix(bg,u_sky,smoothstep(.2,.9,n2*(1.2-uv.x)*uv.y));
    bg=mix(bg,u_deep,smoothstep(.1,.8,n1*uv.x*(1.1-uv.y)));
    bg=mix(bg,u_wisp,smoothstep(.3,1.,n3*(1.-uv.y)*uv.x*1.5));
    float grain=fract(sin(dot(gl_FragCoord.xy+u_time*100.,vec2(12.9898,78.233)))*43758.5453123);
    gl_FragColor=vec4(bg+(grain-.5)*mix(0.015,0.04,u_dark),1.);
  }
`;

const compile = (gl: WebGLRenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
};

const Hero09Backdrop = ({ className }: { className?: string }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  // Bumped whenever the theme flips, to re-read the tokens and repaint.
  const [themeTick, setThemeTick] = React.useState(0);

  React.useEffect(() => {
    const observer = new MutationObserver(() => setThemeTick((tick) => tick + 1));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onMedia = () => setThemeTick((tick) => tick + 1);
    media.addEventListener('change', onMedia);

    return () => {
      observer.disconnect();
      media.removeEventListener('change', onMedia);
    };
  }, []);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl');
    if (!gl) return;

    const program = gl.createProgram();
    const vertexShader = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!program || !vertexShader || !fragmentShader) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1, -1, -1, -1, 1, 1, -1, 1]), gl.STATIC_DRAW);

    const position = gl.getAttribLocation(program, 'p');
    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const start = Date.now();

    // A still frame is the whole effect under reduced motion: the wash is the
    // point, the drift is the flourish.
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let frame = 0;
    let running = false;
    let ready = false;
    // Start optimistically on-screen so the hero paints at load; the observer's
    // first callback pauses it a frame later if it isn't.
    let onScreen = true;

    const draw = () => {
      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(position);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, still ? 0 : (Date.now() - start) / 1000);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (running && !still) frame = requestAnimationFrame(draw);
    };

    // Paint only while on-screen and the tab is visible — an off-screen sky
    // costs nothing, and the CSS wash underneath covers the gap.
    const play = () => {
      if (running || !ready || !onScreen || document.hidden) return;
      running = true;
      frame = requestAnimationFrame(draw);
    };
    const pause = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    // Read the tokens on the next frame, not now: a theme toggle flips the class
    // in its own effect, and parent effects run after child ones — reading here
    // would sample the theme we're leaving.
    const paletteFrame = requestAnimationFrame(() => {
      const palette = buildPalette();
      // Without tokens there is nothing on-palette to paint; leave the CSS wash
      // showing rather than an off-theme gradient.
      if (!palette) return;

      // Fixed for the life of the effect — a theme change re-runs it — so these
      // upload once instead of every frame.
      gl.useProgram(program);
      gl.uniform3fv(gl.getUniformLocation(program, 'u_base'), palette.base);
      gl.uniform3fv(gl.getUniformLocation(program, 'u_wisp'), palette.wisp);
      gl.uniform3fv(gl.getUniformLocation(program, 'u_sky'), palette.sky);
      gl.uniform3fv(gl.getUniformLocation(program, 'u_deep'), palette.deep);
      gl.uniform3fv(gl.getUniformLocation(program, 'u_blue'), palette.blue);
      gl.uniform1f(gl.getUniformLocation(program, 'u_dark'), srgbToOklch(palette.base).l < 0.5 ? 1 : 0);
      ready = true;
      play();
    });

    const observer = new IntersectionObserver(
      (entries) => {
        onScreen = entries[0]?.isIntersecting ?? false;
        if (onScreen) play();
        else pause();
      },
      // Pre-roll a little before it scrolls in, so it is already painting.
      { rootMargin: '200px' },
    );
    observer.observe(canvas);

    const onVisibility = () => (document.hidden ? pause() : play());
    document.addEventListener('visibilitychange', onVisibility);

    // A resize changes the canvas backing store, which clears it — repaint once
    // even when the loop is parked on a still frame.
    const onResize = () => {
      if (ready && still) draw();
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(paletteFrame);
      pause();
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', onResize);
    };
  }, [themeTick]);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
};

export default Hero09Backdrop;
