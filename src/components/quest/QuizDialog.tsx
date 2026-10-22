import { useEffect, useMemo, useState } from "react";
import { Check, HelpCircle, Sparkles, X } from "lucide-react";

import mascot from "@/assets/mascot-owl.png";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { isCorrectAnswer, playableQuiz, type Checkpoint, type QuizQuestion } from "@/lib/quest";
import { TactileButton } from "./TactileButton";

interface Props {
  open: boolean;
  checkpoint: Checkpoint | null;
  onOpenChange: (open: boolean) => void;
  onPassed: () => void;
}

const LETTERS = ["A", "B", "C", "D", "E"];

/** Shuffle the options so the right answer isn't always in the same place. */
function shuffleQuestion(q: QuizQuestion): QuizQuestion {
  const order = q.options.map((_, i) => i).sort(() => Math.random() - 0.5);
  return {
    question: q.question,
    options: order.map((i) => q.options[i]!),
    answer: order.indexOf(q.answer),
  };
}

export function QuizDialog({ open, checkpoint, onOpenChange, onPassed }: Props) {
  const [round, setRound] = useState(0);
  const questions = useMemo(
    () => (checkpoint ? playableQuiz(checkpoint).map(shuffleQuestion) : []),
    // new shuffle every time the quiz opens
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [checkpoint, round],
  );
  const [step, setStep] = useState(0);
  const [wrong, setWrong] = useState<number[]>([]);
  const [solved, setSolved] = useState(false);
  const [firstTry, setFirstTry] = useState(0);

  useEffect(() => {
    if (open) {
      setRound((r) => r + 1);
      setStep(0);
      setWrong([]);
      setSolved(false);
      setFirstTry(0);
    }
  }, [open]);

  if (!checkpoint) return null;
  const finished = step >= questions.length && questions.length > 0;
  const q = questions[step];

  const choose = (i: number) => {
    if (!q || solved) return;
    if (isCorrectAnswer(q, i)) {
      setSolved(true);
      if (wrong.length === 0) setFirstTry((n) => n + 1);
    } else if (!wrong.includes(i)) {
      setWrong((w) => [...w, i]);
    }
  };

  const next = () => {
    setStep((s) => s + 1);
    setWrong([]);
    setSolved(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="animate-modal-enter max-h-[94vh] max-w-3xl overflow-y-auto rounded-3xl border-2 border-card-border bg-card p-6 sm:rounded-3xl sm:p-10">
        {!finished && q ? (
          <>
            <div className="flex items-center gap-3">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                <HelpCircle aria-hidden className="size-7" />
              </span>
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Quiz · Semana {checkpoint.week} · Pergunta {step + 1} de {questions.length}
                </p>
                <p className="font-display text-lg font-semibold">{checkpoint.title}</p>
              </div>
            </div>
            <div className="flex gap-1.5" aria-hidden>
              {questions.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-2.5 flex-1 rounded-full",
                    i < step ? "bg-highlight-strong" : i === step ? "bg-accent" : "bg-muted",
                  )}
                />
              ))}
            </div>
            <DialogTitle className="font-display text-3xl font-bold leading-snug sm:text-4xl">
              {q.question}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Escolham a resposta certa para continuar a missão.
            </DialogDescription>

            <div className="grid gap-3">
              {q.options.map((opt, i) => {
                const isWrong = wrong.includes(i);
                const isRight = solved && i === q.answer;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => choose(i)}
                    disabled={isWrong || (solved && !isRight)}
                    aria-label={`${LETTERS[i]}: ${opt}${isWrong ? " — errada" : ""}${isRight ? " — certa" : ""}`}
                    className={cn(
                      "flex min-h-16 items-center gap-4 rounded-2xl border-4 px-5 py-3 text-left font-display text-2xl font-semibold transition-[transform,background-color] duration-[180ms] ease-[var(--ease-bounce)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring cursor-pointer",
                      !isWrong && !isRight && "border-amber bg-background hover:-translate-y-0.5 hover:bg-card-border",
                      isWrong && "cursor-not-allowed border-node-locked bg-muted text-muted-foreground line-through",
                      isRight && "border-highlight-strong bg-highlight text-highlight-foreground",
                      solved && !isRight && "opacity-50",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-11 shrink-0 items-center justify-center rounded-full border-2 text-xl no-underline",
                        isRight ? "border-highlight-strong bg-card" : "border-amber bg-card",
                      )}
                    >
                      {isRight ? <Check aria-hidden className="size-6" strokeWidth={3} /> : isWrong ? <X aria-hidden className="size-6" /> : LETTERS[i]}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            <div aria-live="polite" className="min-h-14">
              {solved ? (
                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="flex items-center gap-2 font-display text-2xl font-bold text-highlight-strong">
                    <Sparkles aria-hidden className="size-6" /> Certo! Muito bem!
                  </p>
                  <TactileButton variant="accent" size="lg" onClick={next} autoFocus>
                    {step + 1 < questions.length ? "Próxima pergunta" : "Ver resultado"}
                  </TactileButton>
                </div>
              ) : wrong.length > 0 ? (
                <p className="font-display text-xl font-semibold">Quase! Pensem outra vez e tentem de novo. 🦉</p>
              ) : null}
            </div>
          </>
        ) : (
          <div className="text-center">
            <img src={mascot} alt="" width={140} height={140} className="mx-auto size-36" />
            <DialogTitle className="mt-2 font-display text-4xl font-bold">Quiz completo! 🎉</DialogTitle>
            <DialogDescription className="mt-2 text-xl text-foreground">
              Acertaram {firstTry} de {questions.length} à primeira. A missão está pronta para ser concluída!
            </DialogDescription>
            <TactileButton variant="primary" size="xl" className="mt-6" onClick={onPassed} autoFocus>
              Concluir Missão ✨
            </TactileButton>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
