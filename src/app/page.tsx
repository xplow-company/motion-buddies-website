import { MarkSymbol } from "@/components/icons";
import { Motion } from "@/components/motion";
import { HowWeWork } from "@/components/how-we-work";
import { Contact, Faq, Hero, Nav, Premise, Pricing } from "@/components/sections";
import { Work } from "@/components/work";

export default function Home() {
  return (
    <>
      <MarkSymbol />
      <div id="buddy" aria-hidden="true"><i /></div>
      <Nav />
      <main>
        <Hero />
        <Premise />
        <HowWeWork />
        <Work />
        <Faq />
        <Pricing />
        <Contact />
      </main>
      <Motion />
    </>
  );
}
