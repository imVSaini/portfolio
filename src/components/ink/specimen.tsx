import { cn } from "@/lib/cn";

const HATCH = Array.from({ length: 28 }, (_, i) => 76 + i * 13.5);

function Arrow({ x, y, deg }: { x: number; y: number; deg: number }) {
  return <path d="M0 0 L-9 -4 M0 0 L-9 4" transform={`translate(${x} ${y}) rotate(${deg})`} />;
}

/**
 * A technical drawing of the ink drop: an empty, dimensioned outline. On scroll the real drop
 * jumps in and swells to fill it exactly, then leaves for the next section.
 */
export function Specimen({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none select-none", className)} aria-hidden>
      <svg
        data-ink-specimen
        viewBox="0 0 520 470"
        preserveAspectRatio="xMidYMid meet"
        className="size-full overflow-visible"
      >
        <text x="40" y="44" className="fill-mineral font-hand text-[22px]">
          fig. 01b — specimen: one drop
        </text>

        <g className="specimen-line">
          <path d="M66 360 L454 360" />
          {HATCH.map((x) => (
            <path key={x} d={`M${x} 362 l -9 11`} className="specimen-ghost" />
          ))}
        </g>

        <ellipse
          data-ink-specimen-drop
          cx="260"
          cy="262"
          rx="112"
          ry="98"
          className="specimen-drop"
        />

        <g className="specimen-line">
          <path d="M148 268 L148 402 M372 268 L372 402" className="specimen-ghost" />
          <path d="M150 392 L370 392" />
          <Arrow x={150} y={392} deg={180} />
          <Arrow x={370} y={392} deg={0} />
          <path d="M262 164 L432 164" className="specimen-ghost" />
          <path d="M424 166 L424 358" />
          <Arrow x={424} y={166} deg={-90} />
          <Arrow x={424} y={358} deg={90} />
          <path d="M318 182 C 350 150 380 128 412 118" className="specimen-ghost" />
          <path d="M196 182 C 160 150 120 128 92 118" className="specimen-ghost" />
          <path d="M262 362 C 270 396 280 416 292 428" className="specimen-ghost" />
          <path d="M238 360 A 22 22 0 0 1 282 360" />
        </g>

        <g className="font-hand">
          <text x="260" y="420" textAnchor="middle" className="fill-ink text-[19px]">
            Ø — one drop
          </text>
          <text x="436" y="266" className="fill-ink text-[19px]">
            h
          </text>
          <text x="416" y="104" className="fill-ink text-[19px] font-bold">
            pigment
          </text>
          <text x="416" y="124" className="fill-ink-soft text-[17px]">
            #D97757 · clay
          </text>
          <text x="88" y="104" textAnchor="end" className="fill-ink text-[19px] font-bold">
            source
          </text>
          <text x="88" y="124" textAnchor="end" className="fill-ink-soft text-[17px]">
            the logo ↖
          </text>
          <text x="298" y="442" className="fill-ink text-[19px] font-bold">
            θ ≈ 180°
          </text>
          <text x="298" y="462" className="fill-ink-soft text-[17px]">
            barely touches, holds shape
          </text>
          <text x="260" y="150" textAnchor="middle" className="specimen-tag fill-plum text-[19px]">
            filled ✓
          </text>
        </g>
      </svg>
    </div>
  );
}
