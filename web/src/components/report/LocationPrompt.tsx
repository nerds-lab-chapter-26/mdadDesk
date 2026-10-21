import { useState } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useLocationPermission } from "@/hooks/useLocationPermission";
import { getLocation } from "@/lib/geo";
import { isLocationSnoozed, snoozeLocation } from "@/lib/snooze";

/**
 * Asks for location as soon as the report page opens, BEFORE an emergency, so that later the SOS
 * goes with GPS at once (no permission pop-up in a panic, and the GPS is already warmed up).
 */
export function LocationPrompt() {
  const permission = useLocationPermission();
  const [hidden, setHidden] = useState(isLocationSnoozed);
  const [asking, setAsking] = useState(false);
  if (permission === "checking" || permission === "granted" || hidden) return null;

  const turnOn = async () => {
    setAsking(true);
    const point = await getLocation(); // shows the phone's "Allow location?" question
    setAsking(false);
    if (point) setHidden(true);
  };

  const notNow = () => {
    snoozeLocation(); // remembered for 7 days on this phone
    setHidden(true);
  };

  const blocked = permission === "denied";
  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-sky-200 bg-sky-50 p-4 sm:flex-row sm:items-center">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-sky-100 text-sky-700">
        <MapPin size={22} aria-hidden />
      </span>
      <div className="flex-1 text-sm text-sky-900">
        <p className="font-bold">Turn on location so rescuers can find you</p>
        <p>
          {blocked
            ? "Location is blocked. Tap the lock icon next to the web address (or phone Settings → Apps → Chrome → Location) and allow it."
            : "Do it now, before an emergency: your SOS will then include your exact spot automatically."}
        </p>
      </div>
      <div className="flex gap-2">
        {!blocked && <Button busy={asking} onClick={turnOn}>Turn on location</Button>}
        <Button variant="ghost" onClick={notNow}>Not now</Button>
      </div>
    </section>
  );
}
