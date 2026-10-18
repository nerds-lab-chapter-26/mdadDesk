export const INCIDENT_TYPES = ["fire", "smoke", "collapse", "medical", "trapped", "other"] as const;
export type IncidentType = (typeof INCIDENT_TYPES)[number];

export const LOCATION_FIELDS = ["incidentType", "building", "floor", "landmark", "peopleReported"] as const;
export type LocationField = (typeof LOCATION_FIELDS)[number];

/** Fields Gemini extracts from a report. `null` means "not stated" — never guessed. */
export interface Extraction {
  incidentType: IncidentType | null;
  building: string | null;
  floor: string | null;
  landmark: string | null;
  peopleReported: number | null;
  helpRequested: string | null;
  summary: string;
  language: string; // ISO code ("en", "ja", "id" ...), "roman-ur" or "mixed"
  question: string | null; // one follow-up for the reporter, in their own language
  missingFields: LocationField[];
}

export const emptyExtraction = (summary = ""): Extraction => ({
  incidentType: null,
  building: null,
  floor: null,
  landmark: null,
  peopleReported: null,
  helpRequested: null,
  summary,
  language: "mixed",
  question: null,
  missingFields: [...LOCATION_FIELDS],
});
