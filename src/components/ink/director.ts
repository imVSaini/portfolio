import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/*
 * One drop of clay ink made every clay mark on this page. The director owns that drop: each
 * section is an act that says where the ink should be for a given scroll position (and inks
 * the real DOM as it goes); between acts the drop hops, or rides the career ruler's needle.
 * The rendered ink chases those targets through springs, so it lags, stretches, overshoots and
 * wobbles like a liquid, and the goo filter fuses or splits the blobs.
 */

type Pt = { x: number; y: number };
type Blob = { x: number; y: number; r: number };
type Pill = { x: number; y: number; w: number; h: number };

type Shape = {
  main: { x: number; y: number; rx: number; ry: number };
  extra: Blob[];
  pills: Pill[];
  ground?: number;
  seal?: { x: number; y: number; size: number; on: number };
};

type Env = {
  horizontal: boolean;
  size: number;
  R: number;
  pin?: ScrollTrigger;
  max: number;
  top: number;
  bottom: number;
};

type Act = {
  start: number;
  end: number;
  measure(env: Env): void;
  pose(pos: number, env: Env, out: Shape): void;
  effects(pos: number, env: Env): void;
  settle(): void;
  restore(): void;
};

const clamp01 = gsap.utils.clamp(0, 1);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (a: number, b: number, t: number) => {
  const x = clamp01((t - a) / (b - a));
  return x * x * (3 - 2 * x);
};
const arc = (a: Pt, b: Pt, u: number, h: number): Pt => ({
  x: lerp(a.x, b.x, u),
  y: lerp(a.y, b.y, u) - 4 * h * u * (1 - u),
});
const dist = (a: Pt, b: Pt) => Math.hypot(b.x - a.x, b.y - a.y);
const centre = (el: Element): Pt => {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
};
const visible = (el: Element) => el.getClientRects().length > 0;
const firstVisible = <T extends Element>(selector: string) =>
  Array.from(document.querySelectorAll<T>(selector)).find(visible) ?? null;

// Inline-style writes are cached so a scroll frame only touches what actually changed.
const written = new WeakMap<Element, Map<string, string>>();
function write(el: HTMLElement | SVGElement, prop: string, value: string) {
  let props = written.get(el);
  if (!props) written.set(el, (props = new Map()));
  if (props.get(prop) === value) return;
  props.set(prop, value);
  el.style.setProperty(prop, value);
}
function unwrite(el: HTMLElement | SVGElement, ...props: string[]) {
  props.forEach((prop) => el.style.removeProperty(prop));
  written.delete(el);
}

function keyFor(el: Element, f: number, env: Env) {
  const r = el.getBoundingClientRect();
  const track = env.horizontal ? el.closest<HTMLElement>("[data-fake-vertical-track]") : null;
  if (track && env.pin) {
    const y0 = r.top + r.height / 2 - Number(gsap.getProperty(track, "y"));
    return env.pin.start + y0 - f * window.innerHeight;
  }
  return env.horizontal
    ? r.left + r.width / 2 + window.scrollX - f * window.innerWidth
    : r.top + r.height / 2 + window.scrollY - f * window.innerHeight;
}

const setMain = (out: Shape, p: Pt, rx: number, ry = rx) => {
  out.main.x = p.x;
  out.main.y = p.y;
  out.main.rx = rx;
  out.main.ry = ry;
};

