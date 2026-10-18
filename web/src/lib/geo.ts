import type { GeoPoint } from "@shared";

/** One try at the phone's position. Returns null if refused, off or too slow. */
function askOnce(highAccuracy: boolean, timeout: number): Promise<GeoPoint | null> {
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracyM: Math.round(pos.coords.accuracy),
        }),
      () => resolve(null),
      { enableHighAccuracy: highAccuracy, timeout, maximumAge: 60_000 },
    );
  });
}

/**
 * Asks the phone for its position. The browser shows "Allow location?" the first time.
 * Try 1: exact GPS (10 s). Try 2: rough Wi-Fi / mobile-tower position (15 s), because a new
 * phone indoors often has no GPS fix yet. Returns null if both fail: the SOS is sent anyway.
 * Note: GPS knows the street, not the floor, so floor / shop still come from the message.
 */
export async function getLocation(): Promise<GeoPoint | null> {
  if (!("geolocation" in navigator)) return null;
  const exact = await askOnce(true, 10_000);
  return exact ?? askOnce(false, 15_000);
}

/** Free link that opens the spot in Google Maps (no API key needed). */
export const mapsLink = (point: GeoPoint) => `https://www.google.com/maps?q=${point.lat},${point.lng}`;
