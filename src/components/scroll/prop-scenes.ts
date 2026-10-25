import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Scene = {
  tl: gsap.core.Timeline;
  loops?: gsap.core.Animation[];
  onScroll?: (self: ScrollTrigger) => void;
  tick?: () => void;
  dispose?: () => void;
};

type Flight = { prefix?: string; origin?: [number, number]; turn?: boolean };

const SVG_NS = "http://www.w3.org/2000/svg";

const part = <T extends Element = SVGGraphicsElement>(el: Element, name: string) =>
  el.querySelector<T>(`[data-part="${name}"]`)!;

const parts = <T extends Element = SVGGraphicsElement>(el: Element, name: string) =>
  gsap.utils.toArray<T>(el.querySelectorAll(`[data-part="${name}"]`));

const speedOf = (self: ScrollTrigger) =>
  gsap.utils.clamp(0, 1, Math.abs(self.getVelocity()) / 2400);

function pivotAtOrigin(node: SVGGraphicsElement) {
  const box = node.getBBox();
  gsap.set(node, { transformOrigin: `${-box.x}px ${-box.y}px` });
}

function sketchIn(tl: gsap.core.Timeline, nodes: Element[], at: number, duration: number) {
  if (!nodes.length) return;
  const stagger = Math.min(0.02, (duration * 0.5) / nodes.length);
  tl.fromTo(
    nodes,
    { attr: { "stroke-dasharray": 1, "stroke-dashoffset": 1 } },
    { attr: { "stroke-dashoffset": 0 }, duration, stagger, ease: "power1.inOut" },
    at,
  ).fromTo(
    nodes,
    { attr: { "fill-opacity": 0 } },
    { attr: { "fill-opacity": 1 }, duration: duration * 0.6, stagger },
    at + duration * 0.5,
  );
}

function fly(
  tl: gsap.core.Timeline,
  el: Element,
  at: number,
  duration: number,
  ease: string,
  { prefix = "", origin = [0.5, 0.5], turn = true }: Flight = {},
) {
  const path = part<SVGPathElement>(el, `${prefix}path`);
  tl.fromTo(
    part(el, `${prefix}trail`),
    { attr: { "stroke-dasharray": 1, "stroke-dashoffset": 1 } },
    { attr: { "stroke-dashoffset": 0 }, duration, ease },
    at,
  );
  const tween = gsap.to(part(el, `${prefix}rider`), {
    motionPath: { path, align: path, alignOrigin: origin, autoRotate: turn },
    duration,
    ease,
    immediateRender: true,
  });
  tl.add(tween, at);
  return tween;
}

function popIn(tl: gsap.core.Timeline, node: Element, at: number, tilt = -4) {
  tl.fromTo(
    node,
    { autoAlpha: 0, scale: 0.5, rotation: tilt - 10, transformOrigin: "50% 50%" },
    { autoAlpha: 1, scale: 1, rotation: tilt, duration: 0.07, ease: "back.out(3)" },
    at,
  );
}

function plane(el: HTMLElement): Scene {
  const path = part<SVGPathElement>(el, "path");
  const rider = part(el, "rider");
  const turn = part(el, "turn");
  const flutter = part(el, "flutter");
  const shadow = part(el, "shadow");
  const ground = Number(shadow.getAttribute("cy"));
  const length = path.getTotalLength();
  pivotAtOrigin(turn);
  pivotAtOrigin(flutter);

  const tl = gsap.timeline({ defaults: { ease: "none" } });
  sketchIn(tl, parts(el, "ink"), 0, 0.1);
  const flight = fly(tl, el, 0.1, 0.82, "power1.inOut");
  popIn(tl, part(el, "note"), 0.93);

  const roll = gsap.quickTo(turn, "scaleY", { duration: 0.5, ease: "power2.out" });
  const lines = gsap.quickSetter(part(el, "lines"), "opacity");
  let lastAngle = Number(gsap.getProperty(rider, "rotation"));
  const follow = () => {
    const at = path.getPointAtLength(flight.ratio * length);
    const lift = gsap.utils.clamp(0, 1, (ground - at.y) / ground);
    shadow.setAttribute("cx", at.x.toFixed(1));
    shadow.setAttribute("rx", (30 - lift * 20).toFixed(1));
    shadow.setAttribute("opacity", (0.2 - lift * 0.15).toFixed(3));
    const angle = Number(gsap.getProperty(rider, "rotation"));
    roll(1 - gsap.utils.clamp(0, 0.6, Math.abs(angle - lastAngle) * 0.06));
    lastAngle = angle;
  };
  flight.eventCallback("onUpdate", follow);
  follow();

  const wobble = gsap.fromTo(
    flutter,
    { rotation: -3 },
    { rotation: 3, duration: 0.9, ease: "sine.inOut", yoyo: true, repeat: -1, paused: true },
  );

  let speed = 0;
  let facing = 1;
  return {
    tl,
    loops: [wobble],
    onScroll: (self) => {
      speed = Math.max(speed, speedOf(self));
      if (self.direction === facing) return;
      facing = self.direction;
      gsap.to(turn, { scaleX: facing, duration: 0.5, ease: "power3.inOut" });
    },
    tick: () => {
      speed *= 0.93;
      lines(speed);
      wobble.timeScale(1 + speed * 4);
    },
  };
}

