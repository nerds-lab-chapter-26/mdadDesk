import { useState } from "react";
import type { IncidentType } from "@shared";
import { isFirebaseConfigured } from "@/lib/firebase";
import { askNotificationPermission } from "@/lib/systemNotify";
import { newReportId } from "@/services/reports";
import { deliver, readWithAi, shareLocation, type SubmitState } from "./submitSteps";

const INITIAL: SubmitState = {
  delivery: null,
  ai: null,
  extraction: null,
  question: null,
  location: null,
  reportId: null,
  message: null,
  point: null,
};

/**
 * Delivery first, AI second: the report is saved before Gemini runs,
 * so an AI failure or timeout never blocks the SOS from reaching the coordinator.
 */
export function useReportSubmit() {
  const [state, setState] = useState<SubmitState>(INITIAL);
  const patch = (changes: Partial<SubmitState>) => setState((s) => ({ ...s, ...changes }));

  const submit = async (text: string, type: IncidentType) => {
    askNotificationPermission(); // so "help is on the way" can pop up later, even in the background
    const id = newReportId();
    const live = isFirebaseConfigured;
    setState({
      ...INITIAL,
      delivery: live ? "pending" : null,
      ai: "pending",
      location: live ? "pending" : null,
      reportId: live ? id : null,
      message: text,
    });

    if (live) deliver(id, text, type, patch);
    await readWithAi(id, text, live, patch);
  };

  const retryLocation = () => state.reportId && shareLocation(state.reportId, patch);

  return { ...state, submit, retryLocation, reset: () => setState(INITIAL) };
}
