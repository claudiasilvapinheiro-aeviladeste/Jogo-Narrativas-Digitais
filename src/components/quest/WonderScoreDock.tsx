import { Eye, PartyPopper, Star } from "lucide-react";

import { useAnimatedNumber } from "@/hooks/use-quest";
import { TOTAL_MISSIONS, progressPercent, scoreFor, type QuestState } from "@/lib/quest";
import { TactileButton } from "./TactileButton";
import { WonderCard } from "./WonderCard";

interface Props {
  quest: QuestState;
  onComplete: () => void;
  onOpenActive: () => void;
}

export function ScoreSummaryCard({ score }: { score: number }) {
  const shown = useAnimatedNumber(score);
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-secondary">
        <Star aria-hidden className="size-8 fill-gold text-secondary-edge" />
      </span>
      <div>
        <p className="font-display text-3xl font-bold leading-none tabular-nums" aria-live="polite">
          {shown}
        </p>
        <p className="text-[13px] font-semibold text-muted-foreground">Pontos de Maravilha</p>
      </div>
    </div>
  );
}

export function WonderScoreDock({ quest, onComplete, onOpenActive }: Props) {
  const pct = progressPercent(quest);
  const done = quest.completed >= TOTAL_MISSIONS;
  const active = done ? null : quest.checkpoints[quest.completed];

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3 sm:px-6 sm:pb-5">
      <WonderCard className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:gap-6">
        <ScoreSummaryCard score={scoreFor(quest.completed)} />

        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-baseline justify-between gap-3">
            <p className="truncate font-display text-lg font-bold">
              {done ? "Aventura completa! 🏆" : `Semana ${active!.week}: ${active!.title.trim() || "missão por escrever"}`}
            </p>
            <p className="shrink-0 text-[13px] font-semibold text-muted-foreground">
              {quest.completed} de {TOTAL_MISSIONS} missões · {pct}%
            </p>
          </div>
          <div
            role="progressbar"
            aria-label="Progresso da aventura"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-5 overflow-hidden rounded-full border-2 border-amber bg-muted"
          >
            <div
              className="h-full rounded-full transition-[width] duration-[650ms] ease-[var(--ease-bounce)] [background-image:linear-gradient(90deg,var(--accent-soft),var(--highlight),var(--primary-soft))]"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          {!done && (
            <TactileButton variant="parchment" size="lg" onClick={onOpenActive} aria-label="Ver a missão desta semana">
              <Eye aria-hidden className="size-5" />
              <span className="hidden lg:inline">Ver missão</span>
            </TactileButton>
          )}
          <TactileButton variant="primary" size="lg" onClick={onComplete} disabled={done}>
            <PartyPopper aria-hidden className="size-5" />
            Marcar Missão como Concluída
          </TactileButton>
        </div>
      </WonderCard>
    </div>
  );
}
