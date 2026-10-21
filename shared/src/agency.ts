import type { GeoPoint } from "./incident";

export type AgencyKind = "fire" | "ambulance" | "police";
export type Role = "coordinator" | "agency" | "reporter";

export interface Agency {
  id: string;
  name: string;
  kind: AgencyKind;
  available: boolean;
  availabilityUpdatedAt: number;
  location?: GeoPoint; // the station; the agency globe draws its arcs from here
}

export type AssignmentStatus = "notified" | "acknowledged" | "accepted" | "declined" | "busy";

export interface Assignment {
  id: string; // `${incidentId}_${agencyId}`
  incidentId: string;
  agencyId: string;
  agencyKind: AgencyKind; // copied here so the agency inbox and reporter page need no extra lookup
  agencyName: string;
  location: GeoPoint | null; // reporter's GPS when the request was sent (for the agency globe)
  role: "lead" | "support" | null;
  status: AssignmentStatus;
  updatedAt: number;
}
