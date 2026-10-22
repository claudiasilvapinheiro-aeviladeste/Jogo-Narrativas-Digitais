import forestBg from "@/assets/forest-whispering.jpg";
import { MAP_HEIGHT, ZONE_WIDTH } from "@/lib/quest";

// Decorative storybook scenery for each zone. Purely visual (aria-hidden by parent).

function seeded(n: number) {
  const x = Math.sin(n * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

export function ForestArt() {
  return (
    <g>
      <defs>
        <radialGradient id="firefly-glow">
          <stop offset="0%" stopColor="var(--gold)" stopOpacity={1} />
          <stop offset="100%" stopColor="var(--gold)" stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={ZONE_WIDTH} height={MAP_HEIGHT} fill="var(--forest-sky)" />
      <image
        href={forestBg}
        x={0}
        y={0}
        width={ZONE_WIDTH}
        height={MAP_HEIGHT}
        preserveAspectRatio="xMidYMid slice"
      />
      {/* Twinkling fireflies over the illustration */}
      {Array.from({ length: 22 }, (_, i) => (
        <circle
          key={`f${i}`}
          className="motion-particles"
          cx={seeded(i + 50) * ZONE_WIDTH}
          cy={140 + seeded(i + 80) * 380}
          r={8 + seeded(i + 90) * 6}
          fill="url(#firefly-glow)"
        >
          <animate
            attributeName="opacity"
            values="0.2;0.9;0.2"
            dur={`${2.5 + seeded(i + 120) * 2.5}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </g>
  );
}

export function CavernsArt() {
  const crystals = Array.from({ length: 30 }, (_, i) => ({
    x: 20 + i * 67 + seeded(i + 200) * 20,
    top: i % 2 === 0,
    h: 50 + seeded(i + 300) * 70,
    c: ["var(--crystal-1)", "var(--crystal-2)", "var(--crystal-3)"][i % 3],
  }));
  return (
    <g>
      <rect x={0} y={0} width={ZONE_WIDTH} height={MAP_HEIGHT} fill="var(--caverns-bg)" />
      <path
        d={`M0 0 H ${ZONE_WIDTH} V 120 Q 1700 170 1500 120 T 1000 130 T 500 120 T 0 140 Z`}
        fill="var(--caverns-mid)"
      />
      <path
        d={`M0 ${MAP_HEIGHT} H ${ZONE_WIDTH} V 500 Q 1700 460 1400 510 T 800 500 T 0 490 Z`}
        fill="var(--caverns-mid)"
      />
      {crystals.map((c, i) =>
        c.top ? (
          <path
            key={i}
            d={`M${c.x - 14} 100 L ${c.x} ${100 + c.h} L ${c.x + 14} 100 Z`}
            fill={c.c}
            opacity={0.85}
          />
        ) : (
          <path
            key={i}
            d={`M${c.x - 16} 560 L ${c.x} ${560 - c.h} L ${c.x + 16} 560 Z`}
            fill={c.c}
            opacity={0.9}
          />
        ),
      )}
      {Array.from({ length: 40 }, (_, i) => (
        <circle
          key={`s${i}`}
          cx={seeded(i + 400) * ZONE_WIDTH}
          cy={150 + seeded(i + 500) * 320}
          r={1.5 + seeded(i + 600) * 2}
          fill="var(--crystal-1)"
          opacity={0.6}
        />
      ))}
    </g>
  );
}

export function CitadelArt() {
  return (
    <g>
      <rect x={0} y={0} width={ZONE_WIDTH} height={MAP_HEIGHT} fill="var(--citadel-sky)" />
      {Array.from({ length: 12 }, (_, i) => (
        <g key={i} transform={`translate(${80 + i * 170} ${i % 2 ? 540 : 130})`} opacity={0.95}>
          <ellipse cx={0} cy={0} rx={70} ry={26} fill="var(--citadel-cloud)" />
          <ellipse cx={-34} cy={-12} rx={34} ry={22} fill="var(--citadel-cloud)" />
          <ellipse cx={30} cy={-16} rx={40} ry={26} fill="var(--citadel-cloud)" />
        </g>
      ))}
      {/* Castle near the end */}
      <g transform="translate(1880 210)">
        <rect x={-60} y={0} width={120} height={140} rx={8} fill="var(--citadel-stone)" />
        <rect x={-95} y={30} width={40} height={110} rx={6} fill="var(--citadel-stone)" />
        <rect x={55} y={30} width={40} height={110} rx={6} fill="var(--citadel-stone)" />
        <path d="M-70 0 L 0 -70 L 70 0 Z" fill="var(--citadel-roof)" />
        <path d="M-100 30 L -75 -20 L -50 30 Z" fill="var(--citadel-roof)" />
        <path d="M50 30 L 75 -20 L 100 30 Z" fill="var(--citadel-roof)" />
        <rect x={-14} y={90} width={28} height={50} rx={14} fill="var(--highlight-strong)" />
        <circle cx={0} cy={-80} r={8} fill="var(--gold)" />
      </g>
      {Array.from({ length: 24 }, (_, i) => (
        <path
          key={`st${i}`}
          transform={`translate(${seeded(i + 700) * 1750} ${170 + seeded(i + 800) * 300}) scale(0.5)`}
          d="M0 -10 L 3 -3 L 10 0 L 3 3 L 0 10 L -3 3 L -10 0 L -3 -3 Z"
          fill="var(--gold)"
        />
      ))}
    </g>
  );
}
