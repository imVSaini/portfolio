import Image from "next/image";
import { projects, type Project } from "@/data/projects";
import { cn } from "@/lib/cn";

const pad = (n: number) => String(n).padStart(2, "0");

export function Work() {
  return (
    <div
      id="work"
      data-section="work"
      className="bg-ink text-paper md:flex md:h-svh md:w-max md:items-stretch"
    >
      <header className="flex flex-col justify-between gap-10 px-[4vw] pt-24 pb-12 md:w-max md:pt-32 md:pr-[6vw] md:pb-24">
        <p className="eyebrow text-paper/50">(03) Selected work</p>
        <h2 className="display text-[30vw] md:text-[min(40vh,20vw)] md:whitespace-nowrap">
          Work
          <sup className="ml-2 align-top font-mono text-[0.12em] font-normal tracking-normal text-signal">
            {pad(projects.length)}
          </sup>
        </h2>
        <p className="max-w-[24rem] text-base leading-relaxed text-paper/65" data-reveal>
          Products and platforms I’ve engineered — from a workspace SaaS on FastAPI and Next.js to
          international conference platforms and studio sites.
        </p>
      </header>

      <ol className="md:flex md:h-full">
        {projects.map((project, i) => (
          <ProjectPanel key={project.slug} project={project} index={i} total={projects.length} />
        ))}
      </ol>
    </div>
  );
}

function ProjectPanel({
  project,
  index,
  total,
}: {
  project: Project;
  index: number;
  total: number;
}) {
  const flip = index % 2 === 1;

  return (
    <li
      className={cn(
        "group flex flex-col gap-6 border-t border-paper/10 px-[4vw] py-12 md:h-full md:w-[min(64vw,150vh)] md:border-t-0 md:border-l md:py-24 md:pr-[3vw] md:pl-[3vw]",
        flip && "md:flex-col-reverse",
      )}
    >
      <a
        href={project.href}
        target="_blank"
        rel="noreferrer"
        className="relative block aspect-[16/10] overflow-hidden bg-ink-soft md:aspect-auto md:h-[46vh]"
        aria-label={`${project.title} — case study (opens in a new tab)`}
      >
        <span data-scroll className="frame-reveal absolute inset-0 block">
          <span
            data-scroll
            data-scroll-speed="0.06"
            className="absolute inset-y-0 -left-[10%] block w-[120%]"
          >
            <Image
              src={project.image}
              alt=""
              fill
              sizes="(min-width: 768px) 64vw, 92vw"
              quality={85}
              className="object-cover object-top transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.04]"
            />
          </span>
        </span>
        <span className="eyebrow absolute top-4 left-4 bg-paper px-2 py-1 text-ink">
          {pad(index + 1)} / {pad(total)}
        </span>
      </a>

      <div className="grid gap-5 md:grid-cols-[1fr_auto] md:gap-x-10">
        <div>
          <p className="eyebrow mb-3 flex gap-4 text-paper/50">
            <span>{project.category}</span>
            <span>{project.year}</span>
          </p>
          <h3 className="display text-[15vw] md:text-[min(13vh,7vw)]">
            <a href={project.href} target="_blank" rel="noreferrer" className="hover:text-signal">
              {project.title}
            </a>
          </h3>
          <p className="mt-2 font-serif text-xl text-paper/60 italic">{project.client}</p>
        </div>
        <div className="flex flex-col justify-end gap-4 md:max-w-[22rem]">
          <p className="text-[0.9375rem] leading-relaxed text-paper/75">{project.description}</p>
          <ul className="eyebrow flex flex-wrap gap-x-3 gap-y-1 text-paper/45">
            {project.stack.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
          <a
            href={project.href}
            target="_blank"
            rel="noreferrer"
            className="eyebrow mt-1 self-start text-paper"
            tabIndex={-1}
          >
            <span className="link-line">Case study</span> ↗
          </a>
        </div>
      </div>
    </li>
  );
}
