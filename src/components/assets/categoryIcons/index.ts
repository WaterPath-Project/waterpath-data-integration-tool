/**
 * Category and subcategory icons.
 *
 * Source: https://github.com/WaterPath-Project/waterpath-learning-materials/tree/main/data/figures
 * Keys match the `icon` file names used in `data/categories.json` of that repository.
 */
import concentrations from "./concentrations.svg";
import humanEmissions from "./human_emissions.svg";
import humanPopulation from "./human_population.svg";
import livestockEmissions from "./livestock_emissions.svg";
import livestockPopulation from "./livestock_population.svg";
import manureManagement from "./manure_management.svg";
import productionSystems from "./production_systems.svg";
import risk from "./risk.svg";
import sanitation from "./sanitation.svg";
import wastewaterTreatment from "./wastewater_treatment.svg";

export const categoryIcons = {
  "concentrations.svg": concentrations,
  "human_emissions.svg": humanEmissions,
  "human_population.svg": humanPopulation,
  "livestock_emissions.svg": livestockEmissions,
  "livestock_population.svg": livestockPopulation,
  "manure_management.svg": manureManagement,
  "production_systems.svg": productionSystems,
  "risk.svg": risk,
  "sanitation.svg": sanitation,
  "wastewater_treatment.svg": wastewaterTreatment,
} as const;

export type CategoryIconName = keyof typeof categoryIcons;
