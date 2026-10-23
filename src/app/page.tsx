import { SmoothScroll } from "@/components/scroll/smooth-scroll";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Experience } from "@/components/sections/experience";
import { Work } from "@/components/sections/work";
import { Toolkit } from "@/components/sections/toolkit";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <SmoothScroll>
      {/* One long strip on desktop (scrolled along x), a normal stack on mobile. */}
      <main className="md:flex md:h-svh md:w-max md:flex-nowrap md:[&>*]:shrink-0">
        <Hero />
        <About />
        <Experience />
        <Work />
        <Toolkit />
        <Contact />
      </main>
    </SmoothScroll>
  );
}
