import type { CSSProperties } from "react";
import Image from "next/image";
import { projects, type Project } from "@/data/projects";
import { cn } from "@/lib/cn";
import { Rough } from "@/components/ui/rough";

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
        className="relative px-[6vw] pt-(--section-y) pb-10 md:w-[34vw] md:pt-(--top-line) md:pr-[3vw] md:pb-0 md:pl-[5vw]"
        data-lit
      >
        <p className="eyebrow mb-3 text-mineral">fig. 07 — selected work</p>
        <h2 className="title">
          {projects.length} favourites, <span className="hl">one sketchbook.</span>
        </h2>
        <p className="mt-4 font-hand text-2xl leading-snug text-plum">
          every card opens the live site ↗
        </p>
      </header>

      <ol className="flex flex-col gap-12 px-[6vw] pb-(--section-y) md:h-full md:flex-row md:items-start md:gap-[3.5vw] md:px-0 md:pt-[calc(var(--top-line)+13px)] md:pr-[6vw] md:pb-0">
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
      <Rough preset="card" seed={`project-${project.slug}`} />
      <a
        href={project.href}
        target="_blank"
        rel="noreferrer"
        className="relative isolate block aspect-16/10 bg-paper-dim md:aspect-auto md:h-[31vh] short:h-[27vh]"
        aria-label={`${project.title} — live site (opens in a new tab)`}
      >
        {/* Pencil frame drawn over the screenshot. */}
        <span className="pointer-events-none absolute inset-0 z-10">
          <Rough preset="frame" seed={`frame-${project.slug}`} className="z-0" />
        </span>
        <span className="absolute inset-0 block overflow-hidden">
          <span data-ink-frame className="absolute inset-0 block">
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
        </span>
      </a>

      <div className="px-1.5 pt-4">
        <p className="eyebrow flex justify-between text-mineral">
          <span>
            fig. 07.{pad(index + 1)} — {project.category.toLowerCase()}
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
            <Rough preset="button" seed={`cta-${project.slug}`} />
            Visit live ↗
          </a>
          <span className="font-hand text-lg text-ink-soft">drawn with love</span>
        </div>
      </div>
    </li>
  );
}
