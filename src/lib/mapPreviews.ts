import { LIVESTOCK_SCALE, POPULATION_SCALE, RasterColorScale } from "@/components/map/colorScales";
import { HydroOverlay } from "@/components/map/HydroMapControls";
import { LIVESTOCK_ANIMALS } from "@/lib/animals";
import { MONTHS } from "@/lib/months";
import { GeodataPreviewFile } from "@/lib/scenarios";

/** One geodata file drawn as a single coloured raster (population, livestock). */
export type RasterPreviewConfig = {
  kind: "raster";
  file: GeodataPreviewFile;
  colorScale: RasterColorScale;
  /** Values for the API's `dimension` parameter, when the file has one (e.g. species). */
  dimensions?: readonly string[];
  height: number;
};

/** The hydrology map: one file per switchable overlay, all sharing a month dimension. */
export type HydrologyPreviewConfig = {
  kind: "hydrology";
  files: Record<HydroOverlay, GeodataPreviewFile>;
  dimensions: readonly string[];
  height: number;
};

/** The categorical drinking-water treatment raster. */
export type TreatmentPreviewConfig = {
  kind: "treatment";
  file: GeodataPreviewFile;
  height: number;
};

export type MapPreviewConfig = RasterPreviewConfig | HydrologyPreviewConfig | TreatmentPreviewConfig;
export type MapPreviewKind = "population" | "livestock" | "hydrology" | "risk";

/** How each category's map preview is drawn on the Preview data page. */
export const MAP_PREVIEWS: Record<MapPreviewKind, MapPreviewConfig> = {
  population: { kind: "raster", file: "population-distribution", colorScale: POPULATION_SCALE, height: 420 },
  livestock: { kind: "raster", file: "livestock-distribution", colorScale: LIVESTOCK_SCALE, dimensions: LIVESTOCK_ANIMALS, height: 380 },
  hydrology: {
    kind: "hydrology",
    files: {
      flow: "hydrology-flow",
      temp: "hydrology-river_temperature",
      ssrd: "hydrology-ssrd",
      runoff: "hydrology-runoff",
    },
    dimensions: MONTHS,
    height: 520,
  },
  risk: { kind: "treatment", file: "risk-treatment", height: 400 },
};
