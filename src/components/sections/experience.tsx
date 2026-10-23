import { education, experience } from "@/data/experience";

/**
 * The "fake-vertical" panel. On desktop the outer wrapper is what the horizontal scroll sees;
 * the inner <section> gets pinned and `[data-fake-vertical-track]` is scrubbed upward.
 */
export function Experience() {
  return (
    <div id="experience" data-section="experience" className="md:h-svh">
      <section
        data-fake-vertical
        className="relative bg-paper text-ink md:flex md:h-svh md:w-screen md:overflow-hidden"
      >
        <aside className="flex flex-col justify-between gap-10 px-[4vw] pt-24 pb-6 md:w-[40vw] md:pt-32 md:pb-24">
          <p className="eyebrow text-ink/50">(02) Experience</p>

          <div className="flex items-end gap-6">
            <h2 className="display text-[22vw] whitespace-nowrap md:text-[min(22vh,10.5vw)]">
              2019
              <br />
              <span className="text-ink/25">—Now</span>
            </h2>
            <span className="relative mb-3 hidden h-[28vh] w-px bg-ink/15 md:block" aria-hidden>
              <span
                data-fake-vertical-meter
                className="absolute inset-0 origin-top bg-signal"
                style={{ transform: "scaleY(0)" }}
              />
            </span>
          </div>

          <dl className="eyebrow hidden gap-1 text-ink/60 md:grid">
            <dt className="text-ink/40">Education</dt>
            <dd className="text-ink">{education.degree}</dd>
            <dd>{education.school}</dd>
            <dd>
              {education.start} — {education.end}
            </dd>
          </dl>
        </aside>

        {/* Fades the column out under the header and HUD while it travels. */}
        <div className="px-[4vw] md:w-[60vw] md:mask-[linear-gradient(to_bottom,transparent_6rem,black_12rem,black_calc(100%-7rem),transparent_calc(100%-4rem))] md:pr-[6vw] md:pl-0">
          <ol data-fake-vertical-track className="pb-16 md:pt-32 md:pb-[22vh]">
            {experience.map((role, i) => (
              <li key={role.company} className="border-t border-ink/15 py-10 md:py-14">
                <div className="eyebrow mb-6 flex flex-wrap justify-between gap-2 text-ink/55">
                  <span>
                    {String(i + 1).padStart(2, "0")} — {role.location}
                  </span>
                  <span className="tabular-nums">
                    {role.start} → {role.end}
                  </span>
                </div>

                <h3 className="text-[2rem] leading-none font-semibold tracking-tight md:text-[2.75rem]">
                  {role.company}
                </h3>
                <p className="mt-2 font-serif text-2xl text-ink/70 italic">{role.title}</p>
                <p className="mt-6 max-w-160 text-lg leading-snug">{role.summary}</p>

                <ul className="mt-8 grid gap-x-10 gap-y-4 text-[0.9375rem] leading-relaxed text-ink/75 lg:grid-cols-2">
                  {role.points.map((point) => (
                    <li key={point} className="relative pl-5">
                      <span
                        className="absolute top-[0.7em] left-0 h-px w-2.5 bg-signal"
                        aria-hidden
                      />
                      {point}
                    </li>
                  ))}
                </ul>

                <p className="eyebrow mt-8 text-ink/50">{role.stack.join(" / ")}</p>
              </li>
            ))}

            <li className="border-t border-ink/15 py-10 md:hidden">
              <p className="eyebrow mb-3 text-ink/50">Education</p>
              <p className="text-xl font-semibold">{education.school}</p>
              <p className="mt-1 font-serif text-lg italic">
                {education.degree}, {education.start} — {education.end}
              </p>
            </li>
          </ol>
        </div>
      </section>
    </div>
  );
}