function rocket(el: HTMLElement): Scene {
  const path = part<SVGPathElement>(el, "path");
  const smoke = part(el, "smoke");
  const length = path.getTotalLength();
  const LAUNCH_AT = 0.2;
  const LAUNCH_FOR = 0.74;

  const tl = gsap.timeline({ defaults: { ease: "none" } });
  sketchIn(tl, parts(el, "ink"), 0, 0.08);

  parts(el, "count").forEach((n, i) => {
    const at = 0.04 + i * 0.045;
    tl.fromTo(
      n,
      { autoAlpha: 0, scale: 1.8, transformOrigin: "50% 50%" },
      { autoAlpha: 1, scale: 1, duration: 0.015, ease: "back.out(3)" },
      at,
    ).to(n, { autoAlpha: 0, scale: 0.5, duration: 0.012 }, at + 0.03);
  });

  tl.fromTo(
    part(el, "ignite"),
    { scale: 0, transformOrigin: "100% 50%" },
    { scale: 1, duration: 0.05, ease: "power2.out" },
    0.14,
  ).to(
    part(el, "shake"),
    { keyframes: { x: [0, -1.8, 1.6, -1.4, 1.8, -1, 0.6, 0] }, duration: 0.08 },
    0.13,
  );

  parts(el, "billow").forEach((b) => {
    const dir = Number(b.getAttribute("data-dir"));
    gsap.set(b, { autoAlpha: 0, scale: 0.3, transformOrigin: "50% 50%" });
    tl.to(
      b,
      {
        keyframes: [
          { autoAlpha: 1, scale: 1.2, x: dir * 7, y: -3, duration: 0.07, ease: "power2.out" },
          { autoAlpha: 0, scale: 2.2, x: dir * 18, y: -12, duration: 0.12, ease: "power1.in" },
        ],
      },
      0.15 + Math.abs(dir) * 0.012,
    );
  });

  fly(tl, el, LAUNCH_AT, LAUNCH_FOR, "power1.in");

  const puffs = Array.from({ length: 18 }, (_, i) => {
    const f = 0.02 + (i / 17) * 0.9;
    const at = path.getPointAtLength(f * length);
    const puff = document.createElementNS(SVG_NS, "circle");
    puff.setAttribute("cx", at.x.toFixed(1));
    puff.setAttribute("cy", at.y.toFixed(1));
    puff.setAttribute("r", (3.5 + (i % 3) * 1.4 + f * 3).toFixed(1));
    puff.setAttribute("class", "ink ghost");
    puff.style.fill = "var(--color-card)";
    smoke.appendChild(puff);
    gsap.set(puff, { autoAlpha: 0, scale: 0.3, transformOrigin: "50% 50%" });
    tl.to(
      puff,
      {
        keyframes: [
          { autoAlpha: 1, scale: 0.7, duration: 0.012 },
          {
            autoAlpha: 0,
            scale: 2 + (i % 4) * 0.35,
            x: gsap.utils.random(-12, 12),
            y: gsap.utils.random(4, 16),
            duration: 0.2,
            ease: "power1.out",
          },
        ],
      },
      LAUNCH_AT + LAUNCH_FOR * Math.sqrt(f),
    );
    return puff;
  });

  const stars = parts(el, "star");
  tl.fromTo(
    stars,
    { autoAlpha: 0, scale: 0, rotation: -120, transformOrigin: "50% 50%" },
    { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.06, ease: "back.out(3)", stagger: 0.035 },
    0.62,
  );
  popIn(tl, part(el, "note"), 0.94);

  const flicker = gsap.to(part(el, "flame"), {
    scaleX: "random(0.7, 1.3)",
    scaleY: "random(0.8, 1.2)",
    transformOrigin: "100% 50%",
    duration: 0.07,
    ease: "none",
    repeat: -1,
    repeatRefresh: true,
    paused: true,
  });
  const twinkles = parts(el, "twinkle").map((s, i) =>
    gsap.to(s, {
      scale: 0.5,
      rotation: 45,
      transformOrigin: "50% 50%",
      duration: 0.7 + i * 0.13,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay: i * 0.17,
      paused: true,
    }),
  );

  const boost = part(el, "boost");
  gsap.set(boost, { transformOrigin: "100% 50%" });
  const thrust = gsap.quickTo(boost, "scaleX", { duration: 0.3, ease: "power2.out" });

  let speed = 0;
  return {
    tl,
    loops: [flicker, ...twinkles],
    onScroll: (self) => {
      speed = Math.max(speed, speedOf(self));
    },
    tick: () => {
      speed *= 0.92;
      thrust(1 + speed * 1.6);
    },
    dispose: () => puffs.forEach((p) => p.remove()),
  };
}

