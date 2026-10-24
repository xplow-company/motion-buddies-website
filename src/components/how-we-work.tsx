import { Pd } from "./icons";

const CARDS = [
  { k: "story", cls: "s4 dk", title: "We find your story", text: "Your product does a lot. We find the one thing buyers need to hear and build the whole film around it." },
  { k: "approve", cls: "s2", title: "You approve every frame first", text: "Script and storyboards come first. We only animate what your team has signed off, so there are no costly surprises at the end." },
  { k: "brand", cls: "s3", title: "It looks like your brand", text: "Your colours, type and product. Not a template, and not our style pasted on top of yours." },
  { k: "cal", cls: "s3 dk", title: "Your team stays on the roadmap", text: "Two short check-ins a week. We handle the rest, so nobody on your side turns into a part-time producer." },
  { k: "chan", cls: "s2 dk", title: "Made for everywhere you launch", text: "One story, cut for your site, socials, sales calls and launch platforms." },
  { k: "res", cls: "s4", title: "Built to move your numbers", text: "When people get the product faster, more of them try it, book the demo and pass it on." },
];

export function HowWeWork() {
  return (
    <section className="hw" id="method">
      <div className="hw-head">
        <h2>A motion team, without the overhead<Pd /></h2>
        <p>We run everything from story to launch files. Your team reviews, signs off, and gets back to building the product.</p>
      </div>
      <div className="bento">
        {CARDS.map((c) => (
          <article key={c.k} className={`bc ${c.cls}`} data-k={c.k}>
            <div className="vis" />
            <div className="txt"><h3>{c.title}</h3><p>{c.text}</p></div>
          </article>
        ))}
      </div>
    </section>
  );
}
