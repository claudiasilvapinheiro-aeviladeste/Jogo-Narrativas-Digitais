import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Check, Lock, Sparkles, Star } from "lucide-react";

import mascot from "@/assets/mascot-owl.png";
import { cn } from "@/lib/utils";
import {
  MAP_HEIGHT,
  MAP_WIDTH,
  STATUS_LABEL,
  ZONES,
  ZONE_WIDTH,
  isZoneUnlocked,
  nodePosition,
  statusOf,
  trailPath,
  type QuestState,
} from "@/lib/quest";
import { CavernsArt, CitadelArt, ForestArt } from "./BiomeArt";

export interface RealmMapHandle {
  scrollToIndex: (index: number, smooth?: boolean) => void;
  burstAt: (index: number) => void;
}

interface Props {
  quest: QuestState;
  dissolvingZones: string[];
  onSelect: (index: number) => void;
}

type Burst = { id: number; x: number; y: number };

export const RealmMap = forwardRef<RealmMapHandle, Props>(function RealmMap(
  { quest, dissolvingZones, onSelect },
  ref,
) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [lengths, setLengths] = useState<number[] | null>(null);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [scale, setScale] = useState(1);

  // Scale the storybook map to fill the available height (Smartboards, laptops).
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const measure = () => setScale(Math.max(0.6, Math.min(1.6, el.clientHeight / MAP_HEIGHT)));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const scaleRef = useRef(scale);
  scaleRef.current = scale;

  const points = useMemo(() => quest.checkpoints.map((_, i) => nodePosition(i)), [quest.checkpoints]);
  const d = useMemo(() => trailPath(points), [points]);

  // Find how far along the trail each node sits, so the mascot can travel the path.
  useLayoutEffect(() => {
    const path = pathRef.current;
    if (!path || typeof path.getTotalLength !== "function") return;
    const total = path.getTotalLength();
    const result: number[] = [];
    let from = 0;
    for (const p of points) {
      let best = from;
      let bestDist = Infinity;
      for (let l = from; l <= Math.min(total, from + 900); l += 3) {
        const pt = path.getPointAtLength(l);
        const dist = (pt.x - p.x) ** 2 + (pt.y - p.y) ** 2;
        if (dist < bestDist) {
          bestDist = dist;
          best = l;
        }
      }
      result.push(best);
      from = best;
    }
    setLengths(result);
  }, [points]);

  useImperativeHandle(ref, () => ({
    scrollToIndex(index, smooth = true) {
      const el = scrollRef.current;
      if (!el) return;
      const { x } = nodePosition(Math.min(index, points.length - 1));
      el.scrollTo({ left: Math.max(0, x * scaleRef.current - el.clientWidth / 2), behavior: smooth ? "smooth" : "auto" });
    },
    burstAt(index) {
      const { x, y } = nodePosition(index);
      const id = Date.now() + Math.random();
      setBursts((b) => [...b, { id, x, y }]);
      window.setTimeout(() => setBursts((b) => b.filter((it) => it.id !== id)), 900);
    },
  }));

  const mascotIndex = Math.min(quest.completed, points.length - 1);
  const mascotLength = lengths?.[mascotIndex] ?? 0;
  const completedLength = lengths
    ? quest.completed >= points.length
      ? lengths[lengths.length - 1]!
      : lengths[quest.completed]!
    : 0;

  return (
    <div
      ref={scrollRef}
      className="relative h-full w-full overflow-x-auto overflow-y-hidden [scrollbar-color:var(--amber)_transparent]"
      tabIndex={-1}
    >
      <div className="relative" style={{ width: MAP_WIDTH * scale, height: MAP_HEIGHT * scale }}>
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{ width: MAP_WIDTH, height: MAP_HEIGHT, transform: `scale(${scale})` }}
      >
        <svg
          aria-hidden
          width={MAP_WIDTH}
          height={MAP_HEIGHT}
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          className="absolute inset-0"
        >
          <g>
            <ForestArt />
          </g>
          <g transform={`translate(${ZONE_WIDTH} 0)`}>
            <CavernsArt />
          </g>
          <g transform={`translate(${ZONE_WIDTH * 2} 0)`}>
            <CitadelArt />
          </g>
          {/* Trail: a soft, earthy footpath */}
          <defs>
            <filter id="trail-soft" x="-5%" y="-50%" width="110%" height="200%">
              <feGaussianBlur stdDeviation="5" />
            </filter>
          </defs>
          <path
            d={d}
            fill="none"
            stroke="var(--trail-edge)"
            strokeOpacity={0.45}
            strokeWidth={44}
            strokeLinecap="round"
            filter="url(#trail-soft)"
          />
          <path
            ref={pathRef}
            d={d}
            fill="none"
            stroke="var(--trail)"
            strokeOpacity={0.92}
            strokeWidth={28}
            strokeLinecap="round"
          />
          <path
            d={d}
            fill="none"
            stroke="var(--trail-edge)"
            strokeOpacity={0.3}
            strokeWidth={20}
            strokeDasharray="4 18 2 26"
            strokeLinecap="round"
          />
          <path
            d={d}
            fill="none"
            stroke="var(--highlight)"
            strokeWidth={7}
            strokeLinecap="round"
            strokeDasharray={lengths ? `${completedLength} 999999` : "0 999999"}
            style={{ transition: "stroke-dasharray 1.4s var(--ease-smooth)" }}
          />
        </svg>

        {/* Zone titles and secret lore */}
        {ZONES.map((zone, zi) => {
          const unlocked = isZoneUnlocked(quest, zone.id);
          const dark = zone.id === "caverns";
          return (
            <div
              key={zone.id}
              className="absolute top-4 z-20 max-w-sm"
              style={{ left: zi * ZONE_WIDTH + 32 }}
            >
              <div
                className={cn(
                  "rounded-2xl border-2 px-4 py-2 shadow-warm",
                  dark ? "border-highlight bg-card/95" : "border-amber bg-background/95",
                )}
              >
                <p className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Zona {zi + 1} · Semanas {zi * 10 + 1}–{zi * 10 + 10}
                </p>
                <h2 className="font-display text-2xl font-bold leading-tight">{zone.name}</h2>
                <p className="mt-1 flex items-start gap-1.5 text-[15px] leading-snug">
                  {unlocked ? (
                    <>
                      <Sparkles aria-hidden className="mt-0.5 size-4 shrink-0 text-highlight-strong" />
                      <span>{zone.lore}</span>
                    </>
                  ) : (
                    <>
                      <Lock aria-hidden className="mt-0.5 size-4 shrink-0" />
                      <span>Segredo por revelar… terminem a zona anterior.</span>
                    </>
                  )}
                </p>
              </div>
            </div>
          );
        })}

        {/* Mist over locked zones */}
        {ZONES.map((zone, zi) => {
          const locked = !isZoneUnlocked(quest, zone.id);
          const dissolving = dissolvingZones.includes(zone.id);
          if (!locked && !dissolving) return null;
          return (
            <div
              key={`mist-${zone.id}`}
              aria-hidden
              className={cn(
                "pointer-events-none absolute top-0 z-10 flex items-center justify-center",
                dissolving && "animate-mist-dissolve",
              )}
              style={{
                left: zi * ZONE_WIDTH,
                width: ZONE_WIDTH,
                height: MAP_HEIGHT,
                opacity: 0.85,
                background:
                  "radial-gradient(ellipse at 20% 40%, var(--mist) 0%, transparent 55%), radial-gradient(ellipse at 60% 70%, var(--mist) 0%, transparent 60%), radial-gradient(ellipse at 85% 30%, var(--mist) 0%, transparent 55%), color-mix(in oklab, var(--mist) 70%, transparent)",
                filter: "blur(2px)",
              }}
            />
          );
        })}

        {/* Mascot travelling along the trail */}
        <div
          aria-hidden
          className="mascot-travel pointer-events-none absolute left-0 top-0 z-40"
          style={{
            offsetPath: `path("${d}")`,
            offsetDistance: `${mascotLength}px`,
            offsetRotate: "0deg",
            width: 0,
            height: 0,
            opacity: lengths ? 1 : 0,
          }}
        >
          <img
            src={mascot}
            alt=""
            width={128}
            height={128}
            className="absolute -left-16 bottom-7 size-32 max-w-none drop-shadow-lg"
          />
        </div>

        {/* Mission stones */}
        <ol className="contents">
          {quest.checkpoints.map((cp, i) => {
            const status = statusOf(quest, i);
            const { x, y } = points[i]!;
            const zone = ZONES.find((z) => z.id === cp.zone)!;
            const label = `Semana ${cp.week}: ${cp.title.trim() || "missão por escrever"} — ${zone.shortName} — ${STATUS_LABEL[status]}`;
            const below = i % 2 === 0 || i === mascotIndex;
            return (
              <li
                key={cp.id}
                className="absolute z-30 flex flex-col items-center"
                style={{ left: x, top: y, transform: "translate(-50%, -32px)" }}
              >
                <button
                  type="button"
                  onClick={() => onSelect(i)}
                  aria-label={label}
                  className={cn(
                    "animate-bob relative flex size-16 items-center justify-center rounded-full border-4 font-display text-xl font-bold shadow-float transition-transform duration-[320ms] ease-[var(--ease-spring)] hover:scale-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring cursor-pointer",
                    status === "locked" && "border-node-locked bg-muted text-muted-foreground",
                    status === "active" && "animate-active-pulse border-accent-edge bg-accent text-accent-foreground",
                    status === "completed" && "border-highlight-strong bg-highlight text-highlight-foreground",
                  )}
                >
                  {status === "completed" ? (
                    <Check aria-hidden className="size-8" strokeWidth={3} />
                  ) : status === "locked" ? (
                    <span className="flex flex-col items-center leading-none">
                      <Lock aria-hidden className="size-4" />
                      <span className="text-base">{cp.week}</span>
                    </span>
                  ) : (
                    <span>{cp.week}</span>
                  )}
                </button>
                <div
                  className={cn(
                    "pointer-events-none absolute w-40 rounded-2xl border-2 bg-background/95 px-2.5 py-1.5 text-center shadow-warm",
                    below ? "top-[72px]" : "bottom-[72px]",
                    status === "locked" && "border-node-locked",
                    status === "active" && "border-accent",
                    status === "completed" && "border-highlight",
                  )}
                >
                  <p className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Semana {cp.week}
                    {status === "active" && " · Agora!"}
                    {status === "completed" && " · Feito"}
                  </p>
                  <p className="line-clamp-2 text-[14px] font-semibold leading-tight">
                    {cp.title.trim() || "Pedra por gravar"}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>

        {/* Star bursts */}
        {bursts.map((b) => (
          <div
            key={b.id}
            aria-hidden
            className="motion-particles pointer-events-none absolute z-50"
            style={{ left: b.x, top: b.y }}
          >
            {Array.from({ length: 12 }, (_, k) => {
              const angle = (k / 12) * Math.PI * 2;
              const dist = 70 + (k % 3) * 22;
              return (
                <Star
                  key={k}
                  className="animate-star-pop absolute -left-3 -top-3 size-6 fill-gold text-gold"
                  style={
                    {
                      "--tx": `${Math.cos(angle) * dist}px`,
                      "--ty": `${Math.sin(angle) * dist}px`,
                    } as CSSProperties
                  }
                />
              );
            })}
          </div>
        ))}
      </div>
      </div>
    </div>
  );
});

export function useDissolvingZones() {
  const [zones, setZones] = useState<string[]>([]);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);
  const dissolve = (zone: string) => {
    setZones((z) => [...z, zone]);
    timers.current.push(window.setTimeout(() => setZones((z) => z.filter((x) => x !== zone)), 1000));
  };
  return { zones, dissolve };
}
