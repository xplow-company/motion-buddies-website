import { gsap } from "gsap";
import { $, lerp, type Env } from "./kit";

type Ctx = CanvasRenderingContext2D;
type Pt = [number, number];
type Sc = { cv: HTMLCanvasElement; ctx: Ctx; w: number; h: number; d: number; refit: () => void };
type Scene = { k: string; c: HTMLElement; G: HTMLElement; init: () => void; tl: gsap.core.Timeline; draw: (t: number) => void; played: boolean; playing: boolean; vis: boolean; near: boolean };

const INK = "#0A0A0B", AC = "#FF4B1F", BONE = "#ECE9E1", WHT = "#F3F1EC";
const cl = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const E = {
  io: (t: number) => { t = cl(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; },
  o3: (t: number) => 1 - Math.pow(1 - cl(t), 3),
  o5: (t: number) => 1 - Math.pow(1 - cl(t), 5),
  back: (t: number) => { t = cl(t); const c = 1.3; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); },
};
const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const TAU = 6.283;

function rr(c: Ctx, x: number, y: number, w: number, h: number, r: number) {
  r = Math.min(r, w / 2, h / 2);
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}

export function initHowWeWork(env: Env) {
  const sec = $("#method");
  // next/font hashes the family name, so canvas text has to use the resolved one.
  const fam = getComputedStyle(document.documentElement).getPropertyValue("--font-instrument").trim();
  const FONT = `${fam}, ui-sans-serif, system-ui, sans-serif`;
  const LOGO = new Path2D($("#mb path").getAttribute("d")!);
  const S: Record<string, Scene> = {};
  const fontsReady: (() => void)[] = [];
  let last = performance.now();

  const logo = (c: Ctx, x: number, y: number, w: number, col: string) => {
    c.save(); c.translate(x, y); c.scale(w / 598, w / 598); c.fillStyle = col; c.fill(LOGO); c.restore();
  };
  const font = (c: Ctx, size: number, w = 600) => {
    c.font = `${w} ${size}px ${FONT}`;
    c.letterSpacing = (size > 20 ? -size * 0.03 : -0.1).toFixed(2) + "px";
  };
  function mkCanvas(card: HTMLElement, onfit: () => void): Sc {
    const vis = $(".vis", card), cv = document.createElement("canvas");
    vis.replaceChildren(cv);
    const o: Sc = { cv, ctx: cv.getContext("2d")!, w: 0, h: 0, d: 0, refit: () => { o.w = 0; fit(); } };
    function fit() {
      const r = vis.getBoundingClientRect();
      if (!r.width) return;
      const d = Math.min(2, devicePixelRatio || 1);
      if (Math.abs(r.width - o.w) < 0.5 && Math.abs(r.height - o.h) < 0.5 && o.d === d) return;
      o.d = d; o.w = r.width; o.h = r.height;
      cv.width = Math.round(o.w * d); cv.height = Math.round(o.h * d);
      cv.style.width = o.w + "px"; cv.style.height = o.h + "px";
      o.ctx.setTransform(d, 0, 0, d, 0, 0);
      onfit();
    }
    const ro = new ResizeObserver(fit);
    ro.observe(vis);
    env.defer(() => { ro.disconnect(); cv.remove(); });
    queueMicrotask(fit);
    return o;
  }
  function reg(k: string, init: () => void, tl: gsap.core.Timeline, draw: (t: number) => void) {
    const c = $(`[data-k=${k}]`, sec);
    S[k] = { k, c, G: $(".vis", c), init, tl, draw, played: false, playing: false, vis: false, near: false };
    init();
    tl.eventCallback("onComplete", () => { S[k].playing = false; last = performance.now(); });
  }

  /* 1 story: a swarm of noise settles into one clear line */
  (() => {
    type P = { cx: number; cy: number; rx: number; ry: number; sp: number; ph: number; d: number; t: Pt | null; r: number };
    const st = { m: 0, o: 0 }, per = { x: 0, y: 0, r: 6 };
    let ps: P[] = [], orb = { cx: 0, cy: 0, rx: 0, ry: 0, sp: 0.42, ph: 0.6 };
    function layout() {
      const w = sc.w, h = sc.h;
      const two = w < 560, fs = two ? Math.min(w * 0.115, h * 0.2) : Math.min(w * 0.074, h * 0.27);
      const lines = two ? ["Your product,", "in one line"] : ["Your product, in one line"];
      const oc = document.createElement("canvas");
      oc.width = Math.ceil(w); oc.height = Math.ceil(h);
      const o = oc.getContext("2d", { willReadFrequently: true })!;
      font(o, fs, 600); o.textAlign = "center"; o.fillStyle = "#000";
      const lh = fs * 1.04, y0 = h * 0.5 - (lines.length * lh) / 2 + fs * 0.76;
      lines.forEach((l, i) => o.fillText(l, w / 2, y0 + i * lh));
      const lw = o.measureText(lines[lines.length - 1]).width;
      per.r = fs * 0.105; per.x = w / 2 + lw / 2 + fs * 0.2; per.y = y0 + (lines.length - 1) * lh - per.r * 1.02;
      const data = o.getImageData(0, 0, oc.width, oc.height).data, step = Math.max(2.2, fs / 24), T: Pt[] = [];
      for (let y = 0; y < oc.height; y += step) for (let x = 0; x < oc.width; x += step) if (data[((y | 0) * oc.width + (x | 0)) * 4 + 3] > 140) T.push([x, y]);
      for (let i = T.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [T[i], T[j]] = [T[j], T[i]]; }
      ps = [];
      const n = T.length + Math.round(T.length * 0.3);
      for (let i = 0; i < n; i++) ps.push({ cx: rnd(-30, w + 30), cy: rnd(-10, h + 10), rx: rnd(18, 120), ry: rnd(10, 64), sp: rnd(0.1, 0.32) * (Math.random() < 0.5 ? -1 : 1), ph: rnd(0, TAU), d: Math.random(), t: T[i] || null, r: T[i] ? Math.max(0.85, step * 0.34) : rnd(0.45, 0.85) });
      orb = { cx: w * 0.28, cy: h * 0.5, rx: w * 0.16, ry: h * 0.24, sp: 0.42, ph: 0.6 };
    }
    const sc = mkCanvas($("[data-k=story]", sec), layout), ctx = sc.ctx;
    fontsReady.push(sc.refit);
    function draw(t: number) {
      const w = sc.w, h = sc.h;
      ctx.clearRect(0, 0, w, h);
      if (!ps.length) return;
      const m = st.m, A = new Path2D(), B = new Path2D(), D = new Path2D();
      for (const p of ps) {
        const ox = p.cx + p.rx * Math.cos(p.ph + t * p.sp), oy = p.cy + p.ry * Math.sin(p.ph * 1.3 + t * p.sp * 1.27), r = p.r;
        if (p.t) {
          const k = E.io(m * 1.7 - p.d * 0.7), tx = p.t[0] + Math.sin(t * 1.1 + p.ph) * 0.32, ty = p.t[1] + Math.cos(t * 0.9 + p.ph) * 0.32;
          const x = lerp(ox, tx, k), y = lerp(oy, ty, k);
          (k > 0.995 ? A : B).rect(x - r, y - r, r * 2, r * 2);
        } else D.rect(ox - r, oy - r, r * 2, r * 2);
      }
      ctx.fillStyle = `rgba(236,233,225,${(0.32 * (1 - m * 0.55)).toFixed(3)})`; ctx.fill(D);
      ctx.fillStyle = "rgba(236,233,225,.5)"; ctx.fill(B);
      ctx.fillStyle = "rgba(243,241,236,.96)"; ctx.fill(A);
      const k = E.io(st.o), ox = orb.cx + orb.rx * Math.cos(orb.ph + t * orb.sp), oy = orb.cy + orb.ry * Math.sin(orb.ph * 1.4 + t * orb.sp * 1.2);
      const x = lerp(ox, per.x, k), y = lerp(oy, per.y, k), R = lerp(3.4, per.r, k);
      const gl = ctx.createRadialGradient(x, y, 0, x, y, R * 5);
      gl.addColorStop(0, "rgba(255,75,31,.35)"); gl.addColorStop(1, "rgba(255,75,31,0)");
      ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(x, y, R * 5, 0, TAU); ctx.fill();
      ctx.fillStyle = AC; ctx.beginPath(); ctx.arc(x, y, R, 0, TAU); ctx.fill();
    }
    const tl = gsap.timeline({ paused: true });
    tl.to(st, { m: 1, duration: 3, ease: "none" }, 0.5).to(st, { o: 1, duration: 1.4, ease: "none" }, 2.6).to({}, { duration: 0.5 });
    reg("story", () => { st.m = 0; st.o = 0; }, tl, draw);
  })();

  /* 2 sign-off: storyboard frames on top, finished frames below, each released once approved */
  (() => {
    type Stroke = Pt[] & { len?: number };
    const st = { d: 0, c0: 0, c1: 0, c2: 0 }, L = { fw: 0, fh: 0, g: 0, x0: 0, ytop: 0, ybot: 0, ny: 0 };
    let SK: Stroke[][] = [];
    const seed = (n: number) => () => { n = (n * 16807) % 2147483647; return (n - 1) / 2147483646; };
    function layout() {
      const w = sc.w, h = sc.h, g = Math.max(10, w * 0.03), lab = 24, mid = 48;
      let fw = (w * 0.88 - g * 2) / 3, fh = (fw * 9) / 16;
      if (lab + fh + mid + lab + fh > h - 24) { fh = (h - 24 - lab * 2 - mid) / 2; fw = (fh * 16) / 9; }
      L.fw = fw; L.fh = fh; L.g = g; L.x0 = (w - (fw * 3 + g * 2)) / 2;
      L.ytop = (h - (lab * 2 + fh * 2 + mid)) / 2 + lab; L.ybot = L.ytop + fh + mid + lab; L.ny = L.ytop + fh + mid / 2;
      const R = seed(11), j = (s: number) => (R() - 0.5) * s;
      SK = [];
      for (let c = 0; c < 3; c++) {
        const x = L.x0 + c * (fw + g), y = L.ytop;
        const P = (u: number, v: number): Pt => [x + u * fw + j(1), y + v * fh + j(1)];
        const seg = (a: Pt, b: Pt): Stroke => { const pts: Stroke = []; for (let i = 0; i <= 8; i++) { const t = i / 8; pts.push([lerp(a[0], b[0], t) + j(0.7), lerp(a[1], b[1], t) + j(0.7)]); } return pts; };
        const rect = (a: Pt, b: Pt, cc: Pt, d: Pt): Stroke => seg(a, b).concat(seg(b, cc).slice(1), seg(cc, d).slice(1), seg(d, a).slice(1));
        const strokes: Stroke[] = [];
        if (c === 0) strokes.push(rect(P(0.32, 0.26), P(0.68, 0.26), P(0.68, 0.74), P(0.32, 0.74)), seg(P(0.32, 0.26), P(0.68, 0.74)), seg(P(0.68, 0.26), P(0.32, 0.74)));
        if (c === 1) strokes.push(rect(P(0.2, 0.2), P(0.8, 0.2), P(0.8, 0.8), P(0.2, 0.8)), [P(0.28, 0.68), P(0.42, 0.55), P(0.53, 0.61), P(0.72, 0.36)]);
        if (c === 2) {
          const cc = P(0.3, 0.47), r = fh * 0.15, pts: Stroke = [];
          for (let i = 0; i <= 30; i++) { const a = -1.6 + (i / 30) * TAU * 1.07; pts.push([cc[0] + Math.cos(a) * (r + j(1)), cc[1] + Math.sin(a) * (r + j(1))]); }
          strokes.push(pts, seg(P(0.54, 0.42), P(0.84, 0.42)), seg(P(0.54, 0.58), P(0.74, 0.58)), seg(P(0.12, 0.3), P(0.06, 0.3)), seg(P(0.12, 0.47), P(0.04, 0.47)));
        }
        strokes.forEach((k) => { let len = 0; for (let i = 1; i < k.length; i++) len += Math.hypot(k[i][0] - k[i - 1][0], k[i][1] - k[i - 1][1]); k.len = len; });
        SK.push(strokes);
      }
    }
    const sc = mkCanvas($("[data-k=approve]", sec), layout), ctx = sc.ctx;
    function stroke(k: Stroke, f: number) {
      if (f <= 0) return;
      const lim = k.len! * cl(f);
      let acc = 0;
      ctx.beginPath(); ctx.moveTo(k[0][0], k[0][1]);
      for (let i = 1; i < k.length; i++) {
        const a = k[i - 1], b = k[i], s = Math.hypot(b[0] - a[0], b[1] - a[1]);
        if (acc + s > lim) { const t = (lim - acc) / s; ctx.lineTo(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t); break; }
        ctx.lineTo(b[0], b[1]); acc += s;
      }
      ctx.stroke();
    }
    function finalFrame(c: number, x: number, y: number, w: number, h: number, t: number) {
      ctx.save(); rr(ctx, x, y, w, h, 8); ctx.fillStyle = INK; ctx.fill(); ctx.clip();
      if (c === 0) { const lw = w * 0.42; logo(ctx, x + (w - lw) / 2, y + (h - (lw * 355) / 598) / 2, lw, WHT); }
      if (c === 1) {
        rr(ctx, x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6, 5); ctx.fillStyle = "#fff"; ctx.fill();
        ctx.strokeStyle = AC; ctx.lineWidth = 2.2; ctx.lineCap = "round"; ctx.lineJoin = "round";
        ctx.beginPath(); ctx.moveTo(x + w * 0.28, y + h * 0.68); ctx.lineTo(x + w * 0.42, y + h * 0.55); ctx.lineTo(x + w * 0.53, y + h * 0.61); ctx.lineTo(x + w * 0.72, y + h * 0.36); ctx.stroke();
      }
      if (c === 2) {
        const by = y + h * 0.47 + Math.sin(t * 1.6) * h * 0.035, r = h * 0.15;
        const gl = ctx.createRadialGradient(x + w * 0.3, by, 0, x + w * 0.3, by, r * 3);
        gl.addColorStop(0, "rgba(255,75,31,.35)"); gl.addColorStop(1, "rgba(255,75,31,0)");
        ctx.fillStyle = gl; ctx.fillRect(x, y, w, h);
        ctx.fillStyle = AC; ctx.beginPath(); ctx.arc(x + w * 0.3, by, r, 0, TAU); ctx.fill();
        const bh = Math.max(3, h * 0.08);
        ctx.fillStyle = WHT; rr(ctx, x + w * 0.54, y + h * 0.38, w * 0.3, bh, bh / 2); ctx.fill();
        ctx.globalAlpha = 0.5; rr(ctx, x + w * 0.54, y + h * 0.55, w * 0.2, bh, bh / 2); ctx.fill();
      }
      ctx.restore();
    }
    function draw(t: number) {
      const w = sc.w, h = sc.h, fw = L.fw, fh = L.fh, g = L.g;
      ctx.clearRect(0, 0, w, h);
      font(ctx, 12.5, 600); ctx.fillStyle = "#8A857B";
      ctx.globalAlpha = E.o3(st.d * 3); ctx.fillText("Storyboard", L.x0, L.ytop - 9);
      ctx.globalAlpha = E.o3(Math.max(st.c0, st.c1, st.c2) * 3); ctx.fillText("Final film", L.x0, L.ybot - 9);
      ctx.globalAlpha = 1;
      for (let c = 0; c < 3; c++) {
        const x = L.x0 + c * (fw + g), ck = [st.c0, st.c1, st.c2][c], dk = st.d * 3 - c * 0.6;
        const pk = E.o3(dk * 2);
        ctx.save(); ctx.globalAlpha = pk;
        ctx.shadowColor = "rgba(70,52,24,.12)"; ctx.shadowBlur = 12; ctx.shadowOffsetY = 4;
        rr(ctx, x, L.ytop, fw, fh, 8); ctx.fillStyle = "#fff"; ctx.fill();
        ctx.shadowColor = "transparent"; ctx.strokeStyle = "#E6E0D4"; ctx.lineWidth = 1; ctx.stroke();
        ctx.strokeStyle = "rgba(58,56,51,.8)"; ctx.lineWidth = 1.5; ctx.lineCap = "round"; ctx.lineJoin = "round";
        SK[c].forEach((k, i) => stroke(k, dk * 1.6 - i * 0.35 - 0.2));
        ctx.restore();
        const cx = x + fw / 2, yb = L.ybot;
        ctx.save(); ctx.globalAlpha = pk * (1 - E.o3(ck * 2));
        rr(ctx, x + 0.5, yb + 0.5, fw - 1, fh - 1, 8); ctx.setLineDash([3, 4]); ctx.strokeStyle = "#CFC8BA"; ctx.lineWidth = 1; ctx.stroke(); ctx.setLineDash([]);
        ctx.restore();
        ctx.save(); ctx.globalAlpha = pk; ctx.strokeStyle = "#DDD7CA"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(cx + 0.5, L.ytop + fh + 5); ctx.lineTo(cx + 0.5, yb - 26); ctx.stroke();
        ctx.restore();
        const nk = E.back(ck * 1.6), nr = 10;
        ctx.save(); ctx.beginPath(); ctx.arc(cx, L.ny, nr, 0, TAU); ctx.fillStyle = "#fff"; ctx.globalAlpha = pk; ctx.fill(); ctx.strokeStyle = "#DDD7CA"; ctx.stroke();
        if (ck > 0) {
          ctx.globalAlpha = 1; ctx.beginPath(); ctx.arc(cx, L.ny, nr * cl(nk), 0, TAU); ctx.fillStyle = AC; ctx.fill();
          const ckk = E.o3(ck * 2.2 - 0.3);
          if (ckk > 0) {
            ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath();
            const a: Pt = [cx - 4, L.ny + 0.2], b: Pt = [cx - 1, L.ny + 3.4], e: Pt = [cx + 4.6, L.ny - 3.2];
            ctx.moveTo(a[0], a[1]);
            if (ckk < 0.4) { const q = ckk / 0.4; ctx.lineTo(lerp(a[0], b[0], q), lerp(a[1], b[1], q)); }
            else { ctx.lineTo(b[0], b[1]); const q = (ckk - 0.4) / 0.6; ctx.lineTo(lerp(b[0], e[0], q), lerp(b[1], e[1], q)); }
            ctx.stroke();
          }
        }
        ctx.restore();
        const fk = E.o5(ck * 1.5 - 0.35);
        if (fk > 0) {
          ctx.save(); ctx.globalAlpha = fk; ctx.translate(0, (1 - fk) * -8);
          ctx.shadowColor = "rgba(0,0,0,.18)"; ctx.shadowBlur = 14; ctx.shadowOffsetY = 5;
          rr(ctx, x, yb, fw, fh, 8); ctx.fillStyle = INK; ctx.fill(); ctx.shadowColor = "transparent";
          finalFrame(c, x, yb, fw, fh, t);
          ctx.restore();
        }
      }
    }
    const tl = gsap.timeline({ paused: true });
    tl.to(st, { d: 1, duration: 2.6, ease: "none" }, 0.1).to(st, { c0: 1, duration: 1.1, ease: "none" }, 2.6).to(st, { c1: 1, duration: 1.1, ease: "none" }, 3.15).to(st, { c2: 1, duration: 1.1, ease: "none" }, 3.7).to({}, { duration: 0.3 });
    reg("approve", () => { st.d = 0; st.c0 = 0; st.c1 = 0; st.c2 = 0; }, tl, draw);
  })();

  /* 3 brand: the brand pours in and floods a grey layout */
  (() => {
    const st = { kit: 0, pour: 0, tail: 0, fill: 0, txt: 0 };
    const L = { m: false, kx: 0, ky: 0, lw: 0, sw: [] as Pt[], ay: 0, fx: 0, fy: 0, fw: 0, fh: 0, ex: 0, ey: 0, R: 0, p0: [0, 0] as Pt, p1: [0, 0] as Pt, p2: [0, 0] as Pt, p3: [0, 0] as Pt };
    function layout() {
      const w = sc.w, h = sc.h, m = w < 520;
      L.m = m; L.sw = [];
      if (!m) {
        L.kx = Math.max(22, w * 0.05); L.ky = h * 0.2; L.lw = Math.min(96, w * 0.15);
        const sy = L.ky + L.lw * 0.6 + 30;
        for (let i = 0; i < 3; i++) L.sw.push([L.kx + 13 + i * 32, sy]);
        L.ay = sy + 52;
        L.fx = w * 0.37; L.fw = w - L.fx - Math.max(22, w * 0.05); L.fh = (L.fw * 9) / 16;
        if (L.fh > h - 44) { L.fh = h - 44; L.fw = (L.fh * 16) / 9; L.fx = w - L.fw - Math.max(22, w * 0.05); }
        L.fy = (h - L.fh) / 2; L.ex = L.fx; L.ey = L.fy + L.fh * 0.55;
      } else {
        L.kx = 20; L.ky = 20; L.lw = 62;
        for (let j = 0; j < 3; j++) L.sw.push([L.kx + L.lw + 34 + j * 30, L.ky + 18]);
        L.ay = L.ky + 18 + 9;
        L.fw = w - 40; L.fh = (L.fw * 9) / 16;
        if (L.fh > h - 92) { L.fh = h - 92; L.fw = (L.fh * 16) / 9; }
        L.fx = (w - L.fw) / 2; L.fy = h - L.fh - 18; L.ex = L.fx + L.fw * 0.5; L.ey = L.fy;
      }
      const s = L.sw[0];
      L.p0 = [s[0], s[1]]; L.p3 = [L.ex, L.ey];
      L.p1 = m ? [s[0], L.ey - 10] : [s[0] + 60, s[1]];
      L.p2 = m ? [L.ex, L.ey - 40] : [L.ex - 70, L.ey];
      const cs: Pt[] = [[L.fx, L.fy], [L.fx + L.fw, L.fy], [L.fx, L.fy + L.fh], [L.fx + L.fw, L.fy + L.fh]];
      L.R = Math.max(...cs.map((c) => Math.hypot(c[0] - L.ex, c[1] - L.ey))) * 1.12;
    }
    const sc = mkCanvas($("[data-k=brand]", sec), layout), ctx = sc.ctx;
    function bez(t: number): Pt {
      const a = L.p0, b = L.p1, c = L.p2, d = L.p3, u = 1 - t;
      return [u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0], u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1]];
    }
    function branded(c: Ctx) {
      const x = L.fx, y = L.fy, w = L.fw, h = L.fh;
      c.fillStyle = AC; c.fillRect(x - 2, y - 2, w + 4, h + 4);
      c.fillStyle = INK; c.beginPath(); c.arc(x + w * 0.84, y + h * 0.24, h * 0.17, 0, TAU); c.fill();
      const fs = h * 0.13, tk = E.o5(st.txt);
      c.save(); c.globalAlpha = tk; font(c, fs, 600); c.fillStyle = INK;
      c.fillText("Make your product", x + h * 0.12, y + h * 0.43 + (1 - tk) * 8);
      c.fillText("move people", x + h * 0.12, y + h * 0.43 + fs * 1.08 + (1 - tk) * 8);
      const mw = c.measureText("move people").width;
      c.beginPath(); c.arc(x + h * 0.12 + mw + fs * 0.2, y + h * 0.43 + fs * 1.08 - fs * 0.1, fs * 0.1, 0, TAU); c.fillStyle = WHT; c.fill();
      logo(c, x + h * 0.12, y + h - h * 0.12 - h * 0.13, h * 0.22, INK);
      c.restore();
    }
    function draw(t: number) {
      const w = sc.w, h = sc.h, kk = E.o3(st.kit);
      ctx.clearRect(0, 0, w, h);
      ctx.save(); ctx.globalAlpha = kk; ctx.translate(0, (1 - kk) * 8);
      logo(ctx, L.kx, L.ky, L.lw, INK);
      L.sw.forEach((s, i) => {
        ctx.beginPath(); ctx.arc(s[0], s[1], L.m ? 11 : 13, 0, TAU); ctx.fillStyle = [AC, INK, BONE][i]; ctx.fill();
        if (i === 2) { ctx.strokeStyle = "#D2CBBD"; ctx.lineWidth = 1; ctx.stroke(); }
      });
      if (!L.m) {
        font(ctx, 30, 600); ctx.fillStyle = INK; ctx.fillText("Aa", L.kx, L.ay + 10);
        font(ctx, 12.5, 500); ctx.fillStyle = "#8A857B"; ctx.fillText("Instrument Sans", L.kx + 44, L.ay + 8);
      }
      ctx.restore();
      const x = L.fx, y = L.fy, fw = L.fw, fh = L.fh;
      ctx.save(); rr(ctx, x, y, fw, fh, 16); ctx.fillStyle = "#EFEBE3"; ctx.fill();
      ctx.setLineDash([4, 5]); ctx.strokeStyle = "#CFC8BA"; ctx.lineWidth = 1.2; ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = "#E0DACE";
      rr(ctx, x + fh * 0.12, y + fh * 0.32, fw * 0.42, fh * 0.09, fh * 0.045); ctx.fill();
      rr(ctx, x + fh * 0.12, y + fh * 0.47, fw * 0.28, fh * 0.09, fh * 0.045); ctx.fill();
      ctx.beginPath(); ctx.arc(x + fw * 0.84, y + fh * 0.24, fh * 0.17, 0, TAU); ctx.fill();
      rr(ctx, x + fh * 0.12, y + fh * 0.76, fh * 0.22, fh * 0.08, fh * 0.04); ctx.fill();
      ctx.restore();
      if (st.pour > 0 && st.tail < 1) {
        ctx.save(); ctx.strokeStyle = AC; ctx.lineWidth = L.m ? 5 : 6; ctx.lineCap = "round"; ctx.beginPath();
        const a = E.io(st.tail), b = E.io(st.pour);
        for (let i = 0; i <= 40; i++) { const q = bez(lerp(a, b, i / 40)); if (i) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]); }
        ctx.stroke(); ctx.restore();
      }
      if (st.fill > 0) {
        const f = E.io(st.fill), R = L.R * f, wob = (1 - f) * 0.09;
        ctx.save(); rr(ctx, L.fx, L.fy, L.fw, L.fh, 16); ctx.clip(); ctx.beginPath();
        for (let j = 0; j <= 72; j++) {
          const th = (j / 72) * TAU, rad = R * (1 + wob * Math.sin(3 * th + t * 1.6) + wob * 0.7 * Math.sin(5 * th - t * 1.1) + wob * 0.4 * Math.sin(9 * th + t * 2.3));
          const px = L.ex + Math.cos(th) * rad, py = L.ey + Math.sin(th) * rad;
          if (j) ctx.lineTo(px, py); else ctx.moveTo(px, py);
        }
        ctx.closePath(); ctx.clip(); branded(ctx); ctx.restore();
      }
    }
    const tl = gsap.timeline({ paused: true });
    tl.to(st, { kit: 1, duration: 1.1, ease: "none" }, 0.1).to(st, { pour: 1, duration: 1.1, ease: "none" }, 1.2).to(st, { fill: 1, duration: 1.8, ease: "none" }, 2.15).to(st, { tail: 1, duration: 0.9, ease: "none" }, 2.2).to(st, { txt: 1, duration: 1.2, ease: "none" }, 3.4);
    reg("brand", () => { st.kit = 0; st.pour = 0; st.tail = 0; st.fill = 0; st.txt = 0; }, tl, draw);
  })();

  /* 4 roadmap: the week keeps flowing, two calm slots are ours */
  (() => {
    type Col = { items: [number, number, number][]; len: number; sp: number; off: number };
    const st = { s: 0, o1: 0, o2: 0, n: 0 }, L = { days: [] as string[], n: 0, px: 0, cw: 0, top: 46, bot: 0, slots: [] as Pt[] };
    let C: Col[] = [];
    function layout() {
      const w = sc.w, h = sc.h, mob = w < 520;
      L.days = mob ? ["Tue", "Wed", "Thu"] : ["Mon", "Tue", "Wed", "Thu", "Fri"];
      L.n = L.days.length; L.px = mob ? 16 : 26; L.cw = (w - L.px * 2) / L.n; L.top = 46; L.bot = h - 50;
      C = [];
      for (let i = 0; i < L.n; i++) {
        const items: Col["items"] = [];
        let y = 0;
        while (y < 520) { const hh = rnd(22, 58); items.push([y, hh, rnd(0.35, 0.8)]); y += hh + 8; }
        C.push({ items, len: y, sp: rnd(7, 12), off: rnd(0, 500) });
      }
      L.slots = [[L.days.indexOf("Tue"), 0.34], [L.days.indexOf("Thu"), 0.12]];
    }
    const sc = mkCanvas($("[data-k=cal]", sec), layout), ctx = sc.ctx;
    function draw(t: number) {
      const w = sc.w, h = sc.h, H = L.bot - L.top;
      ctx.clearRect(0, 0, w, h);
      font(ctx, 12.5, 600); ctx.fillStyle = "rgba(236,233,225,.55)";
      L.days.forEach((d, i) => ctx.fillText(d, L.px + i * L.cw + 6, 30));
      ctx.save(); ctx.beginPath(); ctx.rect(0, L.top, w, H); ctx.clip(); ctx.globalAlpha = E.o3(st.s);
      C.forEach((c, i) => {
        const x = L.px + i * L.cw + 4, cw = L.cw - 8, off = (c.off + t * c.sp) % c.len;
        for (let rep = 0; rep < 2; rep++)
          c.items.forEach((it) => {
            const y = L.top + it[0] - off + rep * c.len;
            if (y > L.bot || y + it[1] < L.top) return;
            rr(ctx, x, y, cw, it[1], 8); ctx.fillStyle = "rgba(236,233,225,.065)"; ctx.fill();
            ctx.fillStyle = "rgba(236,233,225,.13)"; rr(ctx, x + 10, y + 9, cw * it[2] * 0.7, 4, 2); ctx.fill();
            if (it[1] > 34) { rr(ctx, x + 10, y + 19, cw * it[2] * 0.4, 4, 2); ctx.fill(); }
          });
      });
      ctx.restore();
      // Fade the stream out at its top and bottom edges.
      ctx.save(); ctx.globalCompositeOperation = "destination-out";
      const g1 = ctx.createLinearGradient(0, L.top, 0, L.top + 40);
      g1.addColorStop(0, "rgba(0,0,0,1)"); g1.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g1; ctx.fillRect(0, L.top - 1, w, 41);
      const g2 = ctx.createLinearGradient(0, L.bot - 50, 0, L.bot);
      g2.addColorStop(0, "rgba(0,0,0,0)"); g2.addColorStop(1, "rgba(0,0,0,1)");
      ctx.fillStyle = g2; ctx.fillRect(0, L.bot - 50, w, 51);
      ctx.restore();
      L.slots.forEach((s, i) => {
        const k = E.o5(i ? st.o2 : st.o1);
        if (k <= 0) return;
        const x = L.px + s[0] * L.cw + 4, cw = L.cw - 8, y = L.top + H * s[1] + (1 - k) * -10;
        ctx.save(); ctx.globalAlpha = k; ctx.shadowColor = "rgba(255,75,31,.5)"; ctx.shadowBlur = 26;
        rr(ctx, x, y, cw, 32, 9); ctx.fillStyle = AC; ctx.fill(); ctx.shadowBlur = 0;
        logo(ctx, x + 10, y + 9.5, 22, INK);
        font(ctx, 12.5, 700); ctx.fillStyle = INK; ctx.fillText("30 min", x + 39, y + 20.5);
        ctx.restore();
      });
      const nk = E.o3(st.n);
      if (nk > 0) {
        const ny = h - 20 + (1 - nk) * 6;
        ctx.save(); ctx.globalAlpha = nk; font(ctx, 13.5, 600);
        ctx.fillStyle = WHT; ctx.fillText("That's all we need from your team", L.px + 22, ny);
        ctx.fillStyle = AC; ctx.beginPath(); ctx.arc(L.px + 10, ny - 4.5, 4, 0, TAU); ctx.fill();
        ctx.restore();
      }
    }
    const tl = gsap.timeline({ paused: true });
    tl.to(st, { s: 1, duration: 1.4, ease: "none" }, 0.1).to(st, { o1: 1, duration: 1.2, ease: "none" }, 1.4).to(st, { o2: 1, duration: 1.2, ease: "none" }, 2.0).to(st, { n: 1, duration: 1, ease: "none" }, 2.9);
    reg("cal", () => { st.s = 0; st.o1 = 0; st.o2 = 0; st.n = 0; }, tl, draw);
  })();

  /* 5 formats: one film plays live in every ratio */
  (() => {
    type Box = { x: number; y: number; w: number; h: number };
    const RAT: [number, string, string][] = [[16 / 9, "Website", "16:9"], [1, "LinkedIn", "1:1"], [9 / 16, "Reels", "9:16"], [4 / 5, "Ads", "4:5"]];
    const st = { a: 0, s: 0, l: 0 }, L = { slots: [] as Box[], H: 0, y: 0, start: { x: 0, y: 0, w: 0, h: 0 } as Box };
    function layout() {
      const w = sc.w, h = sc.h, g = w * 0.03, sum = RAT.reduce((a, r) => a + r[0], 0);
      let H = h * 0.4;
      if (H * sum + g * 3 > w * 0.88) H = (w * 0.88 - g * 3) / sum;
      const tot = H * sum + g * 3, y = Math.max(14, (h - H - 50) / 2);
      let x = (w - tot) / 2;
      L.slots = RAT.map((r) => { const o = { x, y, w: H * r[0], h: H }; x += o.w + g; return o; });
      L.H = H; L.y = y;
      const sw = Math.min(w * 0.6, ((h * 0.56) * 16) / 9);
      L.start = { x: (w - sw) / 2, y: y + H / 2 - (sw * 9) / 32, w: sw, h: (sw * 9) / 16 };
    }
    const sc = mkCanvas($("[data-k=chan]", sec), layout), ctx = sc.ctx;
    function film(x: number, y: number, w: number, h: number, ph: number) {
      ctx.save(); rr(ctx, x, y, w, h, Math.min(12, Math.min(w, h) * 0.12));
      ctx.fillStyle = "#050506"; ctx.fill(); ctx.strokeStyle = "rgba(255,255,255,.09)"; ctx.lineWidth = 1; ctx.stroke(); ctx.clip();
      const m = Math.min(w, h), pad = m * 0.17, r = m * 0.1, fade = 1 - E.io((ph - 0.86) / 0.14);
      ctx.globalAlpha = fade;
      const k = E.back(ph / 0.32), bx = lerp(x - r * 2, x + pad + r, k);
      const by = lerp(y + h * 0.95, y + pad + r, E.o3(ph / 0.32)) - Math.sin(cl(ph / 0.32) * Math.PI) * h * 0.12;
      const gl = ctx.createRadialGradient(bx, by, 0, bx, by, r * 4);
      gl.addColorStop(0, "rgba(255,75,31,.3)"); gl.addColorStop(1, "rgba(255,75,31,0)");
      ctx.fillStyle = gl; ctx.fillRect(bx - r * 4, by - r * 4, r * 8, r * 8);
      ctx.fillStyle = AC; ctx.beginPath(); ctx.arc(bx, by, r, 0, TAU); ctx.fill();
      const bh = Math.max(3, m * 0.075), bw = w - pad * 2, b1 = E.o5((ph - 0.24) / 0.26), b2 = E.o5((ph - 0.32) / 0.26);
      ctx.fillStyle = WHT; rr(ctx, x + pad, y + h - pad - bh * 2.7, Math.max(0.1, bw * 0.8 * b1), bh, bh / 2); ctx.fill();
      ctx.globalAlpha = fade * 0.5; rr(ctx, x + pad, y + h - pad - bh, Math.max(0.1, bw * 0.5 * b2), bh, bh / 2); ctx.fill();
      ctx.globalAlpha = fade * E.o3((ph - 0.5) / 0.16);
      const lw = Math.max(14, m * 0.22);
      logo(ctx, x + w - pad - lw, y + pad, lw, WHT);
      ctx.restore();
    }
    function draw(t: number) {
      const w = sc.w, h = sc.h, a = E.o3(st.a);
      ctx.clearRect(0, 0, w, h);
      if (a <= 0) return;
      const ph = (t % 5.2) / 5.2;
      ctx.save(); ctx.globalAlpha = a;
      for (let i = RAT.length - 1; i >= 0; i--) {
        if (st.s <= 0 && i > 0) continue;
        const k = E.io(st.s * 1.45 - i * 0.15), s = L.start, d = L.slots[i];
        film(lerp(s.x, d.x, k), lerp(s.y, d.y, k), lerp(s.w, d.w, k), lerp(s.h, d.h, k), ph);
      }
      const lk = E.o3(st.l);
      if (lk > 0) {
        ctx.textAlign = "center";
        RAT.forEach((r, i) => {
          const d = L.slots[i], cx = d.x + d.w / 2;
          ctx.globalAlpha = a * lk;
          font(ctx, 12.5, 600); ctx.fillStyle = WHT; ctx.fillText(r[1], cx, L.y + L.H + 26 + (1 - lk) * 6);
          font(ctx, 11.5, 500); ctx.fillStyle = "rgba(236,233,225,.45)"; ctx.fillText(r[2], cx, L.y + L.H + 43 + (1 - lk) * 6);
        });
        ctx.textAlign = "start";
      }
      ctx.restore();
    }
    const tl = gsap.timeline({ paused: true });
    tl.to(st, { a: 1, duration: 1, ease: "none" }, 0.1).to(st, { s: 1, duration: 1.9, ease: "none" }, 1.6).to(st, { l: 1, duration: 1, ease: "none" }, 3.0);
    reg("chan", () => { st.a = 0; st.s = 0; st.l = 0; }, tl, draw);
  })();

  /* 6 results: one clean curve that lifts once the product goes live */
  (() => {
    const st = { u: 0 }, L = { mob: false, x0: 0, x1: 0, y0: 0, hh: 0, lx: 0 };
    const NOTES: [number, string][] = [[0.66, "More signups"], [0.8, "More demos booked"], [0.94, "Shared by the team"]];
    const f = (u: number) => { const b = 0.2 + 0.03 * u; if (u <= 0.5) return b; const x = (u - 0.5) / 0.5; return b + 0.6 * (2 * x * x - x * x * x); };
    function layout() {
      const w = sc.w, h = sc.h, mob = w < 560;
      L.mob = mob; L.x0 = mob ? 20 : 44; L.x1 = w - (mob ? 24 : 48); L.y0 = h - 46; L.hh = h - (mob ? 96 : 100); L.lx = (L.x0 + L.x1) / 2;
    }
    const X = (u: number) => L.x0 + u * (L.x1 - L.x0), Y = (u: number) => L.y0 - f(u) * L.hh;
    const sc = mkCanvas($("[data-k=res]", sec), layout), ctx = sc.ctx;
    function path(a: number, b: number) {
      ctx.beginPath();
      for (let i = 0; i <= 80; i++) { const u = lerp(a, b, i / 80); if (i) ctx.lineTo(X(u), Y(u)); else ctx.moveTo(X(u), Y(u)); }
    }
    function node(x: number, y: number, k: number, col: string) {
      ctx.save(); ctx.globalAlpha = k; ctx.shadowColor = "rgba(60,45,20,.18)"; ctx.shadowBlur = 8; ctx.shadowOffsetY = 2;
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(x, y, 6.5 * (0.6 + 0.4 * k), 0, TAU); ctx.fill();
      ctx.shadowColor = "transparent"; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, 3.6 * (0.6 + 0.4 * k), 0, TAU); ctx.fill();
      ctx.restore();
    }
    function up(x: number, y: number, col: string) {
      ctx.strokeStyle = col; ctx.lineWidth = 1.8; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath();
      ctx.moveTo(x, y + 4.5); ctx.lineTo(x, y - 4.5); ctx.moveTo(x - 3.6, y - 1); ctx.lineTo(x, y - 4.8); ctx.lineTo(x + 3.6, y - 1); ctx.stroke();
    }
    function draw() {
      const w = sc.w, h = sc.h, u = st.u;
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(10,10,11,.1)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(L.x0, L.y0 + 0.5); ctx.lineTo(L.x1, L.y0 + 0.5); ctx.stroke();
      font(ctx, 12.5, 500); ctx.fillStyle = "#9A958B"; ctx.fillText("Before", L.x0, L.y0 + 26);
      ctx.textAlign = "end"; ctx.fillText("After", L.x1, L.y0 + 26); ctx.textAlign = "start";
      const lk = E.o3((u - 0.47) / 0.08);
      if (lk > 0) {
        const top = L.mob ? 20 : 26;
        ctx.save(); ctx.globalAlpha = lk; ctx.strokeStyle = "rgba(10,10,11,.22)"; ctx.lineWidth = 1; ctx.setLineDash([2, 4]);
        ctx.beginPath(); ctx.moveTo(L.lx + 0.5, top + 14); ctx.lineTo(L.lx + 0.5, L.y0); ctx.stroke(); ctx.setLineDash([]);
        font(ctx, 13.5, 600);
        const tx = "Product goes live", tw = ctx.measureText(tx).width, tx0 = L.mob ? L.lx + 10 : L.lx - (tw + 18) / 2, ty = top + (1 - lk) * -5;
        ctx.fillStyle = AC; ctx.beginPath(); ctx.moveTo(tx0, ty - 4.5); ctx.lineTo(tx0 + 8, ty); ctx.lineTo(tx0, ty + 4.5); ctx.closePath(); ctx.fill();
        ctx.fillStyle = INK; ctx.fillText(tx, tx0 + 16, ty + 4.8);
        ctx.restore();
      }
      if (u > 0.5) {
        path(0.5, u); ctx.lineTo(X(u), L.y0); ctx.lineTo(X(0.5), L.y0); ctx.closePath();
        const gr = ctx.createLinearGradient(0, Y(u), 0, L.y0);
        gr.addColorStop(0, "rgba(255,75,31,.16)"); gr.addColorStop(1, "rgba(255,75,31,0)");
        ctx.fillStyle = gr; ctx.fill();
      }
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      path(0, Math.min(u, 0.5)); ctx.strokeStyle = "rgba(10,10,11,.85)"; ctx.lineWidth = 2.4; ctx.stroke();
      if (u > 0.5) { path(0.5, u); ctx.strokeStyle = AC; ctx.lineWidth = 3.2; ctx.stroke(); }
      if (lk > 0) node(X(0.5), Y(0.5), lk, INK);
      NOTES.forEach((n, i) => {
        const k = E.o3((u - n[0]) / 0.06);
        if (k <= 0) return;
        const x = X(n[0]), y = Y(n[0]);
        ctx.save(); ctx.globalAlpha = k;
        if (!L.mob) {
          const lt = y - 50;
          ctx.strokeStyle = "rgba(10,10,11,.25)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x + 0.5, y - 8); ctx.lineTo(x + 0.5, lt + 6); ctx.stroke();
          font(ctx, 13.5, 600);
          const tw = ctx.measureText(n[1]).width, x0 = Math.min(x - (tw + 16) / 2, L.x1 - tw - 16), by = lt + (1 - k) * 6;
          up(x0 + 4, by - 5, AC); ctx.fillStyle = INK; ctx.fillText(n[1], x0 + 16, by);
        } else {
          font(ctx, 13, 600);
          const by = 26 + i * 24 + (1 - k) * 6;
          up(L.x0 + 4, by - 5, AC); ctx.fillStyle = INK; ctx.fillText(n[1], L.x0 + 16, by);
        }
        ctx.restore();
        node(x, y, k, AC);
      });
      if (u > 0 && u < 1) { ctx.fillStyle = u > 0.5 ? AC : INK; ctx.beginPath(); ctx.arc(X(u), Y(u), 4.5, 0, TAU); ctx.fill(); }
    }
    const tl = gsap.timeline({ paused: true });
    tl.to(st, { u: 1, duration: 4.2, ease: "power1.inOut" }, 0.2).to({}, { duration: 0.4 });
    reg("res", () => { st.u = 0; }, tl, draw);
  })();

  // One render loop, only for cards near the screen.
  const t0 = performance.now();
  let raf = 0;
  const frame = (now: number) => {
    const t = (now - t0) / 1000;
    for (const k in S) if (S[k].near) S[k].draw(t);
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  env.defer(() => cancelAnimationFrame(raf));
  const whenFonts = () => { if (!env.dead) fontsReady.forEach((f) => f()); };
  Promise.all([document.fonts.load(`600 40px ${fam}`), document.fonts.load(`500 14px ${fam}`), document.fonts.load(`700 14px ${fam}`)]).then(whenFonts, whenFonts);

  // Each card plays once on arrival, then rests; after 8s of quiet one visible card replays.
  const ORDER = Object.keys(S), queue: Scene[] = [];
  let qBusy = false, rot = 0;
  function play(s: Scene) {
    if (s.playing) return;
    s.playing = true; s.played = true; last = performance.now();
    if (s.tl.progress() > 0)
      gsap.to(s.G, { opacity: 0, duration: 0.6, ease: "power2.inOut", onComplete: () => { s.init(); s.tl.pause(0); gsap.to(s.G, { opacity: 1, duration: 0.4, ease: "power2.out" }); s.tl.play(0); } });
    else s.tl.play(0);
  }
  function pump() {
    if (qBusy || !queue.length || env.dead) return;
    qBusy = true;
    const s = queue.shift()!;
    if (s.vis) play(s);
    gsap.delayedCall(0.55, () => { qBusy = false; pump(); });
  }
  const anyPlaying = () => ORDER.some((k) => S[k].playing);
  const near = new IntersectionObserver((es) => es.forEach((e) => { S[(e.target as HTMLElement).dataset.k!].near = e.isIntersecting; }), { rootMargin: "120px 0px" });
  ORDER.forEach((k) => near.observe(S[k].c));
  env.defer(() => near.disconnect());
  env.defer(() => ORDER.forEach((k) => { S[k].tl.kill(); gsap.killTweensOf(S[k].G); }));
  if (env.reduce) {
    ORDER.forEach((k) => { S[k].tl.progress(1); S[k].c.classList.add("in"); });
    return;
  }
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    const s = S[(e.target as HTMLElement).dataset.k!];
    s.vis = e.isIntersecting;
    if (e.isIntersecting) {
      e.target.classList.add("in");
      if (!s.played && !queue.includes(s)) { queue.push(s); pump(); }
      else if (s.playing) s.tl.resume();
    } else if (s.playing) s.tl.pause();
  }), { threshold: 0.35 });
  ORDER.forEach((k, i) => { S[k].c.style.transitionDelay = (i % 2) * 90 + "ms"; io.observe(S[k].c); });
  env.defer(() => io.disconnect());
  const timer = window.setInterval(() => {
    if (document.hidden || anyPlaying() || queue.length || performance.now() - last < 8000) return;
    for (let n = 0; n < ORDER.length; n++) {
      const s = S[ORDER[(rot + n) % ORDER.length]];
      if (s.vis && s.played) { rot = (rot + n + 1) % ORDER.length; play(s); return; }
    }
  }, 1000);
  env.defer(() => clearInterval(timer));
  if (matchMedia("(hover:hover)").matches)
    ORDER.forEach((k) => env.on(S[k].c, "pointerenter", () => { const s = S[k]; if (s.played && !s.playing) play(s); }));
}
