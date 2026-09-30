import React, { useEffect, useMemo, useState } from "react";
import { MapContainer } from "react-leaflet";
import type { FeatureCollection } from "geojson";
import "leaflet/dist/leaflet.css";
import { BasemapStyleId, OpenFreeMapLayer } from "./OpenFreeMapLayer";
import { AreaOverlay } from "./AreaOverlay";
import { TreatmentLegend } from "./TreatmentLegend";
import { TreatmentRasterLayer } from "./TreatmentRasterLayer";
import { DEFAULT_CODE_COLORS, TreatmentLegendEntry, createTreatmentLegend } from "./treatmentCodes";

type TreatmentMapProps = {
  tifUrl: string;
  /** Precomputed legend; derived in the browser when omitted. */
  legend?: TreatmentLegendEntry[];
  styleId?: BasemapStyleId;
  height?: number | string;
  /** Falsy hides the caption. */
  caption?: React.ReactNode;
  /** Area outlines; also clips the raster to them. */
  geojson?: FeatureCollection | null;
  /** Shown instead of the map when the raster fails to load. */
  errorMessage?: string;
};

/**
 * QMRA drinking-water treatment map with a categorical legend.
 * Pass a precomputed legend or let the raster layer discover its present codes.
 *
 * Port of `07-risk-treatment/TreatmentMap.jsx` from waterpath-reporting-suite,
 * plus area outlines / clipping like the other previews.
 */
export function TreatmentMap({
  tifUrl,
  legend: legendProp,
  styleId = "bright",
  height = 400,
  caption = "Treatment raster wired into the drinking-water pathway. Log-reduction values are sampled per treatment step at run time.",
  geojson,
  errorMessage = "No treatment raster found.",
}: TreatmentMapProps) {
  const [discoveredCodes, setDiscoveredCodes] = useState<number[]>([]);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    setDiscoveredCodes([]);
    setError(null);
  }, [tifUrl]);

  const legend = legendProp ?? createTreatmentLegend(discoveredCodes);
  const codeColors = useMemo(
    () => (legendProp ? Object.fromEntries(legendProp.map((entry) => [entry.code, entry.color])) : DEFAULT_CODE_COLORS),
    [legendProp],
  );

  if (!tifUrl || error) {
    return <p className="text-sm text-gray-500">{errorMessage}</p>;
  }

  return (
    <div className="space-y-1">
      <MapContainer center={[0, 0]} zoom={2} style={{ height, width: "100%", borderRadius: 8 }}>
        <OpenFreeMapLayer styleId={styleId} />
        <TreatmentRasterLayer tifUrl={tifUrl} codeColors={codeColors} onCodes={setDiscoveredCodes} onError={setError} mask={geojson} />
        <AreaOverlay geojson={geojson} />
      </MapContainer>
      {caption && <p className="text-xs text-gray-400">{caption}</p>}
      <TreatmentLegend legend={legend} />
    </div>
  );
}
