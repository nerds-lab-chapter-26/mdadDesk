import { where } from "firebase/firestore";
import type { Agency, Assignment } from "@shared";
import { DEMO_BUILDING } from "@/lib/building";
import { useDoc } from "@/hooks/useDoc";
import { Notice } from "@/components/ui/Notice";
import { AssignmentCard } from "@/components/agency/AssignmentCard";
import { NewRequestAlert } from "@/components/alert/NewRequestAlert";
import { GlobePanel } from "./GlobePanel";
import { Pager } from "@/components/ui/Pager";
import { usePages } from "@/hooks/usePages";
import { useClaims } from "@/hooks/useClaims";
import { useCollection } from "@/hooks/useCollection";

/** Agency inbox: help requests sent to the signed-in agency, newest first. */
export function AgencyInbox() {
  const { agencyId } = useClaims(); // RoleGate already checked this is an agency
  const inbox = useCollection<Assignment>(
    agencyId ? "assignments" : null,
    agencyId ? [where("agencyId", "==", agencyId)] : [],
    agencyId ?? "",
  );

  const agency = useDoc<Agency>(agencyId ? `agencies/${agencyId}` : null);
  const station = agency.data?.location ?? DEMO_BUILDING; // no station saved yet: the demo building

  const newestFirst = [...inbox.data].sort((a, b) => b.updatedAt - a.updatedAt);
  const pages = usePages(newestFirst, 5);
  // Globe on one side (stays in view while scrolling), requests on the other. Phones: globe on top.
  return (
    <div className="grid items-start gap-5 lg:grid-cols-[400px_1fr]">
      <NewRequestAlert assignments={inbox.data} ready={agencyId !== null && !inbox.loading} />
      <div className="lg:sticky lg:top-24">
        <GlobePanel assignments={inbox.data} station={station} />
      </div>
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-ink">Requests</h2>
        {inbox.error && <Notice tone="danger">{inbox.error}</Notice>}
        {newestFirst.length === 0 && <Notice tone="info">No requests yet. A request appears here (with a siren) after the coordinator verifies an SOS and taps "Send" for your agency.</Notice>}
        {pages.visible.map((a) => (
          <AssignmentCard key={a.id} assignment={a} />
        ))}
        <Pager page={pages.page} pageCount={pages.pageCount} goTo={pages.goTo} />
      </div>
    </div>
  );
}
