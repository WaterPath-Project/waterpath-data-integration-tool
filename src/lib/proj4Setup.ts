// Required by georaster-layer-for-leaflet to reproject GeoTIFFs that are not in WGS84.
// Ported from `shared/proj4Setup.js` in waterpath-reporting-suite.
import proj4 from "proj4";

declare global {
  interface Window {
    proj4?: typeof proj4;
  }
}

/** Exposes proj4 on `window`, where georaster-layer-for-leaflet looks for it. Safe to call repeatedly and during SSR. */
export function ensureProj4(): void {
  if (typeof window !== "undefined" && !window.proj4) {
    window.proj4 = proj4;
  }
}
