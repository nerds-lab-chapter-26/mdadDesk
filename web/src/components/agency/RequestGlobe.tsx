import { useEffect, useRef } from "react";
import createGlobe from "cobe";
import type { GeoPoint } from "@shared";
import { facePhi, globeOptions } from "@/lib/globe";

interface Props {
  points: GeoPoint[];
  station: GeoPoint; // the agency's own location: the teal dot where every arc starts
  size?: number;
}

/**
 * Grey dotted globe (cobe, WebGL), like GitHub's globe: a red dot for every open request and a red
 * arc from the agency's station to it ("help travelling there"). It sways gently around that area.
 */
export function RequestGlobe({ points, station, size = 360 }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  // redraw only when the dots change
  const pointsKey = [station, ...points].map((p) => `${p.lat},${p.lng}`).join("|");

  useEffect(() => {
    if (!canvas.current) return;
    const centre = points[0] ?? station;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const globe = createGlobe(canvas.current, globeOptions(points, station, centre, size));

    // Sway left and right around the requests.
    let frame = 0;
    const started = performance.now();
    const sway = (now: number) => {
      if (!still) globe.update({ phi: facePhi(centre.lng) + Math.sin((now - started) / 3000) * 0.45 });
      frame = requestAnimationFrame(sway);
    };
    frame = requestAnimationFrame(sway);

    return () => {
      cancelAnimationFrame(frame);
      globe.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pointsKey, size]);

  return <canvas ref={canvas} aria-hidden className="aspect-square max-w-full" style={{ width: size }} />;
}
