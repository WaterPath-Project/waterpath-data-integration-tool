import { Scenario } from "@/lib/scenarios";
import { MAP_PREVIEWS, MapPreviewKind } from "@/lib/mapPreviews";
import { RasterMapPreview } from "./RasterMapPreview";
import { HydrologyMapPreview } from "./HydrologyMapPreview";
import { TreatmentMapPreview } from "./TreatmentMapPreview";

type GeodataMapPreviewProps = {
  sessionId: string | null;
  /** Which preview to draw (see `MAP_PREVIEWS`). */
  preview: MapPreviewKind;
  /** Active projection scenario; omitted on the baseline (no year / SSP sent). */
  scenario?: Scenario;
  className?: string;
};

/** Picks the map preview for a category: a single raster, the hydrology map, or the treatment map. */
export function GeodataMapPreview({ preview, ...props }: GeodataMapPreviewProps) {
  const config = MAP_PREVIEWS[preview];
  if (config.kind === "hydrology") return <HydrologyMapPreview config={config} {...props} />;
  if (config.kind === "treatment") return <TreatmentMapPreview config={config} {...props} />;
  return <RasterMapPreview config={config} {...props} />;
}
