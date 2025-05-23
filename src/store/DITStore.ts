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
  hasConcentrations: boolean;
  setHasConcentrations: (hasConcentrations: boolean) => void;
  hasRisks: boolean;
  setHasRisks: (hasRisks: boolean) => void;
  downLoadedAreas: GADMAreas[];
  addDownLoadedAreas: (country: GADMAreas[]) => void;
  selectedAreas: string[];
  addSelectedArea: (area: string) => void;
  removeSelectedArea: (area: string) => void;
  documentation: Documentation[];
  setDocumentation: (documetation: Documentation[]) => void;
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
  hasHumanEmissions: false,
  setHasHumanEmissions: (newHasHumanEmissions: boolean) =>
    set({ hasHumanEmissions: newHasHumanEmissions }),
  hasLivestockEmissions: false,
  setHasLivestockEmissions: (newHasLivestockEmissions: boolean) =>
    set({ hasLivestockEmissions: newHasLivestockEmissions }),
  hasConcentrations: false,
  setHasConcentrations: (newHasConcentrations: boolean) =>
    set({ hasConcentrations: newHasConcentrations }),
  hasRisks: false,
  setHasRisks: (newHasRisks: boolean) => set({ hasRisks: newHasRisks }),

  /*
  *   State Management of GADM areas
  */
  downLoadedAreas: [],
  addDownLoadedAreas: (newAreas: GADMAreas[]) =>
    set((state) => ({
      downLoadedAreas: [...state.downLoadedAreas, ...newAreas],
    })),
  selectedAreas: [],
  addSelectedArea: (area: string) => set((state) => ({ selectedAreas: [...state.selectedAreas, area] })),
  removeSelectedArea: (area: string) =>
    set((state) => ({
      selectedAreas: state.selectedAreas.filter((a) => a !== area),
    })),

  /*
  *   State Management of documentation
  */
  documentation: [],
  setDocumentation: (documentation: Documentation[]) =>
    set({ documentation: documentation }),

  /*
  *   Reset all states to initial values.
  */
  reset: () =>
    set({
      countries: [],
      area: AreaOptionEnum.EntireCountries,
      adminLevel: AdminstrativeLevelEnum.Level1,
      hasHumanEmissions: false,
      hasLivestockEmissions: false,
      hasConcentrations: false,
      hasRisks: false,
      downLoadedAreas: [],
      selectedAreas: [],
    }),
  resetAreaNDocumentation: () =>
    set({
      selectedAreas: [],
      documentation: []
    }),
}));
