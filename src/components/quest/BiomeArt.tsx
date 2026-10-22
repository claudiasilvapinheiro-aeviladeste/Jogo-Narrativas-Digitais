import { MAP_HEIGHT, ZONE_WIDTH } from "@/lib/quest";

// Decorative storybook scenery for each zone. Purely visual (aria-hidden by parent).

function seeded(n: number) {
  const x = Math.sin(n * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

export function ForestArt() {
  const trees = Array.from({ length: 26 }, (_, i) => ({
    x: 30 + i * 76 + seeded(i) * 30,
    y: i % 2 === 0 ? 110 + seeded(i + 3) * 40 : 520 + seeded(i + 7) * 40,
    s: 0.8 + seeded(i + 11) * 0.6,
  }));
  return (
    <g>
      <rect x={0} y={0} width={ZONE_WIDTH} height={MAP_HEIGHT} fill="var(--forest-sky)" />
      <path
        d={`M0 470 Q 300 400 600 460 T 1200 450 T 2000 440 V ${MAP_HEIGHT} H 0 Z`}
        fill="var(--forest-hill)"
        opacity={0.7}
      />
      <path
        d={`M0 150 Q 400 90 800 150 T 1600 140 T 2000 150 V 0 H 0 Z`}
        fill="var(--forest-hill)"
        opacity={0.45}
      />
      {trees.map((t, i) => (
        <g key={i} transform={`translate(${t.x} ${t.y}) scale(${t.s})`}>
          <rect x={-5} y={10} width={10} height={26} rx={3} fill="var(--forest-trunk)" />
          <path d="M0 -44 L 28 14 H -28 Z" fill="var(--forest-deep)" />
          <path d="M0 -62 L 22 -10 H -22 Z" fill="var(--forest-deep)" opacity={0.85} />
        </g>
      ))}
      {Array.from({ length: 10 }, (_, i) => (
        <g key={`m${i}`} transform={`translate(${120 + i * 190} ${560})`}>
          <rect x={-3} y={0} width={6} height={12} rx={2} fill="var(--card)" />
          <ellipse cx={0} cy={0} rx={12} ry={8} fill="var(--primary-soft)" />
          <circle cx={-4} cy={-2} r={2} fill="var(--card)" />
          <circle cx={4} cy={-3} r={1.6} fill="var(--card)" />
        </g>
      ))}
      {Array.from({ length: 18 }, (_, i) => (
        <circle
          key={`f${i}`}
          cx={seeded(i + 50) * ZONE_WIDTH}
          cy={180 + seeded(i + 80) * 300}
          r={3}
          fill="var(--gold)"
          opacity={0.7}
        />
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
