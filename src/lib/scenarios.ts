/**
 * Projection scenarios created from the "Preview data" page.
 * Labels live in i18n under `finetune.sspScenarios.<ssp>`.
 */
export const SSP_SCENARIOS = ["ssp1", "ssp2", "ssp3", "ssp4", "ssp5"] as const;
export const SCENARIO_YEARS = ["2030", "2050", "2100"] as const;

export type SspScenario = (typeof SSP_SCENARIOS)[number];
export type ScenarioYear = (typeof SCENARIO_YEARS)[number];
export type Scenario = { ssp: SspScenario; year: ScenarioYear };

export const scenarioId = ({ ssp, year }: Scenario) => `${ssp}-${year}`;

/** Value the API expects for the `ssp` / `scenario` parameter, e.g. "SSP1". */
export const sspParam = (ssp: SspScenario) => ssp.toUpperCase();

export const scenarioExists = (scenarios: Scenario[], ssp: SspScenario, year: ScenarioYear) =>
  scenarios.some((scenario) => scenario.ssp === ssp && scenario.year === year);

/**
 * Maps a Preview data category to the `schema` value the projections API
 * expects. Categories missing here (e.g. `risk`) are never sent, even when
 * selected. Confirmed from the API: human_emissions -> human_emissions,
 * hydrology -> hydrology. The livestock value is assumed.
 */
export const PROJECTION_SCHEMAS: Record<string, string> = {
  human_emissions: "human_emissions",
  livestock_emissions: "livestock_emissions",
  hydrology: "hydrology",
};

/** `file` values accepted by GET /api/geodata/preview. */
export const GEODATA_PREVIEW_FILES = [
  "population-distribution",
  "livestock-distribution",
  "hydrology-flow",
  "hydrology-river_temperature",
  "hydrology-ssrd",
  "hydrology-runoff",
  "risk-treatment",
] as const;
export type GeodataPreviewFile = (typeof GEODATA_PREVIEW_FILES)[number];
