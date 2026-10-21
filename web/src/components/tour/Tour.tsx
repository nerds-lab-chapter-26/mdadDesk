import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Overlay } from "@/components/ui/Overlay";
import { useTour } from "@/hooks/useTour";
import { TOURS, type TourId } from "@/lib/tours";

/** First-visit guide for a page. Afterwards a small "How it works" button replays it. */
export function Tour({ id }: { id: TourId }) {
  const { open, close, replay } = useTour(id);
  const [index, setIndex] = useState(0);
  const steps = TOURS[id];

  if (!open) {
    const restart = () => {
      setIndex(0);
      replay();
    };
    return (
      <button
        onClick={restart}
        aria-label="How it works"
        title="How it works"
        className="fixed bottom-4 right-4 z-[1500] grid h-12 w-12 place-items-center rounded-full bg-emerald-700 text-2xl font-extrabold text-white shadow-lg transition hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        ?
      </button>
    );
  }

  const step = steps[index];
  const isLast = index === steps.length - 1;
  return (
    <Overlay tone="neutral" label="How it works">
      <Card>
        <div className="space-y-3 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-soft text-brand">
            <step.icon size={32} aria-hidden />
          </span>
          <h2 className="text-lg font-semibold">{step.title}</h2>
          <p className="text-sm text-slate-600">{step.text}</p>
          <p className="text-xs text-slate-500">
            {index + 1} / {steps.length}
          </p>
          <div className="flex justify-center gap-2">
            <Button variant="ghost" onClick={close}>Skip</Button>
            <Button onClick={() => (isLast ? close() : setIndex(index + 1))}>{isLast ? "Got it" : "Next"}</Button>
          </div>
        </div>
      </Card>
    </Overlay>
  );
}
