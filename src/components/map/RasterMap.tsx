import React from "react";
import { MapContainer } from "react-leaflet";
import type { FeatureCollection } from "geojson";
import "leaflet/dist/leaflet.css";
import { BasemapStyleId, OpenFreeMapLayer } from "./OpenFreeMapLayer";
import { AreaOverlay } from "./AreaOverlay";
import { RasterLayer } from "./RasterLayer";
import { RasterLegend } from "./RasterLegend";
import { RasterColorScale } from "./colorScales";

export type RasterMapProps = {
  /** GeoTIFF URL; `null` shows the basemap only. */
  tifUrl: string | null;
  colorScale: RasterColorScale;
  /** Optional area FeatureCollection drawn as outlines and used to clip the raster. */
  geojson?: FeatureCollection | null;
  /** Basemap style id (default "bright"). */
  styleId?: BasemapStyleId;
  /** Text under the map. */
  caption?: string;
  /** Map height in px (default 420). */
  height?: number;
  legendTitle?: string;
};

/**
 * Basemap + one raster layer + area outlines + legend. `PopulationMap` and
 * `AnimalHeadsMap` are thin wrappers that pick the colour scale.
 */
export function RasterMap({ tifUrl, colorScale, geojson, styleId = "bright", caption, height = 420, legendTitle }: RasterMapProps) {
  const [rasterMax, setRasterMax] = React.useState<number | null>(null);

  return (
    <div className="space-y-2">
      <MapContainer center={[0, 0]} zoom={2} style={{ height, width: "100%", borderRadius: 8 }}>
        <OpenFreeMapLayer styleId={styleId} />
        {tifUrl && <RasterLayer key={tifUrl} tifUrl={tifUrl} colorScale={colorScale} mask={geojson} onMaxLoaded={setRasterMax} />}
        <AreaOverlay geojson={geojson} />
      </MapContainer>
      {tifUrl && rasterMax !== null && <RasterLegend colorScale={colorScale} max={rasterMax} title={legendTitle} />}
      {caption && <p className="text-xs text-gray-400">{caption}</p>}
    </div>
  );
}
