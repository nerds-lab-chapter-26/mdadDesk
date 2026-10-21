import { useEffect, type ReactNode } from "react";
import { Siren } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Overlay } from "@/components/ui/Overlay";
import { startSiren } from "@/lib/siren";
import { showSystemNotification } from "@/lib/systemNotify";

interface Props {
  title: string; // e.g. "NEW SOS"
  body: string; // one line for the phone notification
  onClose: () => void;
  children: ReactNode; // the details and action buttons
}

/** Full-screen flashing red alert with a siren. Give it key={item.id} so each alert restarts. */
export function EmergencyAlert({ title, body, onClose, children }: Props) {
  // Runs once per alert (the key changes for each new one), even if the details update later.
  useEffect(() => {
    const stopSiren = startSiren();
    showSystemNotification(title, body);
    return stopSiren; // stops when the alert closes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Overlay tone="danger" label={title}>
      <h2 className="flex items-center justify-center gap-3 text-3xl font-black tracking-wide text-white">
        <Siren size={34} aria-hidden /> {title}
      </h2>
      {children}
      <div className="text-center">
        <Button variant="secondary" onClick={onClose}>
          Silence and close
        </Button>
      </div>
    </Overlay>
  );
}
