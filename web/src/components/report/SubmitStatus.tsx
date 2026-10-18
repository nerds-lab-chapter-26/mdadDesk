import type { AiStatus, DeliveryStatus } from "@shared";
import { MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Notice } from "@/components/ui/Notice";
import { WaveText } from "@/components/ui/WaveText";
import type { Tone } from "@/lib/labels";
import type { LocationStatus } from "@/hooks/submitSteps";

const DELIVERY: Record<DeliveryStatus, [Tone, string]> = {
  pending: ["warn", "SOS pending — not delivered yet. Keep this page open; it will send when online."],
  sent: ["success", "SOS delivered to the coordinator."],
  failed: ["danger", "SOS could not be saved. Call emergency services directly."],
};

const AI: Record<AiStatus, [Tone, string]> = {
  pending: ["info", "Reading your report…"],
  ok: ["neutral", "Details extracted. The coordinator will review them."],
  failed: ["neutral", "Automatic reading unavailable — the coordinator will read your message directly."],
};

const LOCATION: Record<LocationStatus, [Tone, string]> = {
  pending: ["info", "Finding your location…"],
  shared: ["success", "Location shared with the coordinator."],
  off: ["warn", "Location not shared. Turn on your phone's Location (swipe down from the top), then tap Try again. Or write your floor and shop in a new message."],
};

interface Props {
  delivery: DeliveryStatus | null;
  ai: AiStatus | null;
  location: LocationStatus | null;
  onRetryLocation: () => void;
}

export function SubmitStatus({ delivery, ai, location, onRetryLocation }: Props) {
  return (
    <div className="space-y-2">
      {delivery && <Notice tone={DELIVERY[delivery][0]}>{DELIVERY[delivery][1]}</Notice>}
      {location && (
        <Notice tone={LOCATION[location][0]} icon={MapPin}>
          {LOCATION[location][1]}
          {location === "off" && (
            <div className="mt-2">
              <Button variant="secondary" onClick={onRetryLocation}>Try again</Button>
            </div>
          )}
        </Notice>
      )}
      {ai === "pending" && (
        <Notice tone="info" icon={Sparkles}>
          <WaveText text="Reading your report…" />
        </Notice>
      )}
      {ai && ai !== "pending" && <Notice tone={AI[ai][0]}>{AI[ai][1]}</Notice>}
    </div>
  );
}
