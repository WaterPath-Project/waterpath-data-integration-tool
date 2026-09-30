import { RasterMap, RasterMapProps } from "./RasterMap";
import { POPULATION_SCALE } from "./colorScales";

type PopulationMapProps = Omit<RasterMapProps, "colorScale" | "tifUrl"> & {
  /** Population GeoTIFF URL (e.g. popurban.tif). */
  tifUrl: string;
};

/**
 * Human population distribution map (urban population per cell by default).
 * Port of `04-population-distribution/PopulationMap.jsx` from waterpath-reporting-suite.
 */
export function PopulationMap({ caption = "Urban population per cell", ...props }: PopulationMapProps) {
  return <RasterMap {...props} caption={caption} colorScale={POPULATION_SCALE} />;
}
