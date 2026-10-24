export const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector(s) as T;
export const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll(s)) as T[];
export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const pad = (n: number) => (n < 10 ? "0" + n : "" + n);

export type Shared = {
  bud: { x: number; y: number; sp: number };
  mfProgress: number;
  ripple: (x: number, y: number, a: number) => void;
};

export type Env = ReturnType<typeof createEnv>;

// Owns every listener, observer and frame loop so the page can unmount cleanly.
export function createEnv() {
  const cleanups: (() => void)[] = [];
  const env = {
    dead: false,
    reduce: matchMedia("(prefers-reduced-motion: reduce)").matches,
    fine: matchMedia("(hover:hover) and (pointer:fine)").matches,
    defer(fn: () => void) {
      cleanups.push(fn);
    },
    on(t: EventTarget, type: string, fn: (e: never) => void, opts?: AddEventListenerOptions) {
      t.addEventListener(type, fn as EventListener, opts);
      cleanups.push(() => t.removeEventListener(type, fn as EventListener, opts));
    },
    watch(el: Element, cb: (visible: boolean) => void, margin = "0px") {
      const io = new IntersectionObserver((e) => cb(e[0].isIntersecting), { rootMargin: margin });
      io.observe(el);
      cleanups.push(() => io.disconnect());
    },
    dispose() {
      env.dead = true;
      cleanups.reverse().forEach((f) => f());
    },
  };
  return env;
}
