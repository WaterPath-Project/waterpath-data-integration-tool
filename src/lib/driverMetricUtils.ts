/**
 * Formatting/derivation helpers for the "Summary of changes" table.
 *
 * Ported from `05-summary-of-changes/driverMetricUtils.js` in
 * https://github.com/WaterPath-Project/waterpath-reporting-suite. Icons come
 * from the category icon map already bundled with this app.
 */
import { categoryIcons } from "@/components/assets/categoryIcons";
import { SummarizeScenario } from "@/types";

type Numeric = number | string | null | undefined;

export function computeDeltaPct(base: Numeric, value: Numeric): number | null {
  if (base === null || base === undefined || value === null || value === undefined) return null;
  const b = Number(base);
  const v = Number(value);
  if (!Number.isFinite(b) || !Number.isFinite(v)) return null;
  if (Math.abs(b) < 1e-9) return Math.abs(v) < 1e-9 ? 0 : null;
  return ((v - b) / Math.abs(b)) * 100;
}

export function formatMetricValue(value: Numeric, valueFormat: string): string {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "n/a";
  const v = Number(value);
  if (valueFormat === "percent") return `${v.toFixed(1)}%`;
  if (valueFormat === "hdi") return v.toFixed(3);
  if (valueFormat === "integer") return Math.round(v).toLocaleString();
  if (valueFormat === "probability") return v < 0.001 && v > 0 ? v.toExponential(2) : v.toFixed(4);
  return v.toFixed(2);
}

export function formatDeltaValue(delta: Numeric, deltaMode: string): string {
  if (delta === null || delta === undefined || Number.isNaN(Number(delta))) return "n/a";
  const v = Number(delta);
  if (deltaMode === "pp") return `${v >= 0 ? "+" : ""}${v.toFixed(1)} %`;
  if (deltaMode === "absolute") return `${v >= 0 ? "+" : ""}${v.toFixed(3)}`;
  return `${v >= 0 ? "+" : ""}${v.toFixed(1)}%`;
}

export function computeMetricDelta(base: Numeric, value: Numeric, deltaMode: string): number | null {
  if (base === null || base === undefined || value === null || value === undefined) return null;
  const b = Number(base);
  const v = Number(value);
  if (!Number.isFinite(b) || !Number.isFinite(v)) return null;
  if (deltaMode === "pp" || deltaMode === "absolute") return v - b;
  return computeDeltaPct(b, v);
}

export function isWastewaterMetric(k: string): boolean {
  return k.startsWith("wastewater_");
}
export function isShareMetric(k: string): boolean {
  return k.startsWith("wastewater_share_");
}
export function isPointOnlyMetric(k: string): boolean {
  return k === "wastewater_facility_count" || k === "wastewater_total_capacity";
}

/** Point-mode scenarios have no treatment-level shares; area-mode ones have no facility count/capacity. */
export function isMetricApplicableForScenario(metricKey: string, scenario: SummarizeScenario | null): boolean {
  if (!scenario || !isWastewaterMetric(metricKey)) return true;
  const mode = scenario.wwtp_mode;
  if (mode === "point" && isShareMetric(metricKey)) return false;
  if (mode === "area" && isPointOnlyMetric(metricKey)) return false;
  return true;
}

export type DriverMeta = { icon: string; label: string };

export const DRIVER_META: Record<string, DriverMeta> = {
  Population: { icon: categoryIcons["human_population.svg"], label: "Population" },
  Hydrology: { icon: categoryIcons["concentrations.svg"], label: "Hydrology" },
  Sanitation: { icon: categoryIcons["sanitation.svg"], label: "Sanitation" },
  "Wastewater treatment": { icon: categoryIcons["wastewater_treatment.svg"], label: "Wastewater treatment" },
  "Livestock population": { icon: categoryIcons["livestock_population.svg"], label: "Livestock population" },
  "Manure management": { icon: categoryIcons["manure_management.svg"], label: "Manure management" },
  "Production systems": { icon: categoryIcons["production_systems.svg"], label: "Production systems" },
  "Exposure pathways": { icon: categoryIcons["risk.svg"], label: "Exposure pathways" },
};

export const DRIVER_ORDER = [
  "Population",
  "Sanitation",
  "Wastewater treatment",
  "Livestock population",
  "Manure management",
  "Production systems",
  "Hydrology",
  "Exposure pathways",
];
