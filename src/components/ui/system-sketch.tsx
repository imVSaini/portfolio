import type { CSSProperties } from "react";
import rough from "roughjs";
import type { Options } from "roughjs/bin/core";
import { cn } from "@/lib/cn";

/*
 * A hand-drawn architecture sketch of how the products I lead fit together (CRM, AI chatbot,
 * partner-portal sync): boundaries, sync vs async paths, failure handling and cost controls —
 * the things a reviewer looks for, not just boxes. Fixed geometry + fixed seeds, so it renders
 * on the server identically every time.
 */

const gen = rough.generator();
const ink = "var(--color-ink)";
const HALO = {
  paintOrder: "stroke",
  stroke: "var(--color-card)",
  strokeWidth: 4,
  strokeLinejoin: "round",
} as const;
const NOTE_HALO = {
  paintOrder: "stroke",
  stroke: "var(--color-paper)",
  strokeWidth: 5,
  strokeLinejoin: "round",
} as const;

type Node = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  sub: string;
  accent?: boolean;
};

const NODES: Node[] = [
  { id: "web", x: 70, y: 24, w: 190, h: 58, title: "Web app", sub: "Next.js · tenant teams" },
  { id: "widget", x: 400, y: 24, w: 190, h: 58, title: "Chat widget", sub: "on client sites" },
  {
    id: "api",
    x: 200,
    y: 160,
    w: 240,
    h: 64,
    title: "FastAPI",
    sub: "RBAC · audit trail · rate limits",
    accent: true,
  },
  { id: "llm", x: 492, y: 166, w: 142, h: 56, title: "LLM", sub: "RAG · cost per tenant" },
  {
    id: "pg",
    x: 40,
    y: 290,
    w: 220,
    h: 62,
    title: "PostgreSQL",
    sub: "schema per tenant · pgvector",
  },
  { id: "redis", x: 300, y: 290, w: 170, h: 62, title: "Redis", sub: "cache · job broker" },
  {
    id: "celery",
    x: 300,
    y: 410,
    w: 170,
    h: 58,
    title: "Celery workers",
    sub: "60s beat · outbox relay",
  },
  { id: "zoho", x: 510, y: 410, w: 124, h: 58, title: "Zoho CRM", sub: "retried, never lost" },
];

type Edge = {
  id: string;
  d: string;
  dur: number;
  begin: number;
  /** Async hand-off (dashed) vs synchronous request (solid). */
  async?: boolean;
  /** Arrowheads at both ends (request/response channels). */
  both?: boolean;
  note?: { x: number; y: number; text: string; anchor?: "start" | "middle" | "end" };
};

const EDGES: Edge[] = [
  {
    id: "web-api",
    d: "M165 86 C165 120 240 128 266 156",
    dur: 1.8,
    begin: 0,
    note: { x: 186, y: 126, text: "JWT · TOTP · passkeys", anchor: "end" },
  },
  {
    id: "widget-api",
    d: "M495 86 C495 120 430 130 412 156",
    dur: 1.8,
    begin: 0.4,
    both: true,
    note: { x: 474, y: 128, text: "WebSocket · allow-list" },
  },
  { id: "api-llm", d: "M442 194 L488 194", dur: 1, begin: 1 },
  // Reads/writes, including vector search for the chatbot's retrieval.
  { id: "api-pg", d: "M250 228 C230 255 170 262 150 286", dur: 1.8, begin: 1.3, both: true },
  {
    id: "api-redis",
    d: "M385 228 L385 286",
    dur: 1.4,
    begin: 1.6,
    both: true,
    note: { x: 393, y: 262, text: "cache · enqueue" },
  },
  // Workers consume jobs from the broker; beat writes refreshed dashboards back to the cache.
  {
    id: "redis-celery",
    d: "M385 356 L385 406",
    dur: 1.3,
    begin: 2,
    async: true,
    both: true,
    note: { x: 393, y: 386, text: "jobs · cache refresh" },
  },
  // Transactional outbox: rows written with the business change, relayed by a worker.
  {
    id: "pg-celery",
    d: "M150 356 C150 400 230 438 296 438",
    dur: 2,
    begin: 2.3,
    async: true,
    note: { x: 120, y: 452, text: "outbox rows" },
  },
  {
    id: "celery-zoho",
    d: "M474 439 L506 439",
    dur: 1,
    begin: 2.7,
    async: true,
  },
];

