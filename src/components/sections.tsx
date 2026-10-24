import type { CSSProperties } from "react";
import { Arrow, Mark, Pd } from "./icons";

export function Nav() {
  return (
    <header className="nav">
      <a className="lg" href="#top" aria-label="Motion Buddies, home">
        <Mark />
        <span>Motion Buddies</span>
      </a>
      <ul>
        <li><a href="#work">Work</a></li>
        <li><a href="#method">Method</a></li>
        <li><a href="#pricing">Pricing</a></li>
        <li><a href="#faq">FAQ</a></li>
      </ul>
      <a className="cta" href="#contact"><i />Start a project</a>
    </header>
  );
}

export function Hero() {
  return (
    <section className="hero ink" id="top">
      <canvas id="grid" aria-hidden="true" />
      <div className="hero-in">
        <div className="hwrap">
          <h1 aria-label="Make your product move people.">
            <span className="ln" aria-hidden="true"><span className="wd h">Make</span>{" "}<span className="wd h">your</span></span>
            <span className="ln2" aria-hidden="true"><span className="ln"><span className="wd h">product</span></span>{" "}<span className="ln"><span className="wd h">move</span></span></span>
            <span className="ln" aria-hidden="true"><span className="wd h">people</span><Pd /></span>
          </h1>
          <div className="side">
            <p>We turn ambitious AI and SaaS products into compelling visual stories through motion design, 3D, and creative technology.</p>
            <a className="btn" href="#contact">Let’s make something move<Arrow /></a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Premise() {
  return (
    <section className="mfs ink" id="premise">
      <div className="st">
        <p className="mf" id="mf">
          Your product took years to build. A buyer gives it six seconds. We turn those seconds into a feeling, so the complicated looks obvious and the right people lean in<Pd gate="mf" />
        </p>
      </div>
    </section>
  );
}

const STEPS = [
  ["Brief", "A 30-minute call and a link to your product. We come back with the one idea the whole film is built on."],
  ["Boards", "Every shot is sketched before anything moves, so you approve the story, not a guess."],
  ["Style frames", "The look, locked in your brand. Type, colour and the key frames of the film."],
  ["Animation", "Everything moves, with sound. You review cuts from a link and comment on the exact frame."],
  ["Delivery", "Every ratio and cut-down you need, ready for your homepage, feeds and sales calls."],
];

export function Process() {
  return (
    <section className="flow bone" id="method">
      <div className="fst">
        <div className="fl-l">
          <h2 className="rv">From brief to final frame<Pd /></h2>
          <ol className="fsteps">
            {STEPS.map(([t, d], i) => (
              <li key={t} className={i === 0 ? "on" : undefined} data-i={i}>
                <h3>{t}</h3>
                <div className="fd2"><p>{d}</p></div>
              </li>
            ))}
          </ol>
        </div>
        <div className="fl-r">
          <div className="stg" aria-hidden="true">
            <div className="bf">
              <h4>Launch film, 60 seconds</h4>
              <dl>
                <dt>For</dt><dd>Platform teams at growing SaaS companies</dd>
                <dt>The idea</dt><dd>Deploys without the dread</dd>
                <dt>Runs on</dt><dd>Homepage, launch post, sales calls</dd>
                <dt>Due</dt><dd>Launch week</dd>
              </dl>
            </div>
            <div className="mainf">
              <div className="fr fr169 mf1" />
              <div className="sk"><svg viewBox="0 0 160 90" /></div>
            </div>
            <div className="ftl">
              <div className="lane"><i style={{ left: "4%", width: "21%" }} /></div>
              <div className="lane"><i style={{ left: "18%", width: "23%" }} /></div>
              <div className="lane"><i style={{ left: "48%", width: "34%" }} /></div>
              <b className="kd" style={{ left: "4%", top: "16%" }} />
              <b className="kd" style={{ left: "18%", top: "50%" }} />
              <b className="kd" style={{ left: "48%", top: "84%" }} />
              <span className="fph" />
            </div>
            <div className="dlv">
              <figure><div className="fr d169" /><figcaption>16:9</figcaption></figure>
              <figure><div className="fr d916" /><figcaption>9:16</figcaption></figure>
              <figure><div className="fr d11" /><figcaption>1:1</figcaption></figure>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const FAQS = [
  ["What do you need from us to start?", "A link to your product, a sense of who needs to be moved, and the moment it is for: a launch, a raise, a sales push. We handle story, boards and motion from there."],
  ["How long does a launch film take?", "It depends on length and how much UI and 3D is involved. We set a schedule at kickoff that you can plan a release date around, and we tell you early if a date is tight."],
  ["Can you work from our brand and Figma files?", "Yes. We build from your Figma, your UI and your brand. If there is no motion language yet, we write one as part of the project so the work feels like you."],
  ["Do you use AI in production?", "Where it makes the work better or faster: ideation, previs, iteration. Direction, craft and every final frame are human and reviewed. You get the quality of a studio, not the look of a generator."],
  ["How do reviews and revisions work?", "You get a review link at each stage with timestamped comments. The number of rounds is set in the scope, so there are no surprises."],
  ["Who owns the final files?", "You do. The finished film and its cut-downs are yours to use anywhere. Source files come with Launch and Partner projects."],
];

export function Faq() {
  return (
    <section className="sec bone" id="faq">
      <div className="fqg">
        <div className="sh">
          <h2 className="rv">Straight answers<Pd /></h2>
          <p className="lead fd">The things founders and marketing leads ask us first. Anything else, ask us directly.</p>
          <a className="btn fd" href="#contact" style={{ marginTop: 30 }}>Ask a question<Arrow /></a>
        </div>
        <div className="faq fd">
          {FAQS.map(([q, a], i) => (
            <div key={q} className={i === 0 ? "q on" : "q"}>
              <button aria-expanded={i === 0}>{q}<span className="pm" /></button>
              <div className="qa"><div><p>{a}</p></div></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const TIERS = [
  { name: "Spot", sub: "One piece, done properly.", items: ["One motion piece up to 30 seconds", "Product loop, UI animation or explainer segment", "Boards and style frames", "Sound design", "Two review rounds"] },
  { name: "Launch", sub: "The film that carries your release.", hot: true, items: ["Hero film, 45 to 90 seconds", "UI, 3D and explainer shots as needed", "Cut-downs for social and sales", "Sound design and voiceover direction", "Three review rounds and source files"] },
  { name: "Partner", sub: "A motion team on call.", items: ["Monthly retainer", "Every release, update and campaign", "Brand motion system, kept current", "Priority scheduling", "A shared board for reviews"] },
];

export function Pricing() {
  return (
    <section className="sec ink" id="pricing">
      <div className="sh">
        <h2 className="rv">Priced by what has to move<Pd /></h2>
        <p className="lead fd">Three ways to work together, scoped to your brief. Tell us what you are launching and we send back a clear plan and a fixed price.</p>
      </div>
      <div className="tiers">
        {TIERS.map((t, i) => (
          <article key={t.name} className={t.hot ? "tier hot fd" : "tier fd"} style={{ "--d": `${i * 90}ms` } as CSSProperties}>
            <h3>{t.name}</h3>
            <p className="sub">{t.sub}</p>
            <ul>{t.items.map((it) => <li key={it}>{it}</li>)}</ul>
            <div className="ft"><a className="btn" href="#contact">Start<Arrow /></a></div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="fill" />
      <Mark className="wm" />
      <div>
        <h2 className="rv">Let’s make something move<Pd /></h2>
        <div className="cgrid">
          <p className="lead fd">Tell us what has to move. A few lines is plenty. We read every brief and come back with questions, a plan, or an honest “not us”.</p>
          <form className="form fd" id="cf" noValidate>
            <label><input name="n" aria-label="Name" placeholder="Your name" autoComplete="name" /></label>
            <label><input name="e" aria-label="Work email" type="email" placeholder="you@company.com" autoComplete="email" /></label>
            <label className="w"><textarea name="m" aria-label="What has to move?" rows={2} placeholder="A launch, a feature, a funding story…" /></label>
            <div className="sub">
              <button className="btn" type="submit">Send brief<Arrow /></button>
              <span className="sent" id="sent">Thank you. Your brief is in.</span>
            </div>
          </form>
        </div>
      </div>
      <footer className="foot">
        <span>© 2026 Motion Buddies</span>
        <nav><a href="#work">Work</a><a href="#method">Method</a><a href="#pricing">Pricing</a><a href="#top">Back to top</a></nav>
      </footer>
    </section>
  );
}
