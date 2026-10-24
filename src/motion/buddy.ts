import { $, $$, clamp, lerp, type Env, type Shared } from "./kit";

type Hop = { t0: number; dur: number; fx: number; fy: number; fs: number; side: number; drop?: false } | { t0: number; dur: number; fx: number; fy: number; drop: true; hit: number };

const easeIO = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
function bounceOut(t: number) {
  const n = 7.5625, d = 2.75;
  if (t < 1 / d) return n * t * t;
  if (t < 2 / d) { t -= 1.5 / d; return n * t * t + 0.75; }
  if (t < 2.5 / d) { t -= 2.25 / d; return n * t * t + 0.9375; }
  t -= 2.625 / d;
  return n * t * t + 0.984375;
}
// Impact times of bounceOut, and how hard each one ripples the grid.
const HITS = [0.3636, 0.7273, 0.9091, 1], HIT_AMP = [1, 0.55, 0.3, 0.16];

export function initBuddy(env: Env, shared: Shared) {
  const el = $("#buddy");
  const anch = $$("[data-buddy]");
  const contact = $("#contact");
  const cIdx = anch.indexOf($("#contact [data-buddy]"));
  const gates: Record<string, () => boolean> = { mf: () => shared.mfProgress > 0.9 };
  let cur = -1, hop: Hop | null = null, x = 0, y = 0, s = 40, k = 0, kv = 0, px = 0, py = 0, rot = 0, lastT = 0, started = false, raf = 0;

  function cen(a: Element) {
    const r = a.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, s: Math.max(r.width, 8) };
  }
  function want() {
    const vh = innerHeight;
    let w = 0;
    for (let i = 0; i < anch.length; i++) {
      const g = anch[i].getAttribute("data-gate");
      if (g && !gates[g]()) continue;
      if (anch[i].getBoundingClientRect().top < vh * 0.8) w = i;
      else break;
    }
    return w;
  }
  function landed() {
    if (cur === cIdx) {
      const cr = contact.getBoundingClientRect();
      contact.style.setProperty("--fx", x - cr.left + "px");
      contact.style.setProperty("--fy", y - cr.top + "px");
      contact.classList.add("filled");
      document.body.classList.add("inv");
    } else if (cur === 0) shared.ripple(x, y, 0.9);
  }
  function go(w: number, now: number) {
    if (cur === cIdx && w !== cIdx) {
      contact.classList.remove("filled");
      document.body.classList.remove("inv");
    }
    const prev = cur;
    cur = w;
    if (prev < 0 || env.reduce) {
      const t = cen(anch[cur]);
      x = t.x; y = t.y; s = t.s; hop = null; px = x; py = y;
      return;
    }
    const fx = clamp(x, -60, innerWidth + 60), fy = clamp(y, -70, innerHeight + 70), t2 = cen(anch[w]);
    const len = Math.hypot(t2.x - fx, t2.y - fy);
    hop = { t0: now, dur: clamp(0.85 + len / 3400, 0.9, 1.35) * 1000, fx, fy, fs: s, side: w % 2 ? 1 : -1 };
  }
  function frame(now: number) {
    const dt = Math.min(0.05, (now - lastT) / 1000 || 0.016);
    lastT = now;
    if (started) {
      const w = want();
      if (w !== cur && (hop === null || !hop.drop || w > 0)) go(w, now);
      // Anchors are re-measured every frame, so layout shifts never strand the ball.
      const t = cen(anch[cur]);
      let nx = t.x, ny = t.y, ns = t.s;
      if (hop) {
        const p = clamp((now - hop.t0) / hop.dur, 0, 1);
        if (hop.drop) {
          ny = lerp(hop.fy, t.y, bounceOut(p));
          while (hop.hit < 4 && p >= HITS[hop.hit]) { shared.ripple(nx, t.y, HIT_AMP[hop.hit]); hop.hit++; }
        } else {
          const e = easeIO(p), dx = t.x - hop.fx, dy = t.y - hop.fy, len = Math.hypot(dx, dy) || 1;
          const arc = Math.sin(Math.PI * e) * Math.min(150, len * 0.2) * hop.side;
          nx = lerp(hop.fx, t.x, e) + (-dy / len) * arc;
          ny = lerp(hop.fy, t.y, e) + (dx / len) * arc;
          ns = lerp(hop.fs, t.s, e);
        }
        if (p >= 1) { hop = null; x = nx; y = ny; landed(); }
      }
      const rx = nx - t.x, ry = ny - t.y, vx = (rx - px) / dt, vy = (ry - py) / dt;
      px = rx; py = ry; x = nx; y = ny; s = ns;
      const sp = Math.hypot(vx, vy), kt = clamp(sp / 2600, 0, 0.8);
      kv += ((kt - k) * 230 - kv * 15) * dt;
      k = clamp(k + kv * dt, -0.7, 0.9);
      if (sp > 140) rot = Math.atan2(vy, vx);
      shared.bud.x = x; shared.bud.y = y; shared.bud.sp = sp;
      el.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) rotate(${rot.toFixed(3)}rad) scale(${((s / 100) * (1 + k)).toFixed(4)},${((s / 100) * (1 - k * 0.62)).toFixed(4)})`;
    }
    raf = requestAnimationFrame(frame);
  }
  function start() {
    if (started || env.dead) return;
    started = true;
    el.style.opacity = "1";
    const w = want(), t = cen(anch[w]);
    cur = w;
    if (w === 0 && scrollY < 40 && !env.reduce) {
      x = t.x; y = -120; s = t.s; px = 0; py = -120 - t.y;
      hop = { drop: true, t0: performance.now(), dur: 1750, fx: t.x, fy: -120, hit: 0 };
    } else {
      x = t.x; y = t.y; s = t.s; px = 0; py = 0;
      if (cur === cIdx) landed();
    }
  }
  raf = requestAnimationFrame(frame);
  env.defer(() => {
    cancelAnimationFrame(raf);
    el.style.opacity = "";
    contact.classList.remove("filled");
    document.body.classList.remove("inv");
  });
  return { start };
}
