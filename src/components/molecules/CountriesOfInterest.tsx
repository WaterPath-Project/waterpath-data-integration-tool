import { useTranslation } from "react-i18next";
import { MultiSelect } from "../atoms/multiselect";
import { Cat, Dog, Fish, Rabbit, Turtle } from "lucide-react";
import { useState } from "react";

const frameworksList = [
  { value: "react", label: "React", icon: Turtle },
  { value: "angular", label: "Angular", icon: Cat },
  { value: "vue", label: "Vue", icon: Dog },
  { value: "svelte", label: "Svelte", icon: Rabbit },
  { value: "ember", label: "Ember", icon: Fish },
];

export function CountriesOfInterest() {
  const { t } = useTranslation();
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);

  return (
    <div className="flex flex-col gap-2">
      <span className="inter text-sm font-semibold text-wpBlue">
        {t("customizeModel.countriesOfInterest")}
      </span>
      <MultiSelect
        options={frameworksList}
        onValueChange={setSelectedFrameworks}
        defaultValue={selectedFrameworks}
        placeholder="Select frameworks"
        variant="inverted"
        animation={2}
        maxCount={3}
      />
    </div>
  );
}
