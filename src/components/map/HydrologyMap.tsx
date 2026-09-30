import React, { useState } from "react";
import { MapContainer } from "react-leaflet";
import type { FeatureCollection } from "geojson";
import "leaflet/dist/leaflet.css";
import { BasemapStyleId, OpenFreeMapLayer } from "./OpenFreeMapLayer";
import { AreaOverlay } from "./AreaOverlay";
import { FlowArrowLayer, FlowLegendData } from "./FlowArrowLayer";
import { HydroInputRasterLayer, RasterStats } from "./HydroInputRasterLayer";
import { HydroMapControls, HydroOverlay } from "./HydroMapControls";
import { runoffColorFromNorm, ssrdColorFromNorm, tempColorFromNorm } from "./hydroColorRamps";

type HydrologyMapProps = {
  /** Flow-vectors GeoJSON URL (omit to hide the Flow toggle). */
  flowVectorsUrl?: string | null;
  /** { river_temperature?, ssrd?, runoff? } -> GeoTIFF URL. */
  inputRasters?: { river_temperature?: string | null; ssrd?: string | null; runoff?: string | null };
  /** Area FeatureCollection (see shared/README.md); also clips the input rasters. */
  geojson?: FeatureCollection | null;
  styleId?: BasemapStyleId;
  defaultOverlay?: HydroOverlay | null;
  /** Map height in px (default 520). */
  height?: number;
  /**
   * Overlays whose toggle is shown even when their URL is not loaded yet, so a
   * host can fetch the active overlay lazily. Defaults to those with a URL.
   */
  availableOverlays?: readonly HydroOverlay[];
  /** Notified when the user switches overlay (for lazy hosts). */
  onActiveOverlayChange?: (overlay: HydroOverlay | null) => void;
  /** Shows a small loading badge over the map. */
  loading?: boolean;
};

/**
 * Hydrology map: basemap + area outlines + one switchable overlay
 * (flow arrows, river temperature, solar radiation or runoff).
 *
 * Port of `02-hydrology/HydrologyMap.jsx` from waterpath-reporting-suite, with
 * `availableOverlays` / `onActiveOverlayChange` / `loading` added so the host
 * can fetch one overlay at a time.
 */
export function HydrologyMap({
  flowVectorsUrl,
  inputRasters = {},
  geojson,
  styleId = "bright",
  defaultOverlay = null,
  height = 520,
  availableOverlays,
  onActiveOverlayChange,
  loading = false,
}: HydrologyMapProps) {
  const [activeOverlay, setActiveOverlay] = useState<HydroOverlay | null>(defaultOverlay);
  const [minAccPct, setMinAccPct] = useState(5);
  const [flowLegend, setFlowLegend] = useState<FlowLegendData | null>(null);
  const [tempStats, setTempStats] = useState<RasterStats | null>(null);
  const [ssrdStats, setSsrdStats] = useState<RasterStats | null>(null);
  const [runoffStats, setRunoffStats] = useState<RasterStats | null>(null);

  React.useEffect(() => {
    onActiveOverlayChange?.(activeOverlay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeOverlay]);

  const tempUrl = inputRasters.river_temperature ?? null;
  const ssrdUrl = inputRasters.ssrd ?? null;
  const runoffUrl = inputRasters.runoff ?? null;
  const has = (overlay: HydroOverlay, url: string | null | undefined) =>
    availableOverlays ? availableOverlays.includes(overlay) : Boolean(url);

  return (
    <div style={{ height, position: "relative" }} className="rounded-lg overflow-hidden">
      <MapContainer center={[0, 0]} zoom={2} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
        <OpenFreeMapLayer styleId={styleId} />
        {activeOverlay === "temp" && tempUrl && (
          <HydroInputRasterLayer key={`temp-${tempUrl}`} url={tempUrl} colorFn={tempColorFromNorm} onStats={setTempStats} mask={geojson} />
        )}
        {activeOverlay === "ssrd" && ssrdUrl && (
          <HydroInputRasterLayer key={`ssrd-${ssrdUrl}`} url={ssrdUrl} colorFn={ssrdColorFromNorm} onStats={setSsrdStats} mask={geojson} />
        )}
        {activeOverlay === "runoff" && runoffUrl && (
          <HydroInputRasterLayer key={`runoff-${runoffUrl}`} url={runoffUrl} colorFn={runoffColorFromNorm} onStats={setRunoffStats} mask={geojson} />
        )}
        <AreaOverlay geojson={geojson} />
        {activeOverlay === "flow" && flowVectorsUrl && (
          <FlowArrowLayer url={flowVectorsUrl} minAccPct={minAccPct} onLegendData={setFlowLegend} />
        )}
        <HydroMapControls
          activeOverlay={activeOverlay}
          setActiveOverlay={setActiveOverlay}
          minAccPct={minAccPct}
          setMinAccPct={setMinAccPct}
          hasFlowData={has("flow", flowVectorsUrl)}
          hasTempData={has("temp", tempUrl)}
          hasSsrdData={has("ssrd", ssrdUrl)}
          hasRunoffData={has("runoff", runoffUrl)}
          tempStats={tempStats}
          ssrdStats={ssrdStats}
          runoffStats={runoffStats}
          flowLegend={flowLegend}
        />
      </MapContainer>
      {loading && (
        <div
          style={{ position: "absolute", top: 8, right: 8, zIndex: 650 }}
          className="rounded-full bg-white/90 px-3 py-1 font-inter text-xs font-semibold text-wpBlue shadow animate-pulse"
        >
          Loading…
        </div>
      )}
    </div>
  );
}