const BOX_PATHS = NODES.map((n, i) => {
  const opts: Options = {
    seed: 101 + i * 7,
    roughness: 1.2,
    bowing: 1.2,
    stroke: ink,
    strokeWidth: 1.6,
    fill: n.accent ? "var(--color-signal)" : "var(--color-card)",
    fillStyle: n.accent ? "hachure" : "solid",
    hachureGap: 4.5,
    fillWeight: 1.2,
    hachureAngle: -40,
  };
  return { node: n, parts: gen.toPaths(gen.rectangle(n.x, n.y, n.w, n.h, opts)) };
});

const LINE_PATHS = EDGES.map((e, i) => ({
  edge: e,
  parts: gen.toPaths(
    gen.path(e.d, {
      seed: 401 + i * 5,
      roughness: 0.9,
      bowing: 0.6,
      stroke: ink,
      strokeWidth: 1.4,
      disableMultiStroke: e.async,
    }),
  ),
}));

// The tenant boundary: core API and its data stores. The LLM and Zoho sit outside it.
const BOUNDARY = gen
  .toPaths(
    gen.rectangle(28, 146, 456, 234, {
      seed: 977,
      roughness: 1.4,
      bowing: 1.5,
      stroke: ink,
      strokeWidth: 1.2,
      disableMultiStroke: true,
    }),
  )
  .map((p) => p.d);

/** Arrowhead at the end of a path, pointing along its last segment (or its first, reversed). */
function arrowHead(d: string, atStart = false) {
  const nums = d.match(/-?\d+(\.\d+)?/g)!.map(Number);
  const [x2, y2] = atStart ? nums.slice(0, 2) : nums.slice(-2);
  const [x1, y1] = atStart ? nums.slice(2, 4) : nums.slice(-4, -2);
  const a = Math.atan2(y2 - y1, x2 - x1);
  const len = 9;
  const p = (da: number) =>
    `${(x2 - len * Math.cos(a + da)).toFixed(1)} ${(y2 - len * Math.sin(a + da)).toFixed(1)}`;
  return `M${p(0.45)} L${x2} ${y2} L${p(-0.45)}`;
}

function Arrow({ d }: { d: string }) {
  return (
    <path
      className="sketch-stroke"
      d={d}
      pathLength={1}
      fill="none"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ stroke: ink }}
    />
  );
}