function periodAct(): Act | null {
  const line = document.querySelector<HTMLElement>("[data-ink-line]");
  if (!line) return null;
  const source = document.querySelector<SVGGraphicsElement>("[data-ink-source]");
  const intro = { t: 1 };
  let started = false;

  const period = () => {
    const range = document.createRange();
    range.selectNodeContents(line);
    const rects = Array.from(range.getClientRects()).filter((r) => r.width > 1);
    const last = rects.reduce(
      (best, r) =>
        r.bottom > best.bottom + 2 || (r.bottom >= best.bottom - 2 && r.right > best.right)
          ? r
          : best,
      rects[0] ?? line.getBoundingClientRect(),
    );
    const fs = parseFloat(getComputedStyle(line).fontSize) || 60;
    const r = gsap.utils.clamp(5, 13, fs * 0.085);
    return { x: last.right + r * 0.6, y: last.bottom - fs * 0.56 - r, r };
  };

  const act: Act = {
    start: 0,
    end: 1,
    measure(env) {
      act.start = 0;
      act.end = env.size * 0.03;
      if (started) return;
      started = true;
      const pos = env.horizontal ? window.scrollX : window.scrollY;
      if (pos < 4 && source) {
        intro.t = 0;
        gsap.to(intro, { t: 1, duration: 2.6, ease: "none", delay: 0.5 });
      }
    },
    pose(_pos, _env, out) {
      const dot = period();
      if (intro.t >= 1 || !source) return setMain(out, dot, dot.r, dot.r * 0.92);
      const s = source.getBoundingClientRect();
      const tip = { x: s.right - s.width * 0.3, y: s.bottom };
      const t = intro.t;
      if (t < 0.32) {
        const grow = smooth(0, 0.3, t);
        setMain(out, { x: tip.x, y: tip.y + dot.r * (0.4 + grow * 1.6) }, dot.r * grow * 1.1);
        out.extra.push({ x: tip.x, y: tip.y + 2, r: dot.r * 0.7 * (1 - smooth(0.24, 0.32, t)) });
        return;
      }
      if (t < 0.62) {
        const u = (t - 0.32) / 0.3;
        const from = { x: tip.x, y: tip.y + dot.r * 2 };
        setMain(
          out,
          { x: lerp(from.x, dot.x, u), y: from.y + (dot.y - from.y) * u * u },
          dot.r * 1.1,
        );
        return;
      }
      const s2 = Math.sin(Math.PI * clamp01((t - 0.62) / 0.26));
      setMain(out, dot, dot.r, dot.r * 0.92);
      [-1, -0.4, 0.4, 1].forEach((d) =>
        out.extra.push({
          x: dot.x + d * dot.r * 3.2 * s2,
          y: dot.y - (1.4 - Math.abs(d)) * dot.r * 2.2 * s2,
          r: dot.r * 0.42 * s2,
        }),
      );
    },
    effects() {},
    settle() {},
    restore() {},
  };
  return act;
}

function specimenAct(): Act | null {
  let drop = firstVisible<SVGGraphicsElement>("[data-ink-specimen-drop]");
  if (!drop) return null;
  let sheet: SVGSVGElement | null = null;
  const progress = (pos: number) => clamp01((pos - act.start) / (act.end - act.start));
  const shape = () => {
    const r = drop!.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, rx: r.width / 2, ry: r.height / 2 };
  };

  const act: Act = {
    start: 0,
    end: 1,
    measure(env) {
      drop = firstVisible<SVGGraphicsElement>("[data-ink-specimen-drop]") ?? drop;
      sheet = drop?.closest<SVGSVGElement>("[data-ink-specimen]") ?? null;
      const k = keyFor(drop!, 0.55, env);
      act.start = k - env.size * 0.14;
      act.end = k + env.size * 0.16;
    },
    pose(pos, env, out) {
      const p = progress(pos);
      const spec = shape();
      const land = keep({ x: spec.x - spec.rx * 0.15, y: spec.y + spec.ry - env.R }, env);
      const leave = keep({ x: spec.x + spec.rx * 0.8, y: spec.y + spec.ry - env.R }, env);
      if (p < 0.08) return setMain(out, land, env.R);
      if (p < 0.72) {
        const s = smooth(0.08, 0.42, p);
        setMain(
          out,
          { x: lerp(land.x, spec.x, s), y: lerp(land.y, spec.y, s) },
          lerp(env.R, spec.rx, s),
          lerp(env.R, spec.ry, s),
        );
        return;
      }
      const s = smooth(0.72, 0.94, p);
      setMain(
        out,
        { x: lerp(spec.x, leave.x, s), y: lerp(spec.y, leave.y, s) },
        lerp(spec.rx, env.R, s),
        lerp(spec.ry, env.R, s),
      );
    },
    effects(pos) {
      if (!sheet) return;
      const p = progress(pos);
      write(sheet, "--ink", (smooth(0.3, 0.42, p) * (1 - smooth(0.72, 0.84, p))).toFixed(3));
    },
    settle() {},
    restore() {
      document
        .querySelectorAll<SVGSVGElement>("[data-ink-specimen]")
        .forEach((el) => unwrite(el, "--ink"));
    },
  };
  return act;
}

