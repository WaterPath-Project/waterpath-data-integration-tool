import React from "react";
import L from "leaflet";
import { GeoJSON as LeafletGeoJSON, useMap } from "react-leaflet";
import type { FeatureCollection } from "geojson";

const areaStyle = (): L.PathOptions => ({
  fill: false,
  fillOpacity: 0,
  color: "#1e293b",
  weight: 1.5,
  opacity: 0.75,
});

type AreaOverlayProps = {
  /** GeoJSON FeatureCollection of area polygons (WGS84). */
  geojson?: FeatureCollection | null;
  /** Fit map bounds to the areas (default true). */
  fit?: boolean;
  /** Path style; defaults to a thin outline without fill. */
  style?: L.PathOptions;
};

/**
 * Draws area outlines (no fill) and fits the map to them.
 * Ported from `shared/AreaOverlay.jsx` in waterpath-reporting-suite.
 */
export function AreaOverlay({ geojson, fit = true, style }: AreaOverlayProps) {
  const map = useMap();

  React.useEffect(() => {
    if (!fit || !geojson?.features?.length || !map) return;
    const bounds = L.geoJSON(geojson).getBounds();
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [20, 20] });
  }, [geojson, map, fit]);

  if (!geojson?.features?.length) return null;

  return <LeafletGeoJSON key={geojson.features.length} data={geojson} style={style ?? areaStyle} />;
}
