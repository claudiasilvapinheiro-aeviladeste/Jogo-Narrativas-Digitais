import { Map, Sparkles, Star, Wand2 } from "lucide-react";

import mascot from "@/assets/mascot-owl.png";
import { ZONES } from "@/lib/quest";
import { TactileButton } from "./TactileButton";
import { WonderCard } from "./WonderCard";

interface Props {
  onLaunch: () => void;
  resumeWeek: number | null;
}

export function WelcomeScreen({ onLaunch, resumeWeek }: Props) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div aria-hidden className="motion-particles pointer-events-none absolute inset-0">
        {Array.from({ length: 16 }, (_, i) => (
          <Star
            key={i}
            className="absolute fill-gold text-gold opacity-40"
            style={{ left: `${(i * 23) % 100}%`, top: `${(i * 41) % 100}%`, width: 10 + (i % 3) * 8 }}
          />
        ))}
      </div>

      <WonderCard className="relative grid w-full max-w-5xl items-center gap-8 p-8 md:grid-cols-[1.2fr_1fr] md:p-12">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1 font-display text-[15px] font-semibold">
            <Sparkles aria-hidden className="size-4" /> Aventura das Maravilhas
          </p>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.15] md:text-5xl">
            Transformem as aulas de hoje numa história inesquecível
          </h1>
          <p className="mt-4 text-lg font-medium leading-relaxed text-muted-foreground">
            Projetem o mapa, atribuam as missões da turma e acompanhem os alunos desde a Floresta dos
            Sussurros até à Cidadela do Céu.
          </p>

          <ol className="mt-6 flex flex-wrap items-center gap-2 text-[15px] font-semibold">
            {ZONES.map((z, i) => (
              <li key={z.id} className="flex items-center gap-2">
                <span className="rounded-full border-2 border-amber bg-background px-3 py-1">{z.shortName}</span>
                {i < ZONES.length - 1 && <span aria-hidden>→</span>}
              </li>
            ))}
          </ol>

          <div className="mt-8 flex flex-col items-start gap-3">
            <TactileButton variant="primary" size="xl" onClick={onLaunch} autoFocus>
              <Map aria-hidden className="size-6" />
              {resumeWeek ? `Continuar Aventura (Semana ${resumeWeek})` : "Começar a Aventura da Turma (Sem Preparação)"}
            </TactileButton>
            <p className="flex items-center gap-2 text-[13px] font-semibold text-muted-foreground">
              <Wand2 aria-hidden className="size-4" />
              Sem conta, sem registo. 30 missões de exemplo prontas — uma por semana.
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <img
            src={mascot}
            alt="Lumi, a coruja exploradora, com um chapéu de feiticeira e uma lanterna"
            width={360}
            height={360}
            className="size-72 md:size-90"
          />
        </div>
      </WonderCard>
    </main>
  );
}