function highlightAct(): Act | null {
  const el = document.querySelector<HTMLElement>("[data-ink-hl]");
  if (!el) return null;
  const band = (r: DOMRect) => ({ y: r.top + r.height * 0.69, h: r.height * 0.5 });
  const amount = (pos: number) =>
    smooth(0.12, 0.8, clamp01((pos - act.start) / (act.end - act.start)));

  const act: Act = {
    start: 0,
    end: 1,
    measure(env) {
      const k = keyFor(el, 0.5, env);
      act.start = k - env.size * 0.12;
      act.end = k + env.size * 0.14;
    },
    pose(pos, env, out) {
      const p = clamp01((pos - act.start) / (act.end - act.start));
      const rects = Array.from(el.getClientRects()).filter((r) => r.width > 2);
      if (!rects.length) return;
      const a = amount(pos);
      const soak = smooth(0.8, 0.96, p);
      const last = rects[rects.length - 1];
      const exit = { x: last.right + env.R * 0.9, y: band(last).y };

      rects.forEach((r, i) => {
        const b = band(r);
        const w = a * r.width;
        const h = b.h * (1 - soak);
        if (w > 1 && h > 1) out.pills.push({ x: r.left, y: b.y - h / 2, w, h });
        const head = { x: r.left + Math.max(w, env.R * 0.6), y: b.y };
        const rr = lerp(env.R, b.h * 0.62, smooth(0.12, 0.2, p));
        if (i === rects.length - 1) {
          setMain(out, soak > 0 ? arc(head, exit, soak, 18) : head, lerp(rr, env.R, soak));
        } else if (a > 0) {
          const at =
            soak > 0 ? { x: lerp(head.x, exit.x, soak), y: lerp(head.y, exit.y, soak) } : head;
          out.extra.push({ x: at.x, y: at.y, r: rr * smooth(0.12, 0.2, p) });
        }
      });
    },
    effects(pos) {
      write(el, "transition", "none");
      write(el, "background-size", `${(amount(pos) * 100).toFixed(1)}% 52%`);
    },
    settle() {},
    restore() {
      unwrite(el, "transition", "background-size");
    },
  };
  return act;
}

function ringsAct(): Act | null {
  const host = document.querySelector<HTMLElement>("[data-ink-rings]");
  if (!host) return null;
  const paths = Array.from(host.querySelectorAll<SVGPathElement>("[data-ring] path"));
  if (!paths.length) return null;
  const lengths = paths.map((p) => p.getTotalLength());
  let keys = paths.map(() => 0);
  let order = paths.map((_, i) => i);
  let unit = 1;

  const on = (i: number, a: number): Pt => {
    const pt = paths[i].getPointAtLength(a * lengths[i]);
    const m = paths[i].getScreenCTM();
    if (!m) return { x: 0, y: 0 };
    return { x: m.a * pt.x + m.c * pt.y + m.e, y: m.b * pt.x + m.d * pt.y + m.f };
  };
  // Each ring is drawn as it reaches the middle of the screen, so on a short screen no droplet
  // draws under the header.
  const drawn = (i: number, pos: number) =>
    smooth(keys[i] - unit * 0.08, keys[i] + unit * 0.12, pos);

  const act: Act = {
    start: 0,
    end: 1,
    measure(env) {
      unit = env.size;
      keys = paths.map((p) => keyFor(p.closest("svg") ?? p, 0.55, env));
      order = paths.map((_, i) => i).sort((a, b) => keys[a] - keys[b] || a - b);
      act.start = keys[order[0]] - unit * 0.2;
      act.end = keys[order[order.length - 1]] + unit * 0.26;
    },
    pose(pos, env, out) {
      const first = order[0];
      const last = order[order.length - 1];
      const split = smooth(act.start, act.start + unit * 0.16, pos);
      const merge = smooth(keys[last] + unit * 0.12, keys[last] + unit * 0.26, pos);
      const origin = on(first, 0);
      const home = on(last, 1);
      paths.forEach((_, i) => {
        const d = drawn(i, pos);
        let at = d > 0 ? on(i, d) : keep(arc(origin, on(i, 0), split, 46), env);
        if (merge > 0) at = keep(arc(on(i, 1), home, merge, 30), env);
        const r = lerp(env.R, env.R * 0.62, split) * (1 + merge * 0.5);
        if (i === last) setMain(out, at, r);
        else out.extra.push({ x: at.x, y: at.y, r: r * split });
      });
    },
    effects(pos) {
      paths.forEach((p, i) => {
        write(p, "transition", "none");
        write(p, "stroke-dashoffset", (1 - drawn(i, pos)).toFixed(4));
      });
    },
    settle() {},
    restore() {
      paths.forEach((p) => unwrite(p, "transition", "stroke-dashoffset"));
    },
  };
  return act;
}

type HopConfig = {
  select: () => HTMLElement[];
  f: number;
  anchor: (el: HTMLElement) => Pt;
  soak: (el: HTMLElement, a: number, pos: number, key: number, env: Env, i: number) => void;
  clear: (el: HTMLElement) => void;
  settle?: (el: HTMLElement) => void;
  lift?: number;
  sink?: number;
};

