import { doc, writeBatch, type WriteBatch } from "firebase/firestore";
import type { Incident, IncidentEventKind, IncidentStatus } from "@shared";
import { requireDb } from "@/lib/firebase";
import { addEvent } from "./events";

export type EditableFields = Partial<Pick<Incident, "incidentType" | "building" | "floor" | "landmark" | "peopleReported">>;

/**
 * One write path for every incident change, so each change also lands on the timeline.
 * `alsoWrite` lets a caller save one more document in the same all-or-nothing batch.
 */
export async function changeIncident(
  id: string,
  patch: Record<string, unknown>,
  kind: IncidentEventKind,
  message: string,
  alsoWrite?: (batch: WriteBatch) => void,
) {
  const db = requireDb();
  const batch = writeBatch(db);
  batch.update(doc(db, "incidents", id), { ...patch, updatedAt: Date.now() });
  addEvent(batch, id, kind, message);
  if (alsoWrite) alsoWrite(batch);
  await batch.commit();
}

const STATUS_EVENT: Record<IncidentStatus, IncidentEventKind> = {
  reported: "update",
  verified: "verified",
  response: "update",
  resolved: "resolved",
};

export const setIncidentStatus = (id: string, status: IncidentStatus) =>
  changeIncident(id, { status }, STATUS_EVENT[status], `Status set to ${status}`);

export const editIncidentFields = (id: string, fields: EditableFields) =>
  changeIncident(id, fields, "fields_edited", `Edited: ${Object.keys(fields).join(", ")}`);
