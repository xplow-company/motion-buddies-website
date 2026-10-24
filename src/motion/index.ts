import { gsap } from "gsap";
import { initBuddy } from "./buddy";
import { initGrid } from "./grid";
import { createEnv, type Shared } from "./kit";
import { initFaq, initForm, initHeroIntro, initPremise, initReveals, initScroll } from "./page";
import { initProcess } from "./process";
import { initWork } from "./work";

export function initSite() {
  const env = createEnv();
  const shared: Shared = { bud: { x: -999, y: -999, sp: 0 }, mfProgress: 0, ripple: () => {} };
  const ctx = gsap.context(() => {
    initReveals(env);
    initScroll(env, initPremise(env, shared));
    initGrid(env, shared);
    initHeroIntro(env, initBuddy(env, shared).start);
    initProcess(env);
    initWork(env);
    initFaq(env);
    initForm(env);
  });
  return () => {
    env.dispose();
    ctx.revert();
  };
}