// A travelling drop stays between the header and the bottom nav (both move on touch devices).
function keep(p: Pt, env: Env): Pt {
  const pad = env.R + 6;
  const x = gsap.utils.clamp(pad, window.innerWidth - pad, p.x);
  if (env.bottom - env.top < pad * 2) return { x, y: p.y };
  return { x, y: gsap.utils.clamp(env.top + pad, env.bottom - pad, p.y) };
}

// A riding drop lets go before its target scrolls off-screen: it waits at a line near the
// leading edge, then hops on.
function hold(p: Pt, env: Env): Pt {
  if (env.horizontal) return keep({ x: Math.max(p.x, window.innerWidth * 0.16), y: p.y }, env);
  const line = env.top + (env.bottom - env.top) * 0.14;
  return keep({ x: p.x, y: Math.max(p.y, line) }, env);
}

const lift = (env: Env, max: number) => Math.min(max, (env.bottom - env.top) * 0.24);

function hopAct(cfg: HopConfig): Act | null {
  let els = cfg.select().filter(visible);
  if (!els.length) return null;
  let keys: number[] = [];

  const act: Act = {
    start: 0,
    end: 1,
    measure(env) {
      const all = cfg.select().filter(visible);
      const pairs = all.map((el) => ({ el, k: keyFor(el, cfg.f, env) })).sort((a, b) => a.k - b.k);
      els = pairs.map((p) => p.el);
      keys = pairs.map((p) => p.k);
      // Landings at least a short hop apart, and further when neighbours sit in different rows or
      // columns, so no hop ever teleports.
      const cross = els.map((el) => {
        const a = cfg.anchor(el);
        return env.horizontal ? a.y : a.x;
      });
      for (let i = 1; i < keys.length; i++) {
        const apart = env.size * 0.07 + Math.abs(cross[i] - cross[i - 1]) * 0.35;
        keys[i] = Math.max(keys[i], keys[i - 1] + apart);
      }
      act.start = keys[0];
      act.end = keys.length > 1 ? keys[keys.length - 1] : keys[0] + env.size * 0.1;
    },
    pose(pos, env, out) {
      const n = els.length;
      let i = 0;
      while (i < n - 2 && pos > keys[i + 1]) i++;
      const sink = cfg.sink ?? 0.6;
      if (n === 1) return setMain(out, cfg.anchor(els[0]), env.R * sink);
      const a = hold(cfg.anchor(els[i]), env);
      const b = cfg.anchor(els[i + 1]);
      const span = keys[i + 1] - keys[i];
      const hop = Math.min(span, Math.max(env.size * 0.2, dist(a, b) * 0.55));
      const u = clamp01((pos - (keys[i + 1] - hop)) / Math.max(1, hop));
      const h = gsap.utils.clamp(16, lift(env, cfg.lift ?? 110), dist(a, b) * 0.4 + 18);
      const air = smooth(0, 0.2, u) * (1 - smooth(0.8, 1, u));
      setMain(out, u > 0 ? keep(arc(a, b, u, h), env) : a, env.R * lerp(sink, 1, air));
      if (u > 0) out.ground = lerp(a.y, b.y, u) + env.R;
    },
    effects(pos, env) {
      els.forEach((el, i) => {
        const a = smooth(keys[i] - env.size * 0.015, keys[i] + env.size * 0.02, pos);
        cfg.soak(el, a, pos, keys[i], env, i);
      });
    },
    settle() {
      els.forEach((el) => cfg.settle?.(el));
    },
    restore() {
      els.forEach((el) => cfg.clear(el));
    },
  };
  return act;
}

function chipsAct() {
  return hopAct({
    select: () => Array.from(document.querySelectorAll<HTMLElement>("#skills .chip--featured")),
    f: 0.62,
    anchor: (el) => centre(el),
    lift: 120,
    soak: (el, a) => {
      write(el, "--ink", a.toFixed(3));
      write(el, "scale", (1 + Math.sin(Math.PI * a) * 0.12).toFixed(3));
    },
    clear: (el) => unwrite(el, "--ink", "scale"),
  });
}

function stepsAct() {
  return hopAct({
    select: () => Array.from(document.querySelectorAll<HTMLElement>("[data-ink-step]")),
    f: 0.64,
    anchor: (el) => centre(el),
    lift: 90,
    sink: 0.5,
    soak: (el, a) => write(el, "--ink", a.toFixed(3)),
    clear: (el) => unwrite(el, "--ink"),
    settle: (el) => write(el, "--ink", "1"),
  });
}

