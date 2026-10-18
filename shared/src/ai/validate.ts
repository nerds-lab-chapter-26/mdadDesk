import { z } from "zod";
import { INCIDENT_TYPES, LOCATION_FIELDS, type Extraction } from "../extraction";

// Never trust the AI's JSON blindly: check every field before the app uses it.

const extractionShape = z.object({
  incidentType: z.enum(INCIDENT_TYPES).nullable(),
  building: z.string().nullable(),
  floor: z.string().nullable(),
  landmark: z.string().nullable(),
  peopleReported: z.number().int().nonnegative().nullable(),
  helpRequested: z.string().nullable().default(null),
  summary: z.string(),
  language: z.string().min(2).max(12),
  question: z.string().nullable().default(null),
});

/** Checks Gemini's answer and works out missingFields ourselves (we don't trust the model's list). */
export function toExtraction(raw: unknown): Extraction {
  const e = extractionShape.parse(raw);
  const missingFields = LOCATION_FIELDS.filter((field) => e[field] === null);
  return { ...e, missingFields };
}

export function toQuestion(raw: unknown): string | null {
  return z.object({ question: z.string().nullable() }).parse(raw).question;
}
