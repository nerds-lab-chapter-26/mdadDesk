import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

// Same look for every input box in the app. Change it here to change it everywhere.
const BOX_STYLE =
  "w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm focus:outline-2 focus:outline-brand";

// A label shown above any input.
function Labelled({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      {children}
    </label>
  );
}

// One-line input, e.g. email or password.
export function TextInput({ label, ...inputProps }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <Labelled label={label}>
      <input {...inputProps} className={BOX_STYLE} />
    </Labelled>
  );
}

// Drop-down list, e.g. the incident type.
export function SelectInput({ label, ...selectProps }: SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return (
    <Labelled label={label}>
      <select {...selectProps} className={BOX_STYLE} />
    </Labelled>
  );
}

// Multi-line input, e.g. the SOS message.
export function TextArea({ label, ...areaProps }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <Labelled label={label}>
      <textarea {...areaProps} className={BOX_STYLE} />
    </Labelled>
  );
}
