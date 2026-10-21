// Remembers "Not now" on the location banner for a week, on this phone only.
// localStorage can throw (private windows, blocked storage): then the banner simply shows again.

const KEY = "madaddesk.locationSnoozedUntil";
const WEEK = 7 * 24 * 60 * 60 * 1000;

export function isLocationSnoozed(): boolean {
  try {
    return Number(localStorage.getItem(KEY) ?? 0) > Date.now();
  } catch {
    return false;
  }
}

export function snoozeLocation() {
  try {
    localStorage.setItem(KEY, String(Date.now() + WEEK));
  } catch {
    // nothing to do: it is hidden for this visit anyway
  }
}