function framesAct(washes: SVGCircleElement[], clips: SVGRectElement[], group: SVGGElement) {
  const live = new Set<number>();
  const spot = (r: DOMRect) => ({ x: r.width * 0.26, y: r.height * 0.36 });
  return hopAct({
    select: () => Array.from(document.querySelectorAll<HTMLElement>("[data-ink-frame]")),
    f: 0.6,
    anchor: (el) => {
      const r = el.getBoundingClientRect();
      const s = spot(r);
      return { x: r.left + s.x, y: r.top + s.y };
    },
    lift: 140,
    sink: 0.45,
    soak: (el, _a, pos, key, env, i) => {
      const wash = smooth(key - env.size * 0.01, key + env.size * 0.2, pos);
      const clear = smooth(key + env.size * 0.12, key + env.size * 0.32, pos);
      const r = el.getBoundingClientRect();
      const s = spot(r);
      const cover = Math.hypot(Math.max(s.x, r.width - s.x), Math.max(s.y, r.height - s.y));
      write(el, "--ix", `${s.x.toFixed(1)}px`);
      write(el, "--iy", `${s.y.toFixed(1)}px`);
      write(el, "--ir", `${(wash * (cover + 60)).toFixed(1)}px`);
      const circle = washes[i];
      const clip = clips[i];
      if (!circle || !clip) return;
      const on = wash > 0 && clear < 1 && r.right > 0 && r.left < window.innerWidth;
      if (on) live.add(i);
      else live.delete(i);
      group.style.display = live.size ? "" : "none";
      circle.setAttribute("r", on ? (wash * cover * 1.1).toFixed(1) : "0");
      circle.setAttribute("cx", (r.left + s.x).toFixed(1));
      circle.setAttribute("cy", (r.top + s.y).toFixed(1));
      circle.setAttribute("opacity", (1 - clear).toFixed(3));
      clip.setAttribute("x", (r.left - 4).toFixed(1));
      clip.setAttribute("y", (r.top - 4).toFixed(1));
      clip.setAttribute("width", (r.width + 8).toFixed(1));
      clip.setAttribute("height", (r.height + 8).toFixed(1));
    },
    clear: (el) => unwrite(el, "--ix", "--iy", "--ir"),
  });
}

function sealAct(): Act | null {
  const mark = document.querySelector<HTMLElement>("[data-ink-seal]");
  const card = mark?.closest<HTMLElement>("a");
  if (!mark || !card) return null;
  const RIM = 10;

  const act: Act = {
    start: 0,
    end: 1,
    measure(env) {
      act.end = env.max;
      act.start = Math.min(keyFor(card, 0.8, env), act.end - env.size * 0.3);
    },
    pose(pos, env, out) {
      const p = clamp01((pos - act.start) / (act.end - act.start));
      const anchor = centre(mark);
      const box = card.getBoundingClientRect();
      const pad = env.R * 2.4;
      const c = {
        x: anchor.x,
        y: gsap.utils.clamp(
          Math.max(box.top, env.top) + pad,
          Math.max(Math.max(box.top, env.top) + pad, Math.min(box.bottom, env.bottom) - pad),
          anchor.y,
        ),
      };
      const spread = smooth(0.3, 0.62, p);
      const R = env.R;
      setMain(out, c, lerp(R, R * 1.75, spread));
      for (let j = 0; j < RIM; j++) {
        const ang = (j / RIM) * Math.PI * 2 + Math.sin(j * 2.3) * 0.12;
        const rad = R * 1.62 * spread * (1 + Math.sin(j * 1.7) * 0.07);
        out.extra.push({
          x: c.x + Math.cos(ang) * rad,
          y: c.y + Math.sin(ang) * rad,
          r: R * (0.5 + Math.sin(j * 3.1) * 0.08) * spread,
        });
      }
      out.seal = { x: c.x, y: c.y, size: R * 1.25, on: smooth(0.64, 0.86, p) };
    },
    effects() {},
    settle() {},
    restore() {},
  };
  return act;
}

type Body = { x: number; y: number; vx: number; vy: number; r: number; vr: number };
const body = (x = 0, y = 0): Body => ({ x, y, vx: 0, vy: 0, r: 0, vr: 0 });

function spring(b: Body, tx: number, ty: number, tr: number, k: number, c: number, dt: number) {
  b.vx += (k * (tx - b.x) - c * b.vx) * dt;
  b.vy += (k * (ty - b.y) - c * b.vy) * dt;
  b.vr += (k * 1.3 * (tr - b.r) - c * 0.8 * b.vr) * dt;
  b.x += b.vx * dt;
  b.y += b.vy * dt;
  b.r = Math.max(0, b.r + b.vr * dt);
}

