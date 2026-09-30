import { useEffect, useRef } from "react";
import type L from "leaflet";
import { useMap } from "react-leaflet";
import GeoRasterLayer from "georaster-layer-for-leaflet";
import parseGeoraster from "georaster";
import type { FeatureCollection } from "geojson";
import "@/lib/proj4Setup";
import { DEFAULT_CODE_COLORS, UNKNOWN_CODE_COLOR } from "./treatmentCodes";

type TreatmentRasterLayerProps = {
  tifUrl: string;
  codeColors?: Record<number, string>;
  unknownColor?: string;
  opacity?: number;
  fitBounds?: boolean;
  /** Called with the sorted integer codes present in the raster. */
  onCodes?: (codes: number[]) => void;
  onError?: (error: unknown) => void;
  /** Polygons to clip to; pixels outside them are not drawn. */
  mask?: FeatureCollection | null;
};

/**
 * Categorical drinking-water treatment GeoTIFF layer.
 * Integer codes are rounded before lookup; nodata/NaN pixels are transparent.
 *
 * Port of `07-risk-treatment/TreatmentRasterLayer.jsx` from waterpath-reporting-suite,
 * plus an optional `mask` that clips the raster to the selected areas.
 */
export function TreatmentRasterLayer({
  tifUrl,
  codeColors = DEFAULT_CODE_COLORS,
  unknownColor = UNKNOWN_CODE_COLOR,
  opacity = 0.9,
  fitBounds = true,
  onCodes,
  onError,
  mask,
}: TreatmentRasterLayerProps) {
  const map = useMap();
  const layerRef = useRef<L.Layer | null>(null);

  useEffect(() => {
    if (!tifUrl || !map) return;
    let cancelled = false;

    (async () => {
      try {
        const response = await fetch(tifUrl);
        if (!response.ok) throw new Error(`Unable to load treatment raster (${response.status})`);
        const georaster = await parseGeoraster(await response.arrayBuffer());
        if (cancelled) return;

        const nodata = georaster.noDataValue;
        const rows = (georaster as unknown as { values: ArrayLike<number>[][] }).values[0];
        const codes = new Set<number>();
        for (const row of rows) {
          for (let i = 0; i < row.length; i += 1) {
            const value = row[i];
            if (value == null || value === nodata || !Number.isFinite(value)) continue;
            codes.add(Math.round(value));
          }
        }
        onCodes?.([...codes].sort((a, b) => a - b));

        const clipTo = mask?.features?.length ? mask : undefined;
        const layer = new GeoRasterLayer({
          georaster,
          opacity,
          resolution: 256,
          caching: false,
          ...(clipTo ? { mask: clipTo, mask_strategy: "outside" as const } : {}),
          pixelValuesToColorFn: ([value]: number[]) => {
            if (value == null || value === nodata || !Number.isFinite(value)) return "";
            return codeColors[Math.round(value)] ?? unknownColor;
          },
        });
        layer.on("tileload", (event: { tile?: HTMLElement }) => {
          if (event.tile) event.tile.style.imageRendering = "pixelated";
        });
        if (layerRef.current) map.removeLayer(layerRef.current);
        layer.addTo(map);
        layerRef.current = layer;

        if (fitBounds) {
          const bounds: L.LatLngBounds | undefined = layer.getBounds?.();
          if (bounds?.isValid?.()) map.fitBounds(bounds, { padding: [16, 16] });
        }
      } catch (error) {
        if (!cancelled) onError?.(error);
      }
    })();

    return () => {
      cancelled = true;
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
    };
    // onCodes / onError are intentionally not dependencies (as in the reference).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tifUrl, map, codeColors, unknownColor, opacity, fitBounds, mask]);

  return null;
}