function journey(el: HTMLElement): Scene {
  const path = part<SVGPathElement>(el, "path");
  const rider = part(el, "rider");
  const face = part(el, "face");
  const stride = part(el, "stride");
  const pole = part(el, "pole");
  const length = path.getTotalLength();
  const CLIMB_AT = 0.14;
  const CLIMB_FOR = 0.68;

  const nearest = (x: number, y: number) => {
    let best = 0;
    let gap = Infinity;
    for (let i = 0; i <= 160; i++) {
      const pt = path.getPointAtLength((i / 160) * length);
      const d = Math.hypot(pt.x - x, pt.y - y);
      if (d < gap) {
        gap = d;
        best = i / 160;
      }
    }
    return best;
  };

  const tl = gsap.timeline({ defaults: { ease: "none" } });
  sketchIn(tl, parts(el, "ink"), 0, 0.12);
  tl.fromTo(
    part(el, "base"),
    { autoAlpha: 0, x: -8 },
    { autoAlpha: 1, x: 0, duration: 0.05 },
    0.08,
  ).fromTo(
    parts(el, "cloud"),
    { autoAlpha: 0 },
    { autoAlpha: 1, duration: 0.06, stagger: 0.03 },
    0.04,
  );
  tl.to(parts(el, "cloud"), { x: (i: number) => (i ? "-=18" : "+=22"), duration: 1 }, 0);
  tl.fromTo(part(el, "birds"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.04 }, 0.18).to(
    part(el, "birds"),
    { x: "+=86", y: "-=34", duration: 0.6 },
    0.18,
  );

  fly(tl, el, CLIMB_AT, CLIMB_FOR, "none", { origin: [0.5, 1], turn: false });

  parts(el, "tent").forEach((tent) => {
    const at = nearest(Number(tent.getAttribute("data-x")), Number(tent.getAttribute("data-y")));
    tl.fromTo(
      tent,
      { autoAlpha: 0, scale: 0, transformOrigin: "50% 100%" },
      { autoAlpha: 1, scale: 1, duration: 0.04, ease: "back.out(3)" },
      CLIMB_AT + CLIMB_FOR * at,
    );
  });

  const summit = CLIMB_AT + CLIMB_FOR;
  tl.fromTo(
    part(el, "flag"),
    { scaleY: 0, transformOrigin: "50% 100%" },
    { scaleY: 1, duration: 0.05, ease: "back.out(2.5)" },
    summit,
  );
  popIn(tl, part(el, "summit"), summit + 0.03, -3);
  tl.fromTo(
    part(el, "comet-rider"),
    { autoAlpha: 0 },
    { autoAlpha: 1, duration: 0.01 },
    summit + 0.06,
  );
  fly(tl, el, summit + 0.06, 0.08, "power2.out", { prefix: "comet-" });
  popIn(tl, part(el, "beyond"), summit + 0.12, -5);

  const wave = gsap.to(part(el, "cloth"), {
    skewY: 12,
    transformOrigin: "0% 50%",
    duration: 0.45,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
    paused: true,
  });
  const flap = gsap.to(parts(el, "wing"), {
    scaleY: 0.35,
    transformOrigin: "50% 100%",
    duration: 0.22,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
    stagger: 0.11,
    paused: true,
  });

  gsap.set(face, { transformOrigin: "50% 100%" });
  gsap.set(pole, { transformOrigin: "0% 0%" });
  let lastX = Number(gsap.getProperty(rider, "x"));
  let lastY = Number(gsap.getProperty(rider, "y"));
  let facing = 1;
  let phase = 0;
  return {
    tl,
    loops: [wave, flap],
    tick: () => {
      const x = Number(gsap.getProperty(rider, "x"));
      const y = Number(gsap.getProperty(rider, "y"));
      const dx = x - lastX;
      const moved = Math.hypot(dx, y - lastY);
      lastX = x;
      lastY = y;
      if (moved < 0.02) return;
      phase += moved * 0.55;
      gsap.set(stride, { y: -Math.abs(Math.sin(phase)) * 1.8 });
      gsap.set(pole, { rotation: Math.sin(phase) * 16 });
      const dir = Math.abs(dx) > 0.05 ? Math.sign(dx) : facing;
      if (dir === facing) return;
      facing = dir;
      gsap.to(face, { scaleX: dir, duration: 0.25, ease: "power2.out" });
    },
  };
}

