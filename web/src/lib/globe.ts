import type { COBEOptions } from "cobe";
import type { GeoPoint } from "@shared";

// Settings for the agency globe (components/agency/RequestGlobe.tsx, made with the cobe library).
// `station` = where the agency starts from (its own location, or the demo building). Teal dot; arcs start here.

// cobe turns the globe with two angles; these point it at a place on Earth.
export const facePhi = (lng: number) => Math.PI - ((lng * Math.PI) / 180 - Math.PI / 2);
const faceTheta = (lat: number) => (lat * Math.PI) / 180;
const where = (p: GeoPoint): [number, number] => [p.lat, p.lng];

/** Grey globe, a red dot per request, the teal station, and a red arc from the station to each request. */
export function globeOptions(points: GeoPoint[], station: GeoPoint, centre: GeoPoint, size: number): COBEOptions {
  const requestDots = points.map((p) => ({ location: where(p), size: 0.07 }));
  const stationDot = { location: where(station), size: 0.05, color: [0.06, 0.46, 0.43] as [number, number, number] };

  return {
    devicePixelRatio: 2,
    width: size * 2,
    height: size * 2,
    phi: facePhi(centre.lng),
    theta: faceTheta(centre.lat) * 0.6,
    dark: 1,
    diffuse: 1.2,
    mapSamples: 20000,
    mapBrightness: 5,
    baseColor: [0.32, 0.36, 0.43], // grey
    markerColor: [0.88, 0.11, 0.18], // theme red
    glowColor: [0.18, 0.22, 0.3],
    markers: [...requestDots, stationDot],
    arcs: points.map((p) => ({ from: where(station), to: where(p) })),
    arcColor: [0.95, 0.25, 0.3],
    arcWidth: 0.6,
    arcHeight: 0.3,
  };
}
