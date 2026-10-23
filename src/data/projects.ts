export type Project = {
  slug: string;
  title: string;
  client: string;
  category: string;
  year: string;
  description: string;
  stack: string[];
  image: string;
  href: string;
};

export const projects: Project[] = [
  {
    slug: "workos",
    title: "Work OS",
    client: "In-house product",
    category: "SaaS",
    year: "2025",
    description:
      "A workspace and project-management SaaS — tasks, time, clients, docs and finance in one grid, per workspace — on a monorepo workspace engine.",
    stack: ["Next.js 15", "React 19", "FastAPI", "Zustand", "PostgreSQL 16", "Redis 7", "PWA"],
    image: "/projects/workos.jpg",
    href: "https://dsgnphy.com/projects/workos/",
  },
  {
    slug: "vlsid-2027",
    title: "VLSID 2027",
    client: "40th International VLSI Design Conference",
    category: "Conference",
    year: "2027",
    description:
      "The official digital platform for the 40th International Conference on VLSI Design — programme, registration and venue information.",
    stack: ["WordPress", "Custom theme", "PHP"],
    image: "/projects/vlsid-2027.jpg",
    href: "https://dsgnphy.com/projects/vlsid-2027/",
  },
  {
    slug: "travel-kampany",
    title: "Travel Kampany",
    client: "Travel Kampany",
    category: "Travel & Tourism",
    year: "2025",
    description:
      "A dynamic travel platform with itinerary builders and destination showcases, built for fast content updates.",
    stack: ["PHP", "Node.js", "Tailwind CSS"],
    image: "/projects/travel-kampany.jpg",
    href: "https://dsgnphy.com/projects/travel-kampany/",
  },
  {
    slug: "excel-precast",
    title: "Excel Precast",
    client: "Excel Precast",
    category: "Manufacturing",
    year: "2025",
    description:
      "A website for a precast manufacturer that puts products, delivered projects and plant capabilities up front.",
    stack: ["WordPress", "Custom theme", "PHP"],
    image: "/projects/excel-precast.jpg",
    href: "https://dsgnphy.com/projects/excel-precast/",
  },
  {
    slug: "vlsid-2026",
    title: "VLSID 2026",
    client: "39th International VLSI Design Conference",
    category: "Conference",
    year: "2026",
    description:
      "Built and ran the site for a dual-venue conference in Pune, January 2026, from call for papers through to the event.",
    stack: ["WordPress", "Custom theme", "PHP"],
    image: "/projects/vlsid-2026.jpg",
    href: "https://dsgnphy.com/projects/vlsid-2026/",
  },
  {
    slug: "basics-co",
    title: "Basics Architect",
    client: "Basics Co.",
    category: "Architecture",
    year: "2025",
    description:
      "A pared-back portfolio site for an architecture studio, built around their projects and client testimonials.",
    stack: ["WordPress", "Custom theme", "Vite"],
    image: "/projects/basics-co.jpg",
    href: "https://dsgnphy.com/projects/basics-co/",
  },
  {
    slug: "3dvisual",
    title: "3D Visual Solutions",
    client: "3D Visual Solutions",
    category: "3D Visualisation",
    year: "2025",
    description:
      "A showcase for photo-realistic architectural visualisation — renders, walkthroughs and drone mapping.",
    stack: ["WordPress", "Custom theme", "PHP"],
    image: "/projects/3dvisual.jpg",
    href: "https://dsgnphy.com/projects/3dvisual/",
  },
];
