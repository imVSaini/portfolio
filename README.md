# Vaibhav Kumar Saini — Portfolio

A horizontal-scroll portfolio built with Next.js 16 (App Router, TypeScript), Tailwind CSS v4,
GSAP ScrollTrigger, Locomotive Scroll v5 and Zustand.

```bash
npm run dev           # http://localhost:3000
npm run build && npm start
npm run lint          # ESLint (next + prettier + tailwind class sorting)
npm run format        # Prettier
npm run typecheck
```

## How the scroll works

Based on the "native horizontal scroll with a fake-vertical section" pattern:

- **Desktop (≥ 768px):** Locomotive Scroll runs Lenis with `orientation: "horizontal"`, so the
  window scrolls along x and ScrollTrigger works with `horizontal: true`. The Experience panel is
  pinned while its column is scrubbed upward (`[data-fake-vertical]` / `[data-fake-vertical-track]`).
- **Mobile:** the same markup stacks vertically; Locomotive runs in its default orientation.
- Project images use Locomotive's `data-scroll-speed` parallax and its `is-inview` class for the
  wipe reveal. Lenis is driven from `gsap.ticker`, so scroll and scrubbed tweens share a frame.

All of this lives in `src/components/scroll/smooth-scroll.tsx`. Shared UI state (ready, active
section, progress, menu, `scrollTo`) is in `src/store/use-scroll-store.ts`.

## Editing content

Everything is plain data in `src/data/`: `profile.ts`, `experience.ts`, `projects.ts`,
`toolkit.ts`. Project screenshots live in `public/projects/`.

Set `NEXT_PUBLIC_SITE_URL` in production so Open Graph URLs resolve.
