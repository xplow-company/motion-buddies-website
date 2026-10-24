import { MarkSymbol } from "@/components/icons";
import { Motion } from "@/components/motion";
import { Contact, Faq, Hero, Nav, Premise, Pricing, Process } from "@/components/sections";
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
        <Process />
        <Work />
        <Faq />
        <Pricing />
        <Contact />
      </main>
      <Motion />
    </>
  );
}
