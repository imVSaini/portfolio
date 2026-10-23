import type { CSSProperties } from "react";
import { experience } from "@/data/experience";
import { ScrollLink } from "@/components/ui/scroll-link";
import { Cloud } from "@/components/ui/sketches";

const TILTS = ["-0.6deg", "0.5deg", "-0.4deg", "0.6deg"];

function StepNo({ n }: { n: number }) {
  return (
    <span className="absolute -top-7 left-6 grid size-14 place-items-center rounded-blob border-2 border-ink bg-oat font-hand text-[1.8rem] font-bold">
      {String(n).padStart(2, "0")}
    </span>
  );
}

/**
 * The "fake-vertical" panel. On desktop the outer wrapper is what the horizontal scroll sees;
 * the inner <section> gets pinned and `[data-fake-vertical-track]` is scrubbed upward.
 */
export function Experience() {
  return (
    <div id="experience" data-section="experience" className="md:h-svh">
      <section
        data-fake-vertical
        className="relative md:flex md:h-svh md:w-screen md:overflow-hidden"
      >
        <aside className="relative flex flex-col justify-between gap-10 px-[6vw] pt-24 pb-6 md:w-[38vw] md:pt-(--top-line) md:pr-[3vw] md:pb-[29vh] md:pl-[5vw]">
          <Cloud className="absolute top-[calc(var(--header-h)+2vh)] right-[8%] hidden w-24 md:block" />
          <div data-lit>
            <p className="eyebrow mb-3 text-mineral">fig. 06 — the journey</p>
            <h2 className="title">
              From a blank editor to <span className="hl">production</span> — and beyond.
            </h2>
          </div>

          <div className="flex items-end gap-5">
            <p className="font-hand text-[clamp(3.5rem,min(6vw,9vh),5.5rem)] leading-[0.9] font-bold text-signal">
              2019 —<br />
              <span className="text-ink">now</span>
            </p>
            <span
              className="relative mb-2 hidden h-[14vh] w-0.75 rounded bg-ink/15 md:block"
              aria-hidden
            >
              <span
                data-fake-vertical-meter
                className="absolute inset-0 origin-top rounded bg-signal"
                style={{ transform: "scaleY(0)" }}
              />
            </span>
          </div>
        </aside>

        {/* Fades the column out under the header while it travels. */}
        <div className="px-[6vw] md:w-[62vw] md:mask-[linear-gradient(to_bottom,transparent_5rem,black_10rem,black_calc(100%-6rem),transparent_calc(100%-3rem))] md:pr-[6vw] md:pl-[1vw]">
          <ol
            data-fake-vertical-track
            className="space-y-16 pt-10 pb-16 md:pt-[calc(var(--top-line)+1.75rem)] md:pb-[24vh]"
          >
            {experience.map((role, i) => (
              <li
                key={role.company}
                className="card pt-12"
                style={{ "--tilt": TILTS[i % TILTS.length] } as CSSProperties}
              >
                <StepNo n={i + 1} />
                <p className="font-hand text-[1.4rem] leading-none text-signal">
                  {role.start} — {role.end}
                </p>
                <h3 className="mt-1.5 font-head text-[1.6rem] leading-tight font-bold">
                  {role.title}
                </h3>
                <p className="mb-3 font-head text-mineral">
                  @ {role.company} · {role.location}
                </p>
                <p className="max-w-160 text-[1.02rem] leading-snug">{role.summary}</p>

                <ul className="mt-5 grid list-disc gap-x-10 gap-y-2 pl-4.5 text-[0.95rem] text-ink-soft marker:text-signal lg:grid-cols-2">
                  {role.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>

                <p className="mt-4 font-hand text-[1.3rem] leading-snug text-plum">
                  {role.stack.join(" · ")}
                </p>
              </li>
            ))}

            <li className="card pt-12" style={{ "--tilt": "0.8deg" } as CSSProperties}>
              <StepNo n={experience.length + 1} />
              <p className="font-hand text-[1.4rem] leading-none text-signal">Next</p>
              <h3 className="mt-1.5 font-head text-[1.6rem] leading-tight font-bold">
                Your project?
              </h3>
              <p className="mt-2 mb-5 max-w-120 text-ink-soft">
                The next chapter is still a blank page. Bring the problem — I’ll bring the pencil.
              </p>
              <ScrollLink to="contact" className="btn btn--small">
                Start a sketch →
              </ScrollLink>
            </li>
          </ol>
        </div>
      </section>
    </div>
  );
}
