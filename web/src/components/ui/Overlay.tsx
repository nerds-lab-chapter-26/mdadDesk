import type { ReactNode } from "react";
import { cx } from "./tone";

type OverlayTone = "danger" | "good" | "neutral";

const BACKDROP: Record<OverlayTone, string> = {
  danger: "motion-safe:animate-pulse bg-red-700/90", // emergency: flashing red (still for reduced motion)
  good: "bg-emerald-700/90", // good news for the reporter
  neutral: "bg-slate-900/60", // tour / information
};

interface Props {
  tone: OverlayTone;
  label: string; // what screen readers announce, e.g. "How it works"
  children: ReactNode;
}

/** A full-screen layer on top of everything (map included), with the content centred. */
export function Overlay({ tone, label, children }: Props) {
  return (
    <div role="dialog" aria-modal="true" aria-label={label} className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <div className={cx("absolute inset-0", BACKDROP[tone])} />
      <div className="relative w-full max-w-lg space-y-4">{children}</div>
    </div>
  );
}
