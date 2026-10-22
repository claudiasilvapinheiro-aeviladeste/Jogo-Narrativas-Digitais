import { useEffect, useRef, useState, type DragEvent } from "react";
import { BookOpen, Calculator, FlaskConical, ImagePlus, Lock, Sparkles, Trash2, Wand2 } from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  COPY,
  PRESETS,
  STATUS_LABEL,
  ZONES,
  validateUpload,
  type Checkpoint,
  type CheckpointStatus,
  type PresetId,
} from "@/lib/quest";
import { QuizEditor } from "./QuizEditor";
import { TactileButton } from "./TactileButton";
import { BadgeTag } from "./WonderCard";

const PRESET_ICON: Record<PresetId, typeof Calculator> = {
  math: Calculator,
  reading: BookOpen,
  science: FlaskConical,
};

export type CheckpointDraft = Pick<Checkpoint, "title" | "description" | "preset" | "image" | "imageName" | "quiz">;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  checkpoint: Checkpoint | null;
  status: CheckpointStatus;
  onSave: (draft: CheckpointDraft) => void;
  onComplete: (draft: CheckpointDraft) => void;
}

export function CheckpointModal({ open, onOpenChange, checkpoint, status, onSave, onComplete }: Props) {
  const [draft, setDraft] = useState<CheckpointDraft>({
    title: "",
    description: "",
    preset: null,
    image: null,
    imageName: null,
    quiz: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (checkpoint && open) {
      setDraft({
        title: checkpoint.title,
        description: checkpoint.description,
        preset: checkpoint.preset,
        image: checkpoint.image,
        imageName: checkpoint.imageName,
        quiz: checkpoint.quiz.map((q) => ({ ...q, options: [...q.options] })),
      });
      setError(null);
      setUploadError(null);
    }
  }, [checkpoint, open]);

  if (!checkpoint) return null;
  const zone = ZONES.find((z) => z.id === checkpoint.zone)!;

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    const problem = validateUpload(file);
    if (problem) {
      setUploadError(problem === "too-large" ? COPY.uploadTooLarge : COPY.uploadNotImage);
      return;
    }
    setUploadError(null);
    const reader = new FileReader();
    reader.onload = () => setDraft((d) => ({ ...d, image: String(reader.result), imageName: file.name }));
    reader.onerror = () => setUploadError(COPY.network);
    reader.readAsDataURL(file);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const validate = () => {
    if (!draft.description.trim()) {
      setError(COPY.missingTask);
      return false;
    }
    setError(null);
    return true;
  };

  const tone = status === "completed" ? "completed" : status === "active" ? "active" : "locked";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="animate-modal-enter max-h-[92vh] max-w-2xl overflow-y-auto rounded-3xl border-2 border-card-border bg-card p-6 sm:rounded-3xl sm:p-8">
        <DialogHeader className="text-left">
          <div className="flex flex-wrap items-center gap-2">
            <BadgeTag tone={tone}>
              {status === "locked" && <Lock aria-hidden className="size-3.5" />}
              {STATUS_LABEL[status]}
            </BadgeTag>
            <BadgeTag tone="gold">Semana {checkpoint.week}</BadgeTag>
            <span className="text-[13px] font-semibold text-muted-foreground">{zone.shortName}</span>
          </div>
          <DialogTitle className="font-display text-3xl font-bold leading-tight">
            {draft.title.trim() || "Nova missão"}
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            {status === "locked"
              ? "Esta pedra ainda está bloqueada. Podem preparar a missão agora — abre quando terminarem as anteriores."
              : status === "active"
                ? "Esta é a missão desta semana. Quando a turma terminar, marquem-na como concluída."
                : "Missão concluída! Vejam o segredo que o trilho revelou."}
          </DialogDescription>
        </DialogHeader>

        {status === "completed" && (
          <div className="rounded-2xl border-2 border-highlight bg-background p-4" role="note">
            <p className="flex items-center gap-2 font-display text-lg font-bold text-highlight-strong">
              <Sparkles aria-hidden className="size-5" /> Segredo revelado
            </p>
            <p className="mt-1 text-lg">{checkpoint.lore}</p>
          </div>
        )}

        <fieldset className="space-y-2">
          <legend className="mb-2 font-display text-[15px] font-semibold">Modelos rápidos</legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {(Object.keys(PRESETS) as PresetId[]).map((id) => {
              const Icon = PRESET_ICON[id];
              const selected = draft.preset === id;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() =>
                    setDraft((d) => ({
                      ...d,
                      preset: id,
                      title: PRESETS[id].title,
                      description: PRESETS[id].description,
                    }))
                  }
                  className={cn(
                    "flex items-center gap-2 rounded-2xl border-2 px-3 py-2.5 text-left font-display text-[15px] font-semibold transition-colors duration-[180ms] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring cursor-pointer",
                    selected
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-amber bg-background hover:bg-card-border",
                  )}
                >
                  <Icon aria-hidden className="size-5 shrink-0" />
                  {PRESETS[id].label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="space-y-2">
          <Label htmlFor="cp-title" className="font-display text-[15px] font-semibold">
            Nome da missão
          </Label>
          <Input
            id="cp-title"
            value={draft.title}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
            placeholder="Ex.: A Ponte dos Números"
            className="h-12 rounded-2xl border-2 border-amber bg-background text-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cp-desc" className="font-display text-[15px] font-semibold">
            O que os alunos têm de fazer?
          </Label>
          <Textarea
            id="cp-desc"
            value={draft.description}
            onChange={(e) => {
              setDraft((d) => ({ ...d, description: e.target.value }));
              if (error && e.target.value.trim()) setError(null);
            }}
            placeholder="Ex.: Resolvam 5 contas de somar até 100."
            rows={3}
            aria-invalid={!!error}
            aria-describedby={error ? "cp-desc-error" : undefined}
            className="rounded-2xl border-2 border-amber bg-background text-lg"
          />
          {error && (
            <p id="cp-desc-error" role="alert" className="font-semibold text-destructive">
              {error}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <p className="font-display text-[15px] font-semibold">Ficha ou trabalho dos alunos (opcional)</p>
          {draft.image ? (
            <div className="flex items-center gap-4 rounded-2xl border-2 border-amber bg-background p-3">
              <img src={draft.image} alt={`Ficha: ${draft.imageName ?? "imagem"}`} className="h-24 w-32 rounded-xl object-cover" />
              <p className="min-w-0 flex-1 truncate font-semibold">{draft.imageName}</p>
              <TactileButton
                variant="parchment"
                size="sm"
                onClick={() => setDraft((d) => ({ ...d, image: null, imageName: null }))}
              >
                <Trash2 aria-hidden className="size-4" /> Remover
              </TactileButton>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={cn(
                "flex w-full flex-col items-center gap-1 rounded-2xl border-2 border-dashed px-4 py-6 text-center transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring cursor-pointer",
                dragging ? "border-accent bg-card-border" : "border-amber bg-background hover:bg-card-border",
              )}
            >
              <ImagePlus aria-hidden className="size-7 text-accent" />
              <span className="font-display font-semibold">Arrastem uma imagem ou cliquem para escolher</span>
              <span className="text-[13px] text-muted-foreground">JPG, PNG ou WebP · até 10MB</span>
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="sr-only"
            tabIndex={-1}
            aria-label="Escolher imagem da ficha"
            onChange={(e) => {
              handleFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
          {uploadError && (
            <p role="alert" className="font-semibold text-destructive">
              {uploadError}
            </p>
          )}
        </div>

        <QuizEditor quiz={draft.quiz} onChange={(quiz) => setDraft((d) => ({ ...d, quiz }))} />

        <div className="sticky bottom-0 -mx-6 flex flex-col-reverse gap-3 border-t-2 border-card-border bg-card px-6 pt-4 sm:-mx-8 sm:flex-row sm:justify-end sm:px-8">
          <TactileButton
            variant="parchment"
            size="lg"
            onClick={() => {
              if (validate()) onSave(draft);
            }}
          >
            <Wand2 aria-hidden className="size-5" /> Guardar missão
          </TactileButton>
          {status === "active" && (
            <TactileButton
              variant="primary"
              size="lg"
              onClick={() => {
                if (validate()) onComplete(draft);
              }}
            >
              Fazer o Quiz e Concluir
            </TactileButton>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
