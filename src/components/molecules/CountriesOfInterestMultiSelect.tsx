import { useTranslation } from "react-i18next";
import { MultiSelect } from "../atoms/multiselect";
import { useEffect, useState } from "react";
import * as Flags from "country-flag-icons/react/3x2";
import { useCountries } from "@/context/CountriesProvider";
import { GADMCountries, Option } from "@/types";
import { useDITStore } from "@/store/DITStore";

function transformToOption(countries: GADMCountries[]): Option[] {
  const countriesOption: Option[] = [];
  for (const element of countries) {
    const Flag = Flags[element.ALPHA_2 as keyof typeof Flags];
    countriesOption.push({
      value: element.ALPHA_2,
      label: element.NAME_0,
      icon: Flag,
    });
  }
  return countriesOption;
}

export function CountriesOfInterestMultiSelect() {
  const { t } = useTranslation();
  const { countries } = useCountries();
  const { countries: contextCountries } = useDITStore();
  const [selectedCountries, setSelectedCountries] = useState<string[]>(contextCountries.map((c) => c.ALPHA_2));


  useEffect(() => {
    if (countries) {
      const stateCountries: GADMCountries[] = countries.filter((c) =>
        selectedCountries.includes(c.ALPHA_2)
      );
      useDITStore.setState({ countries: stateCountries });
    }
  }, [selectedCountries]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row justify-between">
        <span className="inter text-sm font-semibold text-wpBlue">
          {t("customizeModel.countriesOfInterest")}
        </span>
      </div>
      <MultiSelect
        options={countries ? transformToOption(countries) : []}
        onValueChange={setSelectedCountries}
        defaultValue={contextCountries.map((c) => c.ALPHA_2)}
        placeholder={t("customizeModel.selectCountries")}
        variant="inverted"
        maxCount={5}
        disabled={!countries}
      />
    </div>
  );
}
