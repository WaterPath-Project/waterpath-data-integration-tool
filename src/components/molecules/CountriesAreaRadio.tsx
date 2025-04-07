import { RadioGroup, RadioGroupItem } from "@/components/atoms/radio-group";
import { cn } from "@/lib/utils";
import { useDITStore } from "@/store/DITStore";
import { AreaOptionEnum } from "@/types";
import { useTranslation } from "react-i18next";

export function CountriesAreaRadio() {
  const { t } = useTranslation();
  const { area, setArea } = useDITStore();

  const options = [
    {
      value: AreaOptionEnum.EntireCountries,
      label: t("customizeModel.entireCountries"),
      id: "wholeCountry",
    },
    {
      value: AreaOptionEnum.SpecificAreas,
      label: t("customizeModel.specificAreas"),
      id: "specificAreas",
    },
  ];

  return (
    <RadioGroup value={area} className="w-full flex flex-row gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          className={cn(
            "flex items-center gap-2 w-1/2 p-2 text-xs font-bold font-inter text-wpBlue border border-wpBlue-100 rounded-[8px]",
            {
              "bg-wpGreen border border-wpGreen": area === option.value,
            }
          )}
          onClick={() => setArea(option.value)}
        >
          <RadioGroupItem value={option.value} id={option.id} />
          <label htmlFor={option.id}>{option.label}</label>
        </button>
      ))}
    </RadioGroup>
  );
}
