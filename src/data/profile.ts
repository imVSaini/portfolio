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
  intro:
    "building multi-tenant SaaS, retrieval-augmented chatbots and AI agents that hold up in production.",
  statement:
    "Six years on the side of software you don’t see — schemas, queues, caches, and the integrations that keep running when a vendor doesn’t.",
  now: "Leading backend engineering at Screen Interactiv across five production products: a multi-tenant CRM, an embeddable AI chatbot, a channel-partner sales portal, a review platform and an internal task platform.",
  stats: [
    { value: "06+", label: "Years shipping backends" },
    { value: "05", label: "Production products led" },
    { value: "325", label: "Backend tests in CI" },
    { value: "−35%", label: "PostgreSQL query time" },
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
