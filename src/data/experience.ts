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
      "Own architecture, code review and sprint delivery for five production products, from a multi-tenant CRM to an AI chatbot.",
    points: [
      "Architected the lead-management CRM on FastAPI and PostgreSQL with schema-per-tenant isolation, configurable pipelines, custom fields, RBAC and a full audit trail.",
      "Built an embeddable AI chatbot with RAG over tenant documents (OpenAI embeddings + pgvector), WebSocket streaming, domain whitelisting, Redis rate limiting and per-tenant LLM cost tracking.",
      "Moved the heaviest dashboard aggregation off the request path with a scope-aware Redis cache refreshed every 60 seconds by Celery Beat.",
      "Shipped an internal task platform on async SQLAlchemy 2.0 with a LangGraph assistant that acts through typed tools with human confirmation.",
      "Integrated a channel-partner sales portal with Zoho CRM through a retry-safe outbox that survives vendor outages.",
      "Kept quality high with 325 backend tests, 28 Playwright E2E suites, TOTP MFA and WebAuthn passkeys.",
    ],
    stack: ["FastAPI", "PostgreSQL", "pgvector", "Redis", "Celery", "LangGraph"],
  },
  {
    company: "Assent Global",
    title: "Software Engineer",
    location: "Bengaluru",
    start: "Jan 2020",
    end: "Jan 2022",
    summary: "Backend services for SaaS applications — APIs, caching and database performance.",
    points: [
      "Developed and maintained REST and GraphQL APIs on Node.js, Express, Django and Flask, improving API response time by 20%.",
      "Introduced Redis as a caching layer to speed up reads and take load off the primary database.",
      "Tuned PostgreSQL indexes and queries, cutting query execution time by 35%.",
      "Moved reports and notifications onto asynchronous workers with Celery and RabbitMQ.",
    ],
    stack: ["Node.js", "Django", "PostgreSQL", "Redis", "RabbitMQ", "AWS"],
  },
  {
    company: "Cetpa Infotech",
    title: "Frontend Developer",
    location: "Noida",
    start: "Jul 2019",
    end: "Dec 2019",
    summary: "Where it started — building and maintaining client websites.",
    points: [
      "Built and maintained websites in HTML, CSS and JavaScript, improving site performance by 20%.",
      "Cut load times by 15% through refactoring and asset optimisation.",
      "Tested for cross-browser compatibility and accessibility compliance.",
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
