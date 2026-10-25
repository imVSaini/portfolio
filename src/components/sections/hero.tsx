import { profile } from "@/data/profile";
import { ScrollLink } from "@/components/ui/scroll-link";
import { Specimen } from "@/components/ink/specimen";
import { Rough } from "@/components/ui/rough";

export function Hero() {
  return (
    <section
      id="index"
      data-section="index"
      className="relative flex flex-col overflow-hidden px-[6vw] pt-28 pb-(--section-y) md:h-svh md:w-screen md:overflow-visible md:px-[7vw] md:pt-(--top-line) md:pb-0"
    >
      <Specimen className="hidden md:absolute md:top-[calc(var(--top-line)-1.5rem)] md:right-[4vw] md:bottom-[calc(var(--ruler-h)+2rem)] md:left-[58%] md:block xl:left-[57%]" />

      <div className="relative max-w-3xl md:max-w-[min(50vw,46rem)] lg:max-w-[min(48vw,46rem)]">
        <p className="eyebrow mb-3 text-mineral" data-intro-fade>
          fig. 01 — {profile.name}
          <span className="hidden sm:inline">, {profile.role.toLowerCase()}</span>
        </p>
        <h1 className="display mb-7 text-[clamp(2.5rem,10.5vw,5rem)] md:text-[min(6vw,10vh)] short:mb-4">
          <span className="block" data-intro-split>
            Complex systems,
          </span>
          <span className="block text-signal" data-intro-split data-ink-line>
            built with care
          </span>
        </h1>
        <p
          className="mb-8 max-w-150 text-[1.05rem] leading-relaxed text-ink-soft md:text-[1.15rem] short:mb-5 short:text-[1.05rem]"
          data-intro-fade
        >
          {profile.intro}
        </p>
        <div className="mb-8 flex flex-wrap gap-3.5 short:mb-5" data-intro-fade>
          <ScrollLink to="projects" className="btn">
            <Rough preset="button" seed="hero-explore" />
            Explore my work
          </ScrollLink>
          <ScrollLink to="contact" className="btn btn--ghost">
            <Rough preset="button" seed="hero-touch" />
            Get in touch
          </ScrollLink>
        </div>

        <ul className="flex flex-wrap gap-x-6 gap-y-2" data-intro-fade>
          {profile.chips.map((c) => (
            <li key={c.text} className="font-hand text-xl text-ink-soft">
              <strong className="font-head text-xl text-ink">{c.strong}</strong> {c.text}
            </li>
          ))}
        </ul>
      </div>

      <Specimen className="mt-10 aspect-[520/470] w-full max-w-md self-center md:hidden" />

      <p
        className="absolute bottom-[calc(var(--ruler-h)+0.75rem)] left-[7vw] hidden items-center gap-2 font-hand text-xl text-plum md:flex"
        data-intro-fade
      >
        <svg viewBox="0 0 40 30" className="h-6 w-8 overflow-visible" aria-hidden>
          <path
            d="M4 4 C 6 16 14 24 30 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M23 18 L31 24 L23 29"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        scroll sideways — the ruler below walks through my career, 2019 → today
      </p>
    </section>
  );
}
