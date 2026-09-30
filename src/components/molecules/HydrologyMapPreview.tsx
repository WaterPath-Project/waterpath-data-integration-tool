import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Scenario } from "@/lib/scenarios";
import { HydrologyPreviewConfig } from "@/lib/mapPreviews";
import { MONTHS, Month } from "@/lib/months";
import { PreviewRequest, fetchPreview, previewQueryKey } from "@/lib/geodataPreview";
import { useAreaGeometries } from "@/hooks/useAreaGeometries";
import { usePreviewUrl } from "@/hooks/usePreviewUrl";
import { HydroOverlay, HydrologyMap } from "../map";
import { MonthSelect } from "./MonthSelect";
import { MapPlaceholder, MapPreviewPanel } from "./MapPreviewPanel";

type HydrologyMapPreviewProps = {
  sessionId: string | null;
  config: HydrologyPreviewConfig;
  scenario?: Scenario;
  className?: string;
};

const OVERLAYS: readonly HydroOverlay[] = ["flow", "temp", "ssrd", "runoff"];

/**
 * Hydrology map preview: the reference HydrologyMap with its in-map layer
 * panel, plus a month controller. Only the active overlay's file is fetched,
 * for the selected month, so switching layers or months loads one file.
 */
export function HydrologyMapPreview({ sessionId, config, scenario, className }: HydrologyMapPreviewProps) {
  const { t } = useTranslation();
  const areaGeojson = useAreaGeometries();
  const [month, setMonth] = React.useState<Month>(MONTHS[0]);
  const [activeOverlay, setActiveOverlay] = React.useState<HydroOverlay | null>("flow");

  const file = activeOverlay ? config.files[activeOverlay] : null;
  const previewRequest: PreviewRequest | null =
    sessionId !== null && file ? { sessionId, file, scenario, dimension: month } : null;

  const { data, isFetching, isError } = useQuery({
    queryKey: previewRequest ? previewQueryKey(previewRequest) : ["geodataPreview", "hydrology", "idle"],
    queryFn: () => fetchPreview(previewRequest as PreviewRequest),
    enabled: previewRequest !== null,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
  const url = usePreviewUrl(data);
  const loadedUrl = !isFetching && !isError ? url : null;

  return (
    <MapPreviewPanel scenario={scenario} controls={<MonthSelect value={month} onChange={setMonth} />} className={className}>
      {sessionId === null ? (
        <MapPlaceholder message={t("finetune.mapPreview.unavailable")} height={config.height} />
      ) : (
        <div className="space-y-2">
          <HydrologyMap
            height={config.height}
            geojson={areaGeojson}
            defaultOverlay="flow"
            availableOverlays={OVERLAYS}
            onActiveOverlayChange={setActiveOverlay}
            loading={isFetching}
            flowVectorsUrl={activeOverlay === "flow" ? loadedUrl : null}
            inputRasters={{
              river_temperature: activeOverlay === "temp" ? loadedUrl : null,
              ssrd: activeOverlay === "ssrd" ? loadedUrl : null,
              runoff: activeOverlay === "runoff" ? loadedUrl : null,
            }}
          />
          {isError && <p className="font-inter text-xs text-red-600">{t("finetune.mapPreview.hydrologyError")}</p>}
          <p className="text-xs text-gray-400">{t("finetune.mapPreview.captions.hydrology")}</p>
        </div>
      )}
    </MapPreviewPanel>
  );
}
