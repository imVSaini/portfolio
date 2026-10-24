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
    location: "Bengaluru, India",
    start: "Jan 2022",
    end: "Present",
    summary:
      "Lead engineer for five SaaS products in production, from a multi-tenant CRM to an embeddable AI chatbot, owning architecture, code review and delivery.",
    points: [
      "Designed a schema-per-tenant CRM on FastAPI and PostgreSQL with configurable pipelines, custom fields, RBAC and a full audit trail",
      "Shipped an embeddable AI chatbot that answers from each tenant’s documents, streams replies over WebSockets and sends captured leads straight into the CRM",
      "Locked the chatbot down with API keys, domain whitelisting and Redis rate limiting, with LLM spend tracked per tenant",
      "Took the heaviest dashboard query off the request path with a scope-aware Redis cache, refreshed every 60s by Celery Beat",
      "Built an AI assistant on async SQLAlchemy that manages tasks through typed tools, with a person confirming each action",
      "Synced a real-estate channel-partner portal with Zoho CRM through a retry-safe outbox that rides out vendor outages",
      "Backed it all with 325 automated tests, 28 end-to-end tests and secure login with TOTP MFA and WebAuthn passkeys",
    ],
    stack: ["FastAPI", "SQLAlchemy", "PostgreSQL", "Redis", "Celery", "WebSockets"],
  },
  {
    company: "Assent Global",
    title: "Software Engineer",
    location: "Bengaluru, India",
    start: "Jan 2020",
    end: "Jan 2022",
    summary:
      "Built and tuned SaaS products and their APIs, with a focus on response times and database load.",
    points: [
      "Built REST APIs and GraphQL endpoints on Node.js and Express.js and cut response times by 20%",
      "Cut PostgreSQL query time by 35% by reworking slow queries and indexes",
      "Added a Redis cache in front of the primary database to speed up reads",
      "Moved reports and notifications onto Celery background workers",
      "Debugged and load-tested services to find where the time actually went",
    ],
    stack: ["Node.js", "Express.js", "GraphQL", "PostgreSQL", "Redis", "Celery"],
  },
  {
    company: "Cetpa Infotech",
    title: "Frontend Developer",
    location: "Noida, India",
    start: "Jul 2019",
    end: "Dec 2019",
    summary:
      "Hand-coded and maintained client websites. Where I learned the web from the browser up.",
    points: [
      "Improved site performance by 20% across client websites in HTML5, CSS3 and JavaScript",
      "Made pages load 15% faster through refactoring and asset optimisation",
      "Tested for cross-browser compatibility and accessibility",
    ],
    stack: ["HTML5", "CSS3", "JavaScript (ES6+)"],
  },
];
