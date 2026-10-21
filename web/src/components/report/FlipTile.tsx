import { Send, type LucideIcon } from "lucide-react";
import { cx } from "@/components/ui/tone";
import { useFlip } from "@/hooks/useFlip";
import { useTilt } from "@/hooks/useTilt";

interface Props {
  icon: LucideIcon;
  name: string;
  disabled?: boolean;
  onSend: () => void;
}

// Both faces fill the card; only the one facing you can be tapped. Flip styles: index.css (.flip …).
const FACE = "flip-face absolute inset-0 flex flex-col items-center justify-center gap-1 overflow-hidden rounded-2xl";
const FRONT = "border border-slate-200 bg-white shadow-[0_5px_0_#e2e8f0,0_16px_24px_-12px_rgba(15,23,42,0.35)]";
const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";
const BACK = "bg-linear-to-br from-rose-500 to-red-700 text-white shadow-[0_5px_0_#9f1239,0_16px_24px_-12px_rgba(15,23,42,0.45)]";

/**
 * SOS card. Tap it: it flips over (spring + light sweep) and shows "Send SOS".
 * Two taps on purpose, so a pocket or a child can't send an SOS by accident.
 */
export function FlipTile({ icon: Icon, name, disabled, onSend }: Props) {
  const { flipped, flip, send, cancel, frontButton, sendButton } = useFlip(onSend);
  const tilt = useTilt();

  return (
    <div className="flip h-36" onPointerMove={tilt.onPointerMove} onPointerLeave={tilt.onPointerLeave}>
      <div className="tilt h-full" style={tilt.style}>
        <div className={cx("flip-inner relative h-full", flipped && "flipped")}>
          <button
            ref={frontButton}
            type="button"
            disabled={disabled}
            onClick={flip}
            inert={flipped} // the face turned away can't be tabbed to or tapped
            className={cx(FACE, FRONT, FOCUS, "face-front disabled:opacity-50")}
          >
            <span className="sheen" />
            <span className="grid h-14 w-14 place-items-center rounded-full bg-red-50 text-danger">
              <Icon size={30} strokeWidth={2.2} aria-hidden />
            </span>
            <span className="text-lg font-extrabold text-ink">{name}</span>
            <span className="text-xs text-slate-500">Tap to send</span>
          </button>
          <div className={cx(FACE, BACK, "flip-back")} inert={!flipped}>
            <span className="sheen" />
            <button ref={sendButton} type="button" onClick={send} className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 font-extrabold text-danger shadow">
              <Send size={16} aria-hidden /> Send {name} SOS
            </button>
            <span className="text-[11px] opacity-90">with your location</span>
            <button type="button" onClick={cancel} className="text-xs underline">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
