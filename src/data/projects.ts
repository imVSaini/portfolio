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
    client: "Own product",
    category: "SaaS",
    year: "2025",
    description:
      "Tasks, time, clients, docs and finance in one place, split into workspaces so a day job, freelance clients and side projects stay separate. Built on a monorepo workspace engine and installable as a PWA.",
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
      "The official site for the 40th International Conference on VLSI Design, held at the Sheraton Grand in Bengaluru.",
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
    description: "A travel platform with an itinerary builder and a page for every destination.",
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
      "A website for a precast concrete manufacturer that leads with its products, its finished projects and what the plant can make.",
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
      "Built and ran the site for the 39th edition, held across two venues in Pune in January 2026.",
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
      "A portfolio site for an architecture studio, kept spare so the projects and client testimonials carry it.",
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
      "A showcase for an architectural visualisation studio: photo-real renders, walkthroughs and drone mapping.",
    stack: ["WordPress", "Custom theme", "PHP"],
    image: "/projects/3dvisual.jpg",
    href: "https://dsgnphy.com/projects/3dvisual/",
  },
];
