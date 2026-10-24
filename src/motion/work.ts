import { gsap } from "gsap";
import { $, $$, clamp, lerp, type Env } from "./kit";

type Extra = { start: () => void; stop: () => void };
type Piece = { tl: gsap.core.Timeline; reset?: () => void; extra?: Extra };
type Ctl = Piece & { on: boolean; vis: boolean };

const NS = "http://www.w3.org/2000/svg";
const lines = (c: Element) => $$(".ml b", c);

function film(): Piece {
  const root = $(".film"), cards = $$(".cd", root), php = $(".php", root);
  let z = 3;
  const tl = gsap.timeline({ repeat: -1 });
  const reset = () => {
    gsap.set(cards.slice(1), { clipPath: "inset(0 0 0 100%)", zIndex: 1, xPercent: 0 });
    gsap.set(cards[0], { clipPath: "inset(0 0 0 0)", xPercent: 0, zIndex: 1 });
    gsap.set(lines(cards[0]), { yPercent: 0 });
    gsap.set([...lines(cards[1]), ...lines(cards[2])], { yPercent: 125 });
    z = 3;
  };
  tl.add(reset, 0);
  tl.fromTo(php, { left: "0%" }, { left: "100%", duration: 6.8, ease: "none", immediateRender: false }, 0);
  [1, 2].forEach((i) => {
    const t = i * 2;
    tl.add(() => { cards[i].style.zIndex = String(++z); }, t - 0.01);
    tl.fromTo(cards[i], { clipPath: "inset(0 0 0 100%)" }, { clipPath: "inset(0 0 0 0%)", duration: 0.85, ease: "expo.inOut", immediateRender: false }, t);
    tl.to(cards[i - 1], { xPercent: -10, duration: 0.85, ease: "expo.inOut" }, t);
    tl.fromTo(lines(cards[i]), { yPercent: 125 }, { yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.09, immediateRender: false }, t + 0.35);
  });
  // The first card wipes back in on top so the loop point is seamless.
  tl.add(() => {
    gsap.set(cards[0], { xPercent: 0, clipPath: "inset(0 0 0 100%)", zIndex: ++z });
    gsap.set(lines(cards[0]), { yPercent: 125 });
  }, 5.99);
  tl.to(cards[0], { clipPath: "inset(0 0 0 0%)", duration: 0.85, ease: "expo.inOut" }, 6);
  tl.to(cards[2], { xPercent: -10, duration: 0.85, ease: "expo.inOut" }, 6);
  tl.to(lines(cards[0]), { yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.09 }, 6.35);
  tl.to({}, { duration: 0.01 }, 6.79);
  return { tl, reset };
}

