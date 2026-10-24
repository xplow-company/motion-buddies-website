import { gsap } from "gsap";
import { $, $$, clamp, type Env, type Shared } from "./kit";

export function initReveals(env: Env) {
  $$(".rv").forEach((h) => {
    const pd = $(".pd", h);
    const txt = h.textContent!.trim();
    const words = txt.split(/\s+/);
    h.setAttribute("aria-label", txt + ".");
    h.textContent = "";
    words.forEach((w, i) => {
      const l = document.createElement("span");
      l.className = "ln";
      l.setAttribute("aria-hidden", "true");
      const s = document.createElement("span");
      s.className = "wd";
      s.style.setProperty("--i", String(i));
      s.textContent = w;
      l.appendChild(s);
      h.appendChild(l);
      if (i < words.length - 1) h.appendChild(document.createTextNode(" "));
    });
    h.appendChild(pd);
  });
  const io = new IntersectionObserver(
    (es) => {
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        const t = e.target;
        t.classList.add("in");
        io.unobserve(t);
        // Masks clip glyphs mid-motion only; unclip once the stagger has finished.
        if (t.classList.contains("rv")) setTimeout(() => t.classList.add("done"), env.reduce ? 0 : 1200 + 55 * $$(".wd", t).length);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
  );
  $$(".rv,.fd").forEach((e) => io.observe(e));
  env.defer(() => io.disconnect());
}

export function initPremise(env: Env, shared: Shared) {
  const mf = $("#mf");
  const pd = $(".pd", mf);
  const text = mf.textContent!.trim();
  mf.textContent = "";
  const words = text.split(" ").map((w, i, a) => {
    const s = document.createElement("span");
    s.className = "w";
    s.textContent = w + (i < a.length - 1 ? " " : "");
    mf.appendChild(s);
    return s;
  });
  mf.appendChild(pd);
  const sec = $("#premise");
  return function update() {
    const r = sec.getBoundingClientRect();
    const p = clamp(-r.top / (r.height - innerHeight), 0, 1);
    shared.mfProgress = p;
    const f = clamp(p / 0.84, 0, 1) * (words.length + 3);
    for (let i = 0; i < words.length; i++) {
      const o = env.reduce ? 1 : clamp((f - i) / 3, 0, 1);
      words[i].style.opacity = (0.13 + 0.87 * o).toFixed(3);
    }
  };
}

export function initScroll(env: Env, mfUpdate: () => void) {
  const nav = $(".nav");
  let lastY = 0;
  let ticking = false;
  function navDir() {
    const y = scrollY;
    if (y > 200 && y > lastY + 4) nav.classList.add("hide");
    else if (y < lastY - 4 || y < 200) nav.classList.remove("hide");
    lastY = y;
  }
  env.on(window, "scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      mfUpdate();
      navDir();
    });
  }, { passive: true });
  env.on(window, "resize", mfUpdate);
  mfUpdate();
}

export function initHeroIntro(env: Env, startBuddy: () => void) {
  const hero = $("#top");
  const words = $$(".wd.h");
  let done = false;
  function run() {
    if (done || env.dead) return;
    done = true;
    if (env.reduce) {
      words.forEach((w) => (w.style.opacity = "1"));
      hero.classList.add("done");
      startBuddy();
      return;
    }
    gsap.fromTo(words, { yPercent: 130, opacity: 1 }, { yPercent: 0, opacity: 1, duration: 1.25, ease: "expo.out", stagger: 0.09, delay: 0.1, onComplete: () => hero.classList.add("done") });
    gsap.fromTo(".side", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1.1, ease: "expo.out", delay: 0.9 });
    gsap.fromTo(".nav", { opacity: 0 }, { opacity: 1, duration: 1, delay: 0.6 });
    const t = setTimeout(startBuddy, 420);
    env.defer(() => clearTimeout(t));
  }
  document.fonts.ready.then(run);
  const t = setTimeout(run, 1600);
  env.defer(() => clearTimeout(t));
}

export function initFaq(env: Env) {
  const qs = $$(".q");
  qs.forEach((q) => {
    const b = $("button", q);
    env.on(b, "click", () => {
      const open = q.classList.contains("on");
      qs.forEach((x) => {
        x.classList.remove("on");
        $("button", x).setAttribute("aria-expanded", "false");
      });
      if (!open) {
        q.classList.add("on");
        b.setAttribute("aria-expanded", "true");
      }
    });
  });
}

export function initForm(env: Env) {
  // Not wired to email or a CRM yet: the form only confirms locally.
  env.on($("#cf"), "submit", (e: SubmitEvent) => {
    e.preventDefault();
    $("#sent").classList.add("on");
  });
}
