export const toolkit = [
  { group: "Languages", items: ["Python", "TypeScript", "JavaScript", "SQL"] },
  {
    group: "Backend",
    items: ["FastAPI", "Django", "Flask", "Node.js", "Express", "Apollo GraphQL", "WebSockets"],
  },
  {
    group: "Data",
    items: ["PostgreSQL", "pgvector", "MySQL", "MongoDB", "Redis", "SQLAlchemy 2.0"],
  },
  { group: "Messaging", items: ["Kafka", "RabbitMQ", "Celery", "Redis Pub/Sub"] },
  { group: "AI / LLM", items: ["OpenAI APIs", "RAG", "LangChain", "LangGraph", "Tool calling"] },
  {
    group: "Cloud",
    items: ["AWS — EC2, Lambda, S3, RDS", "Azure", "Docker", "Kubernetes", "GitHub Actions"],
  },
  { group: "Quality", items: ["Pytest", "Jest", "Supertest", "Playwright", "Ruff", "mypy"] },
  { group: "Observability", items: ["Prometheus", "Grafana", "OpenTelemetry", "Sentry"] },
];

export const principles = [
  {
    title: "Tenants never share by accident",
    body: "Separate schemas, scoped cache keys, scoped API keys. One customer should never see another’s data.",
  },
  {
    title: "Plan for the vendor being down",
    body: "Outboxes, idempotency keys and retries, so an integration catches up by itself after an outage.",
  },
  {
    title: "Cache only what costs something",
    body: "Move expensive work off the request path, then check the numbers to see if it paid off.",
  },
  {
    title: "Tests are the spec",
    body: "If there’s no test for it, it isn’t done. CI reviews every pull request before I do.",
  },
];
