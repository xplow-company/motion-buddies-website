import { $, clamp, lerp, type Env, type Shared } from "./kit";

type Ripple = { x: number; y: number; t: number; a: number };

export function initGrid(env: Env, shared: Shared) {
  const hero = $("#top");
  const cv = $<HTMLCanvasElement>("#grid");
  const cx = cv.getContext("2d")!;
  const dpr = Math.min(devicePixelRatio || 1, 2);
  let W = 0, H = 0, pts: [number, number][] = [], rip: Ripple[] = [];
  let mx = -999, my = -999, smx = -999, smy = -999, vis = true, raf = 0;

  function size() {
    const r = hero.getBoundingClientRect();
    W = r.width;
    H = r.height;
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const gap = W < 700 ? 30 : 36;
    const cols = Math.ceil(W / gap) + 1, rows = Math.ceil(H / gap) + 1;
    const ox = (W - (cols - 1) * gap) / 2, oy = (H - (rows - 1) * gap) / 2;
    pts = [];
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) pts.push([ox + i * gap, oy + j * gap]);
  }

  function draw(now: number) {
    cx.clearRect(0, 0, W, H);
    if (mx < -900) { smx = -999; smy = -999; }
    else if (smx < -900) { smx = mx; smy = my; }
    else { smx = lerp(smx, mx, 0.2); smy = lerp(smy, my, 0.2); }
    const hr = hero.getBoundingClientRect();
    const { bud } = shared;
    const bx = bud.x - hr.left, by = bud.y - hr.top, bOn = bud.x > -900 && by < H + 120 && by > -160;
    rip = rip.filter((r) => (now - r.t) / 1000 < 2.6);
    const live = rip.map((r) => [r.x, r.y, (now - r.t) / 1000, r.a]);
    for (let i = 0; i < pts.length; i++) {
      const px = pts[i][0], py = pts[i][1];
      let dx = 0, dy = 0, f = 0, d: number, q: number, ux: number, uy: number;
      if (smx > -900) {
        ux = px - smx; uy = py - smy; d = Math.sqrt(ux * ux + uy * uy);
        if (d < 150) { q = 1 - d / 150; q *= q; dx += (ux / (d || 1)) * q * 15; dy += (uy / (d || 1)) * q * 15; f += q * 0.9; }
      }
      if (bOn) {
        ux = px - bx; uy = py - by; d = Math.sqrt(ux * ux + uy * uy);
        if (d < 120) { q = 1 - d / 120; q *= q; const st = 16 + Math.min(bud.sp, 3000) * 0.012; dx += (ux / (d || 1)) * q * st; dy += (uy / (d || 1)) * q * st; f += q * 0.8; }
      }
      for (const rp of live) {
        ux = px - rp[0]; uy = py - rp[1]; d = Math.sqrt(ux * ux + uy * uy);
        const R = rp[2] * 620, u = (d - R) / 80;
        if (u > -1 && u < 1) {
          let e = Math.cos(u * 1.5708);
          e = e * e * rp[3] * Math.exp(-rp[2] * 1.4);
          dx += (ux / (d || 1)) * e * 22; dy += (uy / (d || 1)) * e * 22; f += e * 1.15;
        }
      }
      const s = 0.5 + 0.5 * Math.sin(now * 0.0008 + px * 0.009 + py * 0.012);
      if (f > 1.5) f = 1.5;
      const r = 1.25 + f * 1.6, al = 0.2 + 0.08 * s + f * 0.6, cl = clamp(f * 0.7, 0, 1);
      cx.fillStyle = `rgba(${Math.round(239 + 16 * cl)},${Math.round(237 - 162 * cl)},${Math.round(232 - 201 * cl)},${Math.min(al, 0.95).toFixed(3)})`;
      cx.beginPath();
      cx.arc(px + dx, py + dy, r, 0, 6.2832);
      cx.fill();
    }
  }

  function loop(now: number) {
    draw(now);
    if (vis && !env.reduce) raf = requestAnimationFrame(loop);
  }

  size();
  env.on(window, "resize", () => { size(); if (env.reduce) draw(performance.now()); });
  env.on(hero, "pointermove", (e: PointerEvent) => { const r = hero.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; }, { passive: true });
  env.on(hero, "pointerleave", () => { mx = my = -999; });
  shared.ripple = (x, y, a) => {
    if (!vis) return;
    const r = hero.getBoundingClientRect();
    rip.push({ x: x - r.left, y: y - r.top, t: performance.now(), a });
    if (rip.length > 7) rip.shift();
  };
  env.watch(hero, (v) => {
    vis = v;
    if (v && !env.reduce) { cancelAnimationFrame(raf); raf = requestAnimationFrame(loop); }
  });
  if (env.reduce) draw(0);
  else raf = requestAnimationFrame(loop);
  env.defer(() => cancelAnimationFrame(raf));
}
