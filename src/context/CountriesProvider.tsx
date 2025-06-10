import api from "@/api";
import { GADMCountries } from "@/types";
import { useQuery } from "@tanstack/react-query";
import React from "react";

type CountriesContextType = {
  countries: GADMCountries[];
  isFetchingCountries: boolean;
  error: Error | null;
};

const CountriesContext = React.createContext<CountriesContextType | undefined>(
  undefined
);

export const CountriesProvider = ({ children }: { children: React.ReactNode }) => {
  const getCountries = async () => {
    const result = await api.get(
      "https://raw.githubusercontent.com/WaterPath-Project/waterpath-data/refs/heads/main/world_admin_overview/data/countries.json"
    );
    return result.data;
  };

  const { data, error, isFetching } = useQuery({
    queryKey: ["countries"],
    queryFn: getCountries,
  });

  const obj = React.useMemo(
    () => ({
      countries: data,
      isFetchingCountries: isFetching && data === undefined,
      error: error,
    }),
    [data, isFetching, error]
  );

  return (
    <CountriesContext.Provider value={obj}>
      {children}
    </CountriesContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCountries = (): CountriesContextType => {
  const context = React.useContext(CountriesContext);
  if (context === undefined) {
    throw new Error("useCountries must be used within a CountriesProvider");
  }
  return context;
};
