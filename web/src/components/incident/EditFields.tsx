import { useState, type ChangeEvent } from "react";
import { Pencil } from "lucide-react";
import { INCIDENT_TYPES, type Incident, type LocationField } from "@shared";
import { Button } from "@/components/ui/Button";
import { ActionButton } from "@/components/ui/ActionButton";
import { SelectInput, TextInput } from "@/components/ui/TextField";
import { FIELD_LABELS, TYPE_NAME } from "@/lib/labels";
import { changedFields, toDraft, type Draft } from "@/lib/fieldDraft";
import { editIncidentFields } from "@/services/incidents";

/**
 * Lets the coordinator fix what the AI got wrong (or could not read). Saving writes only the changed
 * fields, and the timeline shows "Edited: …". Clearing a box sets that field back to "Unknown".
 */
export function EditFields({ incident }: { incident: Incident }) {
  const [draft, setDraft] = useState<Draft | null>(null); // null = not editing
  if (!draft) {
    return (
      <Button variant="secondary" onClick={() => setDraft(toDraft(incident))}>
        <Pencil size={16} aria-hidden /> Edit details
      </Button>
    );
  }

  const set = (f: LocationField) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setDraft({ ...draft, [f]: e.target.value });

  const save = async () => {
    const fields = changedFields(incident, draft);
    if (Object.keys(fields).length > 0) await editIncidentFields(incident.id, fields);
    setDraft(null);
  };

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 p-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <SelectInput label={FIELD_LABELS.incidentType} value={draft.incidentType} onChange={set("incidentType")}>
          <option value="">Unknown</option>
          {INCIDENT_TYPES.map((t) => (
            <option key={t} value={t}>{TYPE_NAME[t]}</option>
          ))}
        </SelectInput>
        {(["building", "floor", "landmark"] as const).map((f) => (
          <TextInput key={f} label={FIELD_LABELS[f]} value={draft[f]} onChange={set(f)} placeholder="Unknown" />
        ))}
        <TextInput label={FIELD_LABELS.peopleReported} type="number" min={0} inputMode="numeric"
          value={draft.peopleReported} onChange={set("peopleReported")} placeholder="Unknown" />
      </div>
      <div className="flex gap-2">
        <ActionButton onClick={save}>Save</ActionButton>
        <Button variant="ghost" onClick={() => setDraft(null)}>Cancel</Button>
      </div>
    </div>
  );
}
