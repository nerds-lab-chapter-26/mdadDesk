import { Radio } from "lucide-react";
import type { Assignment, GeoPoint } from "@shared";
import { DEMO_BUILDING } from "@/lib/building";
import { RequestGlobe } from "./RequestGlobe";

const THREE_HOURS = 3 * 60 * 60 * 1000;

// Still "live": waiting for this agency, or accepted recently (a request stays "accepted" after the
// case is closed, so older accepted ones are left off the globe).
const isLive = (a: Assignment) =>
  a.status === "notified" || (a.status === "accepted" && Date.now() - a.updatedAt < THREE_HOURS);

/** Side panel of the agency inbox: live count + the globe with a dot and arc per live request. */
export function GlobePanel({ assignments, station }: { assignments: Assignment[]; station: GeoPoint }) {
  const points: GeoPoint[] = [];
  for (const a of assignments) {
    if (isLive(a)) points.push(a.location ?? DEMO_BUILDING); // no GPS: the demo building
  }
  const waiting = assignments.filter((a) => a.status === "notified").length;

  return (
    <section className="flex flex-col items-center gap-4 overflow-hidden rounded-3xl bg-linear-to-b from-ink via-slate-800 to-slate-900 p-6 text-white shadow-xl">
      <div className="w-full space-y-1">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-rose-300">
          <Radio size={14} aria-hidden /> Live requests
        </p>
        <p className="text-4xl font-extrabold">{points.length}</p>
        <p className="text-sm text-slate-300">
          {points.length === 0 ? "All quiet. New requests arrive with a siren." : `${waiting} waiting for you`}
        </p>
      </div>
      <RequestGlobe points={points} station={station} />
      <p className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-slate-400">
        <span><span className="text-danger">●</span> Request</span>
        <span><span className="text-brand">●</span> Your station</span>
        <span><span className="text-rose-400">⌒</span> Route</span>
      </p>
    </section>
  );
}
