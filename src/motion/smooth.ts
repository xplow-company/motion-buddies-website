import { gsap } from "gsap";
import Lenis from "lenis";
import type { Env } from "./kit";

// Wheel and trackpad get eased scrolling; touch keeps native momentum and reduced motion stays native.
export function initSmoothScroll(env: Env) {
  if (env.reduce) return;
  const lenis = new Lenis({ autoRaf: false, anchors: true, lerp: 0.1 });
  const tick = (t: number) => lenis.raf(t * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  env.defer(() => {
    gsap.ticker.remove(tick);
    lenis.destroy();
  });
}
