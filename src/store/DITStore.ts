import { AdminstrativeLevelEnum, AreaOptionEnum, Documentation, GADMAreas, GADMCountries } from "@/types";
import { create } from "zustand";

type DITState = {
  sessionId: string | null;
  setSessionId: (sessionId: string | null) => void;
  countries: GADMCountries[];
  addCountry: (country: GADMCountries) => void;
  removeCountry: (country: GADMCountries) => void;
  area: AreaOptionEnum;
  setArea: (area: AreaOptionEnum) => void;
  adminLevel: AdminstrativeLevelEnum;
  setAdminLevel: (adminLevel: AdminstrativeLevelEnum) => void;
  hasHumanEmissions: boolean;
  setHasHumanEmissions: (hasHumanEmissions: boolean) => void;
  hasLivestockEmissions: boolean;
  setHasLivestockEmissions: (hasLivestockEmissions: boolean) => void;
  hasHydrology: boolean;
  setHasHydrology: (hasHydrology: boolean) => void;
  hasRisks: boolean;
  setHasRisks: (hasRisks: boolean) => void;
  downLoadedAreas: GADMAreas[];
  setDownLoadedAreas: (areas: GADMAreas[]) => void;
  selectedAreas: string[];
  addSelectedArea: (area: string) => void;
  removeSelectedArea: (area: string) => void;
  setSelectedAreas: (areas: string[]) => void;
  documentation: Documentation[];
  setDocumentation: (documetation: Documentation[]) => void;
  /** Machine names of the data categories selected when the session was generated. */
  includedCategories: string[];
  setIncludedCategories: (categories: string[]) => void;
  /**
   * GADM ids the session was generated for (GID_0 for whole countries, e.g. "UGA";
   * GID_n for specific areas, e.g. "UGA.1_1"). Used to outline and frame map previews.
   */
  selectedAreaGids: string[];
  setSelectedAreaGids: (gids: string[]) => void;
  reset: () => void;
  resetAreaNDocumentation: () => void;
};

export const useDITStore = create<DITState>((set) => ({
  /*
* State management of sessionId
*/
  sessionId: null,
  setSessionId: (newSessionId: string | null) =>
    set({ sessionId: newSessionId }),

  /*
  * State management of selected countries
  */
  countries: [],
  addCountry: (country: GADMCountries) =>
    set((state) => ({ countries: [...state.countries, country] })),
  removeCountry: (country: GADMCountries) =>
    set((state) => ({
      countries: state.countries.filter(
        (c) => c.COUNTRY_CODE !== country.COUNTRY_CODE
      ),
    })),

  /*
  *   State Management of selected area
  */
  area: AreaOptionEnum.EntireCountries,
  setArea: (newArea: AreaOptionEnum) => set({ area: newArea }),

  /*
  *   State Management of administrative level
  */
  adminLevel: AdminstrativeLevelEnum.Level1,
  setAdminLevel: (newLevel: AdminstrativeLevelEnum) =>
    set({ adminLevel: newLevel }),

  /*
  *   State Management of simulation checkboxes
  */
  hasHumanEmissions: true,
  setHasHumanEmissions: (newHasHumanEmissions: boolean) =>
    set({ hasHumanEmissions: newHasHumanEmissions }),
  hasLivestockEmissions: false,
  setHasLivestockEmissions: (newHasLivestockEmissions: boolean) =>
    set({ hasLivestockEmissions: newHasLivestockEmissions }),
  hasHydrology: false,
  setHasHydrology: (newHasHydrology: boolean) =>
    set({ hasHydrology: newHasHydrology }),
  hasRisks: false,
  setHasRisks: (newHasRisks: boolean) => set({ hasRisks: newHasRisks }),

  /*
  *   State Management of GADM areas
  */
  downLoadedAreas: [],
  setDownLoadedAreas: (areas: GADMAreas[]) => set({ downLoadedAreas: areas }),
  selectedAreas: [],
  addSelectedArea: (area: string) => set((state) => ({ selectedAreas: [...state.selectedAreas, area] })),
  removeSelectedArea: (area: string) =>
    set((state) => ({
      selectedAreas: state.selectedAreas.filter((a) => a !== area),
    })),
  setSelectedAreas: (areas: string[]) => set({ selectedAreas: areas }),

  /*
  *   State Management of documentation
  */
  documentation: [],
  setDocumentation: (documentation: Documentation[]) =>
    set({ documentation: documentation }),
  includedCategories: [],
  setIncludedCategories: (categories: string[]) =>
    set({ includedCategories: categories }),
  selectedAreaGids: [],
  setSelectedAreaGids: (gids: string[]) =>
    set({ selectedAreaGids: gids }),

  /*
  *   Reset the wizard choices to their initial values (used by "Start again").
  *   Keeps `documentation`, `includedCategories` and `selectedAreaGids`,
  *   which the Preview data page needs; see `resetAreaNDocumentation` for those.
  */
  reset: () =>
    set({
      countries: [],
      area: AreaOptionEnum.EntireCountries,
      adminLevel: AdminstrativeLevelEnum.Level1,
      hasHumanEmissions: true,
      hasLivestockEmissions: false,
      hasHydrology: false,
      hasRisks: false,
      downLoadedAreas: [],
      selectedAreas: [],
    }),
  resetAreaNDocumentation: () =>
    set({
      selectedAreas: [],
      documentation: [],
      includedCategories: [],
      selectedAreaGids: [],
    }),
}));
