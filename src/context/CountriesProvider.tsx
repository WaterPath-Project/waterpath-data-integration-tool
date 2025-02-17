import api from "@/api";
import { GADMCountries } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { createContext, ReactNode, useContext, useMemo } from "react";

type CountriesContextType = {
  countries: GADMCountries[];
  isFetchingCountries: boolean;
  error: Error | null;
};

const CountriesContext = createContext<CountriesContextType | undefined>(
  undefined
);

export const CountriesProvider = ({ children }: { children: ReactNode }) => {
  const getCountries = async () => {
    const result = await api.get(
      "https://raw.githubusercontent.com/WaterPath-Project/waterpath-data/refs/heads/main/world_admin_overview/data/countries.json"
    );
    console.log(result.data);
    return result.data;
  };

  const { data, error, isFetching } = useQuery({
    queryKey: ["countries"],
    queryFn: getCountries,
  });

  const obj = useMemo(
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
  const context = useContext(CountriesContext);
  if (context === undefined) {
    throw new Error("useCountries must be used within a CountriesProvider");
  }
  return context;
};