export function SystemSketch({ className }: { className?: string }) {
  return (
    <figure className={cn("flex flex-col", className)}>
      <svg
        viewBox="0 0 640 500"
        className="sketch-in min-h-0 w-full flex-1 overflow-visible"
        role="img"
        aria-label="Architecture sketch. A Next.js web app (JWT, TOTP and passkey sign-in) and an embeddable chat widget (WebSocket, domain allow-list) call a FastAPI service with RBAC, an audit trail and rate limits. Inside a tenant boundary — separate schemas, cache keys and API keys — FastAPI reads and writes PostgreSQL (with pgvector for retrieval) and uses Redis as cache and job broker. It calls an LLM for retrieval-augmented answers, with cost tracked per tenant and tool actions confirmed by a person. Asynchronously, Celery workers take jobs from Redis, refresh dashboards every 60 seconds, and relay outbox rows from PostgreSQL to Zoho CRM with retries, so a vendor outage queues work instead of losing it. Every path is covered by 325 backend tests and 28 end-to-end tests."
      >
        {/* Tenant boundary */}
        <g className="sketch-dash-group" style={{ "--i": 0 } as CSSProperties}>
          {BOUNDARY.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              className="sketch-dash"
              style={{ stroke: ink, strokeWidth: 1.2, opacity: 0.55 }}
            />
          ))}
          <text x={38} y={373} className="fill-ink-soft font-hand text-[15px]" style={NOTE_HALO}>
            tenant boundary — schema · cache keys · API keys
          </text>
        </g>

        {/* Edges */}
        {LINE_PATHS.map(({ edge, parts }, i) => (
          <g key={edge.id} style={{ "--i": i } as CSSProperties}>
            {parts.map((p, j) =>
              edge.async ? (
                <path
                  key={j}
                  className="sketch-dash"
                  d={p.d}
                  fill="none"
                  style={{ stroke: p.stroke, strokeWidth: p.strokeWidth }}
                  strokeLinecap="round"
                />
              ) : (
                <path
                  key={j}
                  className="sketch-stroke"
                  d={p.d}
                  pathLength={1}
                  fill="none"
                  style={{ stroke: p.stroke, strokeWidth: p.strokeWidth }}
                  strokeLinecap="round"
                />
              ),
            )}
            <Arrow d={arrowHead(edge.d)} />
            {edge.both && <Arrow d={arrowHead(edge.d, true)} />}
            {edge.note && (
              <text
                x={edge.note.x}
                y={edge.note.y}
                textAnchor={edge.note.anchor ?? "start"}
                className="sketch-note fill-plum font-hand text-[16px]"
                style={NOTE_HALO}
              >
                {edge.note.text}
              </text>
            )}
          </g>
        ))}

        {/* Nodes */}
        {BOX_PATHS.map(({ node, parts }, i) => (
          <g key={node.id} className="sketch-node" style={{ "--i": i } as CSSProperties}>
            {parts.map((p, j) => (
              <path
                key={j}
                d={p.d}
                style={{ stroke: p.stroke, strokeWidth: p.strokeWidth, fill: p.fill ?? "none" }}
                strokeLinecap="round"
              />
            ))}
            <text
              x={node.x + node.w / 2}
              y={node.y + node.h / 2 - 3}
              textAnchor="middle"
              className="fill-ink font-head text-[17px] font-bold"
              style={node.accent ? HALO : undefined}
            >
              {node.title}
            </text>
            <text
              x={node.x + node.w / 2}
              y={node.y + node.h / 2 + 15}
              textAnchor="middle"
              className={cn("font-hand text-[15px]", node.accent ? "fill-ink" : "fill-ink-soft")}
              style={node.accent ? HALO : undefined}
            >
              {node.sub}
            </text>
          </g>
        ))}

        {/* Human in the loop for the assistant's tool calls. */}
        <text
          x={563}
          y={240}
          textAnchor="middle"
          className="sketch-note fill-plum font-hand text-[15px]"
          style={{ ...NOTE_HALO, "--i": 3 } as CSSProperties}
        >
          tool calls need a human OK
        </text>

        {/* Legend + test coverage */}
        <g className="sketch-note" style={{ "--i": 6 } as CSSProperties}>
          <path
            d="M40 492 L68 492"
            style={{ stroke: ink, strokeWidth: 1.6 }}
            strokeLinecap="round"
          />
          <text x={74} y={497} className="fill-ink-soft font-hand text-[15px]">
            request
          </text>
          <path
            d="M134 492 L162 492"
            className="sketch-dash"
            style={{ stroke: ink, strokeWidth: 1.6 }}
            strokeLinecap="round"
          />
          <text x={168} y={497} className="fill-ink-soft font-hand text-[15px]">
            async job
          </text>
          <text x={634} y={497} textAnchor="end" className="fill-ink-soft font-hand text-[15px]">
            every arrow under test — 325 + 28 E2E
          </text>
        </g>

        {/* Requests in flight — native SVG motion, hidden for reduced-motion users. */}
        <g className="sketch-packets">
          {EDGES.map((e) => (
            <circle
              key={e.id}
              r="4.5"
              fill={e.async ? "var(--color-card)" : "var(--color-signal)"}
              stroke={ink}
              strokeWidth="1.2"
              opacity="0"
            >
              <animateMotion
                path={e.d}
                dur={`${e.dur}s`}
                begin={`${3 + e.begin}s`}
                repeatCount="indefinite"
                keyPoints="0;1"
                keyTimes="0;1"
                calcMode="spline"
                keySplines="0.45 0 0.25 1"
              />
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.12;0.85;1"
                dur={`${e.dur}s`}
                begin={`${3 + e.begin}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </g>
      </svg>
      <figcaption className="mt-1 text-right font-hand text-lg text-ink-soft">
        fig. 01a — how the products I lead fit together
      </figcaption>
    </figure>
  );
}
