import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Scenario } from "@/lib/scenarios";
import { TreatmentPreviewConfig } from "@/lib/mapPreviews";
import { PreviewRequest, fetchPreview, previewQueryKey } from "@/lib/geodataPreview";
import { useAreaGeometries } from "@/hooks/useAreaGeometries";
import { usePreviewUrl } from "@/hooks/usePreviewUrl";
import { TreatmentMap } from "../map";
import { MapPlaceholder, MapPreviewPanel } from "./MapPreviewPanel";

type TreatmentMapPreviewProps = {
  sessionId: string | null;
  config: TreatmentPreviewConfig;
  scenario?: Scenario;
  className?: string;
};

/** Drinking-water treatment map preview (categorical `risk-treatment` raster). */
export function TreatmentMapPreview({ sessionId, config, scenario, className }: TreatmentMapPreviewProps) {
  const { t } = useTranslation();
  const areaGeojson = useAreaGeometries();

  const previewRequest: PreviewRequest = { sessionId: `${sessionId}`, file: config.file, scenario };
  const { data, isFetching, isError } = useQuery({
    queryKey: previewQueryKey(previewRequest),
    queryFn: () => fetchPreview(previewRequest),
    enabled: sessionId !== null,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
  const tifUrl = usePreviewUrl(data);

  return (
    <MapPreviewPanel scenario={scenario} className={className}>
      {sessionId === null && <MapPlaceholder message={t("finetune.mapPreview.unavailable")} height={config.height} />}
      {sessionId !== null && isFetching && <MapPlaceholder message={t("finetune.mapPreview.loading")} height={config.height} pulse />}
      {sessionId !== null && !isFetching && isError && <MapPlaceholder message={t("finetune.mapPreview.error")} height={config.height} />}
      {sessionId !== null && !isFetching && !isError && tifUrl && (
        <TreatmentMap
          tifUrl={tifUrl}
          height={config.height}
          geojson={areaGeojson}
          caption={t(`finetune.mapPreview.captions.${config.file}`)}
          errorMessage={t("finetune.mapPreview.error")}
        />
      )}
    </MapPreviewPanel>
  );
}
