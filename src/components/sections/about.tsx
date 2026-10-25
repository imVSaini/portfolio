import type { CSSProperties } from "react";
import { profile } from "@/data/profile";
import { Ring } from "@/components/ui/sketches";
import { Rough } from "@/components/ui/rough";

const TILTS = ["-1deg", "0.8deg", "0.6deg", "-0.9deg"];
const DRIFT = [0.03, -0.02, 0.04, -0.03];

/** Splits `text` around `phrase` so the phrase can carry the highlighter. */
function withHighlight(text: string, phrase: string) {
  const at = text.indexOf(phrase);
  if (at < 0) return text;
  return (
    <>
      {text.slice(0, at)}
      <span className="hl" data-ink-hl>
        {phrase}
      </span>
      {text.slice(at + phrase.length)}
    </>
  );
}

export function About() {
  return (
    <section
      id="about"
      data-section="about"
      className="relative flex flex-col gap-(--block-gap) px-[6vw] py-(--section-y) md:h-svh md:w-max md:flex-row md:items-start md:gap-[6vw] md:px-[5vw] md:pt-(--top-line) md:pb-[20vh]"
    >
      {/* fig. 02 — the statement */}
      <div className="md:w-[34vw]" data-lit>
        <p className="eyebrow mb-3 text-mineral">fig. 02 — why I draw</p>
        <p className="font-head text-[1.7rem] leading-statement md:text-[min(2.1vw,4vh)]">
          {withHighlight(profile.statement, profile.statementHighlight)}
        </p>
        <p className="mt-6 text-[1.02rem] leading-relaxed text-ink-soft" data-reveal>
          {profile.lead}
        </p>
      </div>

      {/* fig. 03 — the footprint */}
      <div className="relative md:w-[32vw]" data-lit>
        <p className="eyebrow mb-3 text-mineral">fig. 03 — the footprint</p>
        <h2 className="title mb-10 short:mb-6">
          My footprint, <span className="hl">measured in shipped code</span>
        </h2>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-10 short:gap-y-5" data-ink-rings>
          {profile.stats.map((s, i) => (
            <li key={s.label} data-scroll data-scroll-speed={String(DRIFT[i])}>
              <p className="relative inline-flex items-baseline gap-1 px-3.5 py-2 font-hand text-[clamp(3rem,min(4.4vw,7.5vh),4.2rem)] leading-none font-bold">
                <span>{s.value}</span>
                {s.unit && <small className="text-[0.5em] text-ink-soft">{s.unit}</small>}
                <Ring variant={i} />
              </p>
              <p className="mt-2 pl-3.5 font-head text-ink-soft">{s.label}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* fig. 04 — about me */}
      <div className="md:w-[42vw]" data-lit>
        <p className="eyebrow mb-3 text-mineral">fig. 04 — about me</p>
        <h2 className="title mb-10">
          Software should be <span className="hl">the calm part</span> of your business.
        </h2>
        <ul className="grid gap-x-6 gap-y-8 sm:grid-cols-2">
          {profile.pillars.map((p, i) => (
            <li
              key={p.title}
              className="card card--taped"
              style={{ "--tilt": TILTS[i] } as CSSProperties}
            >
              <Rough preset="card" seed={`pillar-${p.title}`} />
              <h3 className="mb-1.5 font-head text-xl leading-tight font-bold">{p.title}</h3>
              <p className="text-[0.95rem] text-ink-soft">{p.text}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* How I work */}
      <div className="md:w-[26vw]">
        <h3 className="mb-2.5 font-hand text-[2.4rem] leading-none font-bold">
          {profile.howIWork.title}
        </h3>
        <p className="text-ink-soft" data-reveal>
          {profile.howIWork.story}
        </p>
        {/* data-lit: items rise in one by one and each tick draws itself when scrolled into view. */}
        <ul className="ticks mt-5" data-lit>
          {profile.howIWork.ticks.map((tick, i) => (
            <li key={tick} style={{ "--i": i } as CSSProperties}>
              {tick}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
