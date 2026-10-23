import type { CSSProperties } from "react";
import Image from "next/image";
import { projects, type Project } from "@/data/projects";
import { Birds, Cloud } from "@/components/ui/sketches";
import { cn } from "@/lib/cn";

const pad = (n: number) => String(n).padStart(2, "0");
const TILTS = ["-0.9deg", "0.7deg", "-0.5deg", "1deg"];

export function Work() {
  return (
    <div
      id="projects"
      data-section="projects"
      className="relative md:flex md:h-svh md:w-max md:items-start"
    >
      <header
        className="relative px-[6vw] pt-24 pb-12 md:w-[34vw] md:pt-(--top-line) md:pr-[3vw] md:pb-0 md:pl-[5vw]"
        data-lit
      >
        <Cloud className="absolute top-[calc(100%+10vh)] left-[46%] hidden w-32 md:block" />
        <Birds className="absolute top-[calc(100%+4vh)] left-[16%] hidden w-20 md:block" />
        <p className="eyebrow mb-3 text-mineral">fig. 07 — selected work</p>
        <h2 className="title">
          {projects.length} favourites, <span className="hl">one sketchbook.</span>
        </h2>
        <p className="mt-4 font-hand text-2xl leading-snug text-plum">
          every page links to its case study ↗
        </p>
      </header>

      <ol className="flex flex-col gap-16 px-[6vw] pb-20 md:h-full md:flex-row md:items-start md:gap-[3.5vw] md:px-0 md:pt-[calc(var(--top-line)+13px)] md:pr-[6vw] md:pb-0">
        {projects.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} total={projects.length} />
        ))}
      </ol>
    </div>
  );
}

function ProjectCard({
  project,
  index,
  total,
}: {
  project: Project;
  index: number;
  total: number;
}) {
  return (
    <li
      className={cn(
        "card card--taped card--lift group shrink-0 p-4 md:w-[min(40vw,92vh)] md:p-5",
        index % 2 === 1 && "md:translate-y-[3vh]",
      )}
      style={{ "--tilt": TILTS[index % TILTS.length] } as CSSProperties}
    >
      <a
        href={project.href}
        target="_blank"
        rel="noreferrer"
        className="relative block aspect-16/10 overflow-hidden rounded-[3px] border-2 border-ink bg-paper-dim md:aspect-auto md:h-[31vh] short:h-[27vh]"
        aria-label={`${project.title} — case study (opens in a new tab)`}
      >
        <span data-scroll className="frame-reveal absolute inset-0 block">
          <span
            data-scroll
            data-scroll-speed="0.05"
            className="absolute inset-y-0 left-[-10%] block w-[120%]"
          >
            <Image
              src={project.image}
              alt=""
              fill
              sizes="(min-width: 768px) 40vw, 92vw"
              quality={85}
              className="object-cover object-top transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.04]"
            />
          </span>
        </span>
      </a>

      <div className="px-1.5 pt-4">
        <p className="eyebrow flex justify-between text-mineral">
          <span>
            fig. 07.{pad(index + 1)} — {project.category.toLowerCase()}, {project.year}
          </span>
          <span className="text-ink-soft">
            {pad(index + 1)} / {pad(total)}
          </span>
        </p>
        <h3 className="mt-1 font-head text-[1.75rem] leading-tight font-bold">
          <a href={project.href} target="_blank" rel="noreferrer" className="hover:text-signal">
            {project.title}
          </a>
        </h3>
        <p className="font-head text-mineral">@ {project.client}</p>
        <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">{project.description}</p>
        <p className="mt-2 font-hand text-[1.25rem] leading-snug text-plum">
          {project.stack.join(" · ")}
        </p>
        <div className="mt-3 flex items-end justify-between">
          <a href={project.href} target="_blank" rel="noreferrer" className="btn btn--small">
            Case study ↗
          </a>
          <span className="font-hand text-lg text-ink-soft">drawn with love</span>
        </div>
      </div>
    </li>
  );
}
