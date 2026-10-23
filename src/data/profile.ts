export const profile = {
  name: "Vaibhav Kumar Saini",
  firstName: "Vaibhav",
  lastName: "Kumar Saini",
  role: "Lead Software Engineer",
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
    "I build the backend of multi-tenant SaaS products: the data model, the APIs, the background jobs, and the AI features that sit on top.",
  statement:
    "I work on the part of a product nobody screenshots. The schema, the queue, the cache, and the integration that keeps syncing after the vendor goes down.",
  now: "Since 2022 I’ve led backend engineering at Screen Interactiv. I own architecture, code review and sprint delivery for five products in production: a multi-tenant CRM, an embeddable AI chatbot, a channel-partner sales portal, a review platform and an internal task tool.",
  stats: [
    { value: "06+", label: "Years building backends" },
    { value: "05", label: "Products I lead in production" },
    { value: "325", label: "Backend tests running in CI" },
    { value: "−35%", label: "Query time after PostgreSQL tuning" },
  ],
} as const;

export const sections = [
  { id: "index", label: "Index" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "work", label: "Work" },
  { id: "toolkit", label: "Toolkit" },
  { id: "contact", label: "Contact" },
] as const;

export type SectionId = (typeof sections)[number]["id"];
