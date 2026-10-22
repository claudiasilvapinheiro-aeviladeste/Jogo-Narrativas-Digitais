import { Plus, Trash2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { MAX_QUIZ_QUESTIONS, type QuizQuestion } from "@/lib/quest";
import { TactileButton } from "./TactileButton";

interface Props {
  quiz: QuizQuestion[];
  onChange: (quiz: QuizQuestion[]) => void;
}

const LETTERS = ["A", "B", "C"];

export function QuizEditor({ quiz, onChange }: Props) {
  const update = (i: number, patch: Partial<QuizQuestion>) =>
    onChange(quiz.map((q, k) => (k === i ? { ...q, ...patch } : q)));

  return (
    <fieldset className="space-y-3">
      <legend className="font-display text-[15px] font-semibold">Quiz da missão</legend>
      <p className="text-[14px] text-muted-foreground">
        Os alunos respondem a estas perguntas antes de a missão ficar concluída. Marquem a resposta certa.
      </p>

      {quiz.length === 0 && (
        <p className="rounded-2xl border-2 border-dashed border-amber bg-background px-4 py-3 text-center font-semibold">
          Ainda não há perguntas. Adicionem pelo menos uma.
        </p>
      )}

      {quiz.map((q, i) => (
        <div key={i} className="space-y-2 rounded-2xl border-2 border-amber bg-background p-3">
          <div className="flex items-center gap-2">
            <span className="font-display text-[15px] font-bold">Pergunta {i + 1}</span>
            <TactileButton
              variant="parchment"
              size="sm"
              className="ml-auto h-9 px-3"
              onClick={() => onChange(quiz.filter((_, k) => k !== i))}
              aria-label={`Apagar pergunta ${i + 1}`}
            >
              <Trash2 aria-hidden className="size-4" />
            </TactileButton>
          </div>
          <Input
            value={q.question}
            onChange={(e) => update(i, { question: e.target.value })}
            placeholder="Escrevam a pergunta…"
            aria-label={`Texto da pergunta ${i + 1}`}
            className="h-11 rounded-xl border-2 border-amber bg-card text-base"
          />
          <div className="grid gap-2">
            {LETTERS.map((letter, o) => (
              <div key={o} className="flex items-center gap-2">
                <label className="flex shrink-0 cursor-pointer items-center gap-1.5 text-[13px] font-semibold">
                  <input
                    type="radio"
                    name={`quiz-${i}-answer`}
                    checked={q.answer === o}
                    onChange={() => update(i, { answer: o })}
                    className="size-5 accent-[var(--highlight-strong)]"
                    aria-label={`Opção ${letter} é a resposta certa`}
                  />
                  {letter}
                </label>
                <Input
                  value={q.options[o] ?? ""}
                  onChange={(e) => {
                    const options = [...q.options];
                    while (options.length < 3) options.push("");
                    options[o] = e.target.value;
                    update(i, { options });
                  }}
                  placeholder={`Opção ${letter}`}
                  aria-label={`Pergunta ${i + 1}, opção ${letter}`}
                  className="h-10 rounded-xl border-2 border-card-border bg-card text-base"
                />
                {q.answer === o && (
                  <span className="shrink-0 text-[13px] font-semibold text-highlight-strong">✓ certa</span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {quiz.length < MAX_QUIZ_QUESTIONS && (
        <TactileButton
          variant="parchment"
          size="sm"
          onClick={() => onChange([...quiz, { question: "", options: ["", "", ""], answer: 0 }])}
        >
          <Plus aria-hidden className="size-4" /> Adicionar pergunta
        </TactileButton>
      )}
    </fieldset>
  );
}
