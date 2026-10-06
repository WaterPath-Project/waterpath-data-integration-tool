import { useEffect } from "react";
import type L from "leaflet";
import { useMap } from "react-leaflet";
import GeoRasterLayer from "georaster-layer-for-leaflet";
import parseGeoraster from "georaster";
import type { FeatureCollection } from "geojson";
import { ensureProj4 } from "@/lib/proj4Setup";

ensureProj4();

export type RasterStats = { min: number; max: number };

type HydroInputRasterLayerProps = {
  /** GeoTIFF URL. */
  url: string;
  /** (norm: 0..1) => CSS colour; pass a stable reference (module-level or useCallback). */
  colorFn: (norm: number) => string;
  /** Layer opacity (default 0.75). */
  opacity?: number;
  /** Called with { min, max } once the raster is parsed. */
  onStats?: (stats: RasterStats) => void;
  /** Polygons to clip to; pixels outside them are not drawn. */
  mask?: FeatureCollection | null;
};

/**
 * Generic single-band GeoTIFF overlay (river temperature, SSRD, runoff, ...).
 * Normalises values against the raster's own finite min/max.
 *
 * Port of `02-hydrology/HydroInputRasterLayer.jsx` from waterpath-reporting-suite,
 * plus an optional `mask` that clips the raster to the selected areas.
 */
export function HydroInputRasterLayer({ url, colorFn, opacity = 0.75, onStats, mask }: HydroInputRasterLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (!url || !colorFn) return;
    let layer: L.Layer | null = null;
    let cancelled = false;

    (async () => {
      try {
        const ab = await fetch(url).then((r) => r.arrayBuffer());
        const gr = await parseGeoraster(ab);
        if (cancelled) return;
        const nd = gr.noDataValue;
        const rows = (gr as unknown as { values: ArrayLike<number>[][] }).values[0];
        let vmin = Infinity;
        let vmax = -Infinity;
        for (const row of rows) {
          for (let i = 0; i < row.length; i += 1) {
            const v = row[i];
            if (v == null || !Number.isFinite(v) || v === nd) continue;
            if (v < vmin) vmin = v;
            if (v > vmax) vmax = v;
          }
        }
        if (!Number.isFinite(vmin)) return;
        onStats?.({ min: vmin, max: vmax });
        const range = vmax - vmin || 1;
        const clipTo = mask?.features?.length ? mask : undefined;
        const newLayer = new GeoRasterLayer({
          georaster: gr,
          opacity,
          resolution: 256,
          caching: false,
          ...(clipTo ? { mask: clipTo, mask_strategy: "outside" as const } : {}),
          pixelValuesToColorFn: (values: number[]) => {
            const v = values[0];
            if (v == null || !Number.isFinite(v) || v === nd) return "";
            const norm = Math.max(0, Math.min(1, (v - vmin) / range));
            return colorFn(norm);
          },
        });
        newLayer.on("tileload", (e: { tile?: HTMLElement }) => {
          if (e.tile) e.tile.style.imageRendering = "pixelated";
        });
        map.addLayer(newLayer);
        layer = newLayer;
      } catch (e) {
        console.error("HydroInputRasterLayer error:", e);
      }
    })();

    return () => {
      cancelled = true;
      if (layer) map.removeLayer(layer);
    };
    // onStats is intentionally not a dependency: a new callback identity must not reload the raster.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, colorFn, opacity, map, mask]);

  return null;
}
