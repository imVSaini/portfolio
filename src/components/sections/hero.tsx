import { profile } from "@/data/profile";
import { LocalTime } from "@/components/ui/local-time";
import { ScrollLink } from "@/components/ui/scroll-link";
import type { CSSProperties } from "react";
import { Birds, Cloud, HeroRig } from "@/components/ui/sketches";

export function Hero() {
  return (
    <section
      id="index"
      data-section="index"
      style={
        {
          // 1 board unit in px. The landscape scales by height only, so its ground sits 100
          // units above the bottom of the viewport; the rig is drawn at the same scale, capped
          // by width so it never reaches the text column on squarer screens.
          "--g": "calc(100svh / 900)",
          "--u": "min(calc(100svh / 900), calc(100vw / 1500))",
        } as CSSProperties
      }
      className="relative flex min-h-svh flex-col justify-center overflow-hidden px-[6vw] pt-28 pb-16 md:h-svh md:w-screen md:justify-start md:overflow-visible md:px-[7vw] md:pt-(--top-line) md:pb-0"
    >
      {/* Tower centre at ~77% of the width, base on the landscape's ground line. */}
      <HeroRig className="pointer-events-none absolute bottom-[calc(var(--g)*100-var(--u)*10)] left-[calc(77%-var(--u)*245)] hidden h-[calc(var(--u)*715)] w-[calc(var(--u)*600)] md:block" />
      <Cloud
        className="absolute top-[12%] left-[52%] hidden w-32 min-[75rem]:block"
        data-intro-fade
      />
      <Birds
        className="absolute top-[30%] left-[54%] hidden w-24 min-[75rem]:block"
        data-intro-fade
      />
      <Cloud
        className="absolute top-[50%] left-[51%] hidden w-24 min-[75rem]:block"
        data-intro-fade
      />

      <div className="relative max-w-170 md:max-w-[50vw]">
        <p className="eyebrow mb-3 text-mineral" data-intro-fade>
          fig. 01 — {profile.name}, {profile.role.toLowerCase()}, 5+ years
        </p>
        <h1 className="display mb-7 text-[clamp(3.4rem,13vw,5rem)] md:text-[min(6vw,10vh)] short:mb-4">
          <span className="block" data-intro-split>
            Better Software,
          </span>
          <span className="block text-signal" data-intro-split>
            the {profile.firstName} Way
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
            Explore my work
          </ScrollLink>
          <ScrollLink to="contact" className="btn btn--ghost">
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
        <p
          className="eyebrow mt-3 flex flex-wrap items-center gap-x-2 text-ink-soft short:hidden"
          data-intro-fade
        >
          <span>Bengaluru ·</span>
          <LocalTime timeZone={profile.timezone} label={profile.timezoneLabel} />
          <span className="flex items-center gap-1.5">
            · <span className="size-2 rounded-full bg-mineral" aria-hidden />{" "}
            {profile.availability.toLowerCase()}
          </span>
        </p>
      </div>

      <p
        className="absolute right-[6vw] bottom-[31vh] hidden font-hand text-2xl leading-tight text-plum min-[75rem]:block"
        data-intro-fade
      >
        still sketching…
        <br />
        scroll to finish <span aria-hidden>→</span>
      </p>
    </section>
  );
}
