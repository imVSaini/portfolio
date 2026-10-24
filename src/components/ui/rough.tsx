"use client";

import { useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import rough from "roughjs";
import type { Options } from "roughjs/bin/core";
import { cn } from "@/lib/cn";

const generator = rough.generator();

/** Stable 32-bit seed from a string, so every element keeps the same wobble on every visit. */
function seedFrom(key: string) {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) h = Math.imul(h ^ key.charCodeAt(i), 16777619);
  return (h >>> 0) % 2 ** 31 || 1;
}

export type RoughShape = "rect" | "ellipse";

type Layer = { shape: RoughShape; dx?: number; dy?: number; options: Options };

/** Ready-made looks. Colours are CSS variables so a theme switch needs no redraw. */
const PRESETS = {
  /** Card: pencil outline plus a cross-hatched shadow peeking out bottom-right. */
  card: [
    {
      shape: "rect",
      dx: 6,
      dy: 7,
      options: {
        stroke: "none",
        fill: "var(--color-ink)",
        fillStyle: "hachure",
        hachureGap: 5,
        hachureAngle: -41,
        fillWeight: 1,
        roughness: 1.1,
      },
    },
    {
      shape: "rect",
      options: {
        stroke: "var(--color-ink)",
        strokeWidth: 1.8,
        fill: "var(--color-card)",
        fillStyle: "solid",
        roughness: 1.35,
        bowing: 1.2,
      },
    },
  ],
  /** Lighter card, no shadow — notes and secondary panels. */
  outline: [
    {
      shape: "rect",
      options: { stroke: "var(--color-ink)", strokeWidth: 1.6, roughness: 1.4, bowing: 1.4 },
    },
  ],
  /** Clay marker blob with an inked edge. */
  button: [
    {
      shape: "rect",
      dx: 3,
      dy: 4,
      options: { stroke: "none", fill: "var(--color-ink)", fillStyle: "solid", roughness: 1.2 },
    },
    {
      shape: "rect",
      options: {
        stroke: "var(--color-ink)",
        strokeWidth: 1.8,
        fill: "var(--btn-fill, var(--color-signal))",
        fillStyle: "solid",
        roughness: 1.5,
        bowing: 1.6,
      },
    },
  ],
  /** Small tag: thin wobbly box. */
  chip: [
    {
      shape: "rect",
      options: {
        stroke: "color-mix(in srgb, var(--color-ink) 55%, transparent)",
        strokeWidth: 1,
        roughness: 1.1,
        bowing: 1.5,
        disableMultiStroke: true,
      },
    },
  ],
  /** Highlighted tag: clay hatching like a quick marker fill. */
  "chip-featured": [
    {
      shape: "rect",
      options: {
        stroke: "var(--color-ink)",
        strokeWidth: 1.1,
        fill: "color-mix(in srgb, var(--color-signal) 75%, transparent)",
        fillStyle: "hachure",
        hachureGap: 3.2,
        hachureAngle: 60,
        fillWeight: 1.4,
        roughness: 1.2,
        bowing: 1.4,
      },
    },
  ],
  /** Hand-drawn circle around a badge or logo. */
  circle: [
    { shape: "ellipse", options: { stroke: "var(--color-ink)", strokeWidth: 1.8, roughness: 1.3 } },
  ],
  /** Picture frame for screenshots. */
  frame: [
    {
      shape: "rect",
      options: { stroke: "var(--color-ink)", strokeWidth: 1.6, roughness: 1, bowing: 0.8 },
    },
  ],
} satisfies Record<string, Layer[]>;

export type RoughPreset = keyof typeof PRESETS;

type Drawn = { key: string; d: string; style: CSSProperties }[];

/**
 * Draws a Rough.js sketch that hugs its parent. Drop it inside any `position: relative` element;
 * it measures the parent, re-draws on resize and paints behind the content (`z-index: -1` inside
 * the parent's stacking context, which the parent gets via `isolate`).
 */
export function Rough({
  preset,
  seed,
  pad = 2,
  className,
}: {
  preset: RoughPreset;
  /** Any string — the same string always gives the same drawing. */
  seed: string;
  /** How far the sketch may overshoot the box, in px. */
  pad?: number;
  className?: string;
}) {
  const svg = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useLayoutEffect(() => {
    const host = svg.current?.parentElement;
    if (!host) return;
    const measure = () => {
      const w = Math.round(host.offsetWidth);
      const h = Math.round(host.offsetHeight);
      setSize((s) => (s && s.w === w && s.h === h ? s : { w, h }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(host);
    return () => ro.disconnect();
  }, []);

  // Pure: the same size + seed always yields the same paths.
  const paths = useMemo<Drawn>(() => {
    if (!size || !size.w || !size.h) return [];
    const base = seedFrom(`${preset}:${seed}`);
    const out: Drawn = [];
    (PRESETS[preset] as Layer[]).forEach((layer, li) => {
      const x = pad + (layer.dx ?? 0);
      const y = pad + (layer.dy ?? 0);
      const opts = { ...layer.options, seed: base + li };
      const drawable =
        layer.shape === "ellipse"
          ? generator.ellipse(x + size.w / 2, y + size.h / 2, size.w, size.h, opts)
          : generator.rectangle(x, y, size.w, size.h, opts);
      generator.toPaths(drawable).forEach((p, pi) => {
        out.push({
          key: `${li}-${pi}`,
          d: p.d,
          style: { stroke: p.stroke, strokeWidth: p.strokeWidth, fill: p.fill ?? "none" },
        });
      });
    });
    return out;
  }, [size, preset, seed, pad]);

  const shadow = Math.max(
    ...(PRESETS[preset] as Layer[]).map((l) => Math.max(l.dx ?? 0, l.dy ?? 0)),
  );
  const w = (size?.w ?? 0) + pad * 2 + shadow;
  const h = (size?.h ?? 0) + pad * 2 + shadow;

  return (
    <svg
      ref={svg}
      aria-hidden
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className={cn("pointer-events-none absolute -z-10 overflow-visible", className)}
      style={{ left: -pad, top: -pad }}
    >
      {paths.map((p) => (
        <path key={p.key} d={p.d} style={p.style} strokeLinecap="round" strokeLinejoin="round" />
      ))}
    </svg>
  );
}
