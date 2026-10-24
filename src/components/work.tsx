import type { ReactNode } from "react";
import { Check, Mark, Pd } from "./icons";

function FilmPiece() {
  return (
    <div className="pc film">
      <div className="fm">
        <div className="fr169">
          <div className="cd c1"><h4><span className="ml"><b>A new way</b></span><span className="ml"><b>to see it.</b></span></h4></div>
          <div className="cd c2"><h4><span className="ml"><b>The first</b></span><span className="ml"><b>six seconds.</b></span></h4></div>
          <div className="cd c3">
            <h4><span className="ml"><b>Made to</b></span><span className="ml"><b>move people.</b></span></h4>
            <div className="mk"><Mark /></div>
          </div>
        </div>
        <div className="tlx">
          <div className="trk"><span className="cl" /><span className="cl" /><span className="cl" /><i className="php" /></div>
          <div className="trk t2"><span className="cl" /><span className="cl" /><span className="cl" /></div>
        </div>
      </div>
    </div>
  );
}

function ExplainerPiece() {
  return (
    <div className="pc ex">
      <svg viewBox="22 68 356 424" preserveAspectRatio="xMidYMid meet">
        <g fill="rgba(255,255,255,.03)" stroke="rgba(255,255,255,.26)">
          {[["Docs", 40], ["Events", 152], ["Chats", 264]].map(([t, x]) => (
            <g key={t} className="cp">
              <rect x={x} y="86" width="96" height="42" rx="12" />
              <text x={Number(x) + 48} y="111" textAnchor="middle" stroke="none">{t}</text>
            </g>
          ))}
        </g>
        <g fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="1.2">
          <path className="ln1" d="M88 128 C88 168 200 158 200 200" />
          <path className="ln1" d="M200 128 L200 200" />
          <path className="ln1" d="M312 128 C312 168 200 158 200 200" />
          <path className="ln1" d="M200 320 L200 392" />
        </g>
        <circle className="ring" cx="200" cy="260" r="62" fill="none" stroke="#FF4B1F" strokeWidth="1.5" opacity="0" />
        <rect className="mdl" x="140" y="200" width="120" height="120" rx="28" fill="#19191C" stroke="rgba(255,255,255,.38)" />
        <g className="dots" fill="#fff" />
        <rect className="card" x="100" y="392" width="200" height="82" rx="16" fill="rgba(255,255,255,.03)" stroke="rgba(255,255,255,.26)" />
        <g className="bars" />
        {[0, 1, 2, 3].map((i) => <circle key={i} className="pk" r="4.5" fill="#FF4B1F" opacity="0" />)}
      </svg>
    </div>
  );
}

function UiPiece() {
  return (
    <div className="pc ui">
      <div className="toast"><i><Check /></i>Report ready</div>
      <div className="uw">
        <div className="ucard">
          <div className="r1">Weekly signups</div>
          <div className="big"><span className="num">0</span><small>+12%</small></div>
          <svg viewBox="0 0 200 68" fill="none">
            <path className="area" d="M0 56 C20 52 34 44 52 46 C72 48 84 30 104 28 C124 26 138 36 156 20 C170 10 184 12 200 4 L200 68 L0 68Z" fill="rgba(255,75,31,.12)" stroke="none" />
            <path className="line" d="M0 56 C20 52 34 44 52 46 C72 48 84 30 104 28 C124 26 138 36 156 20 C170 10 184 12 200 4" stroke="#FF4B1F" strokeWidth="2" strokeLinecap="round" />
            <circle className="tip" cx="200" cy="4" r="4.5" fill="#FF4B1F" />
          </svg>
        </div>
        <ul className="ulist">
          {["Connect data source", "Pick a model", "Share with team"].map((t) => (
            <li key={t}><i className="ck"><Check width={2.2} /></i><span>{t}</span></li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function LayersPiece() {
  return (
    <div className="pc l3d">
      <div className="scene">
        <div className="shd" />
        <div className="stack">
          <div className="pl p1" /><div className="pl p2" /><div className="pl p3" /><div className="pl p4" />
          <div className="pl p5"><Mark /></div>
        </div>
      </div>
    </div>
  );
}

function EasingPiece() {
  return (
    <div className="pc eas">
      <div className="gx">
        <svg className="g" viewBox="-14 -100 228 354">
          <g stroke="rgba(255,255,255,.08)"><path d="M0 0H200M0 50H200M0 100H200M0 150H200M0 200H200M0 0V200M50 0V200M100 0V200M150 0V200M200 0V200" /></g>
          <path d="M0 200H200M0 0H200" stroke="rgba(255,255,255,.22)" strokeDasharray="3 4" />
          <line className="c1" stroke="rgba(255,255,255,.3)" />
          <line className="c2" stroke="rgba(255,255,255,.3)" />
          <path className="curve" fill="none" stroke="#EFEDE8" strokeWidth="2.4" strokeLinecap="round" />
          <circle className="probe" r="4.5" fill="#FF4B1F" />
          <circle className="hd h1" r="8" fill="#0A0A0B" stroke="#EFEDE8" strokeWidth="2" />
          <circle className="hd h2" r="8" fill="#0A0A0B" stroke="#EFEDE8" strokeWidth="2" />
        </svg>
      </div>
      <div className="row3">
        <div className="trk3"><i className="ball" /></div>
        <div className="tiles"><div className="tl"><i /></div><div className="tl"><i /></div><div className="tl"><i /></div></div>
      </div>
      <div className="chips">
        {["Default", "Snap", "Glide", "Settle", "Spring"].map((n, i) => (
          <button key={n} className={i === 3 ? "on" : undefined}>{n}</button>
        ))}
      </div>
    </div>
  );
}

const ROWS: { key: string; title: string; kick: string; body: string; piece: ReactNode }[] = [
  { key: "film", title: "Launch films", kick: "The sixty seconds your release is remembered by.", body: "Story-led films for launches, funding announcements and keynote moments. Concept, script, boards, animation and sound, from one team in one cut.", piece: <FilmPiece /> },
  { key: "ex", title: "Product explainers", kick: "Complicated, made obvious.", body: "Models, pipelines and platforms are hard to picture. We find the one idea that makes them click, then animate it clean.", piece: <ExplainerPiece /> },
  { key: "ui", title: "UI & product animation", kick: "Your interface, performing.", body: "Interaction films, feature reveals and in-product motion built from your real UI. Every transition designed, not defaulted.", piece: <UiPiece /> },
  { key: "d3", title: "3D & CGI", kick: "Depth that earns attention.", body: "Product visuals, abstract worlds and camera moves that give software a physical presence, without ever looking like stock.", piece: <LayersPiece /> },
  { key: "eas", title: "Brand motion systems", kick: "Rules for how you move.", body: "Easing, timing, transitions and logo motion, documented once so every team ships the same feel.", piece: <EasingPiece /> },
];

export function Work() {
  return (
    <section className="sec ink" id="work">
      <div className="sh" style={{ marginBottom: "clamp(30px,4vw,56px)" }}>
        <h2 className="rv">Five ways to make it move<Pd /></h2>
      </div>
      <div className="idx fd">
        <ul className="rows">
          {ROWS.map((r, i) => (
            <li key={r.key} className={i === 0 ? "row on" : "row"} data-p={r.key}>
              <button className="rh" aria-expanded={i === 0}><span className="t">{r.title}</span></button>
              <div className="rb">
                <div className="in">
                  <p className="kick">{r.kick}</p>
                  <p>{r.body}</p>
                  <div className="piece">{r.piece}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
