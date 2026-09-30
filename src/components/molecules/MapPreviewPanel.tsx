import React from "react";
import { useTranslation } from "react-i18next";
import { MapIcon } from "lucide-react";
import classNames from "classnames";
import { Scenario } from "@/lib/scenarios";

type MapPreviewPanelProps = {
  scenario?: Scenario;
  /** Controls rendered between the title and the scenario badge. */
  controls?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

/** Card chrome shared by the map previews: title, controls, scenario badge. */
export function MapPreviewPanel({ scenario, controls, className, children }: MapPreviewPanelProps) {
  const { t } = useTranslation();
  const scenarioLabel = scenario
    ? `${t(`finetune.sspScenarios.${scenario.ssp}`)} · ${scenario.year}`
    : t("finetune.baselineTab");

  return (
    <aside className={classNames("flex flex-col gap-4 rounded-2xl border border-wpGray-200 bg-white p-4", className)}>
      <div className="flex flex-row flex-wrap items-center justify-between gap-3">
        <span className="font-outfit font-bold text-lg text-wpBlue">{t("finetune.mapPreview.title")}</span>
        <div className="flex flex-row items-center gap-2">
          {controls}
          <span className="rounded-full bg-wpGray-100 px-3 py-1 font-inter text-xs font-semibold text-wpBlue">{scenarioLabel}</span>
        </div>
      </div>
      {children}
    </aside>
  );
}

/** Grey placeholder box shown while loading or when there is nothing to draw. */
export function MapPlaceholder({ message, height, pulse = false }: { message: string; height: number; pulse?: boolean }) {
  return (
    <div
      className={classNames("flex flex-col items-center justify-center gap-3 rounded-2xl bg-wpGray-200 text-wpBlue", { "animate-pulse": pulse })}
      style={{ height }}
    >
      <MapIcon className="h-10 w-10" aria-hidden="true" />
      <span className="font-inter text-sm">{message}</span>
    </div>
  );
}
