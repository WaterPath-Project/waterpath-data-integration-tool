import { useEffect, useRef } from "react";
import type L from "leaflet";
import { useMap } from "react-leaflet";
import GeoRasterLayer from "georaster-layer-for-leaflet";
import parseGeoraster from "georaster";
import type { FeatureCollection } from "geojson";
import "@/lib/proj4Setup";
import { RasterColorScale, normaliseValue, scaleRgba } from "./colorScales";

type RasterLayerProps = {
  /** GeoTIFF URL (single band). */
  tifUrl: string;
  colorScale: RasterColorScale;
  /** Polygons to clip to; pixels outside them are not drawn. */
  mask?: FeatureCollection | null;
  /** Called with the raster's maximum value once it is parsed (for a legend). */
  onMaxLoaded?: (max: number) => void;
};

/**
 * Single-band GeoTIFF coloured through a `RasterColorScale`. Nodata and values
 * <= 0 are transparent. Fits the map to the raster extent once loaded.
 *
 * Shared port of `PopRasterLayer.jsx` (04) and `HeadsRasterLayer.jsx` (03) from
 * waterpath-reporting-suite; the two differ only in their colour scale.
 */
export function RasterLayer({ tifUrl, colorScale, mask, onMaxLoaded }: RasterLayerProps) {
  const map = useMap();
  const layerRef = useRef<L.Layer | null>(null);

  useEffect(() => {
    if (!tifUrl || !map) return;
    let cancelled = false;

    (async () => {
      try {
        const ab = await fetch(tifUrl).then((r) => r.arrayBuffer());
        const gr = await parseGeoraster(ab);
        if (cancelled) return;

        const nd = gr.noDataValue;
        const rasterMax = (gr as { maxs?: number[] }).maxs?.[0];
        const max = rasterMax && rasterMax > 0 ? rasterMax : colorScale.defaultMax;
        onMaxLoaded?.(max);

        const clipTo = mask?.features?.length ? mask : undefined;
        const newLayer = new GeoRasterLayer({
          georaster: gr,
          opacity: 1,
          resolution: 256,
          caching: false,
          ...(clipTo ? { mask: clipTo, mask_strategy: "outside" as const } : {}),
          pixelValuesToColorFn: ([v]: number[]) => {
            if (v == null || v === nd || v <= 0) return "";
            return scaleRgba(colorScale, normaliseValue(colorScale, v, max));
          },
        });

        if (layerRef.current) map.removeLayer(layerRef.current);
        newLayer.addTo(map);
        layerRef.current = newLayer;

        const bounds: L.LatLngBounds | undefined = newLayer.getBounds?.();
        if (bounds?.isValid?.()) map.fitBounds(bounds, { padding: [16, 16] });
      } catch (e) {
        console.error("RasterLayer error:", e);
      }
    })();

    return () => {
      cancelled = true;
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
    };
    // onMaxLoaded is intentionally not a dependency: a new callback identity must not re-fetch the raster.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tifUrl, map, mask, colorScale]);

  return null;
}
