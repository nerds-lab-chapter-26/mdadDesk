import { useEffect } from "react";
import type { LucideIcon } from "lucide-react";
import type { Incident } from "@shared";
import { Button } from "@/components/ui/Button";
import { Overlay } from "@/components/ui/Overlay";
import { useStepChange } from "@/hooks/useStepChange";
import { playChime } from "@/lib/chime";
import { helpStep, splashIcons, stepText } from "@/lib/helpSteps";
import { showSystemNotification } from "@/lib/systemNotify";

/** Reporter: big green "good news" screen each time their SOS moves forward. */
export function HelpSplash({ incident }: { incident: Incident }) {
  const { changedTo, clear } = useStepChange(helpStep(incident));
  if (changedTo === null) return null;

  return (
    <GoodNews
      key={changedTo}
      icons={splashIcons(incident, changedTo)}
      text={stepText(incident, changedTo)}
      tip={changedTo === 4 ? "Glad you are safe." : "Stay calm and stay where it is safe. Keep this page open."}
      onClose={clear}
    />
  );
}

interface GoodNewsProps {
  icons: LucideIcon[];
  text: string;
  tip: string;
  onClose: () => void;
}

function GoodNews({ icons, text, tip, onClose }: GoodNewsProps) {
  // Once per splash: a soft chime, plus a phone notification if the page is in the background.
  useEffect(() => {
    playChime();
    showSystemNotification(text, tip);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Overlay tone="good" label="Help is coming">
      <div className="space-y-4 text-center text-white">
        <div className="flex justify-center gap-3 motion-safe:animate-bounce">
          {icons.map((Icon, i) => (
            <span key={i} className="grid h-20 w-20 place-items-center rounded-full bg-white/15 ring-2 ring-white/40">
              <Icon size={42} aria-hidden />
            </span>
          ))}
        </div>
        <h2 className="text-3xl font-black">{text}</h2>
        <p className="text-lg">{tip}</p>
        <Button variant="secondary" onClick={onClose}>OK</Button>
      </div>
    </Overlay>
  );
}