function explainer(): Piece {
  const root = $(".ex"), dg = $<SVGGElement>(".dots", root), bg = $<SVGGElement>(".bars", root), H = [16, 30, 22, 46, 34];
  dg.replaceChildren();
  bg.replaceChildren();
  const dots: Element[] = [], bars: Element[] = [];
  for (let j = 0; j < 4; j++)
    for (let i = 0; i < 4; i++) {
      const c = document.createElementNS(NS, "circle");
      c.setAttribute("cx", String(164 + i * 24)); c.setAttribute("cy", String(224 + j * 24)); c.setAttribute("r", "3.3"); c.setAttribute("fill", "#fff");
      dg.appendChild(c); dots.push(c);
    }
  H.forEach((h, b) => {
    const r = document.createElementNS(NS, "rect");
    r.setAttribute("x", String(124 + b * 34)); r.setAttribute("y", String(458 - h)); r.setAttribute("width", "16"); r.setAttribute("height", String(h)); r.setAttribute("rx", "4");
    r.setAttribute("fill", b === 3 ? "#FF4B1F" : "rgba(239,237,232,.85)");
    bg.appendChild(r); bars.push(r);
  });
  const cps = $$(".cp", root), paths = $$<SVGPathElement>(".ln1", root), pk = $$(".pk", root), ring = $(".ring", root), mdl = $(".mdl", root), card = $(".card", root), labels = $$("text", root);
  const lens = paths.map((p) => p.getTotalLength());
  const tl = gsap.timeline({ repeat: -1 });
  function along(i: number, t0: number, dur: number) {
    const o = { p: 0 };
    tl.to(o, {
      p: 1, duration: dur, ease: "power2.inOut",
      onStart: () => { gsap.set(pk[i], { opacity: 1 }); },
      onUpdate: () => { const pt = paths[i].getPointAtLength(o.p * lens[i]); pk[i].setAttribute("cx", String(pt.x)); pk[i].setAttribute("cy", String(pt.y)); },
      onComplete: () => { gsap.set(pk[i], { opacity: 0 }); },
    }, t0);
  }
  const reset = () => {
    paths.forEach((p, i) => { p.style.strokeDasharray = String(lens[i]); p.style.strokeDashoffset = String(lens[i]); });
    gsap.set(cps, { opacity: 0, y: 8 }); gsap.set(dots, { opacity: 0.22, attr: { fill: "#fff" } }); gsap.set(bars, { scaleY: 0, transformOrigin: "50% 100%" });
    gsap.set(ring, { opacity: 0, scale: 1, transformOrigin: "50% 50%" }); gsap.set(pk, { opacity: 0 });
    gsap.set([mdl, card], { opacity: 1, scale: 1, transformOrigin: "50% 50%" }); gsap.set(labels, { opacity: 1 });
  };
  tl.add(reset, 0);
  tl.to(cps, { opacity: 1, y: 0, duration: 0.8, ease: "expo.out", stagger: 0.1 }, 0.2);
  tl.to(paths.slice(0, 3), { strokeDashoffset: 0, duration: 0.75, ease: "power2.inOut", stagger: 0.08 }, 0.7);
  [0, 1, 2].forEach((i) => along(i, 1.25 + i * 0.1, 0.9));
  tl.to(mdl, { scale: 1.05, duration: 0.3, ease: "power2.out", yoyo: true, repeat: 1 }, 2.15);
  tl.to(dots, { opacity: 1, attr: { fill: "#FF4B1F" }, duration: 0.3, ease: "power1.out", stagger: { each: 0.045, from: "center", grid: [4, 4] }, yoyo: true, repeat: 1 }, 2.1);
  tl.fromTo(ring, { opacity: 0.9, scale: 1 }, { opacity: 0, scale: 1.55, duration: 1, ease: "expo.out", immediateRender: false }, 2.1);
  tl.to(paths[3], { strokeDashoffset: 0, duration: 0.5, ease: "power2.inOut" }, 2.5);
  along(3, 2.9, 0.6);
  tl.to(card, { stroke: "#fff", duration: 0.3 }, 3.4);
  tl.to(bars, { scaleY: 1, duration: 0.8, ease: "back.out(1.5)", stagger: 0.08 }, 3.4);
  tl.to([...cps, ...paths, card, ...bars, ...dots, mdl], { opacity: 0, duration: 0.5, ease: "power2.in" }, 5.4);
  tl.to({}, { duration: 0.01 }, 5.99);
  return { tl, reset };
}

