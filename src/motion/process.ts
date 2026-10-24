import { gsap } from "gsap";
import { $, $$, clamp, type Env } from "./kit";

const NS = "http://www.w3.org/2000/svg";
const CURSOR = '<svg class="c-cur" viewBox="0 0 20 20"><path d="M3 2l13 6.2-5.6 1.7L8 15.6z" fill="#0A0A0B" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></svg>';
const CHART = "M0 70 C24 66 38 56 60 58 C82 60 94 40 116 37 C138 34 150 44 168 26 C180 14 190 14 200 8";
// One composition, injected into every frame; container queries re-lay it out per aspect ratio.
const SHOT =
  '<div class="cmp"><div class="c-h"><span class="ml"><b>Ship without</b></span><span class="ml"><b>the dread.</b></span></div>' +
  '<div class="c-card"><div class="c-top"><i></i><span>Deploys</span><em>Live</em></div>' +
  `<svg class="c-ch" viewBox="0 0 200 80" preserveAspectRatio="none"><path class="c-ar" d="${CHART} L200 80 L0 80Z" fill="rgba(255,75,31,.13)"/><path class="c-ln" pathLength="1" d="${CHART}" fill="none" stroke="#FF4B1F" stroke-width="3" stroke-linecap="round" stroke-dasharray="1" stroke-dashoffset="0" vector-effect="non-scaling-stroke"/></svg>` +
  '<div class="c-btn"><span class="b1">Deploy</span><span class="b2">Deployed</span></div></div>' +
  CURSOR +
  "</div>";

function drawStoryboard(sv: SVGSVGElement) {
  let seed = 7;
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280 - 0.5; };
  const rough = (pts: number[][], j: number) => pts.map((p, i) => (i ? "L" : "M") + (p[0] + rnd() * j).toFixed(2) + " " + (p[1] + rnd() * j).toFixed(2)).join("");
  const rect = (x: number, y: number, w: number, h: number) => rough([[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x + 0.6, y - 0.4]], 0.7);
  const scrib = (x: number, y: number, w: number) => {
    const n = Math.round(w / 2.2), p: number[][] = [];
    for (let i = 0; i <= n; i++) p.push([x + (i * w) / n, y + (i % 2 ? -1.6 : 1.6)]);
    return rough(p, 0.4);
  };
  function add(tag: string, attrs: Record<string, string | number>, txt?: string) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, String(attrs[k]));
    if (txt) e.textContent = txt;
    sv.appendChild(e);
    return e;
  }
  const strokes: Element[] = [];
  const S = (d: string, cls = "st") => strokes.push(add("path", { d, class: cls, pathLength: 1, "stroke-dasharray": 1, "stroke-dashoffset": 1 }));
  sv.replaceChildren();
  S(rect(3, 3, 154, 84));
  S(scrib(13, 37, 46)); S(scrib(13, 47, 34));
  S(rect(86.4, 23.4, 59.2, 43)); S(rect(86.6, 23.6, 59, 42.8));
  S(rough([[91, 29], [95, 29]], 0.2)); S(rough([[98, 29], [110, 29]], 0.2));
  S(rough([[91, 54], [100, 50], [108, 51], [116, 44], [124, 45], [132, 38], [141, 33]], 0.3));
  S(rough([[124, 58], [140, 58], [141.6, 60.5], [140, 63], [124, 63], [122.4, 60.5], [124, 58]], 0.3));
  S(rough([[22, 22], [20, 28], [19, 31]], 0.3), "ar2"); S(rough([[17.5, 29], [19, 31.4], [21.3, 29.6]], 0.2), "ar2");
  S(rough([[118, 13], [116, 18], [116, 21]], 0.3), "ar2"); S(rough([[114.4, 19], [116, 21.4], [117.8, 19.2]], 0.2), "ar2");
  S(rough([[130, 80], [131, 72], [132, 66]], 0.3), "ar2"); S(rough([[130.2, 68], [132, 65.6], [133.8, 68.2]], 0.2), "ar2");
  const notes = [add("text", { x: 24, y: 20 }, "headline lands first"), add("text", { x: 94, y: 12 }, "card slides up, settles"), add("text", { x: 96, y: 85 }, "click → deploy, button answers")];
  return { strokes, notes };
}

