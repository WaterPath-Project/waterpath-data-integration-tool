/*
 * API Requests / Responses Type
 */

//countries.json
export type GADMCountries = {
  NAME_0: string;
  GID_0: string;
  ALPHA_2: string;
  COUNTRY_CODE: number;
  REGION: string;
  SUB_REGION: string;
  INTERMEDIATE_REGION: string;
  MAX_LEVEL: number;
  ADMIN_LABELS: string[];
};

/*
 * API Responses
 */

//Get areas by country
export type GADMAreas = {
  GID_0: string;
  GID_1: string;
  GID_2: string;
  GID_3: string;
  GID_4: string;
  GID_5: string;
  NAME_0: string;
  NAME_1: string;
  NAME_2: string;
  NAME_3: string;
  NAME_4: string;
  NAME_5: string;
};

//Get documentation
export type Documentation = {
  name: string;
  type: string;
  path: string;
  scheme: string;
  format: string;
  mediatype: string;
  encoding: string;
  schema: Schema;
};

export type Schema = {
  fields: Field[];
};

export type Field = {
  name: string;
  type: string;
};

//Summarize input data (GET /api/data/input/summarize)
export type SummarizeResponse = {
  baseline_scenario_id: string;
  metrics: SummarizeMetric[];
  scenarios: SummarizeScenario[];
};

export type SummarizeMetric = {
  key: string;
  driver: string;
  label: string;
  delta_mode: string;
  value_format: string;
  color_direction: string;
};

export type SummarizeScenario = {
  id: string;
  name: string;
  year: string;
  ssp: string;
  is_baseline: boolean;
  wwtp_mode: string;
  metrics: SummarizeMetrics;
};

export type SummarizeMetrics = {
  population_total: number;
  population_urban_mean_pct: number;
  population_under5_mean_pct: number;
  population_hdi_mean: number;
  sanitation_improved_pct: number;
  sanitation_unimproved_pct: number;
  sanitation_open_defecation_pct: number;
  wastewater_sewage_treated_pct: number;
  wastewater_fecal_sludge_treated_pct: number;
  wastewater_facility_count: number | null;
  wastewater_total_capacity: number | null;
  wastewater_share_primary_pct: number;
  wastewater_share_secondary_pct: number;
  wastewater_share_tertiary_pct: number;
  wastewater_share_quaternary_pct: number;
  livestock_mean_population_growth: number;
  manure_direct_land_application_pct: number;
  manure_storage_pct: number;
  manure_treated_pct: number;
  production_mean_progress_intensive_pct: number;
  hydrology_mean_annual_discharge: number;
  hydrology_mean_annual_runoff: number;
  hydrology_mean_river_temperature: number;
  hydrology_mean_ssrd: number;
  exposure_drinking_events_per_year: number;
  exposure_swimming_events_per_year: number;
  exposure_flooding_events_per_year: number;
  exposure_open_drain_events_per_year: number;
  exposure_playing_events_per_year: number;
  exposure_washing_clothes_events_per_year: number;
};

/*
 * Component
 */
export type Option = {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
};

export enum AreaOptionEnum {
  EntireCountries = "EntireCountries",
  SpecificAreas = "SpecificAreas",
}

export enum AdminstrativeLevelEnum {
  Level0 = "Level0",
  Level1 = "Level1",
  Level2 = "Level2",
  Level3 = "Level3",
  Level4 = "Level4",
  Level5 = "Level5",
}
