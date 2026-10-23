export type Role = {
  company: string;
  title: string;
  location: string;
  start: string;
  end: string;
  summary: string;
  points: string[];
  stack: string[];
};

export const experience: Role[] = [
  {
    company: "Screen Interactiv",
    title: "Lead Software Engineer",
    location: "Bengaluru",
    start: "Jan 2022",
    end: "Present",
    summary:
      "I lead the backend for five products in production, from the first architecture sketch through code review to sprint delivery.",
    points: [
      "Designed the lead-management CRM on FastAPI and PostgreSQL. Every tenant gets its own schema, with configurable pipelines, custom fields, role-based access and a full audit trail.",
      "Built an AI chatbot that customers embed on their own sites. It answers from their documents and pages using RAG on OpenAI embeddings and pgvector, streams replies over WebSockets, and sends the leads it captures straight into the CRM.",
      "Locked the chatbot down with API keys, domain whitelisting and Redis rate limiting, and tracked LLM spend per tenant.",
      "Took the heaviest dashboard query off the request path. A Celery Beat job now refreshes a scope-aware Redis cache every 60 seconds.",
      "Built an internal task platform on async SQLAlchemy 2.0 and asyncpg. Its LangGraph assistant works through typed tools and asks before it changes anything.",
      "Connected a real-estate client’s channel-partner portal to Zoho CRM through a retry-safe outbox, so a vendor outage delays a sync instead of losing it.",
      "Across the five products: 325 backend tests and 28 Playwright end-to-end tests, with Ruff and pre-commit in CI. Sign-in supports TOTP and WebAuthn passkeys.",
    ],
    stack: ["FastAPI", "PostgreSQL", "pgvector", "Redis", "Celery", "LangGraph"],
  },
  {
    company: "Assent Global",
    title: "Software Engineer",
    location: "Bengaluru",
    start: "Jan 2020",
    end: "Jan 2022",
    summary:
      "Two years on backend services for SaaS products, mostly APIs and making the database faster.",
    points: [
      "Built and maintained REST and GraphQL APIs in Node.js, Express, Django and Flask, and brought response times down by 20%.",
      "Put Redis in front of the main database as a cache, which sped up reads and took load off PostgreSQL.",
      "Reworked slow PostgreSQL queries and indexes and cut query time by 35%.",
      "Moved reports and notifications out of the request cycle and onto Celery and RabbitMQ workers.",
      "Debugged and load-tested services to find out where the time was actually going.",
    ],
    stack: ["Node.js", "Django", "PostgreSQL", "Redis", "RabbitMQ", "AWS"],
  },
  {
    company: "Cetpa Infotech",
    title: "Frontend Developer",
    location: "Noida",
    start: "Jul 2019",
    end: "Dec 2019",
    summary:
      "My first job: six months building client websites, which is where I learned to care about load times.",
    points: [
      "Built and maintained client websites in HTML, CSS and JavaScript, and improved site performance by 20%.",
      "Refactored code and optimised assets so pages loaded 15% faster.",
      "Tested across browsers and checked pages against accessibility guidelines.",
    ],
    stack: ["HTML", "CSS", "JavaScript"],
  },
];

export const education = {
  school: "Hemvati Nandan Bahuguna Garhwal University",
  degree: "Bachelor of Science",
  start: "2016",
  end: "2019",
};
