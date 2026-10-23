export type ToolGroup = {
  group: string;
  /** Margin doodle next to the tool count. */
  doodle: string;
  note: string;
  /** Daily drivers — get the highlighter. */
  featured?: string[];
  items: string[];
};

export const toolkit: ToolGroup[] = [
  {
    group: "Languages",
    doodle: "{ }",
    featured: ["Python", "TypeScript"],
    note: "The core toolbox — day-to-day.",
    items: ["Python", "JavaScript (ES6+)", "TypeScript", "HTML5", "CSS3", "SCSS"],
  },
  {
    group: "Backend",
    doodle: "⚙",
    featured: ["FastAPI", "Node.js"],
    note: "Async-first APIs, typed contracts, secure by default.",
    items: [
      "FastAPI",
      "Pydantic",
      "SQLAlchemy",
      "Node.js",
      "Express.js",
      "REST APIs",
      "GraphQL",
      "JWT Authentication",
      "Celery",
      "WebSockets",
    ],
  },
  {
    group: "Frontend",
    doodle: "✎",
    featured: ["Next.js (App Router)", "React.js"],
    note: "Next.js, React, and everything around them.",
    items: [
      "Next.js (App Router)",
      "React.js",
      "Redux",
      "Zustand",
      "Context API",
      "Tailwind CSS",
      "GSAP",
    ],
  },
  {
    group: "Data & Infra",
    doodle: "⛁",
    featured: ["PostgreSQL", "Docker"],
    note: "Where the state lives — and how it ships.",
    items: [
      "PostgreSQL",
      "Redis",
      "Docker",
      "Docker Compose",
      "Nginx",
      "AWS EC2",
      "AWS S3",
      "GitHub Actions (CI/CD)",
    ],
  },
  {
    group: "AI Developer Tools",
    doodle: "✦",
    featured: ["Cursor", "Claude Code"],
    note: "AI-native workflow — used daily, not for demos.",
    items: [
      "Cursor",
      "Claude Code",
      "Devin (formerly Windsurf)",
      "Kiro",
      "Antigravity",
      "GitHub Copilot",
      "ChatGPT",
      "Ollama",
    ],
  },
  {
    group: "Tooling",
    doodle: "✂",
    featured: ["Git", "GitHub"],
    note: "Everyday keyboard companions.",
    items: ["Git", "GitHub", "Webpack", "Vite", "Postman", "Vercel", "Linux", "Linear"],
  },
  {
    group: "Architecture",
    doodle: "▦",
    note: "How the code is organized.",
    items: [
      "Component-Driven Development",
      "Micro-Frontend",
      "Responsive Design",
      "Performance Optimization",
    ],
  },
  {
    group: "Practices",
    doodle: "✓",
    featured: ["Code Review"],
    note: "How the work gets shipped.",
    items: [
      "Agile / Scrum",
      "Code Review",
      "Technical Documentation",
      "Team Mentorship",
      "Cross-functional Collaboration",
    ],
  },
];
