import { principles, toolkit } from "@/data/toolkit";

export function Toolkit() {
  return (
    <section
      id="toolkit"
      data-section="toolkit"
      className="flex min-h-svh flex-col gap-14 bg-paper px-[4vw] py-24 text-ink md:h-svh md:w-max md:flex-row md:gap-[5vw] md:py-32"
    >
      <div className="flex flex-col justify-between gap-8 md:w-[30vw]">
        <p className="eyebrow text-ink/50">(04) Toolkit</p>
        <h2 className="font-serif text-[3.25rem] leading-[0.95] tracking-[-0.02em] md:text-[min(10vh,5.5vw)]">
          What I reach for, <em className="text-signal">and why.</em>
        </h2>
        <p className="max-w-[26rem] text-base leading-relaxed text-ink/70" data-reveal>
          Python and PostgreSQL do most of the work. Everything else earns its place by making a
          system easier to reason about, cheaper to run or harder to break.
        </p>
      </div>

      {/* Tool groups flow into columns along the x-axis on desktop. */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:h-full md:[grid-auto-columns:minmax(11rem,13vw)] md:grid-flow-col md:grid-rows-2 md:gap-x-[3vw] md:gap-y-0">
        {toolkit.map(({ group, items }, i) => (
          <div key={group} className="border-t border-ink/20 pt-4 md:pb-8">
            <p className="eyebrow mb-5 flex justify-between text-ink/50">
              <span>{group}</span>
              <span>{String(i + 1).padStart(2, "0")}</span>
            </p>
            <ul className="space-y-1.5 text-[1.0625rem] leading-snug">
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <ol className="grid gap-6 md:h-full md:w-[34vw] md:content-between md:gap-0">
        {principles.map((p, i) => (
          <li key={p.title} className="grid grid-cols-[2.5rem_1fr] border-t border-ink/20 pt-4">
            <span className="eyebrow pt-1 text-signal">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h3 className="text-xl font-semibold tracking-[-0.02em]">{p.title}</h3>
              <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink/65">{p.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
