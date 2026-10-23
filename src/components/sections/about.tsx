import { profile } from "@/data/profile";

export function About() {
  return (
    <section
      id="about"
      data-section="about"
      className="relative flex min-h-svh flex-col justify-between gap-16 bg-ink px-[4vw] py-24 text-paper md:h-svh md:w-[112vw] md:flex-row md:gap-[6vw] md:py-32"
    >
      <div className="flex flex-col justify-between gap-10 md:w-[46vw]">
        <p className="eyebrow text-paper/50">(01) About</p>
        <p
          data-reveal
          className="font-serif text-[2.4rem] leading-[1.02] tracking-[-0.01em] text-balance md:text-[min(7.2vh,4.4vw)]"
        >
          {profile.statement}
        </p>
        <p className="max-w-[34rem] text-base leading-relaxed text-paper/70" data-reveal>
          {profile.now}
        </p>
      </div>

      <div className="flex flex-col justify-end md:w-[52vw]">
        <dl className="grid grid-cols-2 border-t border-paper/15">
          {profile.stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col justify-between gap-10 border-b border-paper/15 py-6 md:py-8 ${i % 2 === 0 ? "border-r pr-6" : "pl-6 md:pl-8"}`}
            >
              <dt className="eyebrow order-2 text-paper/50">{stat.label}</dt>
              <dd className="display order-1 text-[18vw] md:text-[min(17vh,10vw)]">
                {stat.value.startsWith("−") ? (
                  <>
                    <span className="text-signal">−</span>
                    {stat.value.slice(1)}
                  </>
                ) : (
                  stat.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
