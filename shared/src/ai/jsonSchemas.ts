import { INCIDENT_TYPES, LOCATION_FIELDS } from "../extraction";

// The exact JSON shape Gemini must answer with (standard JSON Schema).
// ["string", "null"] means "a string, or null when the report doesn't say".

/** Plain JSON Schema object, as both Gemini SDKs accept it. */
export type JsonSchema = Record<string, unknown>;

const textOrNull = { type: ["string", "null"] };

export const extractionJsonSchema: JsonSchema = {
  type: "object",
  properties: {
    incidentType: { type: ["string", "null"], enum: [...INCIDENT_TYPES, null] },
    building: textOrNull,
    floor: textOrNull,
    landmark: textOrNull,
    peopleReported: { type: ["integer", "null"] },
    helpRequested: textOrNull,
    summary: { type: "string" },
    language: { type: "string" }, // ISO code like "ja", or "roman-ur" / "mixed"
    missingFields: { type: "array", items: { type: "string", enum: [...LOCATION_FIELDS] } },
  },
  required: ["incidentType", "building", "floor", "landmark", "peopleReported", "summary", "language", "missingFields"],
};

export const clarifyJsonSchema: JsonSchema = {
  type: "object",
  properties: { question: textOrNull },
  required: ["question"],
};
