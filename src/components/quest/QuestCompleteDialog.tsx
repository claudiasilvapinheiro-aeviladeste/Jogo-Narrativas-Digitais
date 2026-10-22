import { Crown, Star } from "lucide-react";

import mascot from "@/assets/mascot-owl.png";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { COPY, scoreFor, TOTAL_MISSIONS } from "@/lib/quest";
import { TactileButton } from "./TactileButton";

export function Stardust() {
  return (
    <div aria-hidden className="motion-particles pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {Array.from({ length: 42 }, (_, i) => {
        const left = (i * 37) % 100;
        const delay = (i % 10) * 0.18;
        const size = 14 + (i % 4) * 6;
        return (
          <Star
            key={i}
            className="animate-stardust absolute top-0 fill-gold text-gold"
            style={{ left: `${left}%`, width: size, height: size, animationDelay: `${delay}s`, opacity: 0 }}
          />
        );
      })}
    </div>
  );
}

interface Props {
  open: boolean;
  className: string;
  onOpenChange: (open: boolean) => void;
  onRestart: () => void;
}

export function QuestCompleteDialog({ open, className, onOpenChange, onRestart }: Props) {
  return (
    <>
      {open && <Stardust />}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="animate-modal-enter max-w-xl rounded-3xl border-2 border-card-border bg-card p-8 text-center sm:rounded-3xl">
          <img src={mascot} alt="" width={160} height={160} className="mx-auto -mt-2 size-40" />
          <Crown aria-hidden className="mx-auto size-10 text-secondary-edge" />
          <DialogTitle className="font-display text-3xl font-bold leading-tight">{COPY.questComplete}</DialogTitle>
          <DialogDescription className="text-lg text-foreground">
            A turma {className} terminou as {TOTAL_MISSIONS} missões e juntou{" "}
            <strong>{scoreFor(TOTAL_MISSIONS)} Pontos de Maravilha</strong>!
          </DialogDescription>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-center">
            <TactileButton variant="parchment" size="lg" onClick={() => onOpenChange(false)}>
              Ver o mapa
            </TactileButton>
            <TactileButton variant="primary" size="lg" onClick={onRestart}>
              Começar nova aventura
            </TactileButton>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
