import { CategoryIconName } from "@/components/assets/categoryIcons";
import { Documentation } from "@/types";

/**
 * Input data categories shown on the "Preview data" page.
 *
 * Mirrors `data/categories.json` from
 * https://github.com/WaterPath-Project/waterpath-learning-materials.
 * Titles and descriptions live in i18n under `dataCategories.<machineName>`.
 */
export type DataSubcategory = {
  /** Machine name from categories.json; also the i18n key. */
  machineName: string;
  icon: CategoryIconName;
  /**
   * `file_id` used by the download API. Download / preview are enabled only
   * when this is set; leave undefined while the backend has no file yet.
   */
  fileId?: string;
};

export type DataCategory = {
  machineName: string;
  icon: CategoryIconName;
  subcategories: DataSubcategory[];
};

export const dataCategories: DataCategory[] = [
  {
    machineName: "human_emissions",
    icon: "human_emissions.svg",
    subcategories: [
      { machineName: "population", icon: "human_population.svg", fileId: "population" },
      { machineName: "sanitation", icon: "sanitation.svg", fileId: "sanitation" },
      { machineName: "wastewater_treatment", icon: "wastewater_treatment.svg", fileId: "treatment" },
    ],
  },
  {
    machineName: "livestock_emissions",
    icon: "livestock_emissions.svg",
    subcategories: [
      { machineName: "manure_management", icon: "manure_management.svg", fileId: "manure_management" },
      { machineName: "manure_fractions", icon: "livestock_population.svg", fileId: "manure_fractions" },
      { machineName: "production_systems", icon: "production_systems.svg", fileId: "production_systems" },
    ],
  },
  {
    machineName: "concentrations",
    icon: "concentrations.svg",
    subcategories: [{ machineName: "hydrology", icon: "concentrations.svg" }],
  },
  {
    machineName: "risk",
    icon: "risk.svg",
    subcategories: [{ machineName: "exposure_pathways", icon: "risk.svg" }],
  },
];

export type SimulationFlags = {
  hasHumanEmissions: boolean;
  hasLivestockEmissions: boolean;
  hasConcentrations: boolean;
  hasRisks: boolean;
};

/** Machine names of the categories selected via the simulate checkboxes. */
export function getIncludedCategories(flags: SimulationFlags): string[] {
  const mapping: Record<string, boolean> = {
    human_emissions: flags.hasHumanEmissions,
    livestock_emissions: flags.hasLivestockEmissions,
    concentrations: flags.hasConcentrations,
    risk: flags.hasRisks,
  };
  return Object.keys(mapping).filter((name) => mapping[name]);
}

/** True when at least one subcategory has a downloadable file. */
export function hasAvailableFiles(category: DataCategory): boolean {
  return category.subcategories.some((sub) => sub.fileId !== undefined);
}

/**
 * A category is shown on the Preview data page when it was selected on the
 * first screen, or when the session already exposes a file for one of its
 * subcategories (fallback for sessions opened directly by URL).
 */
export function isCategoryIncluded(
  category: DataCategory,
  includedCategories: string[],
  resources: Documentation[],
): boolean {
  return (
    includedCategories.includes(category.machineName) ||
    category.subcategories.some(
      (sub) => sub.fileId !== undefined && resources.some((resource) => resource.name === sub.fileId),
    )
  );
}
