import { profile } from "@/data/profile";
import { LocalTime } from "@/components/ui/local-time";

export function Hero() {
  return (
    <section
      id="index"
      data-section="index"
      className="relative flex min-h-svh flex-col justify-between bg-paper px-[4vw] pt-28 pb-10 text-ink md:h-svh md:w-max md:min-w-screen md:pt-32 md:pb-20"
    >
      <div
        className="eyebrow grid grid-cols-2 gap-y-2 text-ink/60 md:flex md:gap-[6vw]"
        data-intro-fade
      >
        <span>Portfolio ’26</span>
        <span>{profile.location}</span>
        <LocalTime timeZone={profile.timezone} label={profile.timezoneLabel} />
        <span className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-signal" aria-hidden />
          Open to senior backend roles
        </span>
      </div>

      <h1
        data-hero-name
        className="display my-10 text-[23vw] md:my-0 md:text-[min(34vh,22vw)] md:whitespace-nowrap"
      >
        <span className="sr-only">{profile.name}</span>
        <span aria-hidden className="block md:inline" data-intro-split>
          {profile.firstName}
        </span>{" "}
        <span aria-hidden className="block md:inline" data-intro-split>
          Kumar
        </span>{" "}
        <span aria-hidden className="block md:inline" data-intro-split>
          Saini<span className="text-signal">.</span>
        </span>
      </h1>

      <div className="grid gap-8 md:w-[92vw] md:grid-cols-[minmax(0,28rem)_1fr_auto] md:items-end md:gap-[6vw]">
        <p className="text-lg leading-snug text-balance md:text-xl" data-intro-fade>
          <span className="font-serif text-[1.15em] italic">{profile.role}</span> {profile.intro}
        </p>
        <p className="eyebrow max-w-88 text-ink/60" data-intro-fade>
          Python · FastAPI · PostgreSQL · Redis · Celery · LangGraph · Node.js · AWS
        </p>
        <p className="eyebrow flex items-center gap-3" data-intro-fade>
          <span className="hidden md:inline">Scroll</span>
          <span className="md:hidden">Scroll down</span>
          <span
            className="relative hidden h-px w-16 overflow-hidden bg-ink/20 md:block"
            aria-hidden
          >
            <span className="absolute inset-y-0 left-0 w-1/2 animate-[nudge_2.4s_var(--ease-in-out-quart)_infinite] bg-ink" />
          </span>
        </p>
      </div>
    </section>
  );
}
