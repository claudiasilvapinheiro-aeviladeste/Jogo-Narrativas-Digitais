import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { RotateCcw, ScrollText, Sparkles } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { CheckpointModal, type CheckpointDraft } from "@/components/quest/CheckpointModal";
import { QuestCompleteDialog } from "@/components/quest/QuestCompleteDialog";
import { RealmMap, useDissolvingZones, type RealmMapHandle } from "@/components/quest/RealmMap";
import { TactileButton } from "@/components/quest/TactileButton";
import { WelcomeScreen } from "@/components/quest/WelcomeScreen";
import { WonderScoreDock } from "@/components/quest/WonderScoreDock";
import { useQuest } from "@/hooks/use-quest";
import {
  COPY,
  ZONES,
  blankParchment,
  completeActive,
  isParchmentEmpty,
  restartJourney,
  statusOf,
  updateCheckpoint,
} from "@/lib/quest";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aventura das Maravilhas — mapa de missões para a sala de aula" },
      {
        name: "description",
        content:
          "Projetem um mapa mágico no quadro interativo, escrevam as missões da turma e acompanhem os alunos da Floresta dos Sussurros à Cidadela do Céu.",
      },
      { property: "og:title", content: "Aventura das Maravilhas — missões mágicas para a turma" },
      {
        property: "og:description",
        content: "Um mapa de aventura para o quadro interativo, com missões semanais, pontos e segredos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Confirm = "restart" | "blank" | null;

function Index() {
  const { quest, setQuest, hydrated, imagesNotSaved } = useQuest();
  const [launched, setLaunched] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [celebrate, setCelebrate] = useState(false);
  const [confirm, setConfirm] = useState<Confirm>(null);
  const mapRef = useRef<RealmMapHandle>(null);
  const { zones: dissolvingZones, dissolve } = useDissolvingZones();

  useEffect(() => {
    if (launched) {
      const id = window.setTimeout(() => mapRef.current?.scrollToIndex(quest.completed, false), 50);
      return () => window.clearTimeout(id);
    }
    return undefined;
    // only on launch
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [launched]);

  useEffect(() => {
    if (imagesNotSaved) {
      toast.warning("As imagens são grandes demais para ficar guardadas neste computador. O texto das missões está guardado.");
    }
  }, [imagesNotSaved]);

  const runComplete = useCallback(
    (base = quest) => {
      const result = completeActive(base);
      if (!result.ok) {
        if (result.reason === "missing-task") {
          toast.error(COPY.missingTask);
          setSelected(base.completed);
        }
        return;
      }
      setQuest(result.state);
      setSelected(null);
      mapRef.current?.burstAt(result.completedIndex);
      const completedIndex = result.completedIndex;

      if (result.zoneEntered) {
        dissolve(result.zoneEntered);
        const zone = ZONES.find((z) => z.id === result.zoneEntered)!;
        toast.success(COPY.zoneEntered(base.className || "da aventura", zone.name), { duration: 6000 });
      } else if (!result.questComplete) {
        toast.success(COPY.checkpointCleared, {
          description: `+${result.pointsEarned} Pontos de Maravilha`,
          action: { label: "Ver Segredo", onClick: () => setSelected(completedIndex) },
        });
      }
      if (result.questComplete) setCelebrate(true);
      window.setTimeout(() => mapRef.current?.scrollToIndex(result.state.completed), 250);
    },
    [quest, setQuest, dissolve],
  );

  if (!launched) {
    return (
      <WelcomeScreen
        onLaunch={() => setLaunched(true)}
        resumeWeek={hydrated && quest.completed > 0 ? Math.min(quest.completed + 1, quest.checkpoints.length) : null}
      />
    );
  }

  const selectedCp = selected !== null ? (quest.checkpoints[selected] ?? null) : null;

  const saveDraft = (draft: CheckpointDraft) => {
    if (selected === null) return quest;
    const next = updateCheckpoint(quest, quest.checkpoints[selected]!.id, draft);
    setQuest(next);
    return next;
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <header className="z-30 flex flex-wrap items-center gap-3 border-b-2 border-card-border bg-background px-4 py-3 sm:px-6">
        <p className="flex items-center gap-2 font-display text-xl font-bold">
          <Sparkles aria-hidden className="size-5 text-primary" /> Aventura das Maravilhas
        </p>
        <label className="ml-auto flex items-center gap-2 font-display text-[15px] font-semibold">
          Turma
          <Input
            value={quest.className}
            onChange={(e) => setQuest({ ...quest, className: e.target.value.slice(0, 30) })}
            className="h-10 w-28 rounded-2xl border-2 border-amber bg-card text-base"
            aria-label="Nome da turma"
          />
        </label>
        <TactileButton variant="parchment" size="sm" onClick={() => setConfirm("restart")}>
          <RotateCcw aria-hidden className="size-4" /> Recomeçar
        </TactileButton>
        <TactileButton variant="parchment" size="sm" onClick={() => setConfirm("blank")}>
          <ScrollText aria-hidden className="size-4" /> Pergaminho em branco
        </TactileButton>
      </header>

      {isParchmentEmpty(quest) && (
        <div role="status" className="z-30 bg-secondary px-4 py-2 text-center font-display text-lg font-semibold">
          {COPY.emptyParchment}
        </div>
      )}

      <main className="relative flex-1 pb-36 sm:pb-32">
        <h1 className="sr-only">Mapa da aventura da turma {quest.className}</h1>
        <RealmMap ref={mapRef} quest={quest} dissolvingZones={dissolvingZones} onSelect={setSelected} />
      </main>

      <WonderScoreDock
        quest={quest}
        onComplete={() => runComplete()}
        onOpenActive={() => setSelected(quest.completed)}
      />

      <CheckpointModal
        open={selected !== null}
        onOpenChange={(o) => !o && setSelected(null)}
        checkpoint={selectedCp}
        status={selected !== null ? statusOf(quest, selected) : "locked"}
        onSave={(draft) => {
          saveDraft(draft);
          setSelected(null);
          toast.success("Missão guardada no pergaminho! 📜");
        }}
        onComplete={(draft) => runComplete(saveDraft(draft))}
      />

      <QuestCompleteDialog
        open={celebrate}
        className={quest.className}
        onOpenChange={setCelebrate}
        onRestart={() => {
          setCelebrate(false);
          setQuest(restartJourney(quest));
          window.setTimeout(() => mapRef.current?.scrollToIndex(0), 100);
        }}
      />

      <AlertDialog open={confirm !== null} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent className="rounded-3xl border-2 border-card-border bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-2xl">
              {confirm === "blank" ? "Começar com o pergaminho em branco?" : "Recomeçar a aventura?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              {confirm === "blank"
                ? "Todas as missões ficam vazias e a turma volta à Semana 1. Depois podem escrever as vossas próprias missões."
                : "A turma volta à Semana 1 e os pontos recomeçam do zero. As missões escritas mantêm-se."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-2xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-2xl bg-primary text-primary-foreground hover:bg-primary-edge"
              onClick={() => {
                setQuest(confirm === "blank" ? blankParchment(quest) : restartJourney(quest));
                setConfirm(null);
                window.setTimeout(() => mapRef.current?.scrollToIndex(0), 100);
              }}
            >
              {confirm === "blank" ? "Limpar missões" : "Recomeçar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
