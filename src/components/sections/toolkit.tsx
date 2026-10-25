import type { CSSProperties } from "react";
import { toolkit } from "@/data/toolkit";
import { cn } from "@/lib/cn";
import { Rough } from "@/components/ui/rough";

const TILTS = ["-0.8deg", "0.7deg", "0.5deg", "-0.6deg", "-0.4deg", "0.9deg", "0.6deg", "-0.7deg"];

export function Toolkit() {
  return (
    <section
      id="skills"
      data-section="skills"
      className="relative flex flex-col gap-(--block-gap) px-[6vw] py-(--section-y) md:h-svh md:w-max md:flex-row md:items-start md:gap-[4vw] md:px-[5vw] md:pt-(--top-line) md:pb-0"
    >
      <div className="md:w-[min(34vw,36rem)]" data-lit>
        <p className="eyebrow mb-3 text-mineral">fig. 05 — what’s in the pencil case</p>
        <h2 className="title mb-6">
          Tools I trust, <span className="hl">sharpened over 5+ years.</span>
        </h2>
        <p className="text-[1.05rem] leading-relaxed text-ink-soft" data-reveal>
          From Python services and Node APIs to React interfaces, cloud infrastructure and
          LLM-powered features — the full stack, end to end.
        </p>
      </div>

      {/* Cards flow into columns along the x-axis on desktop. */}
      <ul className="grid gap-x-7 gap-y-9 sm:grid-cols-2 md:mt-3.25 md:auto-cols-104 md:grid-flow-col md:grid-cols-none md:grid-rows-2 md:gap-x-[2vw] md:gap-y-[min(4.5vh,2.5rem)]">
        {toolkit.map((group, i) => (
          <li
            key={group.group}
            className="card card--taped card--lift self-start md:px-5.5 md:py-4.5"
            style={{ "--tilt": TILTS[i % TILTS.length] } as CSSProperties}
          >
            <Rough preset="card" seed={`skills-${group.group}`} />
            <span
              className={cn(
                "inline-block font-hand text-[1.2rem] leading-tight",
                i % 2 ? "text-mineral" : "text-signal",
              )}
            >
              {group.doodle} {group.items.length} tools
            </span>
            <h3 className="font-head text-[1.25rem] leading-tight font-bold">{group.group}</h3>
            <p className="font-hand text-[1.1rem] leading-tight text-ink-soft">{group.note}</p>
            <ul className="mt-2.5 flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <li
                  key={item}
                  className={cn("chip", group.featured?.includes(item) && "chip--featured")}
                >
                  <Rough
                    preset={group.featured?.includes(item) ? "chip-featured" : "chip"}
                    seed={`chip-${item}`}
                    pad={1}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}
