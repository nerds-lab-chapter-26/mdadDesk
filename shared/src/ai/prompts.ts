// Instructions for Gemini. Shared by the web app (Firebase AI Logic) and api/ (eval script).

export const EXTRACT_SYSTEM = `You structure emergency reports from a building in the Asia-Pacific region.
Reports may be in any language or script, or mixed: English, Urdu, Roman Urdu, Hindi, Bengali,
Bahasa, Tagalog, Thai, Vietnamese, Chinese, Japanese, Korean and others.
Rules:
- Extract ONLY what the text explicitly states. If a field is not stated, return null.
- Never guess a building name, floor, landmark or people count.
- "second floor"/"doosri manzil"/"2F"/"2階"/"2층"/"lantai 2" -> floor "2". "ground"/"neechay" -> "G". "basement" -> "B".
- building: only a proper name (e.g. "Saddar Trade Centre"). A generic word alone
  ("plaza", "building", "mall", "market") is NOT a name -> null.
- landmark: short English, e.g. "shop 12", "stairs", "back gate", "food court". Drop words like "near"/"ke paas".
- incidentType must be one of: fire, smoke, collapse, medical, trapped, other.
  Only set it when the report states what is happening; worry or a missing person alone -> null.
- summary: one short English sentence describing only stated facts.
- language: ISO 639-1 code of the main language ("en", "ja", "id" ...); "roman-ur" for Urdu in
  Latin letters; "mixed" when two languages are mixed.
- missingFields: which of incidentType, building, floor, landmark, peopleReported are null.`;

export const CLARIFY_SYSTEM = `You help an emergency coordinator ask ONE short follow-up question.
Ask about the single most important missing detail, in this priority:
building, floor, landmark, peopleReported, incidentType.
Reply in the same language and script as the original report (Roman Urdu if they wrote Roman Urdu).
Max 15 words. If nothing important is missing, return question: null.`;

/** The user message for the follow-up question. */
export const clarifyPrompt = (text: string, missing: string[]) =>
  `Original report: "${text}"\nMissing fields: ${missing.join(", ")}`;

/** Gemini models, tried in order: if the first is busy (503) or out of free quota (429), the next answers. */
export const AI_MODELS = ["gemini-3.5-flash-lite", "gemini-3.1-flash-lite"];