export function playInk({ horizontal, reduced }: { horizontal: boolean; reduced: boolean }) {
  const svg = document.querySelector<SVGSVGElement>("[data-ink]");
  if (!svg || !document.querySelector("[data-ink-gloss]")) return () => {};
  const q = <T extends Element>(s: string) => svg.querySelector<T>(s)!;
  const qa = <T extends Element>(s: string) => Array.from(svg.querySelectorAll<T>(s));

  const washGroup = q<SVGGElement>("[data-ink-washes]");
  const acts = [
    periodAct(),
    specimenAct(),
    highlightAct(),
    ringsAct(),
    chipsAct(),
    stepsAct(),
    framesAct(
      qa<SVGCircleElement>("[data-ink-wash]"),
      qa<SVGRectElement>("[data-ink-clip]"),
      washGroup,
    ),
    sealAct(),
  ].filter((a): a is Act => a !== null);

  const layers = Array.from(
    document.querySelectorAll<SVGSVGElement>("[data-ink], [data-ink-gloss]"),
  );
  if (reduced) {
    layers.forEach((l) => (l.style.display = "none"));
    acts.forEach((a) => a.settle());
    return () => {
      layers.forEach((l) => (l.style.display = ""));
      acts.forEach((a) => a.restore());
    };
  }

  const gooFilter = q<SVGFilterElement>("#ink-goo");
  const mainEl = q<SVGEllipseElement>("[data-ink-main]");
  const blobEls = qa<SVGCircleElement>("[data-ink-blob]");
  const pillEls = qa<SVGRectElement>("[data-ink-pill]");
  const shadow = q<SVGEllipseElement>("[data-ink-shadow]");
  const gloss = document.querySelector<SVGSVGElement>("[data-ink-gloss]");
  const shine = gloss!.querySelector<SVGEllipseElement>("[data-ink-shine]")!;
  const seal = gloss!.querySelector<SVGGElement>("[data-ink-seal]")!;
  const sealRing = seal.querySelector("circle")!;
  const sealMark = seal.querySelector("text")!;

  const env: Env = { horizontal, size: 1, R: 12, max: 1, top: 0, bottom: 1 };
  const header = document.querySelector<HTMLElement>("header");
  const bottomNav = document.querySelector<HTMLElement>("[data-bottom-nav]");
  const band = () => {
    env.top = Math.max(0, header?.getBoundingClientRect().bottom ?? 0);
    const nav = bottomNav?.getBoundingClientRect();
    env.bottom = nav && nav.height > 0 ? Math.min(window.innerHeight, nav.top) : window.innerHeight;
  };
  const measure = () => {
    band();
    env.size = horizontal ? window.innerWidth : Math.max(window.innerHeight, 620);
    env.R = horizontal
      ? gsap.utils.clamp(10, 15, window.innerWidth * 0.0095)
      : gsap.utils.clamp(9, 14, window.innerWidth * 0.026);
    env.pin = ScrollTrigger.getById("fake-vertical");
    env.max = ScrollTrigger.maxScroll(window, horizontal);
    acts.forEach((a) => a.measure(env));
    acts.sort((a, b) => a.start - b.start);
    for (let i = 0; i < acts.length - 1; i++) {
      const a = acts[i];
      const b = acts[i + 1];
      const from = sample(a, a.end);
      const to = sample(b, b.start);
      const across = horizontal ? Math.abs(to.y - from.y) : Math.abs(to.x - from.x);
      const gap = env.size * 0.16 + across * 0.4;
      if (b.start - a.end >= gap) continue;
      const mid = (a.end + b.start) / 2;
      a.end = Math.max(a.start + 1, mid - gap / 2);
      b.start = Math.min(b.end - 1, mid + gap / 2);
    }
    lastPos = NaN;
  };

  const out: Shape = { main: { x: 0, y: 0, rx: 0, ry: 0 }, extra: [], pills: [] };
  const probe: Shape = { main: { x: 0, y: 0, rx: 0, ry: 0 }, extra: [], pills: [] };
  const reset = (s: Shape) => {
    s.extra.length = 0;
    s.pills.length = 0;
    s.ground = undefined;
    s.seal = undefined;
  };
  const sample = (act: Act, pos: number) => {
    reset(probe);
    act.pose(pos, env, probe);
    return { ...probe.main };
  };

  const main = { ...body(), ry: 0, vry: 0 };
  const tails = [body(), body()];
  const extras = blobEls.map(() => body());
  let lastPos = NaN;
  let first = true;

  const tick = (_: number, deltaMs: number) => {
    const dt = Math.min(1 / 30, deltaMs / 1000);
    const pos = horizontal ? window.scrollX : window.scrollY;
    band();
    if (pos !== lastPos) acts.forEach((a) => a.effects(pos, env));
    lastPos = pos;

    reset(out);
    const n = acts.length;
    const at = acts.findIndex((a) => pos >= a.start && pos <= a.end);
    if (at >= 0) acts[at].pose(pos, env, out);
    else if (pos < acts[0].start) acts[0].pose(acts[0].start, env, out);
    else if (pos > acts[n - 1].end) acts[n - 1].pose(acts[n - 1].end, env, out);
    else {
      let i = acts.findIndex((a, k) => k < n - 1 && pos > a.end && pos < acts[k + 1].start);
      if (i < 0)
        i = Math.max(
          0,
          acts.findLastIndex((a) => a.end < pos),
        );
      i = Math.min(i, n - 2);
      const from = sample(acts[i], acts[i].end);
      const to = sample(acts[i + 1], acts[i + 1].start);
      const t = (pos - acts[i].end) / (acts[i + 1].start - acts[i].end);
      const span = Math.abs(horizontal ? to.x - from.x : to.y - from.y);
      const R = env.R;
      const far =
        acts[i + 1].start - acts[i].end > env.size * 0.9 || (horizontal && span > env.size * 0.7);
      const perch: Pt = horizontal
        ? { x: window.innerWidth / 2, y: window.innerHeight - 100 - R * 0.95 }
        : { x: window.innerWidth - R * 2.4, y: (env.top + env.bottom) / 2 };
      let p: Pt;
      let ground: number;
      if (far) {
        const a = gsap.utils.clamp(
          0.1,
          0.45,
          (env.size * 0.45) / Math.max(1, acts[i + 1].start - acts[i].end),
        );
        if (t < a) {
          const u = t / a;
          p = arc(from, perch, u, gsap.utils.clamp(24, lift(env, 220), dist(from, perch) * 0.3));
          ground = lerp(from.y, perch.y, u) + R;
        } else if (t > 1 - a) {
          const u = (t - (1 - a)) / a;
          p = arc(perch, to, u, gsap.utils.clamp(24, lift(env, 220), dist(perch, to) * 0.3));
          ground = lerp(perch.y, to.y, u) + R;
        } else {
          p = { x: perch.x, y: perch.y + Math.sin(t * 40) * 1.5 };
          ground = perch.y + R;
        }
      } else {
        p = arc(from, to, t, gsap.utils.clamp(20, lift(env, 200), dist(from, to) * 0.35));
        ground = lerp(from.y, to.y, t) + R;
      }
      const edge = Math.min(t, 1 - t);
      const r = Math.max(
        R,
        lerp(from.rx, to.rx, t) * (1 - smooth(0, 0.2, edge)) + R * smooth(0, 0.2, edge),
      );
      setMain(out, keep(p, env), r);
      out.ground = ground;
    }

    if (first) {
      first = false;
      Object.assign(main, { x: out.main.x, y: out.main.y, r: 0, ry: 0 });
      tails.forEach((b) => Object.assign(b, { x: out.main.x, y: out.main.y }));
      extras.forEach((b) => Object.assign(b, { x: out.main.x, y: out.main.y }));
    }

    // Main drop: position spring plus independent width/height springs (so it can swell into
    // an ellipse and wobble when it lands).
    main.vx += (240 * (out.main.x - main.x) - 22 * main.vx) * dt;
    main.vy += (240 * (out.main.y - main.y) - 22 * main.vy) * dt;
    main.x += main.vx * dt;
    main.y += main.vy * dt;
    main.vr += (320 * (out.main.rx - main.r) - 15 * main.vr) * dt;
    main.vry += (320 * (out.main.ry - main.ry) - 15 * main.vry) * dt;
    main.r = Math.max(0, main.r + main.vr * dt);
    main.ry = Math.max(0, main.ry + main.vry * dt);

    const speed = Math.hypot(main.vx, main.vy);
    const stretch = Math.min(0.55, speed / 2400);
    const angle = (Math.atan2(main.vy, main.vx) * 180) / Math.PI;
    const tailR = Math.min(main.r, main.ry);
    spring(tails[0], main.x, main.y, tailR * 0.72, 150, 15, dt);
    spring(tails[1], tails[0].x, tails[0].y, tailR * 0.5, 110, 13, dt);

    extras.forEach((b, i) => {
      const t = out.extra[i];
      if (t) spring(b, t.x, t.y, t.r, 230, 21, dt);
      else spring(b, main.x, main.y, 0, 230, 21, dt);
    });

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    const grow = (x: number, y: number, r: number) => {
      if (r < 0.5) return;
      minX = Math.min(minX, x - r);
      minY = Math.min(minY, y - r);
      maxX = Math.max(maxX, x + r);
      maxY = Math.max(maxY, y + r);
    };

    const rx = main.r * (1 + stretch);
    const ry = main.ry / (1 + stretch * 0.8);
    const rot = stretch > 0.02 ? angle : 0;
    mainEl.setAttribute("rx", rx.toFixed(2));
    mainEl.setAttribute("ry", ry.toFixed(2));
    mainEl.setAttribute(
      "transform",
      `translate(${main.x.toFixed(2)} ${main.y.toFixed(2)}) rotate(${rot.toFixed(1)})`,
    );
    grow(main.x, main.y, Math.max(rx, ry));

    blobEls.forEach((el, i) => {
      const b = i < 2 ? tails[i] : extras[i - 2];
      if (!b) return;
      el.setAttribute("cx", b.x.toFixed(2));
      el.setAttribute("cy", b.y.toFixed(2));
      el.setAttribute("r", b.r.toFixed(2));
      grow(b.x, b.y, b.r);
    });

    pillEls.forEach((el, i) => {
      const p = out.pills[i];
      if (!p) {
        el.setAttribute("width", "0");
        return;
      }
      el.setAttribute("x", p.x.toFixed(1));
      el.setAttribute("y", p.y.toFixed(1));
      el.setAttribute("width", p.w.toFixed(1));
      el.setAttribute("height", p.h.toFixed(1));
      el.setAttribute("rx", (p.h / 2).toFixed(1));
      grow(p.x + p.w / 2, p.y + p.h / 2, Math.max(p.w, p.h) / 2 + 2);
    });

    if (Number.isFinite(minX)) {
      const m = 30;
      gooFilter.setAttribute("x", (minX - m).toFixed(0));
      gooFilter.setAttribute("y", (minY - m).toFixed(0));
      gooFilter.setAttribute("width", (maxX - minX + m * 2).toFixed(0));
      gooFilter.setAttribute("height", (maxY - minY + m * 2).toFixed(0));
    }

    const ground = Math.max(out.ground ?? main.y + ry, main.y + ry);
    const height = ground - (main.y + ry);
    const fade = clamp01(1 - height / 220);
    shadow.setAttribute("cx", main.x.toFixed(1));
    shadow.setAttribute("cy", (ground + 2).toFixed(1));
    shadow.setAttribute("rx", (Math.max(rx, ry) * (0.9 - 0.4 * (1 - fade))).toFixed(1));
    shadow.setAttribute("ry", Math.max(1.5, Math.max(rx, ry) * 0.2).toFixed(1));
    shadow.setAttribute("opacity", main.r > 1 ? (0.2 * fade).toFixed(3) : "0");

    shine.setAttribute("cx", (main.x - rx * 0.34).toFixed(1));
    shine.setAttribute("cy", (main.y - ry * 0.38).toFixed(1));
    shine.setAttribute("rx", (rx * 0.26).toFixed(1));
    shine.setAttribute("ry", (ry * 0.15).toFixed(1));
    shine.setAttribute(
      "transform",
      `rotate(-30 ${(main.x - rx * 0.34).toFixed(1)} ${(main.y - ry * 0.38).toFixed(1)})`,
    );
    shine.setAttribute("opacity", main.r > 4 ? "0.5" : "0");

    if (out.seal && out.seal.on > 0) {
      const s = out.seal;
      seal.setAttribute(
        "transform",
        `translate(${s.x.toFixed(1)} ${s.y.toFixed(1)}) scale(${(s.size * (1.25 - 0.25 * s.on)).toFixed(2)})`,
      );
      seal.setAttribute("opacity", s.on.toFixed(3));
      sealRing.setAttribute("stroke-width", (2 / s.size).toFixed(3));
      sealMark.setAttribute("font-size", "1.05");
    } else {
      seal.setAttribute("opacity", "0");
    }
  };

  ScrollTrigger.addEventListener("refresh", measure);
  measure();
  gsap.ticker.add(tick);

  return () => {
    gsap.ticker.remove(tick);
    ScrollTrigger.removeEventListener("refresh", measure);
    acts.forEach((a) => a.restore());
    mainEl.setAttribute("rx", "0");
    mainEl.setAttribute("ry", "0");
    blobEls.forEach((el) => el.setAttribute("r", "0"));
    pillEls.forEach((el) => el.setAttribute("width", "0"));
    shadow.setAttribute("opacity", "0");
    shine.setAttribute("opacity", "0");
    seal.setAttribute("opacity", "0");
    washGroup.style.display = "none";
  };
}
