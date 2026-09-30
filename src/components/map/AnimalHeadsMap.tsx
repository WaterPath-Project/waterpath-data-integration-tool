import { RasterMap, RasterMapProps } from "./RasterMap";
import { LIVESTOCK_SCALE } from "./colorScales";

type AnimalHeadsMapProps = Omit<RasterMapProps, "colorScale" | "height"> & {
  /** Map height in px (default 380, as in the reference). */
  height?: number;
};

/**
 * Livestock heads-per-cell map for one species. The species selector lives in
 * `AnimalSelect` so the caller can fetch the right raster.
 * Port of `03-animal-distribution/AnimalHeadsMap.jsx` from waterpath-reporting-suite.
 */
export function AnimalHeadsMap({ height = 380, ...props }: AnimalHeadsMapProps) {
  return <RasterMap {...props} height={height} colorScale={LIVESTOCK_SCALE} />;
}
