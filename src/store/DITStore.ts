import { AdminstrativeLevelEnum, AreaOptionEnum, GADMCountries } from "@/types";
import { create } from "zustand";

type DITState = {
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
  reset: () => void;
};

export const useDITStore = create<DITState>((set) => ({
  //State management of selected countries
  countries: [],
  addCountry: (country: GADMCountries) =>
    set((state) => ({ countries: [...state.countries, country] })),
  removeCountry: (country: GADMCountries) =>
    set((state) => ({
      countries: state.countries.filter(
        (c) => c.COUNTRY_CODE !== country.COUNTRY_CODE
      ),
    })),
  //State Management of selected area
  area: AreaOptionEnum.EntireCountries,
  setArea: (newArea: AreaOptionEnum) => set({ area: newArea }),
  //State Management of administrative level
  adminLevel: AdminstrativeLevelEnum.Level1,
  setAdminLevel: (newLevel: AdminstrativeLevelEnum) =>
    set({ adminLevel: newLevel }),
  //State Management of simulation checkboxes
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
  //Reset state
  reset: () => set({ countries: [] }),
}));
