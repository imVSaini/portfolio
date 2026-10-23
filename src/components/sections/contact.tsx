import { profile } from "@/data/profile";
import { BackToStart } from "@/components/ui/back-to-start";
import { LocalTime } from "@/components/ui/local-time";

export function Contact() {
  return (
    <section
      id="contact"
      data-section="contact"
      className="relative flex min-h-svh flex-col justify-between gap-10 bg-ink px-[4vw] pt-24 pb-10 text-paper md:h-svh md:w-max md:min-w-screen md:pt-32 md:pr-[8vw] md:pb-20"
    >
      <p className="eyebrow text-paper/50">(05) Contact</p>

      <div>
        <h2 className="display text-[19vw] md:text-[min(26vh,13vw)] md:whitespace-nowrap">
          Got a system
          <br />
          that has to <span className="text-signal">hold?</span>
        </h2>
        <div className="mt-10 flex flex-col gap-8 md:mt-14 md:flex-row md:items-end md:justify-between">
          <p
            className="max-w-[30rem] font-serif text-2xl leading-snug text-paper/80 italic"
            data-reveal
          >
            I’m open to senior and lead backend roles, and the occasional well-scoped contract. Tell
            me what’s breaking.
          </p>
          <a
            href={`mailto:${profile.email}`}
            className="group flex items-baseline gap-4 text-[7vw] leading-none font-semibold tracking-[-0.03em] md:text-[min(7vh,3.6vw)]"
          >
            <span className="link-line pb-1">{profile.email}</span>
            <span
              className="text-signal transition-transform duration-500 ease-out-expo group-hover:translate-x-2 group-hover:-translate-y-2"
              aria-hidden
            >
              ↗
            </span>
          </a>
        </div>
      </div>

      <footer className="eyebrow grid grid-cols-2 gap-y-4 border-t border-paper/15 pt-5 text-paper/55 md:flex md:justify-between">
        <span>© 2026 {profile.name}</span>
        <span>
          {profile.location} —{" "}
          <LocalTime timeZone={profile.timezone} label={profile.timezoneLabel} />
        </span>
        <ul className="flex gap-5">
          {profile.socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="link-line text-paper"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <BackToStart />
      </footer>
    </section>
  );
}
