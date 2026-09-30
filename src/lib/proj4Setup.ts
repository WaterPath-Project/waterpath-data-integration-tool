// Required by georaster-layer-for-leaflet to reproject GeoTIFFs that are not in WGS84.
// Ported from `shared/proj4Setup.js` in waterpath-reporting-suite.
import proj4 from "proj4";

declare global {
  interface Window {
    proj4?: typeof proj4;
  }
}

window.proj4 = proj4;

export {};
