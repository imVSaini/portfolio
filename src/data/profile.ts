export const profile = {
  name: "Vaibhav Kumar Saini",
  firstName: "Vaibhav",
  lastName: "Kumar Saini",
  role: "Full-Stack Lead Software Engineer",
  location: "Bengaluru, India",
  timezone: "Asia/Kolkata",
  timezoneLabel: "IST",
  email: "vaibhav.dev20@gmail.com",
  careerStart: "2019-07-01",
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/vaibhavsaini07" },
    { label: "Email", href: "mailto:vaibhav.dev20@gmail.com" },
  ],
  availability: "Open to lead & senior roles",
  intro:
    "5+ years turning rough sketches into calm, reliable software. I design and build with Python, FastAPI, Node.js, React.js and Next.js — from the first whiteboard doodle to production at scale.",
  statement:
    "I’ve spent five‑plus years turning rough sketches into software people rely on — from hand-coded websites to AI‑powered platforms — one commit, one review, one release at a time.",
  lead: "I’ve built across the modern web — REST and GraphQL APIs, the React and Next.js era, and today’s server‑first, AI‑assisted one. That view across the stack is my superpower: I know which trends stick and when boring technology is exactly what a business needs.",
  howIWork: {
    title: "How I work",
    story:
      "These days I lead architecture for multi-tenant SaaS platforms, build Python data and LLM services, and help teams move fast without breaking the things that matter.",
    ticks: [
      "End‑to‑end ownership — from system design to deployment",
      "Mentor and multiplier for engineering teams",
      "Pragmatic about AI: the right tool, measured results",
    ],
  },
  /** Words in the statement that get the highlighter swipe. */
  statementHighlight: "software people rely on",
  chips: [
    { strong: "5+", text: "years shipping" },
    { strong: "12", text: "projects" },
    { strong: "8", text: "toolboxes" },
  ],
  stats: [
    { value: "5", unit: "+ yrs", label: "Writing production code" },
    { value: "12", unit: "", label: "Projects shipped" },
    { value: "325", unit: "tests", label: "Automated tests in CI" },
    { value: "−35", unit: "%", label: "Database query time" },
  ],
  pillars: [
    {
      title: "Architecture first",
      text: "Every system starts as a sketch on paper before it becomes code.",
    },
    { title: "Readable > clever", text: "Code your future teammates will thank you for." },
    {
      title: "Ship small, ship often",
      text: "Tight feedback loops, calm releases, no big‑bang launches.",
    },
    { title: "Measure everything", text: "Performance budgets, observability and real user data." },
  ],
} as const;

export const sections = [
  { id: "index", label: "Index" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
] as const;

export type SectionId = (typeof sections)[number]["id"];
