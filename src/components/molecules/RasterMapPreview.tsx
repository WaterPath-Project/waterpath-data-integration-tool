import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Scenario } from "@/lib/scenarios";
import { RasterPreviewConfig } from "@/lib/mapPreviews";
import { LivestockAnimal } from "@/lib/animals";
import { PreviewRequest, fetchPreview, previewQueryKey, rasterHasValues } from "@/lib/geodataPreview";
import { useAreaGeometries } from "@/hooks/useAreaGeometries";
import { usePreviewUrl } from "@/hooks/usePreviewUrl";
import { RasterMap } from "../map";
import { AnimalSelect } from "./AnimalSelect";
import { MapPlaceholder, MapPreviewPanel } from "./MapPreviewPanel";

type RasterMapPreviewProps = {
  sessionId: string | null;
  config: RasterPreviewConfig;
  scenario?: Scenario;
  className?: string;
};

/**
 * Single-raster map preview (population, livestock). Files with dimensions
 * (livestock species) are probed once so only those with data are offered.
 */
export function RasterMapPreview({ sessionId, config, scenario, className }: RasterMapPreviewProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { file } = config;
  const areaGeojson = useAreaGeometries();
  const [dimension, setDimension] = React.useState<string | null>(null);

  // Which dimensions (species) actually have raster values. Every candidate is fetched
  // once; the rasters are seeded into the preview cache so the map does not refetch them.
  const { data: availableDimensions, isFetching: isProbingDimensions } = useQuery({
    queryKey: ["geodataDimensions", sessionId, file, scenario?.ssp ?? null, scenario?.year ?? null],
    queryFn: async () => {
      const candidates = config.dimensions ?? [];
      const checks = await Promise.all(
        candidates.map(async (candidate) => {
          try {
            const request: PreviewRequest = { sessionId: `${sessionId}`, file, scenario, dimension: candidate };
            const preview = await fetchPreview(request);
            const hasValues = await rasterHasValues(preview);
            if (hasValues) queryClient.setQueryData(previewQueryKey(request), preview);
            return hasValues ? candidate : null;
          } catch {
            return null;
          }
        }),
      );
      return checks.filter((candidate): candidate is string => candidate !== null);
    },
    enabled: sessionId !== null && config.dimensions !== undefined,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  // Keep the selection on a dimension that has data.
  React.useEffect(() => {
    if (!availableDimensions) return;
    if (dimension === null || !availableDimensions.includes(dimension)) {
      setDimension(availableDimensions[0] ?? null);
    }
  }, [availableDimensions, dimension]);

  const hasDimensions = config.dimensions !== undefined;
  const noDimensionData = hasDimensions && availableDimensions !== undefined && availableDimensions.length === 0;

  const previewRequest: PreviewRequest = { sessionId: `${sessionId}`, file, scenario, dimension };
  const { data, isFetching, isError } = useQuery({
    queryKey: previewQueryKey(previewRequest),
    queryFn: () => fetchPreview(previewRequest),
    // With dimensions, wait until one with data is selected.
    enabled: sessionId !== null && (!hasDimensions || dimension !== null),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
  const tifUrl = usePreviewUrl(data);

  const controls =
    file === "livestock-distribution" && dimension !== null && availableDimensions && availableDimensions.length > 0 ? (
      <AnimalSelect value={dimension as LivestockAnimal} onChange={setDimension} animals={availableDimensions as LivestockAnimal[]} />
    ) : null;

  const busy = isFetching || isProbingDimensions;

  return (
    <MapPreviewPanel scenario={scenario} controls={controls} className={className}>
      {sessionId === null && <MapPlaceholder message={t("finetune.mapPreview.unavailable")} height={config.height} />}
      {sessionId !== null && busy && <MapPlaceholder message={t("finetune.mapPreview.loading")} height={config.height} pulse />}
      {sessionId !== null && !busy && noDimensionData && <MapPlaceholder message={t("finetune.mapPreview.noAnimals")} height={config.height} />}
      {sessionId !== null && !busy && !noDimensionData && isError && (
        <MapPlaceholder message={t("finetune.mapPreview.error")} height={config.height} />
      )}
      {sessionId !== null && !busy && !noDimensionData && !isError && tifUrl && (
        <RasterMap
          tifUrl={tifUrl}
          colorScale={config.colorScale}
          height={config.height}
          geojson={areaGeojson}
          caption={t(`finetune.mapPreview.captions.${file}`)}
          legendTitle={t(`finetune.mapPreview.legendTitles.${file}`)}
        />
      )}
    </MapPreviewPanel>
  );
}
