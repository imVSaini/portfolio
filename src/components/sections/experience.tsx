import type { CSSProperties } from "react";
import { experience } from "@/data/experience";
import { ScrollLink } from "@/components/ui/scroll-link";
import { Rough } from "@/components/ui/rough";

const TILTS = ["-0.6deg", "0.5deg", "-0.4deg", "0.6deg"];

function StepNo({ n }: { n: number }) {
  return (
    <span
      data-ink-step
      className="absolute -top-7 left-6 isolate grid size-14 place-items-center font-hand text-[1.8rem] font-bold"
    >
      <span className="absolute inset-0.5 -z-20 rounded-full bg-oat" aria-hidden />
      <span className="ink-step-fill absolute inset-0.5 -z-10 rounded-full bg-signal" aria-hidden />
      <Rough preset="circle" seed={`step-${n}`} />
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
        <aside className="relative flex flex-col justify-start gap-10 px-[6vw] pt-(--section-y) pb-6 md:w-[38vw] md:pt-(--top-line) md:pr-[3vw] md:pb-[29vh] md:pl-[5vw]">
          <div data-lit>
            <p className="eyebrow mb-3 text-mineral">fig. 06 — the journey</p>
            <h2 className="title">
              From a blank editor to <span className="hl">production</span> — and beyond.
            </h2>
          </div>
        </aside>

        {/* Fades the column out under the header and above the career ruler while it travels. */}
        <div className="px-[6vw] md:w-[62vw] md:mask-[linear-gradient(to_bottom,transparent_var(--header-h),black_calc(var(--header-h)+2rem),black_calc(100%-var(--ruler-h)-4rem),transparent_calc(100%-var(--ruler-h)-0.5rem))] md:pr-[6vw] md:pl-[1vw]">
          <ol
            data-fake-vertical-track
            className="space-y-12 pt-10 pb-(--section-y) md:pt-[calc(var(--top-line)+1.75rem)] md:pb-[calc(var(--ruler-h)+6rem)]"
          >
            {experience.map((role, i) => (
              <li
                key={role.company}
                className="card pt-12"
                style={{ "--tilt": TILTS[i % TILTS.length] } as CSSProperties}
              >
                <Rough preset="card" seed={`job-${role.company}`} />
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
              <Rough preset="card" seed="job-next" />
              <StepNo n={experience.length + 1} />
              <p className="font-hand text-[1.4rem] leading-none text-signal">Next</p>
              <h3 className="mt-1.5 font-head text-[1.6rem] leading-tight font-bold">
                Your project?
              </h3>
              <p className="mt-2 mb-5 max-w-120 text-ink-soft">
                The next chapter is still a blank page. Bring the problem — I’ll bring the pencil.
              </p>
              <ScrollLink to="contact" className="btn btn--small">
                <Rough preset="button" seed="job-next-cta" />
                Start a sketch →
              </ScrollLink>
            </li>
          </ol>
        </div>
      </section>
    </div>
  );
}