const DUST = [
  [-9, -7],
  [-12, 2],
  [-6, 9],
];

function footprints(el: HTMLElement): Scene {
  const steps = parts(el, "step");
  const dust = parts(el, "dust");
  const tl = gsap.timeline({ defaults: { ease: "none" } });

  steps.forEach((step, i) => {
    const at = 0.04 + i * 0.075;
    tl.fromTo(
      step,
      { autoAlpha: 0, scale: 1.8, y: -6, transformOrigin: "50% 50%" },
      { autoAlpha: 1, scale: 1, y: 0, duration: 0.05, ease: "back.out(2)" },
      at,
    );
    const specks = gsap.utils.toArray<SVGCircleElement>(dust[i].children);
    gsap.set(specks, { autoAlpha: 0, transformOrigin: "50% 50%" });
    tl.to(
      specks,
      {
        keyframes: [
          { autoAlpha: 0.9, duration: 0.01 },
          {
            autoAlpha: 0,
            x: (k: number) => DUST[k][0],
            y: (k: number) => DUST[k][1],
            scale: 0.4,
            duration: 0.08,
            ease: "power2.out",
          },
        ],
      },
      at + 0.03,
    );
    if (i < steps.length - 3) tl.to(step, { autoAlpha: 0.3, duration: 0.15 }, at + 0.26);
  });

  tl.fromTo(
    part(el, "note"),
    { autoAlpha: 0, x: -12 },
    { autoAlpha: 1, x: 0, duration: 0.08, ease: "power2.out" },
    0.04 + steps.length * 0.075,
  );

  return { tl };
}

const SCENES: Record<string, (el: HTMLElement) => Scene> = {
  plane,
  rocket,
  journey,
  footprints,
};

export function playProps({ horizontal, reduced }: { horizontal: boolean; reduced: boolean }) {
  const visible = new Set<Scene>();
  const disposers: Array<() => void> = [];
  const parallax: Array<{ x: gsap.QuickToFunc; y: gsap.QuickToFunc; depth: number }> = [];

  gsap.utils.toArray<HTMLElement>("[data-prop]").forEach((el) => {
    const build = SCENES[el.dataset.prop ?? ""];
    if (!build || !el.getClientRects().length) return;
    const scene = build(el);
    if (scene.dispose) disposers.push(scene.dispose);
    if (reduced) {
      scene.tl.progress(1);
      return;
    }

    const panel = horizontal ? el.closest<HTMLElement>("[data-fake-vertical]") : null;
    const track = panel?.querySelector<HTMLElement>("[data-fake-vertical-track]");
    const pinned = panel && track ? panel : null;
    const travel = () => (track ? Math.max(0, track.scrollHeight - window.innerHeight) : 0);

    ScrollTrigger.create({
      trigger: pinned ?? el,
      start: pinned ? "left right" : horizontal ? "left 95%" : "top bottom",
      end: pinned
        ? () => `+=${window.innerWidth + travel()}`
        : horizontal
          ? "clamp(right 35%)"
          : "clamp(bottom 40%)",
      invalidateOnRefresh: true,
      scrub: 1,
      animation: scene.tl,
      onUpdate: scene.onScroll,
    });

    ScrollTrigger.create({
      trigger: pinned ?? el,
      start: horizontal ? "left right" : "top bottom",
      end: pinned
        ? () => `+=${window.innerWidth * 2 + travel()}`
        : horizontal
          ? "right left"
          : "bottom top",
      invalidateOnRefresh: true,
      onToggle: (self) => {
        if (self.isActive) visible.add(scene);
        else visible.delete(scene);
        scene.loops?.forEach((loop) => (self.isActive ? loop.play() : loop.pause()));
      },
    });

    const art = el.querySelector("svg");
    const depth = Number(el.dataset.depth ?? 0);
    if (art && depth)
      parallax.push({
        x: gsap.quickTo(art, "x", { duration: 0.9, ease: "power3.out" }),
        y: gsap.quickTo(art, "y", { duration: 0.9, ease: "power3.out" }),
        depth,
      });
  });

  if (reduced) return () => disposers.forEach((fn) => fn());

  const tick = () => visible.forEach((scene) => scene.tick?.());
  gsap.ticker.add(tick);

  const onMove = (e: PointerEvent) => {
    const nx = e.clientX / window.innerWidth - 0.5;
    const ny = e.clientY / window.innerHeight - 0.5;
    parallax.forEach((p) => {
      p.x(nx * p.depth);
      p.y(ny * p.depth);
    });
  };
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (fine) window.addEventListener("pointermove", onMove, { passive: true });

  return () => {
    gsap.ticker.remove(tick);
    window.removeEventListener("pointermove", onMove);
    disposers.forEach((fn) => fn());
  };
}
