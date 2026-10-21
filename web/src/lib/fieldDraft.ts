import type { Incident, IncidentType, LocationField } from "@shared";
import type { EditableFields } from "@/services/incidents";

// The coordinator's edit form keeps every field as text while typing; this file converts both ways.

export type Draft = Record<LocationField, string>;

export const toDraft = (incident: Incident): Draft => ({
  incidentType: incident.incidentType ?? "",
  building: incident.building ?? "",
  floor: incident.floor ?? "",
  landmark: incident.landmark ?? "",
  peopleReported: incident.peopleReported === null ? "" : String(incident.peopleReported),
});

const textOrNull = (s: string) => s.trim() || null; // an emptied box means "Unknown" again

/** Only the fields the coordinator actually changed, so the timeline says exactly what was edited. */
export function changedFields(incident: Incident, draft: Draft): EditableFields {
  const changed: EditableFields = {};
  const type = (draft.incidentType || null) as IncidentType | null;
  if (type !== incident.incidentType) changed.incidentType = type;

  for (const f of ["building", "floor", "landmark"] as const) {
    if (textOrNull(draft[f]) !== incident[f]) changed[f] = textOrNull(draft[f]);
  }

  const people = draft.peopleReported.trim() === "" ? null : Number(draft.peopleReported);
  const validPeople = people === null || (Number.isInteger(people) && people >= 0);
  if (validPeople && people !== incident.peopleReported) changed.peopleReported = people;
  return changed;
}
