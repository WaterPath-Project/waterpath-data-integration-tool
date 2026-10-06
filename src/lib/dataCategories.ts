import { CategoryIconName } from "@/components/assets/categoryIcons";
import { MapPreviewKind } from "@/lib/mapPreviews";
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
  /**
   * Map preview shown beside the subcategories on the Preview data page
   * (see `MAP_PREVIEWS`). Leave undefined for categories without one.
   */
  mapPreview?: MapPreviewKind;
  /**
   * Entries of the session listing (GET /api/session/) whose presence means the
   * category was generated, e.g. the folder the backend writes its outputs to.
   * The category's own machine name is always checked too, so this is only
   * needed when the backend uses a different name (e.g. "qmra" for risk).
   */
  sessionMarkers?: string[];
};

export const dataCategories: DataCategory[] = [
  {
    machineName: "human_emissions",
    icon: "human_emissions.svg",
    mapPreview: "population",
    subcategories: [
      { machineName: "population", icon: "human_population.svg", fileId: "population" },
      { machineName: "sanitation", icon: "sanitation.svg", fileId: "sanitation" },
      { machineName: "wastewater_treatment", icon: "wastewater_treatment.svg", fileId: "treatment" },
    ],
  },
  {
    machineName: "livestock_emissions",
    icon: "livestock_emissions.svg",
    mapPreview: "livestock",
    subcategories: [
      { machineName: "manure_management", icon: "manure_management.svg", fileId: "livestock_manure_management" },
      { machineName: "manure_fractions", icon: "livestock_population.svg", fileId: "livestock_manure_fractions" },
      { machineName: "production_systems", icon: "production_systems.svg", fileId: "livestock_production_systems" },
    ],
  },
  {
    machineName: "hydrology",
    icon: "concentrations.svg",
    mapPreview: "hydrology",
    subcategories: [{ machineName: "hydrology_variables", icon: "concentrations.svg" }],
  },
  {
    machineName: "risk",
    icon: "risk.svg",
    mapPreview: "risk",
    sessionMarkers: ["qmra"],
    subcategories: [{ machineName: "exposure_pathways", icon: "risk.svg" }],
  },
];

export type SimulationFlags = {
  hasHumanEmissions: boolean;
  hasLivestockEmissions: boolean;
  hasHydrology: boolean;
  hasRisks: boolean;
};

/** Machine names of the categories selected via the simulate checkboxes. */
export function getIncludedCategories(flags: SimulationFlags): string[] {
  const mapping: Record<string, boolean> = {
    human_emissions: flags.hasHumanEmissions,
    livestock_emissions: flags.hasLivestockEmissions,
    hydrology: flags.hasHydrology,
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
 * first screen, or when the session already exposes it (fallback for a page
 * refresh or a session opened directly by URL): either a file of one of its
 * subcategories, or the category's output folder (`sessionMarkers` / machine name).
 */
export function isCategoryIncluded(
  category: DataCategory,
  includedCategories: string[],
  resources: Documentation[],
): boolean {
  if (includedCategories.includes(category.machineName)) return true;
  const names = new Set(resources.map((resource) => resource.name));
  const markers = [category.machineName, ...(category.sessionMarkers ?? [])];
  return (
    markers.some((marker) => names.has(marker)) ||
    category.subcategories.some((sub) => sub.fileId !== undefined && names.has(sub.fileId))
  );
}