function ui(): Piece {
  const root = $(".ui"), card = $(".ucard", root), num = $(".num", root), line = $<SVGPathElement>(".line", root), area = $(".area", root), tip = $(".tip", root);
  const items = $$(".ulist li", root), cks = $$(".ck", root), cki = $$(".ck svg", root), toast = $(".toast", root);
  const LEN = line.getTotalLength(), v = { n: 0 };
  const tl = gsap.timeline({ repeat: -1 });
  const reset = () => {
    num.textContent = "$0.0k";
    gsap.set(card, { opacity: 0, y: 30, scale: 1 }); gsap.set(items, { opacity: 0, y: 14, scale: 1 });
    line.style.strokeDasharray = String(LEN); line.style.strokeDashoffset = String(LEN);
    gsap.set(area, { opacity: 0 }); gsap.set(tip, { scale: 0, transformOrigin: "50% 50%" });
    gsap.set(cks, { backgroundColor: "rgba(0,0,0,0)", borderColor: "#4b4b52" }); gsap.set(cki, { opacity: 0, scale: 0.3, transformOrigin: "50% 50%" });
    gsap.set(toast, { opacity: 0, y: -36 });
  };
  tl.add(reset, 0);
  tl.to(card, { opacity: 1, y: 0, duration: 1, ease: "expo.out" }, 0.2);
  tl.to(line, { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut" }, 0.55);
  tl.to(area, { opacity: 1, duration: 0.7 }, 1.1);
  tl.to(v, { n: 48.2, duration: 1.3, ease: "power2.out", onUpdate: () => { num.textContent = "$" + v.n.toFixed(1) + "k"; } }, 0.55);
  tl.to(tip, { scale: 1, duration: 0.5, ease: "back.out(3)" }, 1.6);
  tl.to(items, { opacity: 1, y: 0, duration: 0.7, ease: "back.out(1.4)", stagger: 0.09 }, 1.5);
  [2.3, 2.75, 3.2].forEach((t, i) => {
    tl.to(cks[i], { backgroundColor: "#EFEDE8", borderColor: "#EFEDE8", duration: 0.2 }, t);
    tl.to(cki[i], { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(3)" }, t);
    tl.to(items[i], { scale: 0.975, duration: 0.12, ease: "power2.out", yoyo: true, repeat: 1 }, t);
  });
  tl.to(toast, { opacity: 1, y: 0, duration: 0.7, ease: "back.out(1.7)" }, 3.85);
  tl.to(toast, { opacity: 0, y: -26, duration: 0.35, ease: "power2.in" }, 5.2);
  tl.to([card, ...items], { opacity: 0, duration: 0.4, ease: "power2.in" }, 5.65);
  tl.to({}, { duration: 0.01 }, 6.19);
  return { tl, reset };
}

function layers(env: Env): Piece {
  const root = $(".l3d"), stack = $(".stack", root), pls = $$(".pl", root), shd = $(".shd", root), o = { e: 0 };
  let mxn = 0, myn = 0, ticking = false;
  stack.style.transform = "rotateX(58deg) rotateZ(-38deg)";
  const apply = () => {
    pls.forEach((p, i) => gsap.set(p, { z: lerp(i * 6, i * 46, o.e) }));
    gsap.set(shd, { scaleX: 1 + 0.2 * o.e, opacity: 1 - 0.4 * o.e });
  };
  apply();
  const tl = gsap.timeline({ repeat: -1 });
  tl.to(o, { e: 1, duration: 1.5, ease: "expo.inOut", onUpdate: apply }, 0.6);
  tl.to(o, { e: 0, duration: 1.5, ease: "expo.inOut", onUpdate: apply }, 3.2);
  tl.to({}, { duration: 0.01 }, 5.5);
  env.on(root, "pointermove", (e: PointerEvent) => {
    const r = root.getBoundingClientRect();
    mxn = (e.clientX - r.left) / r.width - 0.5;
    myn = (e.clientY - r.top) / r.height - 0.5;
  }, { passive: true });
  // gsap.ticker passes time in seconds.
  const tk = (t: number) => {
    stack.style.transform = `rotateX(${(58 - myn * 10).toFixed(2)}deg) rotateZ(${(-38 + Math.sin(t * 0.7) * 7 + mxn * 26).toFixed(2)}deg)`;
  };
  const stop = () => { if (ticking) { ticking = false; gsap.ticker.remove(tk); } };
  env.defer(stop);
  const reset = () => { o.e = 0; apply(); };
  return { tl, reset, extra: { start: () => { if (!ticking) { ticking = true; gsap.ticker.add(tk); } }, stop } };
}

function easing(env: Env): Piece {
  const root = $(".eas"), svg = $<SVGSVGElement>("svg.g", root), curve = $(".curve", root), c1 = $(".c1", root), c2 = $(".c2", root);
  const h1 = $(".h1", root), h2 = $(".h2", root), probe = $(".probe", root), ball = $(".ball", root), trk = $(".trk3", root), tiles = $$(".tl i", root), chips = $$(".chips button", root);
  const PR = [[0, 0, 1, 1], [0.7, 0, 0.2, 1], [0.16, 1, 0.3, 1], [0.3, 1.4, 0.6, 1], [0.6, 1.45, 0.3, 1.18]];
  const E = { a: 0.3, b: 1.4, c: 0.6, d: 1 }, P = { t: 0 };
  let locked = false, timer = 0, idx = 3;
  function bez(t: number) {
    let lo = 0, hi = 1, u = t;
    for (let i = 0; i < 22; i++) {
      const xx = 3 * (1 - u) * (1 - u) * u * E.a + 3 * (1 - u) * u * u * E.c + u * u * u;
      if (xx < t) lo = u; else hi = u;
      u = (lo + hi) / 2;
    }
    return 3 * (1 - u) * (1 - u) * u * E.b + 3 * (1 - u) * u * u * E.d + u * u * u;
  }
  const at = (el: Element, a: Record<string, number>) => { for (const k in a) el.setAttribute(k, String(a[k])); };
  function draw() {
    const X1 = E.a * 200, Y1 = 200 - E.b * 200, X2 = E.c * 200, Y2 = 200 - E.d * 200;
    curve.setAttribute("d", `M0 200C${X1} ${Y1} ${X2} ${Y2} 200 0`);
    at(c1, { x1: 0, y1: 200, x2: X1, y2: Y1 });
    at(c2, { x1: 200, y1: 0, x2: X2, y2: Y2 });
    at(h1, { cx: X1, cy: Y1 });
    at(h2, { cx: X2, cy: Y2 });
  }
  function upd() {
    const v = bez(P.t), W = trk.clientWidth - 28;
    gsap.set(ball, { x: v * W });
    gsap.set(tiles[0], { x: (v - 0.5) * 90 });
    gsap.set(tiles[1], { scale: 0.35 + v * 0.95 });
    gsap.set(tiles[2], { rotation: v * 140, borderRadius: 4 + v * 8 + "px" });
    at(probe, { cx: P.t * 200, cy: 200 - v * 200 });
  }
  draw();
  const loop = gsap.to(P, { t: 1, duration: 1.35, ease: "none", repeat: -1, repeatDelay: 0.75, onUpdate: upd, paused: true });
  function pick(i: number, user: boolean) {
    const v = PR[i];
    if (user) locked = true;
    chips.forEach((c, k) => c.classList.toggle("on", k === i));
    gsap.to(E, { a: v[0], b: v[1], c: v[2], d: v[3], duration: 0.8, ease: "expo.out", overwrite: true, onUpdate: draw });
  }
  chips.forEach((c, i) => env.on(c, "click", () => pick(i, true)));
  [h1, h2].forEach((h, k) => {
    const mv = (ev: PointerEvent) => {
      const pt = new DOMPoint(ev.clientX, ev.clientY).matrixTransform(svg.getScreenCTM()!.inverse());
      const X = clamp(pt.x / 200, 0, 1), Y = clamp((200 - pt.y) / 200, -0.25, 1.45);
      if (k === 0) { E.a = X; E.b = Y; } else { E.c = X; E.d = Y; }
      draw();
    };
    const up = () => { h.removeEventListener("pointermove", mv); h.removeEventListener("pointerup", up); };
    env.on(h, "pointerdown", (e: PointerEvent) => {
      h.setPointerCapture(e.pointerId);
      locked = true;
      gsap.killTweensOf(E);
      chips.forEach((c) => c.classList.remove("on"));
      h.addEventListener("pointermove", mv);
      h.addEventListener("pointerup", up);
    });
  });
  const auto = () => { if (!locked) { idx = (idx + 1) % PR.length; pick(idx, false); } };
  const stop = () => { loop.pause(); clearInterval(timer); };
  env.defer(stop);
  return {
    // The editor has no natural end, so its turn lasts two preset changes.
    tl: gsap.timeline({ repeat: -1, paused: true }).to({}, { duration: 6.6 }),
    extra: { start: () => { loop.play(); clearInterval(timer); timer = window.setInterval(auto, 3300); }, stop },
  };
}

export function initWork(env: Env) {
  const ctl: Record<string, Ctl> = {
    film: { ...film(), on: true, vis: false },
    ex: { ...explainer(), on: false, vis: false },
    ui: { ...ui(), on: false, vis: false },
    d3: { ...layers(env), on: false, vis: false },
    eas: { ...easing(env), on: false, vis: false },
  };
  // A piece plays only while its row is open and the section is on screen.
  const sync = (c: Ctl) => {
    if (c.on && c.vis && !env.reduce) { c.tl.play(); c.extra?.start(); }
    else { c.tl.pause(); c.extra?.stop(); }
  };
  Object.values(ctl).forEach(sync);
  const rows = $$(".row");
  // Only the desktop layout auto-advances; on mobile the accordion would shift the page under the reader.
  const desktop = matchMedia("(min-width: 981px)");
  let overPiece = false, pending = false, hovered: HTMLElement | null = null;
  function activate(row: HTMLElement) {
    pending = false;
    rows.forEach((r) => {
      const on = r === row, c = ctl[r.dataset.p!];
      if (on && !c.on) { c.reset?.(); c.tl.pause(0); }
      r.classList.toggle("on", on);
      $(".rh", r).setAttribute("aria-expanded", String(on));
      c.on = on;
      sync(c);
    });
  }
  const next = () => activate(rows[(rows.findIndex((r) => r.classList.contains("on")) + 1) % rows.length]);
  rows.forEach((r) => {
    const h = $(".rh", r), c = ctl[r.dataset.p!];
    // Each pass of the loop is one full play; when it ends, hand over to the next row.
    c.tl.eventCallback("onRepeat", () => {
      if (!c.on || !desktop.matches) return;
      if (overPiece) pending = true;
      else next();
    });
    env.on(h, "click", () => activate(r));
    if (env.fine) {
      // Hover picks a row once per entry, so auto-advance can move on while the cursor rests.
      env.on(h, "pointermove", (e: PointerEvent) => {
        if (hovered !== r && !r.classList.contains("on") && (e.movementX || e.movementY)) { hovered = r; activate(r); }
      });
      env.on(h, "pointerleave", () => { if (hovered === r) hovered = null; });
    }
    // Hold the hand-over while someone is playing with the piece itself.
    const piece = $(".piece", r);
    env.on(piece, "pointerenter", () => { overPiece = true; });
    env.on(piece, "pointerleave", () => { overPiece = false; if (pending && c.on) next(); });
  });
  env.watch($(".idx"), (v) => Object.values(ctl).forEach((c) => { c.vis = v; sync(c); }), "100px");
}
