import type { Incident, IncidentStatus } from "@shared";
import { Card } from "@/components/ui/Card";
import { LocationLine } from "./LocationLine";
import { FieldGrid } from "./FieldGrid";
import { EditFields } from "./EditFields";
import { StatusBadge } from "./StatusBadge";
import { IncidentActions } from "./IncidentActions";
import { DispatchPanel } from "./DispatchPanel";
import { CloseFalseAlarm } from "./CloseFalseAlarm";
import { Timeline } from "./Timeline";

interface Props {
  incident: Incident;
  onSetStatus: (id: string, status: IncidentStatus) => Promise<void>;
  live: boolean; // false for sample data: it has no saved history and no agencies
}

export function IncidentDetail({ incident, onSetStatus, live }: Props) {
  return (
    <Card
      title={<>Incident <StatusBadge status={incident.status} /></>}
      actions={<IncidentActions incident={incident} onSetStatus={onSetStatus} />}
    >
      <div className="space-y-4">
        <p className="text-sm">{incident.summary}</p>
        {live && <DispatchPanel incident={incident} />}
        <CloseFalseAlarm incident={incident} onSetStatus={onSetStatus} />
        <FieldGrid values={incident} />
        {live && <EditFields key={incident.id} incident={incident} />}
        <LocationLine location={incident.location} />
        {live && (
          <div>
            <h3 className="mb-2 text-sm font-semibold">Timeline</h3>
            <Timeline incidentId={incident.id} />
          </div>
        )}
      </div>
    </Card>
  );
}
