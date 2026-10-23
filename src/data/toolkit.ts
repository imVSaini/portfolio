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
  { group: "Queues", items: ["Kafka", "RabbitMQ", "Celery", "Redis Pub/Sub"] },
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
    title: "Isolate tenants first",
    body: "Schema-per-tenant, scoped caches, scoped keys. Leaks are not a bug class I accept.",
  },
  {
    title: "Assume the vendor is down",
    body: "Outboxes, idempotency keys and retries — integrations should heal on their own.",
  },
  {
    title: "Cache what’s expensive",
    body: "Move heavy work off the request path, then measure whether it was worth it.",
  },
  {
    title: "Tests are the spec",
    body: "If it isn’t covered, it isn’t finished. CI is the second reviewer on every PR.",
  },
];
