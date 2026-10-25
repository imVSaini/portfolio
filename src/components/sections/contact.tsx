import type { CSSProperties } from "react";
import { profile } from "@/data/profile";
import { BackToStart } from "@/components/ui/back-to-start";
import { LocalTime } from "@/components/ui/local-time";
import { Rough } from "@/components/ui/rough";

const linkedIn = profile.socials.find((s) => s.label === "LinkedIn");
const gitHub = profile.socials.find((s) => s.label === "GitHub");

export function Contact() {
  return (
    <section
      id="contact"
      data-section="contact"
      className="relative flex flex-col gap-(--block-gap) px-[6vw] py-(--section-y) md:h-svh md:w-screen md:flex-row md:items-start md:justify-between md:gap-[5vw] md:px-[7vw] md:pt-(--top-line) md:pb-0"
    >
      {/* Left — the ask. */}
      <div className="relative md:w-[38vw]" data-lit>
        <p className="eyebrow mb-3 text-mineral">fig. 08 — get in touch</p>
        <h2 className="title mb-5 short:mb-3">
          Got a system that has to <span className="hl">hold?</span>
        </h2>
        <p className="max-w-120 text-[1.05rem] leading-relaxed text-ink-soft" data-reveal>
          {
            "I’m open to senior and lead backend roles, and the occasional well-scoped contract. Tell me what’s breaking."
          }
        </p>

        <div className="mt-8 flex flex-wrap gap-3.5 short:mt-6">
          <a href={`mailto:${profile.email}`} className="btn">
            <Rough preset="button" seed="contact-email" />
            Email me ↗
          </a>
          {linkedIn && (
            <a href={linkedIn.href} target="_blank" rel="noreferrer" className="btn btn--ghost">
              <Rough preset="button" seed="contact-linkedin" />
              LinkedIn ↗
            </a>
          )}
          {gitHub && (
            <a href={gitHub.href} target="_blank" rel="noreferrer" className="btn btn--ghost">
              <Rough preset="button" seed="contact-github" />
              GitHub ↗
            </a>
          )}
        </div>

        <p className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-1 font-hand text-lg text-ink-soft short:mt-6">
          <span>© 2026 {profile.name}</span>
          <BackToStart />
        </p>
      </div>

      {/* Right — a postcard, already addressed. */}
      <div className="relative md:mt-3.25 md:w-[min(44vw,40rem)]">
        <Postcard />
        <p className="mt-5 text-right font-hand text-xl text-plum md:pr-6">
          postage’s on me — just hit send ↗
        </p>
      </div>
    </section>
  );
}

function Postcard() {
  const line = "border-b-[1.5px] border-dashed border-ink/35";
  return (
    <a
      href={`mailto:${profile.email}`}
      aria-label={`Email ${profile.name} at ${profile.email}`}
      className="card card--taped card--lift group block p-0"
      style={{ "--tilt": "0.6deg" } as CSSProperties}
    >
      <Rough preset="card" seed="postcard" />
      <span
        data-ink-seal
        className="absolute top-[45%] left-[82%] size-0 sm:top-[40%] sm:left-[45%] md:top-[74%]"
        aria-hidden
      />
      <div className="grid min-h-[min(46vh,22rem)] grid-cols-1 sm:grid-cols-[1fr_1.05fr]">
        {/* Message side — left blank for the sender. */}
        <div className="flex flex-col justify-between gap-6 p-6 sm:border-r-[1.5px] sm:border-dashed sm:border-ink/35 md:p-7">
          <p className="font-hand text-[1.9rem] leading-none">Hi Vaibhav,</p>
          <div className="space-y-6 short:space-y-5" aria-hidden>
            {[0, 1, 2].map((i) => (
              <span key={i} className={`block h-px ${line}`} />
            ))}
          </div>
          <p className="font-hand text-xl leading-none text-ink-soft">— you</p>
        </div>

        {/* Address side. */}
        <div className="relative flex flex-col justify-end gap-3 p-6 pt-32 md:p-7 md:pt-36">
          <Stamp className="absolute top-5 right-5 w-21 rotate-3 transition-transform duration-500 group-hover:rotate-[-4deg]" />
          <Postmark className="absolute top-12 right-26 w-24 -rotate-12 opacity-80" />

          <p className={`pb-1 font-head text-lg font-bold ${line}`}>{profile.name}</p>
          <p className={`pb-1 text-[0.95rem] break-all group-hover:text-signal ${line}`}>
            {profile.email}
          </p>
          <p className={`pb-1 text-[0.95rem] text-ink-soft ${line}`}>
            {profile.location} ·{" "}
            <LocalTime timeZone={profile.timezone} label={profile.timezoneLabel} />
          </p>
        </div>
      </div>
    </a>
  );
}

/** Perforated stamp with a tiny atom, in clay. */
function Stamp({ className }: { className?: string }) {
  const holes = Array.from({ length: 9 }, (_, i) => 6 + i * 9.5);
  return (
    <svg viewBox="0 0 90 104" className={className} aria-hidden>
      <rect x="2" y="2" width="86" height="100" rx="2" fill="var(--color-card)" />
      {holes.map((x) => (
        <g key={x}>
          <circle cx={x} cy="2" r="2.6" fill="var(--color-paper)" />
          <circle cx={x} cy="102" r="2.6" fill="var(--color-paper)" />
        </g>
      ))}
      {holes.slice(0, 11).map((y) => (
        <g key={`v${y}`}>
          <circle cx="2" cy={y + 3} r="2.6" fill="var(--color-paper)" />
          <circle cx="88" cy={y + 3} r="2.6" fill="var(--color-paper)" />
        </g>
      ))}
      <rect x="10" y="10" width="70" height="84" fill="rgb(217 119 87 / 0.18)" />
      <rect className="ink thin" x="10" y="10" width="70" height="84" />
      <g transform="translate(45 48)">
        {[0, 60, 120].map((deg) => (
          <ellipse
            key={deg}
            className="ink clay thin"
            rx="24"
            ry="8"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle r="4" fill="var(--color-signal)" />
      </g>
      <text x="45" y="86" textAnchor="middle" className="fill-ink font-hand text-[11px]">
        5+ yrs · IN
      </text>
    </svg>
  );
}

/** Wavy cancellation mark with a circular "Bengaluru" postmark. */
function Postmark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 70" className={`overflow-visible ${className ?? ""}`} aria-hidden>
      <defs>
        <path id="pm-arc" d="M 18 35 a 17 17 0 1 1 34 0 a 17 17 0 1 1 -34 0" />
      </defs>
      <circle className="ink thin" cx="35" cy="35" r="25" />
      <circle className="ink ghost" cx="35" cy="35" r="11" />
      <text className="fill-ink font-hand text-[9px] tracking-[0.18em] uppercase">
        <textPath href="#pm-arc">Bengaluru · India ·</textPath>
      </text>
      {[22, 32, 42, 52].map((y) => (
        <path key={y} className="ink thin" d={`M60 ${y} q8 -5 15 0 t15 0 t15 0 t15 0`} />
      ))}
    </svg>
  );
}