export function initProcess(env: Env) {
  const sec = $("#method");
  $$(".fr", sec).forEach((f) => (f.innerHTML = SHOT));
  const { strokes, notes } = drawStoryboard($<SVGSVGElement>(".sk svg", sec));
  const bf = $(".bf", sec), mainf = $(".mainf", sec), sk = $(".sk", sec), ftl = $(".ftl", sec), dlv = $(".dlv", sec);
  const figs = $$(".dlv figure", sec), lis = $$(".fsteps li", sec), kds = $$(".kd", ftl), fph = $(".fph", ftl);
  const m = $(".mf1", sec), hl = $$(".c-h b", m), card = $(".c-card", m), ln = $(".c-ln", m), ar = $(".c-ar", m);
  const btn = $(".c-btn", m), b1 = $(".b1", m), b2 = $(".b2", m), cur = $(".c-cur", m);

  function finalPose() {
    gsap.set(hl, { yPercent: 0 }); gsap.set(card, { opacity: 1, yPercent: 0 }); gsap.set(ln, { strokeDashoffset: 0 }); gsap.set(ar, { opacity: 1 });
    gsap.set(btn, { scale: 1, backgroundColor: "#0A0A0B", color: "#fff" }); gsap.set(b1, { opacity: 1 }); gsap.set(b2, { opacity: 0 });
    gsap.set(cur, { opacity: 0, left: "97%", top: "94%" });
  }
  const loop = gsap.timeline({ repeat: -1, paused: true });
  loop.add(() => {
    gsap.set(hl, { yPercent: 125 }); gsap.set(card, { opacity: 0, yPercent: 16 }); gsap.set(ln, { strokeDashoffset: 1 }); gsap.set(ar, { opacity: 0 });
    gsap.set(btn, { scale: 1, backgroundColor: "#0A0A0B", color: "#fff" }); gsap.set(b1, { opacity: 1 }); gsap.set(b2, { opacity: 0 });
    gsap.set(cur, { opacity: 0, left: "97%", top: "94%" });
    kds.forEach((k) => k.classList.remove("on"));
  }, 0);
  loop.fromTo(fph, { left: "0%" }, { left: "100%", duration: 4.6, ease: "none", immediateRender: false }, 0);
  loop.to(hl, { yPercent: 0, duration: 0.95, ease: "expo.out", stagger: 0.1 }, 0.2);
  loop.to(card, { opacity: 1, yPercent: 0, duration: 1.1, ease: "expo.out" }, 0.85);
  loop.to(ln, { strokeDashoffset: 0, duration: 1, ease: "power2.inOut" }, 1.25);
  loop.to(ar, { opacity: 1, duration: 0.6 }, 1.7);
  loop.set(cur, { opacity: 1 }, 2.2);
  loop.to(cur, { left: "83.5%", top: "64%", duration: 0.8, ease: "power3.inOut" }, 2.2);
  loop.to(btn, { scale: 0.9, duration: 0.1, ease: "power2.in" }, 3.0);
  loop.to(btn, { scale: 1, duration: 0.7, ease: "elastic.out(1,.45)" }, 3.1);
  loop.to(btn, { backgroundColor: "#FF4B1F", color: "#0A0A0B", duration: 0.25 }, 3.1);
  loop.to(b1, { opacity: 0, duration: 0.15 }, 3.1);
  loop.to(b2, { opacity: 1, duration: 0.2 }, 3.15);
  loop.to(cur, { opacity: 0, duration: 0.3 }, 3.7);
  [0.2, 0.85, 2.2].forEach((t, k) => loop.add(() => kds[k].classList.add("on"), t));
  loop.to({}, { duration: 0.01 }, 4.59);

  const reduce = env.reduce, E = "expo.inOut";
  let curI = -1;
  function show(i: number) {
    if (i === curI) return;
    curI = i;
    lis.forEach((l, k) => l.classList.toggle("on", k === i));
    const d = reduce ? 0 : 0.9;
    gsap.to(bf, { autoAlpha: i === 0 ? 1 : 0, y: i === 0 ? 0 : i > 0 ? -40 : 40, duration: d, ease: E, overwrite: true });
    gsap.to(mainf, { autoAlpha: i >= 1 && i <= 3 ? 1 : 0, scale: i === 3 ? 0.8 : 1, y: i === 3 ? "-9%" : "0%", duration: d, ease: E, overwrite: true });
    gsap.to(sk, { autoAlpha: i === 1 ? 1 : 0, duration: reduce ? 0 : 0.55, overwrite: true });
    if (i === 1) {
      gsap.fromTo(strokes, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: reduce ? 0 : 0.8, ease: "power2.out", stagger: reduce ? 0 : 0.07, delay: reduce ? 0 : 0.3, overwrite: true });
      gsap.fromTo(notes, { opacity: 0, y: 2 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.25, delay: reduce ? 0 : 0.9, overwrite: true });
    }
    gsap.to(ftl, { autoAlpha: i === 3 ? 1 : 0, duration: d * 0.6, overwrite: true });
    if (i === 3 && !reduce) loop.restart();
    else { loop.pause(); finalPose(); }
    gsap.to(dlv, { autoAlpha: i === 4 ? 1 : 0, duration: d * 0.6, overwrite: true });
    if (i === 4) gsap.fromTo(figs, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: reduce ? 0 : 0.9, ease: "expo.out", stagger: 0.1, delay: reduce ? 0 : 0.15, overwrite: true });
  }
  // 5.15 rather than 5 leaves a short hold on Delivery before the section unpins.
  function upd() {
    const r = sec.getBoundingClientRect();
    const p = clamp(-r.top / (r.height - innerHeight), 0, 1);
    show(Math.min(4, Math.floor(p * 5.15)));
  }
  lis.forEach((l, k) =>
    env.on(l, "click", () => {
      const top = sec.getBoundingClientRect().top + scrollY, span = sec.offsetHeight - innerHeight;
      scrollTo({ top: top + span * ((k + 0.5) / 5.15), behavior: reduce ? "auto" : "smooth" });
    }),
  );
  finalPose();
  show(0);
  env.on(window, "scroll", upd, { passive: true });
  upd();
  env.watch(sec, (v) => {
    if (!v) loop.pause();
    else if (curI === 3 && !reduce) loop.play();
  });
  env.defer(() => gsap.killTweensOf([bf, mainf, sk, ftl, dlv, ...figs, ...strokes, ...notes]));
}
