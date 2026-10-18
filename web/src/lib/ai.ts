import { getAI, getGenerativeModel, GoogleAIBackend, ThinkingLevel } from "firebase/ai";
import type { ExtractRequest, ExtractResponse } from "@shared";
import { EXTRACT_SYSTEM, extractionJsonSchema, toExtraction, tryModels, withTimeout, type JsonSchema } from "@shared/ai";
import { app } from "./firebase";

// Gemini through Firebase AI Logic ("Gemini Developer API", free Spark plan).
// No server and no secret key in the app: Firebase handles the key.

const TIMEOUT_MS = 15_000;

// One attempt with one model.
async function askModel(model: string, system: string, user: string, schema: JsonSchema) {
  if (!app) throw new Error("Firebase is not configured");
  const ai = getAI(app, { backend: new GoogleAIBackend() });
  const gemini = getGenerativeModel(ai, {
    model,
    systemInstruction: system,
    generationConfig: {
      responseMimeType: "application/json",
      responseJsonSchema: schema,
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }, // faster; enough for short reports
    },
  });
  const result = await withTimeout(gemini.generateContent(user), TIMEOUT_MS);
  return JSON.parse(result.response.text());
}

const generateJson = (system: string, user: string, schema: JsonSchema) =>
  tryModels((model) => askModel(model, system, user, schema));

// extractReport never throws: on any problem it returns { ok: false },
// and the app carries on without AI (the coordinator reads the message).

export async function extractReport({ text }: ExtractRequest): Promise<ExtractResponse> {
  if (!navigator.onLine) return { ok: false, error: "offline" };
  try {
    return { ok: true, extraction: toExtraction(await generateJson(EXTRACT_SYSTEM, text, extractionJsonSchema)) };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

