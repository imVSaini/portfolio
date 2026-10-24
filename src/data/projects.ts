export type Project = {
  slug: string;
  title: string;
  client: string;
  category: string;
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
    description:
      "Workspace SaaS that puts tasks, time, clients, docs and finance in one grid, with a separate workspace for every context. Installable as a PWA.",
    stack: ["Next.js 15", "React 19", "FastAPI", "Zustand", "PostgreSQL 16", "Redis 7", "PWA"],
    image: "/projects/workos.jpg",
    href: "https://workos.dsgnphy.com/",
  },
  {
    slug: "vlsid-2027",
    title: "VLSID 2027",
    client: "40th International VLSI Design Conference",
    category: "Conference",
    description:
      "Official platform for the 40th International Conference on VLSI Design, at the Sheraton Grand, Bengaluru.",
    stack: ["WordPress", "Custom theme", "PHP"],
    image: "/projects/vlsid-2027.jpg",
    href: "https://vlsid.org/",
  },
  {
    slug: "travel-kampany",
    title: "Travel Kampany",
    client: "Travel Kampany",
    category: "Travel & Tourism",
    description:
      "Travel platform with an itinerary builder and a showcase page for every destination.",
    stack: ["PHP", "Node.js", "Tailwind CSS"],
    image: "/projects/travel-kampany.jpg",
    href: "https://travelkampany.in/",
  },
  {
    slug: "kvpr",
    title: "KVPR Masalas",
    client: "KVPR",
    category: "E-commerce",
    description:
      "Online store for a premium Indian spice brand: product catalogue, cart and checkout, dealership enquiries and a recipes section.",
    stack: ["WordPress", "WooCommerce", "Custom theme", "PHP"],
    image: "/projects/kvpr.jpg",
    href: "https://kvprfs.com/",
  },
  {
    slug: "vlsid-2026",
    title: "VLSID 2026",
    client: "39th International VLSI Design Conference",
    category: "Conference",
    description:
      "Dual-venue conference site for the 39th edition in Pune, January 2026, built and run end to end.",
    stack: ["WordPress", "Custom theme", "PHP"],
    image: "/projects/vlsid-2026.jpg",
    href: "https://2026.vlsid.org/",
  },
  {
    slug: "basics-co",
    title: "Basics Architect",
    client: "Basics Co.",
    category: "Architecture",
    description:
      "Sleek portfolio site for an architecture studio, built around its projects and client testimonials.",
    stack: ["WordPress", "Custom theme", "Vite"],
    image: "/projects/basics-co.jpg",
    href: "https://basics.co.in/",
  },
  {
    slug: "3dvisual",
    title: "3D Visual Solutions",
    client: "3D Visual Solutions",
    category: "3D Visualisation",
    description: "Showcase for photo-real architectural renders, walkthroughs and drone mapping.",
    stack: ["WordPress", "Custom theme", "PHP"],
    image: "/projects/3dvisual.jpg",
    href: "https://3dvisual.in/",
  },
];
